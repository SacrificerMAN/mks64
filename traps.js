(function(){
const S=56,COLS=['#485848','#304030'],Y='#ffdc32',BG='#0a0c0a';
const U={K:'\u2654',Q:'\u2655',R:'\u2656',B:'\u2657',N:'\u2658',P:'\u2659',k:'\u265A',q:'\u265B',r:'\u265C',b:'\u265D',n:'\u265E',p:'\u265F'};
// Corrected famous traps (UCI). Castling + underpromotion supported.
const TRAPS=[
{id:'fools-mate',name:"Fool's Mate",moves:['f2f3','e7e5','g2g4','d8h4'],note:'Fastest mate — weak kingside pawns',side:'Black wins'},
{id:'scholars-mate',name:"Scholar's Mate",moves:['e2e4','e7e5','d1h5','b8c6','f1c4','g8f6','h5f7'],note:'Qh5 + Bc4 pressure on f7',side:'White wins'},
{id:'legals-mate',name:"Legal's Mate",moves:['e2e4','e7e5','g1f3','d7d6','f1c4','c8g4','b1c3','g7g6','f3e5','g4d1','c4f7','e8e7','c3d5'],note:'Sacrifice queen, mate with minor pieces',side:'White wins'},
{id:'fried-liver',name:'Fried Liver',moves:['e2e4','e7e5','g1f3','b8c6','f1c4','g8f6','f3g5','d7d5','e4d5','f6d5','g5f7'],note:'Ng5 and Nxf7 against the Two Knights',side:'White attack'},
{id:'blackburne',name:'Blackburne Shilling',moves:['e2e4','e7e5','g1f3','b8c6','f1c4','c6d4','f3e5','d8g5','e5f7','g5g2','h1f1','g2e4','c4e2','d4f3'],note:'Nd4 bait — if White takes e5, disaster',side:'Black wins'},
{id:'noahs-ark',name:"Noah's Ark",moves:['e2e4','e7e5','g1f3','b8c6','f1b5','a7a6','b5a4','d7d6','d2d4','b7b5','a4b3','c6d4','f3d4','e5d4','d1d4','c7c5','d4d5','c8e6','d5c6','e6d7','c6d5','c5c4'],note:'Ruy Lopez — pawns trap White bishop on b3',side:'Black wins'},
{id:'elephant-trap',name:'Elephant Trap',moves:['d2d4','d7d5','c2c4','e7e6','b1c3','g8f6','c1g5','b8d7','c4d5','e6d5','c3d5','f6d5','g5d8','f8b4','d1d2','b4d2','e1d2','e8d8'],note:"QGD — don't take on d5; Bb4+ wins material back",side:'Black equalizes+'},
{id:'fishing-pole',name:'Fishing Pole',moves:['e2e4','e7e5','g1f3','b8c6','f1b5','g8f6','e1g1','f6g4','h2h3','h7h5'],note:'If White takes Ng4, open h-file attack',side:'Black trap'},
{id:'lasker-trap',name:'Lasker Trap',moves:['d2d4','d7d5','c2c4','e7e5','d4e5','d5d4','e2e3','f8b4','c1d2','d4e3','d2b4','e3f2','e1e2','f2g1n'],note:'Albin Countergambit — underpromote to knight+',side:'Black wins'},
{id:'kieninger',name:'Kieninger Trap',moves:['d2d4','g8f6','c2c4','e7e5','d4e5','f6g4','c1f4','b8c6','g1f3','f8b4','b1d2','d8e7','a2a3','g4e5','a3b4','e5d3'],note:'Budapest Gambit — Nd3# if White takes the bishop',side:'Black wins'}
];
function sq(a){return (a.charCodeAt(0)-97)+8*(parseInt(a[1],10)-1)}
function startBoard(){
  const b=Array(64).fill(null);
  const back=['r','n','b','q','k','b','n','r'];
  for(let i=0;i<8;i++){b[i]=back[i];b[56+i]=back[i].toUpperCase();b[8+i]='p';b[48+i]='P'}
  return b;
}
function applyMove(b,uci){
  const f=sq(uci.slice(0,2)),t=sq(uci.slice(2,4));
  const nb=b.slice();
  const piece=nb[f];
  nb[t]=piece; nb[f]=null;
  if(piece==='K'||piece==='k'){
    if(f===sq('e1')&&t===sq('g1')){nb[sq('f1')]=nb[sq('h1')];nb[sq('h1')]=null}
    if(f===sq('e1')&&t===sq('c1')){nb[sq('d1')]=nb[sq('a1')];nb[sq('a1')]=null}
    if(f===sq('e8')&&t===sq('g8')){nb[sq('f8')]=nb[sq('h8')];nb[sq('h8')]=null}
    if(f===sq('e8')&&t===sq('c8')){nb[sq('d8')]=nb[sq('a8')];nb[sq('a8')]=null}
  }
  if(uci.length>4){
    const promo=uci[4];
    nb[t]=(piece&&piece===piece.toUpperCase())?promo.toUpperCase():promo.toLowerCase();
  }
  return nb;
}
function draw(canvas,board,from,to,label,title){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,padT=44,boardSize=8*S;
  const ox=(W-boardSize)/2;
  ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=Y; ctx.font='bold 18px Inter,system-ui,sans-serif';
  ctx.textAlign='center'; ctx.fillText(title||'Famous Trap',W/2,26);
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const x=ox+f*S,y=padT+(7-r)*S;
    ctx.fillStyle=COLS[(r+f)%2]; ctx.fillRect(x,y,S,S);
  }
  if(from!=null){
    const fx=ox+(from%8)*S,fy=padT+(7-Math.floor(from/8))*S;
    const tx=ox+(to%8)*S,ty=padT+(7-Math.floor(to/8))*S;
    ctx.strokeStyle=Y; ctx.lineWidth=3;
    ctx.strokeRect(fx+3,fy+3,S-6,S-6); ctx.strokeRect(tx+3,ty+3,S-6,S-6);
  }
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font='40px serif';
  for(let i=0;i<64;i++){
    if(!board[i]) continue;
    const f=i%8,r=Math.floor(i/8);
    const x=ox+f*S+S/2,y=padT+(7-r)*S+S/2;
    const isW=board[i]===board[i].toUpperCase();
    ctx.fillStyle=isW?'#f5f5f5':'#1a1a1a';
    ctx.fillText(U[board[i]]||'?',x,y+2);
  }
  if(label){
    ctx.fillStyle=Y; ctx.font='bold 16px Inter,system-ui,sans-serif';
    ctx.fillText(label,W/2,H-14);
  }
}
const timers=new WeakMap();
function stopPlay(canvas){
  const t=timers.get(canvas);
  if(t){clearTimeout(t);timers.delete(canvas)}
}
function playTrap(canvas,trap,statusEl,btn){
  stopPlay(canvas);
  let board=startBoard(), i=-1, from=null,to=null;
  const labels=trap.moves.map(m=>m.slice(0,2)+'\u2013'+m.slice(2,4));
  function schedule(fn,ms){const id=setTimeout(fn,ms);timers.set(canvas,id)}
  function step(){
    if(i>=trap.moves.length){
      draw(canvas,board,null,null,'Done \u2014 tap Replay',trap.name);
      if(btn) btn.textContent='\u25B6 Replay';
      if(statusEl) statusEl.textContent=trap.note+' \u00b7 '+trap.side;
      return;
    }
    if(i>=0){
      const uci=trap.moves[i];
      from=sq(uci.slice(0,2)); to=sq(uci.slice(2,4));
      draw(canvas,board,from,to,labels[i],trap.name);
      schedule(function(){
        board=applyMove(board,uci);
        draw(canvas,board,null,to,labels[i],trap.name);
        i++;
        schedule(step,750);
      },550);
    } else {
      draw(canvas,board,null,null,'Start',trap.name);
      i=0;
      schedule(step,500);
    }
  }
  if(statusEl) statusEl.textContent=trap.note+' \u00b7 '+trap.side;
  if(btn) btn.textContent='Playing\u2026';
  step();
}
function mountList(rootId){
  const root=document.getElementById(rootId||'trap-player');
  if(!root) return;
  root.innerHTML='';
  const grid=document.createElement('div');
  grid.className='trap-grid';
  TRAPS.forEach(function(trap){
    const card=document.createElement('div');
    card.className='trap-card';
    card.id='trap-'+trap.id;
    const c=document.createElement('canvas');
    c.width=488; c.height=520; c.style.width='100%'; c.style.borderRadius='10px'; c.style.background='#000'; c.style.display='block';
    const cap=document.createElement('div');
    cap.className='trap-cap';
    cap.innerHTML='<strong>'+trap.name+'</strong><span class="note">'+trap.note+'</span><span class="side">'+trap.side+'</span>';
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='trap-play';
    btn.textContent='\u25B6 Play';
    btn.onclick=function(){playTrap(c,trap,cap.querySelector('.note'),btn)};
    card.appendChild(c); card.appendChild(cap); card.appendChild(btn);
    grid.appendChild(card);
    draw(c,startBoard(),null,null,'Tap Play',trap.name);
  });
  root.appendChild(grid);
}
function mountHomeTeaser(rootId){
  const root=document.getElementById(rootId||'trap-player');
  if(!root) return;
  const picks=TRAPS.slice(0,3);
  root.innerHTML='';
  const grid=document.createElement('div');
  grid.className='trap-grid trap-grid-home';
  picks.forEach(function(trap){
    const card=document.createElement('div');
    card.className='trap-card';
    const c=document.createElement('canvas');
    c.width=488; c.height=520; c.style.width='100%'; c.style.borderRadius='10px'; c.style.background='#000'; c.style.display='block';
    const cap=document.createElement('div');
    cap.className='trap-cap';
    cap.innerHTML='<strong>'+trap.name+'</strong><span class="note">'+trap.note+'</span>';
    const btn=document.createElement('button');
    btn.type='button'; btn.className='trap-play'; btn.textContent='\u25B6 Play';
    btn.onclick=function(){playTrap(c,trap,cap.querySelector('.note'),btn)};
    card.appendChild(c); card.appendChild(cap); card.appendChild(btn);
    grid.appendChild(card);
    draw(c,startBoard(),null,null,'Tap Play',trap.name);
  });
  root.appendChild(grid);
}
window.SCATraps={TRAPS:TRAPS,mountList:mountList,mountHomeTeaser:mountHomeTeaser};
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){
    if(document.body.dataset.trapsPage==='1') mountList('trap-player');
    else if(document.getElementById('trap-player')) mountHomeTeaser('trap-player');
  });
} else {
  if(document.body.dataset.trapsPage==='1') mountList('trap-player');
  else if(document.getElementById('trap-player')) mountHomeTeaser('trap-player');
}
})();
