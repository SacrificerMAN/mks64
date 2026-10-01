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
function renderBoard(el,fen,opts={}){
  const map=fenToBoard(fen);
  const flip=!!opts.flip;
  const ranks=flip?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1];
  const files=flip?['h','g','f','e','d','c','b','a']:['a','b','c','d','e','f','g','h'];
  el.innerHTML='';
  ranks.forEach((rank,ri)=>files.forEach((file,fi)=>{
    const sq=file+rank;
    const d=document.createElement('div');
    const dark=((ri+fi)%2)===1;
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
    d.onclick=()=>opts.onClick&&opts.onClick(sq,map[sq]);
    el.appendChild(d);
  }));
}
