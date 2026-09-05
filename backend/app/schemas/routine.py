from datetime import date, time
from typing import Optional
from pydantic import BaseModel


class RoutineCreate(BaseModel):
    date: date
    start_time: time
    end_time: Optional[time] = None
    activity: str
    category: Optional[str] = None
    priority: Optional[str] = "medium"


class RoutineUpdate(BaseModel):
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    activity: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None


class RoutineOut(BaseModel):
    id: int
    date: date
    start_time: time
    end_time: Optional[time]
    activity: str
    category: Optional[str]
    priority: str
    status: str

    class Config:
        from_attributes = True