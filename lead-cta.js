(function(){
  // Set digits only with country code, e.g. 919876543210
  var WA_NUMBER = '919354811377';
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyn4ox_ddK6q5LKXVmDwU8SjiBUrWuYBvErWzHr1GD76VZmK_Ce4GkZrvZMWnqN8Lam/exec';
  function waHref(text){
    var t = encodeURIComponent(text || 'Hi, I want a free chess training call from Saran Chess Academy.');
    return WA_NUMBER ? ('https://wa.me/' + WA_NUMBER + '?text=' + t) : '/#join';
  }
  function injectStrip(source){
    if(document.getElementById('leadStrip')) return;
    var strip = document.createElement('div');
    strip.id = 'leadStrip';
    strip.className = 'lead-strip';
    strip.innerHTML = '<div class="lead-strip-inner">'
      + '<div><strong>Want a coach to review your games?</strong><span>Free 15-min training call — English + Hindi.</span></div>'
      + '<div class="lead-strip-actions">'
      + '<a class="btn btn-solid" href="/#join">Book free call</a>'
      + '<a class="btn btn-wa" id="stripWa" target="_blank" rel="noopener" href="' + waHref('Hi, I found you via ' + source) + '">WhatsApp</a>'
      + '</div></div>';
    var main = document.querySelector('main') || document.body;
    main.appendChild(strip);
  }
  function softGate(source, limit){
    limit = limit || 2;
    var key = 'sca_puzzles_' + source;
    var n = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, String(n + 1));
    if(n + 1 < limit) return;
    if(localStorage.getItem('sca_lead_done')) return;
    if(document.getElementById('leadGate')) return;
    var gate = document.createElement('div');
    gate.id = 'leadGate';
    gate.className = 'lead-gate';
    gate.innerHTML = '<div class="lead-gate-card">'
      + '<button type="button" class="lead-gate-x" id="gateClose" aria-label="Close">×</button>'
      + '<h3>Enjoying the tools?</h3>'
      + '<p>Leave your WhatsApp — we will share a free tip and call options. No spam.</p>'
      + '<form id="gateForm">'
      + '<input name="name" placeholder="Name" required>'
      + '<input name="phone" type="tel" placeholder="WhatsApp number" required>'
      + '<button class="btn btn-solid" type="submit">Get free tip</button>'
      + '</form>'
      + '<p class="lead-gate-skip" id="gateSkip">Continue without saving</p>'
      + '</div>';
    document.body.appendChild(gate);
    function close(){ gate.remove(); }
    document.getElementById('gateClose').onclick = close;
    document.getElementById('gateSkip').onclick = close;
    document.getElementById('gateForm').onsubmit = function(e){
      e.preventDefault();
      var fd = new FormData(e.target);
      var payload = {
        name: fd.get('name'),
        contact: fd.get('phone'),
        phone: fd.get('phone'),
        rating: 'Tool user',
        goal: 'Free tip / interested',
        source: source + '-soft-gate'
      };
      fetch(LEAD_ENDPOINT, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(payload)})
        .then(function(){ localStorage.setItem('sca_lead_done','1'); close(); })
        .catch(function(){ close(); });
    };
  }
  window.SCALead = { injectStrip: injectStrip, softGate: softGate, waHref: waHref };
})();
