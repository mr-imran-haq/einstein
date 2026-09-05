from fastapi import UploadFile
from app.ai.client import client
from app.core.config import settings


def transcribe_audio(upload_file: UploadFile) -> str:
    audio_bytes = upload_file.file.read()

    transcription = client.audio.transcriptions.create(
        file=(upload_file.filename, audio_bytes),
        model=settings.ai_stt_model,
    )
    return transcription.text