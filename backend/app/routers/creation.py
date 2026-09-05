from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.creation import Creation
from app.schemas.creation import CreationCreate, CreationOut

router = APIRouter(prefix="/creations", tags=["Creations"])


@router.get("", response_model=List[CreationOut])
def list_creations(
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Creation).filter(Creation.user_id == current_user.id)
    if type:
        query = query.filter(Creation.type == type)
    return query.order_by(Creation.created_at.desc()).all()


@router.post("", response_model=CreationOut, status_code=201)
def create_creation(
    payload: CreationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    creation = Creation(**payload.model_dump(), user_id=current_user.id)
    db.add(creation)
    db.commit()
    db.refresh(creation)
    return creation


@router.delete("/{creation_id}", status_code=204)
def delete_creation(
    creation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    creation = (
        db.query(Creation)
        .filter(Creation.id == creation_id, Creation.user_id == current_user.id)
        .first()
    )
    if not creation:
        raise HTTPException(status_code=404, detail="Creation not found")
    db.delete(creation)
    db.commit()