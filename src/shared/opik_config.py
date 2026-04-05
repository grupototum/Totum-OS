# Opik Configuration for Totum Bot
# This file configures Opik for lightweight cloud-based tracing

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Opik Configuration
OPIK_PROJECT_NAME = "totum-atendente-bot"
OPIK_WORKSPACE = "default"

# Use cloud by default (lighter than self-hosted)
# To use local, set OPIK_URL environment variable
OPIK_API_KEY = os.getenv("OPIK_API_KEY", "")

# Tracing settings
ENABLE_TRACING = bool(OPIK_API_KEY)  # Só ativa se tiver API key
TRACE_LLM_CALLS = True
TRACE_TELEGRAM_HANDLERS = True

# Evaluation settings
ENABLE_EVALUATION = True
EVALUATION_METRICS = [
    "hallucination",
    "answer_relevance", 
    "moderation"
]

# Logging
LOG_LEVEL = "INFO"
