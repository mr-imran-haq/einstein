from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/einstein_db"
    
    # AI Provider (Groq now, switchable to OpenAI later)
    ai_provider: str = "groq"
    ai_api_key: str = ""
    ai_base_url: str = "https://api.groq.com/openai/v1"
    ai_model: str = "llama-3.3-70b-versatile"
    ai_stt_model: str = "whisper-large-v3"
    ai_tts_model: str = "canopylabs/orpheus-v1-english"
    ai_tts_voice: str = "autumn"
    news_api_key: str = ""
    news_api_base_url: str = "https://api.currentsapi.services/v1"

    # OpenAI
    openai_api_key: str = ""

    # Telegram
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Security
    secret_key: str = "change_this_secret_key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    internal_api_key: str = "change_this_internal_key"

    # App
    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file="../.env",   # einstein/.env রুট ফোল্ডার থেকে পড়বে
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()