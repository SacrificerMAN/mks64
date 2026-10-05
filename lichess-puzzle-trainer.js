(function(){
  function moveFromUci(chess,uci){
    const move={from:uci.slice(0,2),to:uci.slice(2,4)};
    if(uci.length>4)move.promotion=uci.slice(4,5);
    return chess.move(move);
  }
  function shuffle(items){
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
    return copy;
  }
  function prettyThemes(themes){
    return (themes||[]).slice(0,4).map(theme=>theme.replace(/([A-Z])/g,' $1').replace(/^./,letter=>letter.toUpperCase())).join(' · ');
  }
  function positionFromGame(data){
    if(data.puzzle.fen)return data.puzzle.fen;
    if(!window.Chess)throw new Error('Chess library did not load');
    const game=new Chess();
    if(!game.load_pgn(data.game.pgn))throw new Error('Could not read the Lichess game');
    const history=game.history({verbose:true});
    const position=new Chess();
    history.slice(0,Math.min(history.length,Number(data.puzzle.initialPly)+1)).forEach(move=>{
      const input={from:move.from,to:move.to};
      if(move.promotion)input.promotion=move.promotion;
      position.move(input);
    });
    return position.fen();
  }
  async function requestPuzzle(settings){
    let latest;
    const attempts=settings.theme?4:1;
    for(let attempt=0;attempt<attempts;attempt++){
      const response=await fetch(settings.endpoint,{headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error('Lichess returned '+response.status);
      latest=await response.json();
      if(!settings.theme||(latest.puzzle.themes||[]).includes(settings.theme))return latest;
    }
    throw new Error('No '+settings.theme+' puzzle returned right now');
  }
  function mount(settings){
    const root=document.querySelector('[data-lichess-puzzle-tool]');
    if(!root)return;
    const board=root.querySelector('.board'),title=root.querySelector('[data-title]'),prompt=root.querySelector('[data-prompt]'),choices=root.querySelector('[data-choices]'),feedback=root.querySelector('[data-feedback]'),progress=root.querySelector('[data-progress]'),counter=root.querySelector('[data-counter]'),next=root.querySelector('[data-next]'),done=root.querySelector('[data-done]'),status=root.querySelector('[data-source-status]'),sourceLink=root.querySelector('[data-source-link]'),gameLink=root.querySelector('[data-game-link]'),turnNote=root.querySelector('[data-turn-note]'),typeNote=root.querySelector('[data-type-note]');
    let step=0,locked=true,current=null,action='load';
    function showError(message){
      title.textContent='Live source temporarily unavailable';
      prompt.textContent='Please try another verified Lichess puzzle.';
      choices.innerHTML='';
      feedback.textContent=message;
      feedback.className='feedback bad';
      status.textContent='The Lichess API did not return a verified position. Try again or open Lichess directly.';
      sourceLink.href='https://lichess.org/training';
      gameLink.hidden=true;
      next.hidden=false;
      next.textContent='Try live source again';
      action='load';
    }
    function completeRound(){
      done.textContent=settings.complete();
      done.classList.add('show');
      feedback.textContent='Round completed with verified Lichess positions.';
      feedback.className='feedback good';
      next.hidden=false;
      next.textContent='Start another live round';
      action='restart';
    }
    function loadPuzzle(){
      locked=true;action='loading';
      title.textContent=settings.title;
      prompt.textContent='Loading a verified position from Lichess…';
      choices.innerHTML='';
      feedback.textContent='';
      feedback.className='feedback';
      next.hidden=true;
      done.classList.remove('show');
      counter.textContent=(step+1)+' / '+settings.setSize;
      progress.style.width=((step/settings.setSize)*100)+'%';
      status.textContent=settings.theme?'Finding a live Lichess endgame puzzle…':'Loading a live Lichess puzzle from a rated game…';
      sourceLink.href='https://lichess.org/training';
      gameLink.hidden=true;
      requestPuzzle(settings).then(data=>{
        const fen=positionFromGame(data);
        const chess=new Chess(fen);
        const firstMove=moveFromUci(chess,data.puzzle.solution[0]);
        if(!firstMove)throw new Error('The Lichess solution could not be read');
        const solution=firstMove.san;
        const alternatives=shuffle(chess.moves().filter(move=>move!==solution)).slice(0,2);
        current={data,fen,solution,options:shuffle([solution].concat(alternatives))};
        ChessTrainer.drawBoard(board,fen);
        const side=fen.split(' ')[1]==='w'?'White':'Black';
        turnNote.textContent=side+' to move';
        typeNote.textContent=settings.boardLabel;
        title.textContent=settings.title;
        prompt.textContent='This exact position comes from a Lichess rated game. Which move begins the recorded solution?';
        counter.textContent=(step+1)+' / '+settings.setSize;
        sourceLink.href='https://lichess.org/training/'+data.puzzle.id;
        sourceLink.textContent='Open this puzzle on Lichess ↗';
        gameLink.href='https://lichess.org/'+data.game.id+'#'+data.puzzle.initialPly;
        gameLink.hidden=false;
        status.textContent='Puzzle '+data.puzzle.id+' · rating '+data.puzzle.rating+' · '+data.puzzle.plays.toLocaleString()+' plays · '+prettyThemes(data.puzzle.themes);
        current.options.forEach(move=>{
          const button=document.createElement('button');
          button.className='choice';button.textContent=move;
          button.addEventListener('click',()=>answer(move,button));
          choices.append(button);
        });
        locked=false;
      }).catch(error=>showError('Could not load the live source: '+error.message));
    }
    function answer(move,button){
      if(locked||!current)return;
      locked=true;
      const buttons=[...choices.querySelectorAll('button')];
      buttons.forEach(item=>item.disabled=true);
      const correct=move===current.solution;
      buttons.forEach(item=>{if(item.textContent===current.solution)item.classList.add('correct')});
      if(correct){
        feedback.textContent='Correct — '+current.solution+' is the first move in the saved Lichess solution. Open the source puzzle to play the full line.';
        feedback.className='feedback good';
      }else{
        button.classList.add('wrong');
        feedback.textContent='The recorded Lichess solution begins '+current.solution+'. Open the source puzzle to replay the complete line.';
        feedback.className='feedback bad';
      }
      progress.style.width=(((step+1)/settings.setSize)*100)+'%';
      next.hidden=false;
      next.textContent=step<settings.setSize-1?'Next live puzzle':'Complete this round';
      action=step<settings.setSize-1?'next':'complete';
    }
    next.addEventListener('click',()=>{
      if(action==='next'){step++;loadPuzzle()}
      else if(action==='complete')completeRound()
      else if(action==='restart'){step=0;loadPuzzle()}
      else if(action==='load')loadPuzzle();
    });
    loadPuzzle();
  }
  window.LichessPuzzleTrainer={mount};
})();
