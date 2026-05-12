from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):

    SQUAD_SECRET_KEY:str
    SQUAD_BASE_URL:str = "https://sandbox-api-d.squadco.com"
    DATABASE_URL:str
    GEMINI_API_KEY:str
    JWT_SECRET:str
    JWT_ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    REFRESH_TOKEN_DAYS:int
    


    model_config = SettingsConfigDict(
    env_file=ENV_PATH,
    env_file_encoding="utf-8",
    extra="ignore"
    )

Config = Settings()