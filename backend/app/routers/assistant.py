from fastapi import APIRouter, Depends, UploadFile, File, Form, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.core.internal_auth import verify_internal_key
from app.models.user import User
from app.schemas.assistant import ChatRequest, ChatResponse, InternalChatRequest
from app.ai.agent import run_agent
from app.ai.stt import transcribe_audio
from app.ai.tts import synthesize_speech

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reply = run_agent(payload.message, current_user.id, db)
    return ChatResponse(reply=reply)


@router.post("/voice")
async def voice_chat(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transcript = transcribe_audio(audio)
    reply_text = run_agent(transcript, current_user.id, db)
    audio_bytes = synthesize_speech(reply_text)
    return Response(content=audio_bytes, media_type="audio/wav")


# ---- Internal endpoints for Telegram bot (via n8n), secured by X-Internal-Key ----

@router.post("/internal/chat", dependencies=[Depends(verify_internal_key)])
def internal_chat(payload: InternalChatRequest, db: Session = Depends(get_db)):
    reply = run_agent(payload.message, payload.user_id, db)
    return {"reply": reply}


@router.post("/internal/voice", dependencies=[Depends(verify_internal_key)])
async def internal_voice_chat(
    user_id: int = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    transcript = transcribe_audio(audio)
    reply_text = run_agent(transcript, user_id, db)
    audio_bytes = synthesize_speech(reply_text)
    return Response(content=audio_bytes, media_type="audio/wav")