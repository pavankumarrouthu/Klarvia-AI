# Backend (FastAPI)

Minimal FastAPI app exposing `/predict` for text and `/health` for status.

## Run locally

```powershell
# From repo root
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r voice-ai-mvp\backend\requirements.txt
# Run uvicorn from repo root by pointing app dir
uvicorn backend.main:app --reload --port 8000 --app-dir voice-ai-mvp
```

- App will try to load a local model from `voice-ai-mvp/backend/model.pkl` if present.
- CORS allows calls from `http://localhost:5500`.

## API
- GET http://localhost:8000/health → `{ "status": "ok" }`
- POST http://localhost:8000/predict → body `{ "text": "hello" }` returns `{ "reply": "..." }`

## Plug in your model
Replace the pickle logic with your preferred framework:

- scikit-learn: `reply = model.predict([text])[0]`
- Hugging Face: tokenize → generate → decode to string
- PyTorch: `model.eval()` with `torch.no_grad()`
- TensorFlow/Keras: `model.predict(...)` then decode

Update `MODEL_PATH` and the `predict` body accordingly.
