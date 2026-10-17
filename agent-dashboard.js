(function(){
  var meta={
    orchestrator:["CO","Command"],
    admissions:["AD","Admissions"],
    academic:["AC","Academic"],
    support:["PS","Parent support"],
    operations:["OP","Operations"],
    finance:["FI","Finance"],
    marketing:["MK","Marketing"],
    analytics:["AN","Analytics"]
  };
  var $=function(id){return document.getElementById(id);};
  var esc=function(value){return String(value==null?"":value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch];});};
  var time=function(value){
    if(!value)return "No activity yet";
    var date=new Date(value), now=new Date(), diff=Math.max(0,Math.round((now-date)/1000));
    if(diff<10)return "Just now";
    if(diff<60)return diff+"s ago";
    if(diff<3600)return Math.floor(diff/60)+"m ago";
    return date.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
  };
  function render(data){
    var agents=data.agents||[];
    $("totalAgents").textContent=agents.length;
    $("activeAgents").textContent=data.activeAgents||0;
    $("totalHandled").textContent=data.totalHandled||0;
    $("activeLabel").textContent=data.activeAgents?"Agent responding now":"Waiting for activity";
    $("rosterNote").textContent=data.activeAgents?(data.activeAgents+" agent"+(data.activeAgents===1?"":"s")+" working now"):"All agents standby";
    $("syncStatus").textContent="System online";
    $("syncTime").textContent="Updated "+time(data.updatedAt);
    $("agentGrid").innerHTML=agents.map(function(agent){
      var m=meta[agent.id]||["AI","Department"];
      var working=agent.status==="Working";
      return '<article class="agent-card '+(working?"working":"")+'"><div class="agent-head"><span class="agent-avatar">'+m[0]+'</span><span class="agent-status '+(working?"working":"")+'">'+(working?"● Working":"○ Standby")+'</span></div><div class="agent-name">'+esc(agent.name)+'</div><div class="agent-purpose">'+esc(agent.purpose)+'</div><div class="agent-task">'+esc(agent.currentTask)+'</div><div class="agent-foot"><span>'+esc(m[1])+'</span><span><strong>'+esc(agent.handled)+'</strong> handled</span></div></article>';
    }).join("");
    var activity=data.activity||[];
    $("activityFeed").innerHTML=activity.length?activity.slice(0,8).map(function(item){
      return '<div class="activity-item"><span class="activity-marker"></span><div class="activity-copy"><strong>'+esc(item.agentName)+'</strong><small>'+esc(item.summary)+'</small></div><span class="activity-time">'+time(item.at)+'</span></div>';
    }).join(""):'<div class="empty-state"><span>⌁</span><p>No requests yet.<br>Send a website chat or WhatsApp message to see the team respond.</p></div>';
  }
  function load(){
    fetch("/api/agents/status",{cache:"no-store"}).then(function(res){return res.json();}).then(render).catch(function(){
      $("syncStatus").textContent="Connection paused";
      $("syncTime").textContent="Retrying automatically…";
    });
  }
  load();
  setInterval(load,3500);
})();
