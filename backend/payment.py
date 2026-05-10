import httpx
import uuid
import hmac
import hashlib
import json
from fastapi import APIRouter, Request, Header
from typing import Optional
from backend.config import Config
from backend.DB.model import Transaction
from backend.DB.main import Session, engine
from sqlmodel import select
from datetime import datetime

payment_router = APIRouter()

processed_transactions = set()


# INITIATE PAYMENT

@payment_router.post("/pay/initiate")
async def initiate_payment(email: str, amount_naira: float):

    transaction_ref = str(uuid.uuid4())  

    with Session(engine) as session:
        transaction = Transaction(
            transaction_ref=transaction_ref,
            email=email,
            amount_naira=amount_naira,
            amount_kobo=int(amount_naira * 100),
            status="pending"
        )
        session.add(transaction)
        session.commit()
        print(f"Saved to DB: {transaction_ref}")

    headers = {
        "Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "amount": int(amount_naira * 100),
        "email": email,
        "currency": "NGN",
        "initiate_type": "inline",
        "transaction_ref": transaction_ref,
        "callback_url": "https://junkman-thrash-omission.ngrok-free.dev/payment/pay/callback"
        }


    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{Config.SQUAD_BASE_URL}/transaction/initiate",
            json=body,
            headers=headers
        )

    data = res.json()
    print("Initiate response:", data)

    if res.status_code != 200 or not data.get("data"):
        return {"error": data.get("message", "Squad error")}

    return {
        "checkout_url": data["data"]["checkout_url"],
        "transaction_ref": data["data"]["transaction_ref"]
    }


# VERIFY PAYMENT

@payment_router.get("/pay/verify/{transaction_ref}")
async def verify_payment(transaction_ref: str):

    # First check your own DB
    with Session(engine) as session:
        statement = select(Transaction).where(
            Transaction.transaction_ref == transaction_ref
        )
        transaction = session.exec(statement).first()

    if not transaction:
        return {"paid": False, "message": "Transaction not found"}

    # If already confirmed in DB, no need to call Squad
    if transaction.status == "success":
        return {
            "paid": True,
            "status": "success",
            "amount": transaction.amount_naira,
            "email": transaction.email,
            "transaction_ref": transaction_ref
        }

    # If still pending, confirm with Squad
    headers = {"Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}"}

    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{Config.SQUAD_BASE_URL}/transaction/verify/{transaction_ref}",
            headers=headers
        )

    data = res.json()
    print("Verify response:", data)

    if res.status_code != 200 or not data.get("data"):
        return {"paid": False, "message": data.get("message", "Verification failed")}

    status = data["data"]["transaction_status"]

    # Update DB if Squad confirms success
    if status == "Success":
        with Session(engine) as session:
            statement = select(Transaction).where(
                Transaction.transaction_ref == transaction_ref
            )
            transaction = session.exec(statement).first()
            if transaction:
                transaction.status = "success"
                transaction.paid_at = datetime.utcnow()
                session.add(transaction)
                session.commit()

    return {
        "paid": status == "Success",
        "status": status,
        "amount": data["data"]["transaction_amount"],
        "email": data["data"]["email"],
        "transaction_ref": transaction_ref
    }

# WEBHOOK

