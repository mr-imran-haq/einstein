from app.ai.client import client
from app.core.config import settings


def synthesize_speech(text: str) -> bytes:
    response = client.audio.speech.create(
        model=settings.ai_tts_model,
        voice=settings.ai_tts_voice,
        input=text,
        response_format="wav",
    )
    return response.read()