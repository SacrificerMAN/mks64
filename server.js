const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const KEY = process.env.GEMINI_API_KEY || "";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".toml": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

const SYSTEM = `You are the on-site chess mentor for Saran Chess Academy (coach: Mohit Kumar Soni, 2520+ rapid/blitz on Chess.com & Lichess).
Speak like a calm Grandmaster teacher: precise, practical, encouraging. English or Hindi — match the visitor.
You are an AI assistant with Grandmaster-style coaching. Never claim you personally hold a FIDE Grandmaster title.
Academy facts you may use:
- Online coaching, English + Hindi
- Programs: Beginner, Intermediate, Advanced, 1:1, Tournament prep, Game analysis
- India: ₹2,999/month, ₹29,999/year (save ₹6,000)
- International: $50/month, $500/year
- Payment links: India https://rzp.io/rzp/wUiMq5BI | Intl monthly https://rzp.io/rzp/AgH7laAA | Intl yearly https://rzp.io/rzp/j4oz4Ry
- Best next step for unsure visitors: free training call via the website form (#join)
Goals:
1) Answer chess and academy questions clearly, short paragraphs.
2) Diagnose level if possible (beginner / club / tournament).
3) Soft conversion: recommend the right program and invite a free call or checkout. Do not be pushy or spammy.
4) If they share name + phone/email, thank them and tell them to also submit the page form so the coach gets it.
5) No medical, legal, or unrelated life advice. No invented tournament results.
Keep replies under 120 words unless they ask for a lesson snippet.`;

function send(res, code, body, type = "application/json; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) return send(res, 403, "Forbidden", "text/plain");
  fs.readFile(file, (err, data) => {
    if (err) {
      const fallback = path.join(ROOT, "index.html");
      return fs.readFile(fallback, (e2, html) => {
        if (e2) return send(res, 404, "Not found", "text/plain");
        send(res, 200, html, "text/html; charset=utf-8");
      });
    }
    send(res, 200, data, TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  });
}

async function chat(req, res) {
  let raw = "";
  req.on("data", (c) => {
    raw += c;
    if (raw.length > 20000) req.destroy();
  });
  req.on("end", async () => {
    if (!KEY) {
      return send(
        res,
        503,
        JSON.stringify({
          error:
            "GEMINI_API_KEY missing. Railway Variables mein key add karo: https://aistudio.google.com/apikey",
        })
      );
    }
    let payload;
    try {
      payload = JSON.parse(raw || "{}");
    } catch {
      return send(res, 400, JSON.stringify({ error: "Invalid JSON" }));
    }
    const messages = Array.isArray(payload.messages) ? payload.messages.slice(-12) : [];
    const contents = messages
      .filter((m) => m && m.text)
      .map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: String(m.text).slice(0, 2000) }],
      }));
    if (!contents.length) return send(res, 400, JSON.stringify({ error: "Empty message" }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(KEY)}`;
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 350 },
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        const msg = (data.error && data.error.message) || "Gemini error";
        return send(res, 502, JSON.stringify({ error: msg }));
      }
      const parts = ((((data.candidates || [])[0] || {}).content || {}).parts) || [];
      const reply = parts.map((x) => x.text || "").join("\n").trim() || "Apna rating aur goal likho — sahi program suggest karta hoon.";
      send(res, 200, JSON.stringify({ reply }));
    } catch (e) {
      send(res, 502, JSON.stringify({ error: "Network error talking to Gemini" }));
    }
  });
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/chat") return chat(req, res);
    if (req.method === "GET" && url.pathname === "/api/health") {
      return send(res, 200, JSON.stringify({ ok: true, model: MODEL, key: Boolean(KEY) }));
    }
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed", "text/plain");
    serveStatic(req, res);
  })
  .listen(PORT, "0.0.0.0", () => console.log("Saran Chess Academy listening on", PORT));
