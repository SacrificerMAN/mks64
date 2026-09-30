(function () {
  if (document.getElementById("chatFab")) return;
  const css = `.chat-fab{position:fixed;right:20px;bottom:20px;z-index:200;width:56px;height:56px;border-radius:50%;border:1px solid rgba(255,255,255,.08);background:#fff;color:#050505;font-size:22px;cursor:pointer;box-shadow:0 12px 32px -8px rgba(0,0,0,.5);display:grid;place-items:center}.chat-panel{position:fixed;right:20px;bottom:86px;z-index:200;width:min(380px,calc(100vw - 24px));height:min(540px,calc(100vh - 120px));background:#0d0d0d;border:1px solid rgba(255,255,255,.08);border-radius:18px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px -16px rgba(0,0,0,.7)}.chat-panel.open{display:flex}.chat-head{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px}.chat-head .dot{width:8px;height:8px;border-radius:50%;background:#10a37f;box-shadow:0 0 0 4px rgba(16,163,127,.14)}.chat-head strong{display:block;font-size:14px;color:#f5f5f5}.chat-head span{display:block;font-size:12px;color:#8a8a8a}.chat-msgs{flex:1;overflow:y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}.bubble{max-width:88%;padding:10px 12px;border-radius:14px;font-size:13px;line-height:1.5}.bubble.bot{background:#111;border:1px solid rgba(255,255,255,.08);align-self:flex-start;color:#f5f5f5}.bubble.me{background:#fff;color:#050505;align-self:flex-end}.chat-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08)}.chat-form input{flex:1;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:10px 14px;font-size:13px;outline:0;color:#f5f5f5}.chat-form button{border:0;border-radius:999px;background:#fff;color:#050505;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer}.chat-hint{font-size:11px;color:#666;padding:0 16px 10px}`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  const wrap = document.createElement("div");
  wrap.innerHTML = `<button class="chat-fab" id="chatFab" type="button" aria-label="Open coach chat">♟</button>
<div class="chat-panel" id="chatPanel">
  <div class="chat-head"><i class="dot"></i><div><strong>Academy Coach</strong><span>GM-style guidance · Saran Chess Academy</span></div></div>
  <div class="chat-msgs" id="chatMsgs"><div class="bubble bot">Namaste. Main academy ka chess mentor hoon — Grandmaster-style thinking se help karta hoon. Level, goal, ya class ke baare mein poochho. Trial call bhi book karwa sakta hoon.</div></div>
  <p class="chat-hint">AI assistant · coaching advice, not a FIDE title claim</p>
  <form class="chat-form" id="chatForm"><input id="chatInput" autocomplete="off" placeholder="Apna sawaal likho…"><button type="submit">Send</button></form>
</div>`;
  document.body.appendChild(wrap);
  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const msgs = document.getElementById("chatMsgs");
  const form = document.getElementById("chatForm");
  const inp = document.getElementById("chatInput");
  const history = [];
  fab.onclick = () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) inp.focus();
  };
  function addBubble(text, who) {
    const d = document.createElement("div");
    d.className = "bubble " + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = (inp.value || "").trim();
    if (!text) return;
    inp.value = "";
    addBubble(text, "me");
    history.push({ role: "user", text });
    const wait = document.createElement("div");
    wait.className = "bubble bot";
    wait.textContent = "Thinking…";
    msgs.appendChild(wait);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = await res.json();
      wait.remove();
      const reply = data.reply || data.error || "Try again in a moment.";
      addBubble(reply, "bot");
      history.push({ role: "model", text: reply });
    } catch (err) {
      wait.remove();
      addBubble("Chat server ready nahi hai. Railway pe GEMINI_API_KEY set karo, ya page form use karo.", "bot");
    }
  };
})();
