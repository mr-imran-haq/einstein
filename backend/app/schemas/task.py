from datetime import date
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    category: Optional[str] = None
    priority: Optional[str] = "medium"
    deadline: Optional[date] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[date] = None
    is_completed: Optional[bool] = None


class TaskOut(BaseModel):
    id: int
    title: str
    category: Optional[str]
    priority: str
    deadline: Optional[date]
    is_completed: bool

    class Config:
        from_attributes = True