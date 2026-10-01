from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Goa Community Resilience API"
    environment: str = "dev"

    # Supabase
    supabase_url: str = ""
    supabase_key: str = ""

    # JWT
    jwt_secret_key: str = "CHANGE_ME_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Module 3 & 4 service URLs (set in .env)
    module3_url: str = "http://localhost:8001"
    module4_url: str = "http://localhost:8002"


settings = Settings()
