const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
const { detectAgent, systemPromptFor } = require("./agent-system");
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const KEY = process.env.GEMINI_API_KEY || "";
const LEAD_ENDPOINT = process.env.LEAD_ENDPOINT || "https://script.google.com/macros/s/AKfycbxR1olMm7l-BYHfuhBTQVeyYn415I4OvPQLcmj97_3U77v-jSdu4Kwobxc5PCsoWDPIqQ/exec";
const TYPES = {".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".ico":"image/x-icon",".xml":"application/xml; charset=utf-8",".txt":"text/plain; charset=utf-8"};
const ACADEMY_CONTEXT = `You are the on-site mentor for Saran Chess Academy (coach Mohit Kumar Soni, 2520+ rapid/blitz).
Speak like a calm Grandmaster-style teacher: precise, practical, encouraging. English or Hindi — match the visitor.
Never claim you personally hold a FIDE Grandmaster title.
Academy facts:
- Online coaching, English + Hindi
- Programs: Beginner, Intermediate, Advanced, 1:1, Tournament prep, Game analysis
- Best next step: free training call via the website form (#join)
Goals: answer chess/academy questions clearly; soft conversion to free call or checkout; if they share name + phone/email, thank them (lead is auto-saved).
Keep replies under 120 words.`;
function send(res,code,body,type="application/json; charset=utf-8"){res.writeHead(code,{"Content-Type":type,"Cache-Control":"no-store"});res.end(body);}
function serveStatic(req,res){const host=(req.headers.host||"").split(":")[0].toLowerCase();if(host==="www.saranchessacademy.com"){res.writeHead(301,{"Location":`https://saranchessacademy.com${req.url}`});res.end();return;}let urlPath=decodeURIComponent(req.url.split("?")[0]);if(urlPath==="/")urlPath="/index.html";const file=path.normalize(path.join(ROOT,urlPath));if(!file.startsWith(ROOT))return send(res,403,"Forbidden","text/plain");fs.readFile(file,(err,data)=>{if(err){return fs.readFile(path.join(ROOT,"index.html"),(e2,html)=>{if(e2)return send(res,404,"Not found","text/plain");send(res,200,html,"text/html; charset=utf-8");});}const type=TYPES[path.extname(file).toLowerCase()]||"application/octet-stream";if(type.startsWith("text/html")){const canonicalPath=urlPath==="/index.html"?"/":urlPath;const canonical=`https://saranchessacademy.com${canonicalPath}`;const html=data.toString().replace(/<head>/i,`<head><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.ico?v=20261008">`).replace(/<\/body>\s*<\/html>\s*$/i,'<script src="/branding.js"></script></body></html>');return send(res,200,html,"text/html; charset=utf-8");}send(res,200,data,type);});}
function extractLead(messages){const text=(messages||[]).map(m=>m.text||"").join("\n");const email=(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)||[])[0];const phone=(text.match(/(?:\+?\d[\d\s-]{8,}\d)/)||[])[0];const nameMatch=text.match(/(?:my name is|i am|i'm|naam)\s+([A-Za-z][A-Za-z\s]{1,40})/i);const name=nameMatch?nameMatch[1].trim():"";const contact=phone||email;if(!contact)return null;const low=text.toLowerCase();let goal="General enquiry";if(low.includes("tournament"))goal="Tournament prep";else if(low.includes("1:1")||low.includes("one on one")||low.includes("private"))goal="1:1 coaching";else if(low.includes("beginner"))goal="Beginner foundation";return{name:name||"Chat visitor",contact,rating:"Not specified",goal,source:"chat-widget"};}
async function saveLead(lead){if(!lead)return false;try{await fetch(LEAD_ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(lead)});return true;}catch{return false;}}
function twimlEscape(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;");}
function twilioSignatureIsValid(req, raw){
  const authToken=process.env.TWILIO_AUTH_TOKEN||"";
  if(!authToken)return process.env.REQUIRE_TWILIO_SIGNATURE!=="true";
  const proto=(req.headers["x-forwarded-proto"]||"http").split(",")[0];
  const host=req.headers["x-forwarded-host"]||req.headers.host||"";
  const url=`${proto}://${host}${req.url}`;
  const params=new URLSearchParams(raw);
  const pairs=Array.from(params.keys()).sort().map(k=>`${k}${params.get(k)}`).join("");
  const expected=crypto.createHmac("sha1",authToken).update(url+pairs).digest("base64");
  const actual=String(req.headers["x-twilio-signature"]||"");
  return actual.length===expected.length&&crypto.timingSafeEqual(Buffer.from(actual),Buffer.from(expected));
}
function readBody(req, limit=20000){return new Promise((resolve,reject)=>{let raw="";req.on("data",chunk=>{raw+=chunk;if(raw.length>limit){req.destroy();reject(new Error("Request too large"));}});req.on("end",()=>resolve(raw));req.on("error",reject);});}
async function askModel(messages){
  if(!KEY)throw new Error("GEMINI_API_KEY missing");
  const contents=(messages||[]).filter(m=>m&&m.text).map(m=>({role:m.role==="model"?"model":"user",parts:[{text:String(m.text).slice(0,2000)}]}));
  if(!contents.length)throw new Error("Empty message");
  const models=[...new Set([MODEL,process.env.GEMINI_FALLBACK_MODEL||"gemini-3.5-flash-lite","gemini-3-flash-preview"])]
  let lastError;
  for(const model of models){
    try{
      const url=`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(KEY)}`;
      const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:{parts:[{text:systemPromptFor(messages,ACADEMY_CONTEXT)}]},contents,generationConfig:{temperature:0.7,maxOutputTokens:350}})});
      const data=await r.json();
      if(!r.ok){lastError=new Error(`${model}: ${(data.error&&data.error.message)||"Gemini error"}`);continue;}
      const parts=((((data.candidates||[])[0]||{}).content||{}).parts)||[];
      const reply=parts.map(x=>x.text||"").join("\n").trim();
      if(reply)return reply;
      lastError=new Error(`${model}: empty response`);
    }catch(e){lastError=e;}
  }
  throw lastError||new Error("Gemini error");
}
async function whatsappWebhook(req,res){
  let raw;
  try{raw=await readBody(req);}catch{return send(res,413,"Request too large","text/plain; charset=utf-8");}
  if(!twilioSignatureIsValid(req,raw))return send(res,403,"Invalid Twilio signature","text/plain; charset=utf-8");
  const form=new URLSearchParams(raw);
  const body=String(form.get("Body")||"").trim();
  const from=String(form.get("From")||"").replace(/^whatsapp:/i,"");
  const profile=String(form.get("ProfileName")||"").trim();
  if(!body)return send(res,200,"<Response></Response>","text/xml; charset=utf-8");
  const messages=[{role:"user",text:body}];
  const agentId=detectAgent(messages);
  const low=body.toLowerCase();
  const leadIntent=/demo|join|enrol|enroll|admission|fee|price|class|coach|program|course|trial|book/.test(low);
  let lead=extractLead(messages);
  if(leadIntent&&from&&!lead)lead={name:profile||"WhatsApp visitor",contact:from,rating:"Not specified",goal:"WhatsApp enquiry",source:"whatsapp"};
  if(lead){lead.agent=agentId;lead.channel="whatsapp";if(!lead.contact)lead.contact=from||lead.contact;await saveLead(lead);}
  let reply;
  try{reply=await askModel(messages);}catch(e){console.error("WhatsApp Gemini error:",e&&e.message?String(e.message).slice(0,300):"unknown");reply="Thanks for messaging Saran Chess Academy. Team aapko jaldi reply karegi.";}
  if(lead)reply+="\n\nAapki enquiry team ko mil gayi hai — hum aapse contact karenge.";
  return send(res,200,`<Response><Message>${twimlEscape(reply)}</Message></Response>`,"text/xml; charset=utf-8");
}
async function chat(req,res){let raw="";req.on("data",c=>{raw+=c;if(raw.length>20000)req.destroy();});req.on("end",async()=>{let payload;try{payload=JSON.parse(raw||"{}");}catch{return send(res,400,JSON.stringify({error:"Invalid JSON"}));}const messages=Array.isArray(payload.messages)?payload.messages.slice(-12):[];const agentId=detectAgent(messages);const lead=extractLead(messages);if(lead){lead.agent=agentId;lead.channel="website-chat";}let leadSaved=false;if(lead)leadSaved=await saveLead(lead);if(!KEY)return send(res,503,JSON.stringify({error:"GEMINI_API_KEY missing",leadSaved,agent:agentId}));if(!messages.some(m=>m&&m.text))return send(res,400,JSON.stringify({error:"Empty message"}));try{let reply=await askModel(messages);if(leadSaved)reply+="\n\nLead save ho gaya — team aapko contact karegi.";send(res,200,JSON.stringify({reply,leadSaved,agent:agentId}));}catch(e){console.error("Website Gemini error:",e&&e.message?String(e.message).slice(0,300):"unknown");send(res,502,JSON.stringify({error:"Gemini temporarily unavailable",leadSaved,agent:agentId}));}});}


