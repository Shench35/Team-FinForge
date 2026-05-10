from fastapi import FastAPI
from backend.payment import payment_router
from backend.DB.main import create_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db()

app.include_router(payment_router, prefix="/payment")