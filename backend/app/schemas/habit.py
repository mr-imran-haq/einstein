from typing import Optional
from pydantic import BaseModel


class HabitCreate(BaseModel):
    name: str
    frequency: Optional[str] = "daily"


class HabitOut(BaseModel):
    id: int
    name: str
    frequency: str
    current_streak: int
    is_active: bool

    class Config:
        from_attributes = True