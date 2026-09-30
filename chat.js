(function () {
  if (document.getElementById("chatFab")) return;

  const css = `
.chat-fab{position:fixed;right:20px;bottom:20px;z-index:200;height:52px;padding:0 20px 0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:#fff;color:#050505;font-size:14px;font-weight:600;letter-spacing:-.01em;cursor:pointer;box-shadow:0 12px 32px -8px rgba(0,0,0,.55);display:inline-flex;align-items:center;gap:10px;font-family:Inter,system-ui,sans-serif;transition:transform .15s ease,box-shadow .15s ease}
.chat-fab:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(0,0,0,.65)}
.chat-fab .fab-ico{width:28px;height:28px;border-radius:50%;background:#10a37f;color:#fff;display:grid;place-items:center;font-size:14px;flex-shrink:0}
.chat-fab.open{background:#111;color:#f5f5f5;border-color:rgba(255,255,255,.12)}
.chat-fab.open .fab-ico{background:#fff;color:#050505}
.chat-panel{position:fixed;right:20px;bottom:90px;z-index:200;width:min(380px,calc(100vw - 24px));height:min(540px,calc(100vh - 120px));background:#0d0d0d;border:1px solid rgba(255,255,255,.08);border-radius:18px;display:none;flex-direction:column;overflow:hidden}
.chat-panel.open{display:flex}
.chat-head{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:10px}
.chat-head-left{display:flex;align-items:center;gap:10px}
.chat-head .dot{width:8px;height:8px;border-radius:50%;background:#10a37f}
.chat-head strong{display:block;font-size:14px;color:#f5f5f5}
.chat-head span{display:block;font-size:12px;color:#8a8a8a}
.chat-head-actions{display:flex;gap:6px;align-items:center}
.icon-btn{border:1px solid rgba(255,255,255,.12);background:#111;color:#f5f5f5;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:14px;display:grid;place-items:center;padding:0}
.icon-btn.on{background:#10a37f;border-color:#10a37f;color:#fff}
.icon-btn:disabled{opacity:.4;cursor:not-allowed}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:88%;padding:10px 12px;border-radius:14px;font-size:13px;line-height:1.5}
.bubble.bot{background:#111;border:1px solid rgba(255,255,255,.08);align-self:flex-start;color:#f5f5f5}
.bubble.me{background:#fff;color:#050505;align-self:flex-end}
.chat-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08);align-items:center}
.chat-form input{flex:1;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:10px 14px;font-size:13px;outline:0;color:#f5f5f5}
.chat-form .send{border:0;border-radius:999px;background:#fff;color:#050505;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer}
.mic-btn{border:1px solid rgba(255,255,255,.12);background:#111;color:#f5f5f5;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:16px;display:grid;place-items:center;flex-shrink:0}
.mic-btn.listening{background:#c0392b;border-color:#c0392b;color:#fff;animation:pulse 1s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,.45)}50%{box-shadow:0 0 0 8px rgba(192,57,43,0)}}
.chat-hint{font-size:11px;color:#666;padding:0 16px 10px}
`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasSR = Boolean(SpeechRecognition);
  const hasTTS = "speechSynthesis" in window;

  const wrap = document.createElement("div");
  wrap.innerHTML = `
<button class="chat-fab" id="chatFab" type="button" aria-label="Let's talk with the academy coach"><span class="fab-ico">♟</span><span class="fab-label">Let's talk</span></button>
<div class="chat-panel" id="chatPanel">
  <div class="chat-head">
    <div class="chat-head-left">
      <i class="dot"></i>
      <div><strong>Academy Coach</strong><span>Saran Chess Academy · voice ready</span></div>
    </div>
    <div class="chat-head-actions">
      <button type="button" class="icon-btn on" id="ttsToggle" title="Voice replies on/off" aria-label="Toggle voice replies">🔊</button>
    </div>
  </div>
  <div class="chat-msgs" id="chatMsgs">
    <div class="bubble bot">Namaste. Bol ke ya type karke poochho — level, goal, class. Mic dabao to sununga. Naam + phone/email likho to lead save ho jayega.</div>
  </div>
  <p class="chat-hint" id="chatHint">Mic = bolke poochho · 🔊 = jawab suno · text bhi chalega</p>
  <form class="chat-form" id="chatForm">
    <button type="button" class="mic-btn" id="micBtn" title="Click to speak" aria-label="Voice input">🎤</button>
    <input id="chatInput" autocomplete="off" placeholder="Bolke ya type karke poochho…">
    <button class="send" type="submit">Send</button>
  </form>
</div>`;
  document.body.appendChild(wrap);

  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const msgs = document.getElementById("chatMsgs");
  const form = document.getElementById("chatForm");
  const inp = document.getElementById("chatInput");
  const micBtn = document.getElementById("micBtn");
  const ttsToggle = document.getElementById("ttsToggle");
  const chatHint = document.getElementById("chatHint");
  const history = [];
  let ttsOn = true;
  let listening = false;
  let recognition = null;

  if (!hasSR) {
    micBtn.disabled = true;
    micBtn.title = "Is browser me voice input support nahi";
    chatHint.textContent = "Is browser me mic support nahi — type karo. Chrome/Edge best.";
  }
  if (!hasTTS) {
    ttsToggle.disabled = true;
    ttsToggle.classList.remove("on");
    ttsOn = false;
  }

  const fabLabel = fab.querySelector(".fab-label");
  function setFabOpen(isOpen) {
    fab.classList.toggle("open", isOpen);
    if (fabLabel) fabLabel.textContent = isOpen ? "Close" : "Let's talk";
  }
  fab.onclick = () => {
    const willOpen = !panel.classList.contains("open");
    panel.classList.toggle("open", willOpen);
    setFabOpen(willOpen);
    if (willOpen) inp.focus();
    else stopListen();
  };

  ttsToggle.onclick = () => {
    if (!hasTTS) return;
    ttsOn = !ttsOn;
    ttsToggle.classList.toggle("on", ttsOn);
    ttsToggle.textContent = ttsOn ? "🔊" : "🔇";
    if (!ttsOn && window.speechSynthesis) window.speechSynthesis.cancel();
  };

  function addBubble(text, who) {
    const d = document.createElement("div");
    d.className = "bubble " + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function pickLang(text) {
    return /[\u0900-\u097F]/.test(text || "") ? "hi-IN" : "en-IN";
  }

  function speak(text) {
    if (!ttsOn || !hasTTS || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = pickLang(text);
      u.rate = 1;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices() || [];
      const want = u.lang.startsWith("hi")
        ? voices.find((v) => /hi(-|_)|Hindi/i.test(v.lang + v.name))
        : voices.find((v) => /en-IN|English.*India/i.test(v.lang + v.name)) ||
          voices.find((v) => /^en/i.test(v.lang));
      if (want) u.voice = want;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  if (hasTTS && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  function stopListen() {
    listening = false;
    micBtn.classList.remove("listening");
    if (recognition) {
      try { recognition.stop(); } catch (_) {}
    }
  }

  function startListen() {
    if (!hasSR || listening) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      micBtn.classList.add("listening");
      chatHint.textContent = "Sun raha hoon… bolo";
    };
    recognition.onerror = (e) => {
      stopListen();
      const err = (e && e.error) || "";
      if (err === "not-allowed") chatHint.textContent = "Mic permission chahiye — browser allow karo.";
      else if (err !== "aborted") chatHint.textContent = "Mic error — phir try karo ya type karo.";
    };
    recognition.onend = () => {
      listening = false;
      micBtn.classList.remove("listening");
      if (chatHint.textContent.indexOf("Sun raha") === 0) {
        chatHint.textContent = "Mic = bolke poochho · 🔊 = jawab suno";
      }
    };
    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      if (interim) inp.value = interim;
      if (finalText) {
        inp.value = finalText.trim();
        stopListen();
        setTimeout(() => form.requestSubmit(), 200);
      }
    };

    try { recognition.start(); } catch (_) { stopListen(); }
  }

  micBtn.onclick = () => {
    if (!hasSR) return;
    if (listening) stopListen();
    else startListen();
  };

  async function sendMessage(text) {
    text = (text || "").trim();
    if (!text) return;
    inp.value = "";
    addBubble(text, "me");
    history.push({ role: "user", text });
    const wait = document.createElement("div");
    wait.className = "bubble bot";
    wait.textContent = "Thinking…";
    msgs.appendChild(wait);
    msgs.scrollTop = msgs.scrollHeight;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = await res.json();
      wait.remove();
      const reply = data.reply || data.error || "Try again.";
      addBubble(reply, "bot");
      history.push({ role: "model", text: reply });
      speak(reply);
    } catch (err) {
      wait.remove();
      const msg = "Chat server ready nahi hai. Form use karo ya GEMINI_API_KEY set karo.";
      addBubble(msg, "bot");
      speak(msg);
    }
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    stopListen();
    sendMessage(inp.value);
  };
})();