@payment_router.post("/webhook")
async def squad_webhook(
    request: Request,
    x_squad_encrypted_body: Optional[str] = Header(None)
):
    body_bytes = await request.body()

    # if x_squad_encrypted_body:
    #     computed = hmac.new(
    #         Config.SQUAD_SECRET_KEY.encode("utf-8"),
    #         body_bytes,
    #         hashlib.sha512
    #         ).hexdigest()

    #     if not hmac.compare_digest(computed, x_squad_encrypted_body):
    #         print("Invalid webhook signature — rejected")
    #         return {"status": "rejected", "reason": "invalid signature"}

    if x_squad_encrypted_body:
        computed = hmac.new(
            Config.SQUAD_SECRET_KEY.encode("utf-8"),
            body_bytes,
            hashlib.sha51
            ).hexdigest()

    print(f"Computed: {computed}")
    print(f"Received: {x_squad_encrypted_body}")

    if not hmac.compare_digest(computed, x_squad_encrypted_body.lower()):
        print("Invalid webhook signature — rejected")
        return {"status": "rejected", "reason": "invalid signature"}

    payload = json.loads(body_bytes)
    print("Webhook received:", payload)

    if payload.get("Event") != "charge_successful":
        return {"status": "ignored", "reason": "not a charge event"}

    body = payload.get("Body", {})
    transaction_ref = body.get("transaction_ref")
    transaction_status = body.get("transaction_status")

    if transaction_status != "Success":
        return {"status": "ignored", "reason": "transaction not successful"}

    if transaction_ref in processed_transactions:
        print(f"Duplicate webhook for {transaction_ref} — ignoring")
        return {"status": "ignored", "reason": "already processed"}

    processed_transactions.add(transaction_ref)

    amount = body.get("amount", 0)
    email = body.get("email")
    print(f"Payment confirmed: {transaction_ref} | ₦{amount/100} | {email}")


    # Update status in database
    with Session(engine) as session:
        statement = select(Transaction).where(
            Transaction.transaction_ref == transaction_ref
        )
        transaction = session.exec(statement).first()
        if transaction:
            transaction.status = "success"
            transaction.paid_at = datetime.utcnow()
            session.add(transaction)
            session.commit()
            print(f"DB updated to success: {transaction_ref}")
        else:
            print(f"Warning: ref {transaction_ref} not found in DB")
    # TODO: Trigger AI pipeline here
    return {"status": "success", "transaction_ref": transaction_ref}


# CALLBACK (user lands here after payment)

@payment_router.get("/pay/callback")
async def payment_callback(transaction_reference: str = None):
    if not transaction_reference:
        return {"message": "No transaction reference received"}

    print(f"User returned after payment. Ref: {transaction_reference}")

    # Verify with Squad
    headers = {"Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}"}

    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{Config.SQUAD_BASE_URL}/transaction/verify/{transaction_reference}",
            headers=headers
        )

    data = res.json()
    status = data.get("data", {}).get("transaction_status", "Unknown")

    # Update DB if payment is confirmed
    if status == "Success":
        with Session(engine) as session:
            statement = select(Transaction).where(
                Transaction.transaction_ref == transaction_reference
            )
            transaction = session.exec(statement).first()
            if transaction and transaction.status != "success":
                transaction.status = "success"
                transaction.paid_at = datetime.utcnow()
                session.add(transaction)
                session.commit()
                print(f"DB updated via callback: {transaction_reference}")

    return {
        "message": "Payment completed",
        "transaction_ref": transaction_reference,
        "status": status
    }


@payment_router.post("/test/charge-card")
async def test_charge_card(transaction_ref: str):
    """Test endpoint - Direct card charge bypassing modal"""
    headers = {
        "Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "transaction_reference": transaction_ref,
        "amount": 100000,  # ₦1000 in kobo
        "pass_charge": True,
        "currency": "NGN",
        "webhook_url": "https://junkman-thrash-omission.ngrok-free.dev/payment/webhook",
        "card": {
            "number": "5555555555554444",
            "cvv": "121",
            "expiry_month": "12",
            "expiry_year": "50"
        },
        "payment_method": "card",
        "customer": {
            "name": "Test User",
            "email": "akinpelushuaib0@gmail.com"
        },
        "redirect_url": "https://junkman-thrash-omission.ngrok-free.dev/payment/pay/callback"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{Config.SQUAD_BASE_URL}/transaction/initiate/process-payment",
            json=body,
            headers=headers
        )

    data = res.json()
    print("Charge card response:", data)
    return data



@payment_router.post("/test/authorize-payment")
async def test_authorize_payment(
    transaction_reference: str,
    pin: str = None,
    otp: str = None
):
    """Test endpoint - Authorize payment with PIN or OTP"""
    headers = {
        "Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    # Build authorization object
    authorization = {}
    if pin:
        authorization["pin"] = pin
    if otp:
        authorization["otp"] = otp

    body = {
        "transaction_reference": transaction_reference,
        "authorization": authorization
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{Config.SQUAD_BASE_URL}/transaction/payment/authorize",
            json=body,
            headers=headers
        )

    data = res.json()
    print("Authorize response:", data)
    return data