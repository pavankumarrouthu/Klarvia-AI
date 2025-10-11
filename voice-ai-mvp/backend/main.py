from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your inference-only model module
try:
    from . import model as model_module
except Exception:
    # When running with --app-dir, relative import may differ
    import importlib
    model_module = importlib.import_module("backend.model")

app = FastAPI(title="voice-ai-mvp", version="0.2.0")

# CORS for local dev: allow frontends served from common localhost ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    reply: str


INFERENCE_READY = False


@app.on_event("startup")
async def startup_event():
    global INFERENCE_READY
    # Try to load resources if the module provides it
    try:
        if hasattr(model_module, "load_resources"):
            INFERENCE_READY = bool(model_module.load_resources())
        else:
            INFERENCE_READY = True
        print(f"[backend] inference_ready={INFERENCE_READY}")
    except Exception as e:
        print(f"[backend] load_resources error: {e}")
        INFERENCE_READY = False


@app.get("/health")
async def health():
    ready = bool(getattr(model_module, "inference_ready", lambda: INFERENCE_READY)()) if hasattr(model_module, "inference_ready") else INFERENCE_READY
    return {"status": "ok", "inference_ready": ready}


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")

    print("[backend] received text:", req.text)
    try:
        if hasattr(model_module, "get_reply"):
            reply = str(model_module.get_reply(req.text))
        else:
            reply = f"I would answer: {req.text}"
        print("[backend] replying:", reply)
        return PredictResponse(reply=reply)
    except Exception as e:
        print(f"[backend] predict error: {e}")
        raise HTTPException(status_code=500, detail=f"inference error: {e}")
