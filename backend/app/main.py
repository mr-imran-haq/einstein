from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import (
    health,
    auth,
    routine,
    task,
    target,
    assistant,
    memory,
    creation,
    news,
    reminder,
    note,
    habit,
    focus,
    event,
)

app = FastAPI(title="EINSTEIN API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://einstein-iota-plum.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(routine.router)
app.include_router(task.router)
app.include_router(target.router)
app.include_router(assistant.router)
app.include_router(memory.router)
app.include_router(creation.router)
app.include_router(news.router)
app.include_router(reminder.router)
app.include_router(note.router)
app.include_router(habit.router)
app.include_router(focus.router)
app.include_router(event.router)


@app.get("/")
def read_root():
    return {"status": "EINSTEIN backend is running"}