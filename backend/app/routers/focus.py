from typing import List
from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.creation import Creation
from app.schemas.focus import FocusSessionCreate

router = APIRouter(prefix="/focus", tags=["Focus"])


@router.post("/sessions", status_code=201)
def log_focus_session(
    payload: FocusSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = Creation(
        user_id=current_user.id,
        type="focus_session",
        title=f"{payload.duration_minutes} min focus session",
        content={"duration_minutes": payload.duration_minutes},
    )
    db.add(session)
    db.commit()
    return {"success": True}


@router.get("/sessions/today")
def get_today_focus_minutes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    sessions = (
        db.query(Creation)
        .filter(
            Creation.user_id == current_user.id,
            Creation.type == "focus_session",
        )
        .all()
    )

    total_minutes = sum(
        s.content.get("duration_minutes", 0)
        for s in sessions
        if s.created_at.date() == today
    )

    return {"total_minutes": total_minutes}