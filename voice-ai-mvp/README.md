# voice-ai-mvp

Minimal, local, end-to-end voice → model → voice demo

- Frontend: static HTML + JS on http://localhost:5500 using Web Speech API (SpeechRecognition for STT, speechSynthesis for TTS)
- Backend: FastAPI on http://localhost:8000 loading local `backend/model.pkl` if present; exposes POST `/predict` and GET `/health`

## Run

```powershell
# 1) Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r voice-ai-mvp\backend\requirements.txt
uvicorn backend.main:app --reload --port 8000 --app-dir voice-ai-mvp

# 2) Frontend (in a second terminal)
cd voice-ai-mvp\frontend
python -m http.server 5500
# or use VS Code Live Server extension

# 3) Open app
# Open http://localhost:5500 in your browser (Chrome recommended for Web Speech API)
```

## Voice Integration Test

1) Open http://localhost:5500 and open the browser DevTools Console (F12).

2) Click "Run Diagnostics" on the page (or run `runVoiceDiagnostics()` from the console). You should see logs like:

```
✅ SpeechRecognition supported
✅ SpeechSynthesis supported
✅ Backend reachable
✅ /predict returned response: <reply>
```

3) Click "Start Recording" and speak a short sentence. Console and page will show:
- 🎤 Recognition started
- ✅ Recognized text: "..."
- ➡️  Sending to backend /predict ...
- ⬅️  Reply received: "..."
- 🔊 Speaking reply ... (you will hear the reply)

If SpeechRecognition is not supported by your browser, a fallback text box appears. Type a message and click Send to test the round-trip and TTS.

## Customize the model
- Put your model at `voice-ai-mvp/backend/model.pkl` if using pickle (e.g., scikit-learn). The server will load it on startup.
- Otherwise, modify `voice-ai-mvp/backend/main.py`:
  - Replace the pickle code in `load_model_if_available()`
  - Update the `predict()` logic to call your model

### Examples
- scikit-learn: `reply = model.predict([text])[0]`
- Hugging Face Transformers: tokenize → generate → decode
- PyTorch: `model.eval(); with torch.no_grad(): ...`
- TensorFlow: `model.predict(...)` then decode to string

## Endpoints
- GET `http://localhost:8000/health` → `{ "status": "ok" }`
- POST `http://localhost:8000/predict` with body `{ "text": "hello" }` → `{ "reply": "..." }`
