(function(){
  function squaresFromFen(fen){const rows=fen.split(' ')[0].split('/');const out=[];rows.forEach(row=>{for(const ch of row){if(/\d/.test(ch)){for(let i=0;i<Number(ch);i++)out.push('')}else out.push(ch)}});return out}
  function drawBoard(el,fen){
    if(!el)return;
    const pieces=squaresFromFen(fen);
    el.innerHTML='';
    el.setAttribute('role','grid');
    pieces.forEach((piece,index)=>{
      const rank=8-Math.floor(index/8),file='abcdefgh'[index%8];
      const sq=document.createElement('div');
      sq.className='square '+((Math.floor(index/8)+index%8)%2?'dark':'light');
      sq.setAttribute('role','gridcell');
      if(piece){
        const color=piece===piece.toUpperCase()?'w':'b';
        const name={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'}[piece.toLowerCase()];
        const image=document.createElement('img');
        image.className='piece '+(color==='w'?'white':'black');
        image.src='https://lichess1.org/assets/piece/cburnett/'+color+piece.toUpperCase()+'.svg';
        image.alt=(color==='w'?'White ':'Black ')+name;
        image.draggable=false;
        sq.setAttribute('aria-label',file+rank+', '+image.alt.toLowerCase());
        sq.append(image);
      }else sq.setAttribute('aria-label',file+rank+', empty');
      el.append(sq);
    });
  }
  function mountQuiz(config){
    const root=document.querySelector('[data-chess-tool]');
    if(!root)return;
    const board=root.querySelector('.board'),title=root.querySelector('[data-title]'),prompt=root.querySelector('[data-prompt]'),choices=root.querySelector('[data-choices]'),feedback=root.querySelector('[data-feedback]'),progress=root.querySelector('[data-progress]'),counter=root.querySelector('[data-counter]'),next=root.querySelector('[data-next]'),done=root.querySelector('[data-done]'),sourceBox=root.querySelector('[data-source-box]'),sourceStatus=root.querySelector('[data-source-status]'),sourceLink=root.querySelector('[data-source-link]');
    let selected=0,step=0,locked=false,sourceRequest=0,sourceAbort=null;
    function active(){return config.groups[selected]}
    function updateSource(q){
      if(!sourceBox)return;
      const url='https://www.chessdb.cn/cdb.php?action=queryall&board='+encodeURIComponent(q.fen);
      sourceLink.href=url;
      sourceStatus.textContent='Loading live book data for this exact position…';
      if(sourceAbort)sourceAbort.abort();
      sourceAbort=new AbortController();
      const request=++sourceRequest;
      const timeout=setTimeout(()=>sourceAbort.abort(),8000);
      fetch(url,{signal:sourceAbort.signal}).then(r=>r.text()).then(text=>{
        if(request!==sourceRequest)return;
        const count=text.split('|').filter(part=>part.includes('move:')).length;
        sourceStatus.textContent=count?'Live book data: '+count+' database moves found for this position.':'No book moves returned yet—use the source link to check the live database.';
      }).catch(()=>{
        if(request===sourceRequest)sourceStatus.textContent='Live book data is temporarily unavailable—open the source link to try again.';
      }).finally(()=>clearTimeout(timeout));
    }
    function render(){
      const group=active(),q=group.questions[step];
      locked=false;title.textContent=group.name;drawBoard(board,q.fen);updateSource(q);prompt.textContent=q.prompt;counter.textContent=(step+1)+' / '+group.questions.length;progress.style.width=((step/group.questions.length)*100)+'%';choices.innerHTML='';feedback.textContent='Choose the move you would play.';feedback.className='feedback';next.hidden=true;done.classList.remove('show');q.options.forEach((move,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=move;b.addEventListener('click',()=>answer(i,b));choices.append(b)});
    }
    function answer(i,button){if(locked)return;locked=true;const q=active().questions[step],buttons=[...choices.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);if(i===q.answer){button.classList.add('correct');feedback.textContent='Correct — '+q.explain;feedback.className='feedback good';next.hidden=false;progress.style.width=(((step+1)/active().questions.length)*100)+'%'}else{button.classList.add('wrong');buttons[q.answer].classList.add('correct');feedback.textContent='Not this time. '+q.explain;feedback.className='feedback bad';next.hidden=false}}
    next.addEventListener('click',()=>{if(step<active().questions.length-1){step++;render()}else{done.textContent=config.complete(active().name);done.classList.add('show');next.hidden=true;progress.style.width='100%';feedback.textContent='Line completed. Choose another line or train again.';feedback.className='feedback good'}});
    root.querySelectorAll('[data-group]').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.group);step=0;root.querySelectorAll('[data-group]').forEach(x=>x.classList.toggle('active',x===b));render()}));
    render();
    return{render};
  }
  window.ChessTrainer={drawBoard,mountQuiz};
})();
