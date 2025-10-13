# Klarvia-AI

Vite + React + TypeScript + shadcn-ui + Tailwind CSS, with a Node/Express backend for Postgres.

This repo now includes a small Python FastAPI microservice for the AI chatbot model to enable voice → model → voice.

## Run the stack locally

Backend (Node/Express) — requires Node.js 18+ (native fetch used):

```powershell
npm --prefix .\server install
npm --prefix .\server run dev
```

Frontend (Vite):

```powershell
npm install
npm run dev
```

AI microservice (FastAPI) — optional; powers the `/chat` endpoint:

```powershell
# Create/activate a Python env first (recommended)
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r .\ai\requirements.txt

# Optionally configure model env (see ai/model.py)
# $env:MODEL_IMPL = "transformers"; $env:MODEL_NAME = "sshleifer/tiny-gpt2"

python -m uvicorn ai.server:app --reload --host 127.0.0.1 --port 8001
```

The frontend proxies `/api/*` to Node on port 4000. We also add a new route `/api/chat` that forwards to the Python service at http://127.0.0.1:8001/chat.

## Voice diagnostics

Open your app at http://localhost:8080 and in the devtools console run:

```js
await (await fetch('/voice_test.js')).text().then(eval)
```

This script checks SpeechRecognition, speechSynthesis, mic permissions, and hits `/api/chat` with "Hello".

You can also open the floating mic button in the UI (bottom-right) to try a full voice interaction. Watch the browser console for lines prefixed with `[voice]`.

## Configure models

The AI service tries these strategies (see `ai/model.py`):
- Unsloth LoRA (set MODEL_IMPL=unsloth and MODEL_PATH to your fine-tuned dir)
- Transformers pipeline (set MODEL_IMPL=transformers and MODEL_NAME)
- Fallback rule-based echo if no heavy libs are present

Set environment variables before starting the Python service. Examples:

```powershell
$env:MODEL_IMPL = "unsloth"; $env:MODEL_PATH = "D:\\models\\klarvia_lora"
# or
$env:MODEL_IMPL = "transformers"; $env:MODEL_NAME = "sshleifer/tiny-gpt2"
```
