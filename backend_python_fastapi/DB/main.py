from sqlmodel import SQLModel, create_engine, Session
from backend_python_fastapi.config import Config

engine = create_engine(Config.DATABASE_URL,
                       echo=True,
                       pool_pre_ping=True,
                       pool_recycle=300
                       )

def create_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
        