from fastapi import Header, HTTPException
from app.core.config import settings


def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_api_key:
        raise HTTPException(status_code=403, detail="Invalid internal API key")