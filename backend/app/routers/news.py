from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.core.internal_auth import verify_internal_key
from app.models.user import User
from app.models.news import NewsPreference, NewsArticle
from app.schemas.news import (
    NewsPreferenceCreate,
    NewsPreferenceOut,
    NewsArticleOut,
    UserTopicOut,
    NewsArticleIngest,
)

router = APIRouter(prefix="/news", tags=["News"])


# ---- User-facing endpoints (JWT protected) ----

@router.get("/preferences", response_model=List[NewsPreferenceOut])
def list_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(NewsPreference).filter(NewsPreference.user_id == current_user.id).all()


@router.post("/preferences", response_model=NewsPreferenceOut, status_code=201)
def add_preference(
    payload: NewsPreferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(NewsPreference)
        .filter(NewsPreference.user_id == current_user.id, NewsPreference.topic == payload.topic)
        .first()
    )
    if existing:
        return existing

    pref = NewsPreference(user_id=current_user.id, topic=payload.topic)
    db.add(pref)
    db.commit()
    db.refresh(pref)
    return pref


@router.delete("/preferences/{pref_id}", status_code=204)
def delete_preference(
    pref_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pref = (
        db.query(NewsPreference)
        .filter(NewsPreference.id == pref_id, NewsPreference.user_id == current_user.id)
        .first()
    )
    if not pref:
        raise HTTPException(status_code=404, detail="Preference not found")
    db.delete(pref)
    db.commit()


@router.get("/articles", response_model=List[NewsArticleOut])
def list_articles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(NewsArticle)
        .filter(NewsArticle.user_id == current_user.id)
        .order_by(NewsArticle.fetched_at.desc())
        .limit(30)
        .all()
    )
    
@router.delete("/articles/{article_id}", status_code=204)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    article = (
        db.query(NewsArticle)
        .filter(NewsArticle.id == article_id, NewsArticle.user_id == current_user.id)
        .first()
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()


# ---- Internal endpoints (used only by n8n, secured by X-Internal-Key header) ----

@router.get(
    "/internal/preferences",
    response_model=List[UserTopicOut],
    dependencies=[Depends(verify_internal_key)],
)
def internal_list_all_preferences(db: Session = Depends(get_db)):
    prefs = db.query(NewsPreference).all()
    return [UserTopicOut(user_id=p.user_id, topic=p.topic) for p in prefs]


@router.post(
    "/internal/articles",
    status_code=201,
    dependencies=[Depends(verify_internal_key)],
)
def internal_save_article(payload: NewsArticleIngest, db: Session = Depends(get_db)):
    article = NewsArticle(**payload.model_dump())
    db.add(article)
    db.commit()
    return {"success": True}