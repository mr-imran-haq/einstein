from datetime import datetime
from pydantic import BaseModel


class MemoryOut(BaseModel):
    id: int
    category: str
    content: str
    importance_score: int
    created_at: datetime

    class Config:
        from_attributes = True