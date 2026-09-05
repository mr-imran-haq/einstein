# JSON schema definitions describing each tool to the AI model.
# The model reads these to decide WHICH tool to call and WHAT arguments to pass.

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "create_routine",
            "description": "Create a routine/schedule item for a specific date and time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                    "start_time": {"type": "string", "description": "Start time in HH:MM (24-hour) format"},
                    "activity": {"type": "string", "description": "What the activity is, e.g. 'Study Data Structures'"},
                    "category": {"type": "string", "description": "Optional category, e.g. 'study', 'health'"},
                },
                "required": ["date", "start_time", "activity"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_task",
            "description": "Create a to-do task, optionally with a deadline.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "The task description"},
                    "deadline": {"type": "string", "description": "Deadline in YYYY-MM-DD format, optional"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                },
                "required": ["title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_target",
            "description": "Create a new study target/goal for a subject.",
            "parameters": {
                "type": "object",
                "properties": {
                    "subject": {"type": "string", "description": "e.g. 'Data Structures'"},
                    "name": {"type": "string", "description": "e.g. 'Finish chapter 4'"},
                    "deadline": {"type": "string", "description": "Deadline in YYYY-MM-DD format, optional"},
                },
                "required": ["subject", "name"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "save_creation",
            "description": "Save a piece of generated content the user wants to keep, such as a study plan, idea, draft document, or project plan. Use this when the user asks you to create something and save/remember it, not for simple routines/tasks/targets which have their own tools.",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "description": "A short category label, e.g. 'study_plan', 'website_idea', 'project_plan', 'note'",
                    },
                    "title": {"type": "string", "description": "A short title for this creation"},
                    "text": {"type": "string", "description": "The full generated content, in plain text or markdown"},
                },
                "required": ["type", "title", "text"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "set_news_preference",
            "description": "Add a topic the user wants to receive news about, e.g. AI, Bangladesh, cybersecurity.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic": {"type": "string", "description": "A short topic keyword, e.g. 'AI', 'Bangladesh', 'programming'"},
                },
                "required": ["topic"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_saved_news",
            "description": "Fetch the user's actual saved news articles, optionally filtered by topic. Use this whenever the user asks to see or hear their news — never make up news yourself.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic": {"type": "string", "description": "Optional topic to filter by"},
                },
                "required": [],
            },
        },
    },
]