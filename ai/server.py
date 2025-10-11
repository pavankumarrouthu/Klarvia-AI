"""FastAPI microservice exposing the chatbot model via /chat.

Run locally:
  uvicorn ai.server:app --reload --host 127.0.0.1 --port 8001
"""
from __future__ import annotations

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .model import get_reply, inference_ready


logger = logging.getLogger("ai.server")
logger.setLevel(logging.INFO)

app = FastAPI(title="Klarvia AI Chat Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatIn(BaseModel):
    text: str


class ChatOut(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok", "inference_ready": inference_ready()}


@app.post("/chat", response_model=ChatOut)
def chat(body: ChatIn):
    try:
        user_text = (body.text or "").strip()
        logger.info("[chat] recv: %s", user_text)
        if not user_text:
            raise HTTPException(status_code=400, detail="text is required")
        reply = get_reply(user_text)
        logger.info("[chat] reply: %s", reply)
        return ChatOut(reply=reply)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Chat error: %s", e)
        raise HTTPException(status_code=500, detail="internal error")
