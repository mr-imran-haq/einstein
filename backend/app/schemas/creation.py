from datetime import datetime
from typing import Any, Dict
from pydantic import BaseModel


class CreationCreate(BaseModel):
    type: str
    title: str
    content: Dict[str, Any]


class CreationOut(BaseModel):
    id: int
    type: str
    title: str
    content: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True