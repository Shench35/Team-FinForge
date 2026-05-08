import httpx
import uuid
from fastapi import FastAPI
from backend.config import Config

app = FastAPI()



@app.post("/pay/initiate")
async def initiate_payment(email: str, amount_naira: float):
    headers = {
        "Authorization": f"Bearer {Config.SQUAD_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "amount": int(amount_naira * 100),  # convert to kobo
        "email": email,
        "currency": "NGN",
        "initiate_type": "inline",
        "transaction_ref": str(uuid.uuid4()),  # unique ref
        "callback_url": "https://yourapp.com/payment/callback"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{Config.SQUAD_BASE_URL}/transaction/initiate",
            json=body,
            headers=headers
        )
    
    data = res.json()
    return {
        "checkout_url": data["data"]["checkout_url"],
        "transaction_ref": data["data"]["transaction_ref"]
    }

app.get("/paymant_successful")
async def payment_successful():
    return{"message":"successfully paid"}