const PIECE_URL={
  K:'https://lichess1.org/assets/piece/cburnett/wK.svg',
  Q:'https://lichess1.org/assets/piece/cburnett/wQ.svg',
  R:'https://lichess1.org/assets/piece/cburnett/wR.svg',
  B:'https://lichess1.org/assets/piece/cburnett/wB.svg',
  N:'https://lichess1.org/assets/piece/cburnett/wN.svg',
  P:'https://lichess1.org/assets/piece/cburnett/wP.svg',
  k:'https://lichess1.org/assets/piece/cburnett/bK.svg',
  q:'https://lichess1.org/assets/piece/cburnett/bQ.svg',
  r:'https://lichess1.org/assets/piece/cburnett/bR.svg',
  b:'https://lichess1.org/assets/piece/cburnett/bB.svg',
  n:'https://lichess1.org/assets/piece/cburnett/bN.svg',
  p:'https://lichess1.org/assets/piece/cburnett/bP.svg'
};
function fenToBoard(fen){
  const map={};let r=7,f=0;
  for(const ch of fen.split(' ')[0]){
    if(ch==='/'){r--;f=0;continue}
    if(/\d/.test(ch)){f+=+ch;continue}
    map[String.fromCharCode(97+f)+(r+1)]=ch;f++;
  }
  return map;
}

// Shared drag state (one board interaction at a time)
let _drag={from:null,piece:null,ghost:null,active:false,startX:0,startY:0,moved:false};

function _clearGhost(){
  if(_drag.ghost&&_drag.ghost.parentNode)_drag.ghost.parentNode.removeChild(_drag.ghost);
  _drag.ghost=null;
  document.querySelectorAll('.sq.drag-from').forEach(el=>el.classList.remove('drag-from'));
  document.querySelectorAll('.sq.drag-over').forEach(el=>el.classList.remove('drag-over'));
}

function renderBoard(el,fen,opts={}){
  const map=fenToBoard(fen);
  const flip=!!opts.flip;
  const ranks=flip?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1];
  const files=flip?['h','g','f','e','d','c','b','a']:['a','b','c','d','e','f','g','h'];
  el.innerHTML='';
  el.classList.add('board');

  ranks.forEach((rank,ri)=>files.forEach((file,fi)=>{
    const sq=file+rank;
    const d=document.createElement('div');
    const fileIdx=file.charCodeAt(0)-97;
    const rankIdx=rank-1;
    const dark=((fileIdx+rankIdx)%2)===0;
    d.className='sq '+(dark?'dk':'lt')+(opts.selected===sq?' sel':'')+(opts.hints&&opts.hints.includes(sq)?' mark':'');
    d.dataset.sq=sq;

    if(map[sq]&&PIECE_URL[map[sq]]){
      const img=document.createElement('img');
      img.src=PIECE_URL[map[sq]];
      img.alt=map[sq];
      img.className='piece';
      img.draggable=false;
      d.appendChild(img);
    }

    // Click still works (select then destination)
    d.addEventListener('click',e=>{
      if(_drag.moved){e.preventDefault();e.stopPropagation();return}
      opts.onClick&&opts.onClick(sq,map[sq]);
    });

    // Pointer drag (mouse + touch)
    d.addEventListener('pointerdown',e=>{
      if(!map[sq]) return;
      if(e.button!==undefined&&e.button!==0) return;
      _drag.from=sq;
      _drag.piece=map[sq];
      _drag.active=true;
      _drag.moved=false;
      _drag.startX=e.clientX;
      _drag.startY=e.clientY;
      d.classList.add('drag-from');
      try{d.setPointerCapture(e.pointerId)}catch(_){}

      // ghost piece that follows cursor
      _clearGhost();
      const srcImg=d.querySelector('.piece');
      if(srcImg){
        const g=srcImg.cloneNode(true);
        g.className='piece-ghost';
        g.style.width=(srcImg.getBoundingClientRect().width||40)+'px';
        g.style.height=(srcImg.getBoundingClientRect().height||40)+'px';
        document.body.appendChild(g);
        _drag.ghost=g;
        g.style.left=(e.clientX-g.offsetWidth/2)+'px';
        g.style.top=(e.clientY-g.offsetHeight/2)+'px';
      }
      e.preventDefault();
    });

    el.appendChild(d);
  }));

  // Board-level pointer move/up (bound once per render via property)
  el.onpointermove=function(e){
    if(!_drag.active||!_drag.from) return;
    const dx=e.clientX-_drag.startX, dy=e.clientY-_drag.startY;
    if(!_drag.moved&&(dx*dx+dy*dy)>16) _drag.moved=true;
    if(_drag.ghost){
      _drag.ghost.style.left=(e.clientX-_drag.ghost.offsetWidth/2)+'px';
      _drag.ghost.style.top=(e.clientY-_drag.ghost.offsetHeight/2)+'px';
    }
    // highlight square under cursor
    document.querySelectorAll('.sq.drag-over').forEach(s=>s.classList.remove('drag-over'));
    const under=document.elementFromPoint(e.clientX,e.clientY);
    const targetSq=under&&under.closest?under.closest('.sq'):null;
    if(targetSq&&targetSq.dataset.sq&&targetSq.dataset.sq!==_drag.from){
      targetSq.classList.add('drag-over');
    }
  };

  el.onpointerup=function(e){
    if(!_drag.active||!_drag.from) return;
    const from=_drag.from;
    const piece=_drag.piece;
    const didMove=_drag.moved;
    document.querySelectorAll('.sq.drag-over').forEach(s=>s.classList.remove('drag-over'));
    const under=document.elementFromPoint(e.clientX,e.clientY);
    const targetSq=under&&under.closest?under.closest('.sq'):null;
    const to=targetSq&&targetSq.dataset?targetSq.dataset.sq:null;
    _clearGhost();
    _drag.active=false;
    _drag.from=null;
    _drag.piece=null;

    if(didMove&&to&&to!==from&&opts.onClick){
      // Select source then destination → existing move logic handles capture
      opts.onClick(from,piece);
      opts.onClick(to,map[to]);
    }
  };

  el.onpointercancel=function(){
    _clearGhost();
    _drag.active=false;
    _drag.from=null;
    _drag.piece=null;
    _drag.moved=false;
  };
}
