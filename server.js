const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const KEY = process.env.GEMINI_API_KEY || "";
const LEAD_ENDPOINT = process.env.LEAD_ENDPOINT || "https://script.google.com/macros/s/AKfycbyn4ox_ddK6q5LKXVmDwU8SjiBUrWuYBvErWzHr1GD76VZmK_Ce4GkZrvZMWnqN8Lam/exec";
const TYPES = {".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".xml":"application/xml; charset=utf-8",".txt":"text/plain; charset=utf-8"};
const SYSTEM = `You are the on-site mentor for Saran Chess Academy (coach Mohit Kumar Soni, 2520+ rapid/blitz).
Speak like a calm Grandmaster-style teacher: precise, practical, encouraging. English or Hindi — match the visitor.
Never claim you personally hold a FIDE Grandmaster title.
Academy facts:
- Online coaching, English + Hindi
- Programs: Beginner, Intermediate, Advanced, 1:1, Tournament prep, Game analysis
- Best next step: free training call via the website form (#join)
Goals: answer chess/academy questions clearly; soft conversion to free call or checkout; if they share name + phone/email, thank them (lead is auto-saved).
Keep replies under 120 words.`;
function send(res,code,body,type="application/json; charset=utf-8"){res.writeHead(code,{"Content-Type":type,"Cache-Control":"no-store"});res.end(body);}
function serveStatic(req,res){const host=(req.headers.host||"").split(":")[0].toLowerCase();if(host==="www.saranchessacademy.com"){res.writeHead(301,{"Location":`https://saranchessacademy.com${req.url}`});res.end();return;}let urlPath=decodeURIComponent(req.url.split("?")[0]);if(urlPath==="/")urlPath="/index.html";const file=path.normalize(path.join(ROOT,urlPath));if(!file.startsWith(ROOT))return send(res,403,"Forbidden","text/plain");fs.readFile(file,(err,data)=>{if(err){return fs.readFile(path.join(ROOT,"index.html"),(e2,html)=>{if(e2)return send(res,404,"Not found","text/plain");send(res,200,html,"text/html; charset=utf-8");});}const type=TYPES[path.extname(file).toLowerCase()]||"application/octet-stream";if(type.startsWith("text/html")){const canonicalPath=urlPath==="/index.html"?"/":urlPath;const canonical=`https://saranchessacademy.com${canonicalPath}`;const html=data.toString().replace(/<head>/i,`<head><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.ico?v=20261008">`).replace(/<\/body>/i,'<script src="/branding.js"></script></body>');return send(res,200,html,"text/html; charset=utf-8");}send(res,200,data,type);});}
function extractLead(messages){const text=(messages||[]).map(m=>m.text||"").join("\n");const email=(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)||[])[0];const phone=(text.match(/(?:\+?\d[\d\s-]{8,}\d)/)||[])[0];const nameMatch=text.match(/(?:my name is|i am|i'm|naam)\s+([A-Za-z][A-Za-z\s]{1,40})/i);const name=nameMatch?nameMatch[1].trim():"";const contact=phone||email;if(!contact)return null;const low=text.toLowerCase();let goal="General enquiry";if(low.includes("tournament"))goal="Tournament prep";else if(low.includes("1:1")||low.includes("one on one")||low.includes("private"))goal="1:1 coaching";else if(low.includes("beginner"))goal="Beginner foundation";return{name:name||"Chat visitor",contact,rating:"Not specified",goal,source:"chat-widget"};}
async function saveLead(lead){if(!lead)return false;try{await fetch(LEAD_ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(lead)});return true;}catch{return false;}}
async function chat(req,res){let raw="";req.on("data",c=>{raw+=c;if(raw.length>20000)req.destroy();});req.on("end",async()=>{let payload;try{payload=JSON.parse(raw||"{}");}catch{return send(res,400,JSON.stringify({error:"Invalid JSON"}));}const messages=Array.isArray(payload.messages)?payload.messages.slice(-12):[];const lead=extractLead(messages);let leadSaved=false;if(lead)leadSaved=await saveLead(lead);if(!KEY)return send(res,503,JSON.stringify({error:"GEMINI_API_KEY missing",leadSaved}));const contents=messages.filter(m=>m&&m.text).map(m=>({role:m.role==="model"?"model":"user",parts:[{text:String(m.text).slice(0,2000)}]}));if(!contents.length)return send(res,400,JSON.stringify({error:"Empty message"}));const url=`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(KEY)}`;try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:{parts:[{text:SYSTEM}]},contents,generationConfig:{temperature:0.7,maxOutputTokens:350}})});const data=await r.json();if(!r.ok)return send(res,502,JSON.stringify({error:(data.error&&data.error.message)||"Gemini error",leadSaved}));const parts=((((data.candidates||[])[0]||{}).content||{}).parts)||[];let reply=parts.map(x=>x.text||"").join("\n").trim()||"Apna rating aur goal likho.";if(leadSaved)reply+="\n\nLead save ho gaya — team aapko contact karegi.";send(res,200,JSON.stringify({reply,leadSaved}));}catch(e){send(res,502,JSON.stringify({error:"Network error",leadSaved}));}});}


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
