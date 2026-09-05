from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NewsPreferenceCreate(BaseModel):
    topic: str


class NewsPreferenceOut(BaseModel):
    id: int
    topic: str

    class Config:
        from_attributes = True


class NewsArticleOut(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    source: Optional[str]
    url: Optional[str]
    topic: Optional[str]
    fetched_at: datetime

    class Config:
        from_attributes = True


# Used only by n8n to report which users want which topics
class UserTopicOut(BaseModel):
    user_id: int
    topic: str


# Used only by n8n to push a fetched+summarized article into the DB
class NewsArticleIngest(BaseModel):
    user_id: int
    title: str
    summary: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None
    topic: Optional[str] = None