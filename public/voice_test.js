(async () => {
  const log = (...args) => console.log("[voice-test]", ...args);
  const ok = (msg) => console.log("%c✅ " + msg, "color: green");
  const bad = (msg) => console.log("%c❌ " + msg, "color: red");

  // Check STT
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) ok("SpeechRecognition supported"); else bad("SpeechRecognition not supported");

  // Check TTS
  if ("speechSynthesis" in window) ok("speechSynthesis supported"); else bad("speechSynthesis not supported");

  // Mic permission check (best-effort)
  try {
    const status = await navigator.permissions.query({ name: "microphone" });
    log("mic permission:", status.state);
  } catch (e) {
    log("mic permission API not available", e?.message);
  }

  // Backend /api/chat
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello" })
    });
    const data = await r.json();
    if (r.ok && data && (data.reply || data.message)) {
      ok("/api/chat returned reply");
      log("reply:", data.reply || data.message);
      try {
        const utter = new SpeechSynthesisUtterance(String(data.reply || data.message));
        speechSynthesis.speak(utter);
        ok("Spoke the reply via TTS");
      } catch {}
    } else {
      bad("/api/chat request failed");
      log("status:", r.status, data);
    }
  } catch (e) {
    bad("/api/chat fetch error");
    log(e);
  }
})();
