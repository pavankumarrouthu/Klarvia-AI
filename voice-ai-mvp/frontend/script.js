// Minimal voice → model → voice demo using Web Speech API and FastAPI backend

const recordBtn = document.getElementById('recordBtn');
const statusEl = document.getElementById('status');
const recognizedEl = document.getElementById('recognized');
const replyEl = document.getElementById('reply');
const logEl = document.getElementById('log');
const diagBtn = document.getElementById('diagBtn');
const fallbackRow = document.getElementById('fallbackRow');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');

const API_URL = 'http://127.0.0.1:8000/predict';

// Cross-browser SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let recording = false;

function log(msg) {
  logEl.textContent += `${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function speak(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    log(`TTS error: ${e}`);
  }
}

function ensureRecognition() {
  if (!SpeechRecognition) {
    throw new Error('Web Speech API is not supported in this browser. Try Chrome.');
  }
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      statusEl.textContent = 'Listening...';
      log('🎤 Recognition started (mic permission granted)');
    };
    recognition.onerror = (e) => {
      statusEl.textContent = 'Error';
      log(`❌ Recognition error: ${e.error}`);
      recording = false;
      recordBtn.textContent = 'Start Recording';
    };
    recognition.onend = () => {
      statusEl.textContent = 'Processing...';
      log('🛑 Recognition ended');
      recording = false;
      recordBtn.textContent = 'Start Recording';
    };
    recognition.onresult = async (ev) => {
      const text = ev.results[0][0].transcript;
      recognizedEl.textContent = text;
      log(`✅ Recognized text: "${text}"`);
      log('➡️  Sending to backend /predict ...');
      await sendToBackend(text);
    };
  }
  return recognition;
}

async function sendToBackend(text) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`HTTP ${res.status}: ${t}`);
    }
    const data = await res.json();
    const reply = data.reply || '';
    replyEl.textContent = reply;
    log(`⬅️  Reply received: "${reply}"`);
    log('🔊 Speaking reply ...');
    speak(reply);
  } catch (e) {
    log(`Backend error: ${e.message}`);
  } finally {
    statusEl.textContent = 'Idle';
  }
}

recordBtn.addEventListener('click', () => {
  try {
    ensureRecognition();
    if (!recording) {
      log('Requesting microphone and starting recognition ...');
      recognition.start();
      recording = true;
      recordBtn.textContent = 'Stop Recording';
    } else {
      log('Stopping recognition ...');
      recognition.stop();
      recording = false;
      recordBtn.textContent = 'Start Recording';
    }
  } catch (e) {
    statusEl.textContent = 'Error';
    log(e.message);
  }
});

// Diagnostics button: checks for APIs and backend connectivity (also available via voice_test.js)
if (diagBtn) {
  diagBtn.addEventListener('click', async () => {
    try {
      log('--- Diagnostics start ---');
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        log('✅ SpeechRecognition supported');
      } else {
        log('❌ SpeechRecognition not supported: showing fallback text input');
      }
      if ('speechSynthesis' in window) {
        log('✅ SpeechSynthesis supported');
      } else {
        log('❌ SpeechSynthesis not supported');
      }

      const healthRes = await fetch('http://localhost:8000/health');
      if (healthRes.ok) {
        log('✅ Backend reachable (/health OK)');
      } else {
        log(`❌ Backend /health failed: HTTP ${healthRes.status}`);
      }

      const pingRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello' })
      });
      if (!pingRes.ok) {
        const t = await pingRes.text();
        log(`❌ /predict failed: HTTP ${pingRes.status}: ${t}`);
      } else {
        const data = await pingRes.json();
        log(`✅ /predict returned response: ${data.reply}`);
      }
      log('--- Diagnostics end ---');
    } catch (e) {
      log(`❌ Diagnostics error: ${e.message}`);
    }
  });
}

// Fallback: show manual text input if SpeechRecognition is unavailable
if (!SpeechRecognition && fallbackRow) {
  fallbackRow.style.display = 'flex';
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const text = (textInput?.value || '').trim();
    if (!text) return;
    recognizedEl.textContent = text;
    log(`(Fallback) Sending typed text to backend: "${text}"`);
    await sendToBackend(text);
  });
}
