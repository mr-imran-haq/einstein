from datetime import datetime
from pydantic import BaseModel


class FocusSessionCreate(BaseModel):
    duration_minutes: int


class FocusSessionOut(BaseModel):
    id: int
    duration_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True