"""
Application configuration using pydantic-settings.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sql_app.db"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI - Anthropic Claude (replaces OpenAI)
    ANTHROPIC_API_KEY: str = ""

    # ML Service
    ML_SERVICE_URL: str = "http://localhost:8001"

    # CORS - comma-separated allowed origins
    CORS_ORIGINS: str = "*"

    # App
    PROJECT_NAME: str = "Terra Nova"
    VERSION: str = "1.0.0"


settings = Settings()
