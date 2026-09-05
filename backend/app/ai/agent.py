import json
from datetime import datetime
from sqlalchemy.orm import Session

from app.ai.client import client
from app.ai.tools import TOOL_DEFINITIONS
from app.ai.executor import execute_tool
from app.core.config import settings
from app.models.memory import Conversation, ConversationMessage, Memory

BASE_SYSTEM_PROMPT = """You are Einstein, a helpful personal AI assistant for a software engineering student.
You help manage routines, tasks, and study targets.
When the user asks you to create or schedule something, use the available tools.
Always confirm what you did in a short, friendly sentence after using a tool.
If a date isn't specified, assume today's date: {today}. If unsure about details, ask a clarifying question instead of guessing.

IMPORTANT: You have NO real-time internet access and cannot know current news yourself.
When the user asks for news, ALWAYS use the get_saved_news tool to check what's actually been saved — never invent or guess news content.
If get_saved_news finds nothing, tell the user honestly that no articles have been fetched yet, and that the automation runs once a day, so they can check back later.
When the user says "give me news about X" without asking to see it now, treat that as a request to set a preference (use set_news_preference) and explain that new articles will appear after the next automated fetch, not instantly."""

MEMORY_EXTRACTION_PROMPT = """Analyze the user's message below. Decide if it contains information worth remembering long-term about the user — such as a goal, preference, routine habit, important instruction, ongoing project, or decision.

Ignore small talk and one-off requests that are already fully handled (like a simple "create a task").

Respond ONLY with JSON in this exact shape, nothing else:
{{"should_remember": true or false, "category": "goal" | "preference" | "instruction" | "project" | "decision" | "other", "content": "a short summary, or empty string"}}

User message: "{message}"
"""


def get_or_create_conversation(user_id: int, db: Session) -> Conversation:
    conversation = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.started_at.desc())
        .first()
    )
    if conversation:
        return conversation

    conversation = Conversation(user_id=user_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def save_message(conversation_id: int, role: str, content: str, db: Session):
    db.add(ConversationMessage(conversation_id=conversation_id, role=role, content=content))
    db.commit()


def get_relevant_memories(user_id: int, db: Session, limit: int = 8):
    return (
        db.query(Memory)
        .filter(Memory.user_id == user_id)
        .order_by(Memory.importance_score.desc(), Memory.created_at.desc())
        .limit(limit)
        .all()
    )


def extract_and_store_memory(user_message: str, user_id: int, conversation_id: int, db: Session):
    try:
        response = client.chat.completions.create(
            model=settings.ai_model,
            messages=[
                {"role": "user", "content": MEMORY_EXTRACTION_PROMPT.format(message=user_message)}
            ],
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content)
    except Exception:
        return  # Extraction failing should never break the main chat flow

    if not data.get("should_remember") or not data.get("content"):
        return

    db.add(
        Memory(
            user_id=user_id,
            source_conversation_id=conversation_id,
            category=data.get("category", "other"),
            content=data["content"],
            importance_score=6,
        )
    )
    db.commit()


def build_system_prompt(user_id: int, db: Session) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    prompt = BASE_SYSTEM_PROMPT.format(today=today)

    memories = get_relevant_memories(user_id, db)
    if memories:
        memory_lines = "\n".join(f"- ({m.category}) {m.content}" for m in memories)
        prompt += f"\n\nThings you remember about this user:\n{memory_lines}"

    return prompt


def run_agent(user_message: str, user_id: int, db: Session) -> str:
    conversation = get_or_create_conversation(user_id, db)
    save_message(conversation.id, "user", user_message, db)

    system_prompt = build_system_prompt(user_id, db)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    reply = None
    max_steps = 5  # safety limit so a misbehaving model can't loop forever

    for _ in range(max_steps):
        response = client.chat.completions.create(
            model=settings.ai_model,
            messages=messages,
            tools=TOOL_DEFINITIONS,
            tool_choice="auto",
        )
        message = response.choices[0].message

        if not message.tool_calls:
            reply = message.content
            break

        messages.append(message)
        for tool_call in message.tool_calls:
            arguments = json.loads(tool_call.function.arguments)
            result = execute_tool(tool_call.function.name, arguments, user_id, db)
            messages.append(
                {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)}
            )
        # loop continues — model may want to call more tools (e.g. a second topic/task)

    if reply is None:
        reply = "Done! I've taken care of that for you."

    save_message(conversation.id, "assistant", reply, db)
    extract_and_store_memory(user_message, user_id, conversation.id, db)

    return reply