from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.internal_auth import verify_internal_key
from app.models.routine import Routine
from app.models.task import Task
from app.models.notification import NotificationLog

router = APIRouter(prefix="/reminders", tags=["Reminders"])


@router.get("/internal/routines-due", dependencies=[Depends(verify_internal_key)])
def routines_due(window_minutes: int = Query(30), db: Session = Depends(get_db)):
    now = datetime.now()
    today = now.date()
    window_end = (now + timedelta(minutes=window_minutes)).time()

    routines = (
        db.query(Routine)
        .filter(
            Routine.date == today,
            Routine.status == "pending",
            Routine.start_time >= now.time(),
            Routine.start_time <= window_end,
        )
        .all()
    )

    results = []
    for r in routines:
        dedupe_key = f"routine:{r.id}:{today}"
        already_sent = db.query(NotificationLog).filter(NotificationLog.message == dedupe_key).first()
        if already_sent:
            continue

        results.append({
            "user_id": r.user_id,
            "activity": r.activity,
            "start_time": r.start_time.strftime("%H:%M"),
        })
        db.add(NotificationLog(user_id=r.user_id, type="routine_reminder", message=dedupe_key))

    db.commit()
    return results


@router.get("/internal/tasks-due", dependencies=[Depends(verify_internal_key)])
def tasks_due(db: Session = Depends(get_db)):
    today = datetime.now().date()

    tasks = (
        db.query(Task)
        .filter(Task.is_completed == False, Task.deadline.isnot(None), Task.deadline <= today)
        .all()
    )

    results = []
    for t in tasks:
        dedupe_key = f"task:{t.id}:{today}"
        already_sent = db.query(NotificationLog).filter(NotificationLog.message == dedupe_key).first()
        if already_sent:
            continue

        results.append({
            "user_id": t.user_id,
            "title": t.title,
            "deadline": str(t.deadline),
        })
        db.add(NotificationLog(user_id=t.user_id, type="task_reminder", message=dedupe_key))
        


    db.commit()
    return results

@router.post("/internal/telegram-dedupe", dependencies=[Depends(verify_internal_key)])
def telegram_dedupe_check(update_id: int = Query(...), db: Session = Depends(get_db)):
    dedupe_key = f"telegram_update:{update_id}"
    already_processed = db.query(NotificationLog).filter(NotificationLog.message == dedupe_key).first()

    if already_processed:
        return {"is_new": False}

    db.add(NotificationLog(user_id=1, type="telegram_dedupe", message=dedupe_key))
    db.commit()
    return {"is_new": True}

@router.get("/internal/pending-summary", dependencies=[Depends(verify_internal_key)])
def pending_summary(db: Session = Depends(get_db)):
    today = datetime.now().date()

    tasks = db.query(Task).filter(Task.is_completed == False).all()
    routines = (
        db.query(Routine)
        .filter(Routine.date == today, Routine.status != "done")
        .all()
    )

    if not tasks and not routines:
        return {"has_pending": False, "message": ""}

    lines = []
    if tasks:
        lines.append("📋 Pending tasks:")
        for t in tasks:
            deadline = f" (due {t.deadline})" if t.deadline else ""
            lines.append(f"- {t.title}{deadline}")

    if routines:
        lines.append("")
        lines.append("⏰ Today's pending routine:")
        for r in routines:
            lines.append(f"- {r.start_time.strftime('%H:%M')} {r.activity}")

    return {"has_pending": True, "message": "\n".join(lines)}