// Shared registration for free tools + quiz (leads stay separate on #join)
(function (global) {
  var SESSION_KEY = "sca_session_v1";
  var WA = "919354811377";

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
  }
  function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function clearSession() { localStorage.removeItem(SESSION_KEY); }
  function isLoggedIn() {
    var s = getSession();
    return !!(s && s.phone && s.name);
  }

  function injectStyles() {
    if (document.getElementById("scaAuthStyles")) return;
    var s = document.createElement("style");
    s.id = "scaAuthStyles";
    s.textContent = [
      "#scaAuthGate{position:fixed;inset:0;z-index:9999;background:rgba(5,5,5,.92);display:flex;align-items:center;justify-content:center;padding:24px;font-family:Inter,system-ui,sans-serif}",
      "#scaAuthGate .card{width:100%;max-width:400px;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px 24px;color:#f5f5f5}",
      "#scaAuthGate h2{font-size:20px;margin:0 0 8px}",
      "#scaAuthGate p.muted{color:#8a8a8a;font-size:14px;margin:0 0 16px;line-height:1.45}",
      "#scaAuthGate .tabs{display:flex;gap:8px;margin-bottom:16px}",
      "#scaAuthGate .tabs button{flex:1;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:transparent;color:#8a8a8a;cursor:pointer;font-weight:500}",
      "#scaAuthGate .tabs button.on{background:rgba(16,163,127,.15);color:#10a37f;border-color:rgba(16,163,127,.4)}",
      "#scaAuthGate label{display:block;font-size:11px;font-weight:600;color:#8a8a8a;margin:12px 0 6px;text-transform:uppercase;letter-spacing:.04em}",
      "#scaAuthGate input{width:100%;box-sizing:border-box;background:#050505;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;color:#f5f5f5;font-size:15px}",
      "#scaAuthGate .btn{display:inline-flex;width:100%;margin-top:16px;align-items:center;justify-content:center;border-radius:999px;padding:12px;font-size:14px;font-weight:500;border:0;cursor:pointer;background:#10a37f;color:#fff}",
      "#scaAuthGate .err{color:#e85d5d;font-size:13px;margin-top:10px;min-height:18px}",
      "#scaAuthGate .note{font-size:12px;color:#8a8a8a;margin-top:14px;text-align:center}",
      "#scaAuthGate .note a{color:#10a37f}",
      "#scaAuthChip{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#8a8a8a}",
      "#scaAuthChip button{border:1px solid rgba(255,255,255,.08);background:transparent;color:#f5f5f5;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer}"
    ].join("");
    document.head.appendChild(s);
  }

  function api(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; }); });
  }

  function showGate(onSuccess) {
    injectStyles();
    if (document.getElementById("scaAuthGate")) return;
    var gate = document.createElement("div");
    gate.id = "scaAuthGate";
    gate.innerHTML =
      '<div class="card">' +
      '<h2>Free tools — login required</h2>' +
      '<p class="muted">Register once (free). Same account for Daily Puzzle, Live TV, Chess Hub & Sunday Quiz.</p>' +
      '<div class="tabs"><button type="button" class="on" data-t="login">Login</button><button type="button" data-t="register">Register</button></div>' +
      '<div id="scaAuthLogin">' +
      '<label>Phone</label><input id="scaLoginPhone" type="tel" placeholder="10-digit mobile" autocomplete="tel">' +
      '<label>Password</label><input id="scaLoginPass" type="password" placeholder="Password" autocomplete="current-password">' +
      '<button class="btn" type="button" id="scaDoLogin">Login</button>' +
      '</div>' +
      '<div id="scaAuthReg" style="display:none">' +
      '<label>Full name</label><input id="scaRegName" placeholder="Your name" autocomplete="name">' +
      '<label>Phone (WhatsApp)</label><input id="scaRegPhone" type="tel" placeholder="10-digit mobile" autocomplete="tel">' +
      '<label>Password</label><input id="scaRegPass" type="password" placeholder="Min 4 characters" autocomplete="new-password">' +
      '<button class="btn" type="button" id="scaDoReg">Create free account</button>' +
      '</div>' +
      '<p class="err" id="scaAuthErr"></p>' +
      '<p class="note">Want coaching? <a href="/#join">Book a free Demo</a> (separate lead form)</p>' +
      '</div>';
    document.body.appendChild(gate);

    var tabs = gate.querySelectorAll(".tabs button");
    tabs.forEach(function (btn) {
      btn.onclick = function () {
        tabs.forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        var t = btn.getAttribute("data-t");
        document.getElementById("scaAuthLogin").style.display = t === "login" ? "block" : "none";
        document.getElementById("scaAuthReg").style.display = t === "register" ? "block" : "none";
        document.getElementById("scaAuthErr").textContent = "";
      };
    });

    function err(msg) { document.getElementById("scaAuthErr").textContent = msg || ""; }

    document.getElementById("scaDoLogin").onclick = function () {
      var phone = (document.getElementById("scaLoginPhone").value || "").replace(/\D/g, "").slice(-10);
      var pass = document.getElementById("scaLoginPass").value || "";
      err("");
      if (phone.length !== 10) return err("Valid 10-digit phone required");
      if (pass.length < 4) return err("Password min 4 characters");
      api("/api/auth/login", { phone: phone, password: pass }).then(function (res) {
        if (!res.ok) return err((res.data && res.data.error) || "Login failed");
        setSession({ phone: res.data.phone, name: res.data.name, token: res.data.token });
        gate.remove();
        if (onSuccess) onSuccess(getSession());
        location.reload();
      }).catch(function () { err("Network error — try again"); });
    };

    document.getElementById("scaDoReg").onclick = function () {
      var name = (document.getElementById("scaRegName").value || "").trim();
      var phone = (document.getElementById("scaRegPhone").value || "").replace(/\D/g, "").slice(-10);
      var pass = document.getElementById("scaRegPass").value || "";
      err("");
      if (name.length < 2) return err("Name required");
      if (phone.length !== 10) return err("Valid 10-digit phone required");
      if (pass.length < 4) return err("Password min 4 characters");
      api("/api/auth/register", { name: name, phone: phone, password: pass }).then(function (res) {
        if (!res.ok) return err((res.data && res.data.error) || "Register failed");
        setSession({ phone: res.data.phone, name: res.data.name, token: res.data.token });
        gate.remove();
        if (onSuccess) onSuccess(getSession());
        location.reload();
      }).catch(function () { err("Network error — try again"); });
    };
  }

  function requireAuth() {
    if (isLoggedIn()) return getSession();
    document.documentElement.style.overflow = "hidden";
    showGate(function () { document.documentElement.style.overflow = ""; });
    return null;
  }

  function mountChip(container) {
    injectStyles();
    if (!container) return;
    var s = getSession();
    if (!s) {
      container.innerHTML = '<a href="#" id="scaOpenLogin" style="color:#10a37f;font-size:13px">Login / Register</a>';
      var a = document.getElementById("scaOpenLogin");
      if (a) a.onclick = function (e) { e.preventDefault(); showGate(); };
      return;
    }
    container.innerHTML = '<span id="scaAuthChip"><span>' + escapeHtml(s.name) + '</span><button type="button" id="scaLogout">Logout</button></span>';
    var b = document.getElementById("scaLogout");
    if (b) b.onclick = function () { clearSession(); location.reload(); };
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&", "<": "<", ">": ">", '"': """ }[c];
    });
  }

  global.SCAAuth = {
    getSession: getSession,
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    showGate: showGate,
    clearSession: clearSession,
    mountChip: mountChip,
    WA: WA
  };

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    if (body && body.getAttribute("data-require-auth") === "1") {
      requireAuth();
    }
    var chip = document.getElementById("authChip");
    if (chip) mountChip(chip);
  });
})(typeof window !== "undefined" ? window : global);
