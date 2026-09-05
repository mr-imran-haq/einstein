from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.target import Target
from app.schemas.target import TargetCreate, TargetUpdate, TargetOut

router = APIRouter(prefix="/targets", tags=["Targets"])


@router.get("", response_model=List[TargetOut])
def list_targets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Target)
        .filter(Target.user_id == current_user.id)
        .order_by(Target.status, Target.deadline.asc().nullslast())
        .all()
    )


@router.post("", response_model=TargetOut, status_code=201)
def create_target(
    payload: TargetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target = Target(**payload.model_dump(), user_id=current_user.id)
    db.add(target)
    db.commit()
    db.refresh(target)
    return target


@router.patch("/{target_id}", response_model=TargetOut)
def update_target(
    target_id: int,
    payload: TargetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target = (
        db.query(Target)
        .filter(Target.id == target_id, Target.user_id == current_user.id)
        .first()
    )
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(target, field, value)

    # Auto-complete: if progress hits 100, mark status as completed
    if target.progress_percent == 100 and target.status == "active":
        target.status = "completed"

    db.commit()
    db.refresh(target)
    return target


@router.delete("/{target_id}", status_code=204)
def delete_target(
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target = (
        db.query(Target)
        .filter(Target.id == target_id, Target.user_id == current_user.id)
        .first()
    )
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    db.delete(target)
    db.commit()