from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class TargetCreate(BaseModel):
    subject: str
    name: str
    deadline: Optional[date] = None
    progress_percent: int = Field(default=0, ge=0, le=100)


class TargetUpdate(BaseModel):
    subject: Optional[str] = None
    name: Optional[str] = None
    deadline: Optional[date] = None
    progress_percent: Optional[int] = Field(default=None, ge=0, le=100)
    status: Optional[str] = None


class TargetOut(BaseModel):
    id: int
    subject: str
    name: str
    progress_percent: int
    deadline: Optional[date]
    status: str

    class Config:
        from_attributes = True