import json
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.routine import Routine
from app.models.task import Task
from app.models.target import Target

from app.models.creation import Creation

from app.models.news import NewsPreference

from app.models.news import NewsArticle


def execute_tool(tool_name: str, arguments: dict, user_id: int, db: Session) -> dict:
    """
    Executes a validated tool call against the database.
    Returns a small dict that gets sent back to the AI as the tool's result.
    """

    if tool_name == "create_routine":
        routine = Routine(
            user_id=user_id,
            date=datetime.strptime(arguments["date"], "%Y-%m-%d").date(),
            start_time=datetime.strptime(arguments["start_time"], "%H:%M").time(),
            activity=arguments["activity"],
            category=arguments.get("category"),
        )
        db.add(routine)
        db.commit()
        db.refresh(routine)
        return {"success": True, "routine_id": routine.id, "activity": routine.activity}

    if tool_name == "create_task":
        task = Task(
            user_id=user_id,
            title=arguments["title"],
            priority=arguments.get("priority", "medium"),
            deadline=datetime.strptime(arguments["deadline"], "%Y-%m-%d").date()
            if arguments.get("deadline")
            else None,
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return {"success": True, "task_id": task.id, "title": task.title}

    if tool_name == "create_target":
        target = Target(
            user_id=user_id,
            subject=arguments["subject"],
            name=arguments["name"],
            deadline=datetime.strptime(arguments["deadline"], "%Y-%m-%d").date()
            if arguments.get("deadline")
            else None,
        )
        db.add(target)
        db.commit()
        db.refresh(target)
        return {"success": True, "target_id": target.id, "name": target.name}
    
    if tool_name == "save_creation":
        creation = Creation(
            user_id=user_id,
            type=arguments["type"],
            title=arguments["title"],
            content={"text": arguments["text"]},
        )
        db.add(creation)
        db.commit()
        db.refresh(creation)
        return {"success": True, "creation_id": creation.id, "title": creation.title}
    
    if tool_name == "set_news_preference":
        topic = arguments["topic"]
        existing = (
            db.query(NewsPreference)
            .filter(NewsPreference.user_id == user_id, NewsPreference.topic == topic)
            .first()
        )
        if not existing:
            db.add(NewsPreference(user_id=user_id, topic=topic))
            db.commit()
        return {"success": True, "topic": topic}
    
    if tool_name == "get_saved_news":
        query = db.query(NewsArticle).filter(NewsArticle.user_id == user_id)
        topic = arguments.get("topic")
        if topic:
            query = query.filter(NewsArticle.topic.ilike(f"%{topic}%"))
        articles = query.order_by(NewsArticle.fetched_at.desc()).limit(5).all()

        if not articles:
            return {"found": False, "message": "No saved articles yet for this topic."}

        return {
            "found": True,
            "articles": [{"title": a.title, "summary": a.summary} for a in articles],
        }

    return {"success": False, "error": f"Unknown tool: {tool_name}"}