from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class EventCreate(BaseModel):
    title: str
    event_datetime: datetime
    category: Optional[str] = None
    notes: Optional[str] = None


class EventOut(BaseModel):
    id: int
    title: str
    event_datetime: datetime
    category: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True