const QUIZ_FILE = path.join(ROOT, "data", "quiz-scores.json");
function readQuiz() {
  try { return JSON.parse(fs.readFileSync(QUIZ_FILE, "utf8")); } catch { return {}; }
}
function writeQuiz(data) {
  try {
    fs.mkdirSync(path.dirname(QUIZ_FILE), { recursive: true });
    fs.writeFileSync(QUIZ_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch { return false; }
}
function quizApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/quiz/leaderboard") {
    const week = url.searchParams.get("week") || "";
    const all = readQuiz();
    let list = week ? (all[week] || []) : Object.values(all).flat();
    list = list.slice().sort((a, b) => (b.score - a.score) || ((a.timeMs || 9e15) - (b.timeMs || 9e15)));
    return send(res, 200, JSON.stringify({ week, leaders: list.slice(0, 50) }));
  }
  if (req.method === "POST" && url.pathname === "/api/quiz/score") {
    let raw = "";
    req.on("data", c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on("end", () => {
      let p;
      try { p = JSON.parse(raw || "{}"); } catch { return send(res, 400, JSON.stringify({ error: "bad json" })); }
      const week = String(p.week || "").slice(0, 16);
      const name = String(p.name || "Player").slice(0, 40);
      const phone = String(p.phone || "").replace(/\D/g, "").slice(-10);
      const score = Math.max(0, Math.min(30, parseInt(p.score, 10) || 0));
      const total = Math.max(1, Math.min(30, parseInt(p.total, 10) || 30));
      const timeMs = Math.max(0, parseInt(p.timeMs, 10) || 0);
      if (!week || phone.length < 8) return send(res, 400, JSON.stringify({ error: "missing fields" }));
      const all = readQuiz();
      if (!all[week]) all[week] = [];
      const prev = all[week].findIndex(x => x.phone === phone);
      const row = { name, phone, score, total, timeMs, at: Date.now() };
      if (prev >= 0) {
        if (score > all[week][prev].score || (score === all[week][prev].score && timeMs < (all[week][prev].timeMs || 9e15))) {
          all[week][prev] = row;
        }
      } else {
        all[week].push(row);
      }
      writeQuiz(all);
      const leaders = all[week].slice().sort((a, b) => (b.score - a.score) || ((a.timeMs || 9e15) - (b.timeMs || 9e15))).slice(0, 50);
      return send(res, 200, JSON.stringify({ ok: true, leaders }));
    });
    return;
  }
  return false;
}

const USERS_FILE = path.join(ROOT, "data", "users.json");
function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); } catch { return {}; }
}
function writeUsers(data) {
  try {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch { return false; }
}
function token() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function authApi(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    let raw = "";
    req.on("data", c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on("end", () => {
      let p;
      try { p = JSON.parse(raw || "{}"); } catch { return send(res, 400, JSON.stringify({ error: "bad json" })); }
      const name = String(p.name || "").trim().slice(0, 60);
      const phone = String(p.phone || "").replace(/\D/g, "").slice(-10);
      const password = String(p.password || "");
      if (name.length < 2) return send(res, 400, JSON.stringify({ error: "Name required" }));
      if (phone.length !== 10) return send(res, 400, JSON.stringify({ error: "Valid 10-digit phone" }));
      if (password.length < 4) return send(res, 400, JSON.stringify({ error: "Password min 4 chars" }));
      const all = readUsers();
      if (all[phone]) return send(res, 409, JSON.stringify({ error: "Already registered — please login" }));
      const tok = token();
      all[phone] = { name, password, token: tok, createdAt: Date.now(), source: "register" };
      writeUsers(all);
      return send(res, 200, JSON.stringify({ ok: true, name, phone, token: tok }));
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    let raw = "";
    req.on("data", c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on("end", () => {
      let p;
      try { p = JSON.parse(raw || "{}"); } catch { return send(res, 400, JSON.stringify({ error: "bad json" })); }
      const phone = String(p.phone || "").replace(/\D/g, "").slice(-10);
      const password = String(p.password || "");
      const all = readUsers();
      const u = all[phone];
      if (!u || u.password !== password) return send(res, 401, JSON.stringify({ error: "Invalid phone or password" }));
      const tok = token();
      u.token = tok;
      u.lastLogin = Date.now();
      writeUsers(all);
      return send(res, 200, JSON.stringify({ ok: true, name: u.name, phone, token: tok }));
    });
    return;
  }
  return false;
}

http.createServer((req,res)=>{const url=new URL(req.url,`http://${req.headers.host}`);if(req.method==="POST"&&url.pathname==="/api/chat")return chat(req,res);if(req.method==="POST"&&url.pathname==="/api/whatsapp/webhook")return whatsappWebhook(req,res);if(req.method==="GET"&&url.pathname==="/api/health")return send(res,200,JSON.stringify({ok:true,model:MODEL,key:Boolean(KEY),whatsappWebhook:"/api/whatsapp/webhook",agents:true}));if(url.pathname.startsWith("/api/auth/"))return authApi(req,res,url);if(url.pathname.startsWith("/api/quiz/"))return quizApi(req,res,url);if(req.method!=="GET"&&req.method!=="HEAD")return send(res,405,"Method not allowed","text/plain");serveStatic(req,res);}).listen(PORT,"0.0.0.0",()=>console.log("listening",PORT));
