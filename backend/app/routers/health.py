from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.db.session import get_db

from app.ai.client import client
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def health_check():
    return {
        "status": "ok",
        "service": "EINSTEIN backend",
        "database_configured": bool(settings.database_url),
    }


@router.get("/db")
def db_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {"database_connected": result == 1}


@router.get("/ai")
def ai_check():
    response = client.chat.completions.create(
        model=settings.ai_model,
        messages=[{"role": "user", "content": "Say hello in one short sentence."}],
    )
    return {"ai_response": response.choices[0].message.content}