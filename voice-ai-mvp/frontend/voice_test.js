// Voice Integration Diagnostics
// Open the browser DevTools Console to see logs from this file.
(function () {
  const log = (m) => console.log(m) || append(m);
  function append(msg) {
    const el = document.getElementById('log');
    if (el) {
      el.textContent += msg + '\n';
      el.scrollTop = el.scrollHeight;
    }
  }

  async function run() {
    log('--- Voice Integration Test ---');
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      log('✅ SpeechRecognition supported');
    } else {
      log('❌ SpeechRecognition not supported (use Chrome).');
    }

    if ('speechSynthesis' in window) {
      log('✅ SpeechSynthesis supported');
    } else {
      log('❌ SpeechSynthesis not supported');
    }

    try {
      const health = await fetch('http://127.0.0.1:8000/health');
      if (health.ok) {
        const data = await health.json();
        log('✅ Backend reachable');
        log(`ℹ️  inference_ready = ${data.inference_ready}`);
        if (!data.inference_ready) {
          log('💡 Tip: Ensure load_resources() loads your model or use MODEL_NAME env var.');
        }
      } else {
        log(`❌ Backend /health failed: HTTP ${health.status}`);
      }
    } catch (e) {
      log(`❌ Backend /health error: ${e.message}`);
    }

    try {
  const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello' })
      });
      if (!res.ok) {
        const t = await res.text();
        log(`❌ /predict failed: HTTP ${res.status}: ${t}`);
      } else {
        const data = await res.json();
        log(`✅ /predict returned response: ${data.reply}`);
        try {
          const u = new SpeechSynthesisUtterance(`Test reply: ${data.reply}`);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
          log('🔊 Spoke test reply');
        } catch (_) {
          // no-op
        }
      }
    } catch (e) {
      log(`❌ /predict error: ${e.message}`);
    }

    log('--- End of Test ---');
  }

  // Hook up diagnostics button if present
  const btn = document.getElementById('diagBtn');
  if (btn) btn.addEventListener('click', run);

  // Also expose to window for manual trigger if needed
  window.runVoiceDiagnostics = run;
})();
