from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.memory import Memory
from app.schemas.memory import MemoryOut

router = APIRouter(prefix="/memories", tags=["Memory"])


@router.get("", response_model=List[MemoryOut])
def list_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .order_by(Memory.created_at.desc())
        .all()
    )


@router.delete("/{memory_id}", status_code=204)
def delete_memory(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memory = (
        db.query(Memory)
        .filter(Memory.id == memory_id, Memory.user_id == current_user.id)
        .first()
    )
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    db.delete(memory)
    db.commit()


@router.delete("", status_code=204)
def clear_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Memory).filter(Memory.user_id == current_user.id).delete()
    db.commit()