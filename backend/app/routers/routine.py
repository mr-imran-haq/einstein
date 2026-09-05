from datetime import date as date_type
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.routine import Routine
from app.schemas.routine import RoutineCreate, RoutineUpdate, RoutineOut

router = APIRouter(prefix="/routines", tags=["Routine"])


@router.get("", response_model=List[RoutineOut])
def list_routines(
    for_date: Optional[date_type] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Routine).filter(Routine.user_id == current_user.id)
    if for_date:
        query = query.filter(Routine.date == for_date)
    return query.order_by(Routine.date, Routine.start_time).all()


@router.post("", response_model=RoutineOut, status_code=201)
def create_routine(
    payload: RoutineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    routine = Routine(**payload.model_dump(), user_id=current_user.id)
    db.add(routine)
    db.commit()
    db.refresh(routine)
    return routine


@router.patch("/{routine_id}", response_model=RoutineOut)
def update_routine(
    routine_id: int,
    payload: RoutineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    routine = (
        db.query(Routine)
        .filter(Routine.id == routine_id, Routine.user_id == current_user.id)
        .first()
    )
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(routine, field, value)

    db.commit()
    db.refresh(routine)
    return routine


@router.delete("/{routine_id}", status_code=204)
def delete_routine(
    routine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    routine = (
        db.query(Routine)
        .filter(Routine.id == routine_id, Routine.user_id == current_user.id)
        .first()
    )
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")

    db.delete(routine)
    db.commit()