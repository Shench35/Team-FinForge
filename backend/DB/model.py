from sqlmodel import SQLModel, Field, Uuid
from sqlalchemy import Column, String
from datetime import datetime
import uuid

class Transaction(SQLModel, table=True):
    __tablename__ = "transaction_records"

    transaction_id:uuid.UUID = Field(sa_column=Column(Uuid, nullable=False, primary_key=True, default=uuid.uuid4))
    transaction_ref: str = Field(index=True, unique=True)
    email: str
    amount_naira: float
    amount_kobo: int
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    paid_at: datetime | None = Field(default=None)