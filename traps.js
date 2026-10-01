(function(){
const S=56,COLS=['#485848','#304030'],Y='#ffdc32',BG='#0a0c0a';
const U={K:'\u2654',Q:'\u2655',R:'\u2656',B:'\u2657',N:'\u2658',P:'\u2659',k:'\u265A',q:'\u265B',r:'\u265C',b:'\u265D',n:'\u265E',p:'\u265F'};
const TRAPS=[
{id:'scholars-mate',name:"Scholar's Mate",moves:['e2e4','e7e5','d1h5','b8c6','f1c4','g8f6','h5f7'],note:'Queen + Bishop on f7'},
{id:'legals-mate',name:"Legal's Mate",moves:['e2e4','e7e5','g1f3','d7d6','f1c4','c8g4','b1c3','g7g6','f3e5','g4d1','c4f7','e8e7','c3d5'],note:'Queen bait → mate'},
{id:'fried-liver',name:'Fried Liver',moves:['e2e4','e7e5','g1f3','b8c6','f1c4','g8f6','f3g5','d7d5','e4d5','f6d5','g5f7'],note:'Nxf7 sacrifice'},
{id:'blackburne',name:'Blackburne Shilling',moves:['e2e4','e7e5','g1f3','b8c6','f1c4','c6d4','f3e5','d8g5','e5f7','g5g2','h1f1','g2e4','c4e2','d4f3'],note:'Nd4 trap'},
{id:'noahs-ark',name:"Noah's Ark",moves:['e2e4','e7e5','g1f3','b8c6','f1b5','a7a6','b5a4','b7b5','a4b3','c6a5'],note:'Trap the bishop'},
{id:'elephant-trap',name:'Elephant Trap',moves:['d2d4','d7d5','c2c4','e7e6','b1c3','g8f6','c1g5','b8d7','c4d5','e6d5','c3d5','f6d5','g5d8','f8b4'],note:'Bb4+ regains queen'},
{id:'fishing-pole',name:'Fishing Pole',moves:['e2e4','e7e5','g1f3','b8c6','f1b5','g8f6','e1g1','f6g4','h2h3','h7h5'],note:'Open the h-file'}
];
function sq(a){return (a.charCodeAt(0)-97)+8*(parseInt(a[1])-1)}
function startBoard(){
  const b=Array(64).fill(null);
  const back=['r','n','b','q','k','b','n','r'];
  for(let i=0;i<8;i++){b[i]=back[i];b[56+i]=back[i].toUpperCase();b[8+i]='p';b[48+i]='P'}
  return b;
}
function applyMove(b,uci){
  const f=sq(uci.slice(0,2)),t=sq(uci.slice(2,4));
  const nb=b.slice(); nb[t]=nb[f]; nb[f]=null;
  if(uci.length>4) nb[t]=uci[4];
  return nb;
}
function draw(canvas,board,from,to,label){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,padT=50,boardSize=8*S;
  const ox=(W-boardSize)/2;
  ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=Y; ctx.font='bold 22px Inter,system-ui,sans-serif';
  ctx.textAlign='center'; ctx.fillText('Famous Traps',W/2,28);
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const x=ox+f*S,y=padT+(7-r)*S;
    ctx.fillStyle=COLS[(r+f)%2]; ctx.fillRect(x,y,S,S);
  }
  if(from!=null){
    const fx=ox+(from%8)*S,fy=padT+(7-Math.floor(from/8))*S;
    const tx=ox+(to%8)*S,ty=padT+(7-Math.floor(to/8))*S;
    ctx.strokeStyle=Y; ctx.lineWidth=3;
    ctx.strokeRect(fx+3,fy+3,S-6,S-6); ctx.strokeRect(tx+3,ty+3,S-6,S-6);
    ctx.beginPath();
    ctx.moveTo(fx+S/2,fy+S/2); ctx.lineTo(tx+S/2,ty+S/2);
    ctx.stroke();
    ctx.fillStyle=Y; ctx.beginPath(); ctx.arc(tx+S/2,ty+S/2,7,0,6.28); ctx.fill();
  }
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font='40px serif';
  for(let i=0;i<64;i++){
    if(!board[i]) continue;
    const f=i%8,r=Math.floor(i/8);
    const x=ox+f*S+S/2,y=padT+(7-r)*S+S/2;
    const isW=board[i]===board[i].toUpperCase();
    ctx.fillStyle=isW?'#f5f5f5':'#222';
    ctx.fillText(U[board[i]],x,y+2);
  }
  if(label){
    ctx.fillStyle=Y; ctx.font='bold 18px Inter,system-ui,sans-serif';
    ctx.fillText(label,W/2,H-16);
  }
}
function playTrap(canvas,trap,statusEl){
  let board=startBoard(), i=-1, from=null,to=null;
  const labels=trap.moves.map(m=>m.slice(0,2)+'-'+m.slice(2,4));
  function step(){
    if(i>=trap.moves.length){i=-1;board=startBoard();from=to=null;draw(canvas,board,null,null,'Replay…');setTimeout(step,1200);return}
    if(i>=0){
      const uci=trap.moves[i];
      from=sq(uci.slice(0,2)); to=sq(uci.slice(2,4));
      draw(canvas,board,from,to,labels[i]);
      setTimeout(()=>{
        board=applyMove(board,uci);
        draw(canvas,board,null,to,labels[i]);
        i++; setTimeout(step,900);
      },700);
    } else {
      draw(canvas,board,null,null,'Start');
      i=0; setTimeout(step,800);
    }
  }
  statusEl.textContent=trap.note;
  step();
}
function mount(){
  const root=document.getElementById('trap-player');
  if(!root) return;
  root.innerHTML='';
  const grid=document.createElement('div');
  grid.className='video-grid';
  TRAPS.forEach(trap=>{
    const card=document.createElement('div');
    card.className='video-card';
    const c=document.createElement('canvas');
    c.width=488; c.height=538; c.style.width='100%'; c.style.borderRadius='10px'; c.style.background='#000';
    const cap=document.createElement('div');
    cap.className='vcap';
    cap.innerHTML='<strong>'+trap.name+'</strong><span class="note"></span>';
    const btn=document.createElement('button');
    btn.textContent='▶ Play';
    btn.style.cssText='margin-top:8px;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:#10a37f;color:#fff;font-size:13px;cursor:pointer';
    btn.onclick=()=>{playTrap(c,trap,cap.querySelector('.note'));btn.textContent='Playing…'};
    card.appendChild(c); card.appendChild(cap); card.appendChild(btn);
    grid.appendChild(card);
    draw(c,startBoard(),null,null,'Tap Play');
  });
  root.appendChild(grid);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
else mount();
})();
