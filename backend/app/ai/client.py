from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.ai_api_key,
    base_url=settings.ai_base_url,
)