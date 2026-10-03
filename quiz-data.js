// Saran Chess Academy — Weekly Quiz (verified paper)
// 30 Q | 14 tactics + 6 viz + 10 GK | answers checked
(function (global) {
  var WA = "919354811377";
  var ENTRY_FEE = 300;
  var PRIZES = [
    { rank: "1st", amount: 2500 },
    { rank: "2nd", amount: 2000 },
    { rank: "3rd", amount: 1500 },
    { rank: "4th", amount: 1000 },
    { rank: "5th–6th", amount: 500 }
  ];

  var tactics = [
    {
      id: "pin1", theme: "Pin", type: "tactic",
      fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      q: "Black to move. White’s bishop on b5 is pinning Black’s knight on c6 against the king. True or false?",
      options: ["True — the knight cannot move without exposing the king", "False — the knight is free to move", "False — it pins the e5 pawn", "False — it pins the queen"],
      answer: 0
    },
    {
      id: "pin2", theme: "Pin", type: "tactic",
      fen: "rnbqk2r/pppp1ppp/5n2/4p1B1/2B1P3/8/PPPP1PPP/RN1QK1NR b KQkq - 3 3",
      q: "Black to move. White’s bishop on g5 is pinning which Black piece?",
      options: ["The knight on f6 (against the queen on d8)", "The pawn on e5", "The king on e8", "Nothing"],
      answer: 0
    },
    {
      id: "fork1", theme: "Fork", type: "tactic",
      fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
      q: "Black to move. White just played Qxf7. What is the result?",
      options: ["Checkmate — Black’s king is mated", "Black can capture the queen with the king safely", "Black is only in check and can escape to d7", "Stalemate"],
      answer: 0
    },
    {
      id: "fork2", theme: "Fork", type: "tactic",
      fen: "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3",
      q: "Black to move. White’s knight on e5 is attacking two important points. A knight attack on two pieces/targets at once is called a?",
      options: ["Fork", "Pin", "Skewer", "Discovered check"],
      answer: 0
    },
    {
      id: "sk1", theme: "Skewer", type: "tactic",
      fen: "4k3/8/8/8/8/8/4R3/4K2r w - - 0 1",
      q: "White to move. Which move skewers the Black king and wins the rook on h1?",
      options: ["Re8+", "Ke2", "Rh2", "Re1"],
      answer: 0
    },
    {
      id: "sk2", theme: "Skewer", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
      q: "White to move. Which move checks the king and attacks the back rank (skewer idea)?",
      options: ["Ra8+", "Rd1", "h3", "Kg2"],
      answer: 0
    },
    {
      id: "da1", theme: "Discovered Attack", type: "tactic",
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
      q: "A discovered attack happens when you move one piece and thereby open an attack from another piece behind it. True or false?",
      options: ["True", "False — that is called a pin", "False — that is only for checks", "False — only knights can do it"],
      answer: 0
    },
    {
      id: "da2", theme: "Discovered Attack", type: "tactic",
      fen: "rnbqk2r/ppp2ppp/3b1n2/3pp3/4P3/3P1N2/PPP1BPPP/RNBQK2R w KQkq - 0 5",
      q: "White to move. Which capture opens the centre and creates more lines for the pieces?",
      options: ["exd5", "Nxe5", "Bg5", "h3"],
      answer: 0
    },
    {
      id: "m11", theme: "Mate in 1", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
      q: "White to move. Find mate in 1.",
      options: ["Rd8#", "Rd7", "Re1", "h4"],
      answer: 0
    },
    {
      id: "m12", theme: "Mate in 1", type: "tactic",
      fen: "5k2/8/5K2/8/8/8/8/6R1 w - - 0 1",
      q: "White to move. Find mate in 1.",
      options: ["Rg8#", "Rf1", "Ke6", "Rg7"],
      answer: 0
    },
    {
      id: "m21", theme: "Mate in 2", type: "tactic",
      fen: "5k2/8/5K2/8/8/8/8/7R w - - 0 1",
      q: "White to move. Best first move toward forced mate in 2?",
      options: ["Rh8+", "Rh7", "Ke5", "Rh2"],
      answer: 0
    },
    {
      id: "m22", theme: "Mate in 2", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1",
      q: "White to move. Best first move for a back-rank mate idea?",
      options: ["Rc8+", "Rc7", "h3", "Kh1"],
      answer: 0
    },
    {
      id: "m31", theme: "Mate in 3", type: "tactic",
      fen: "7k/8/6K1/8/8/8/8/7Q w - - 0 1",
      q: "White to move (K+Q vs K). What is the correct plan?",
      options: ["Use the queen to cut the king, then step the king in and mate", "Sacrifice the queen immediately", "Only move the king and never the queen", "Stalemate on purpose"],
      answer: 0
    },
    {
      id: "m32", theme: "Mate in 3", type: "tactic",
      fen: "7k/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
      q: "White to move. Best first move to start a back-rank attack?",
      options: ["Ra8+", "Rd1", "h4", "Kf1"],
      answer: 0
    }
  ];

  var visualize = [
    { id: "v1", theme: "Visualization", type: "viz", q: "From the starting position: 1.e4 e5 2.Nf3 Nc6 3.Bb5. Where is Black’s queen’s knight?", options: ["c6", "f6", "c5", "b8"], answer: 0 },
    { id: "v2", theme: "Visualization", type: "viz", q: "White: King on a1, Rook on b1. Black: King on a3. White to move. Is Rb3 checkmate?", options: ["Yes", "No — the king escapes to a2", "No — the king captures the rook", "No — it is stalemate"], answer: 0 },
    { id: "v3", theme: "Visualization", type: "viz", q: "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4, on which square is White’s knight?", options: ["d4", "f3", "c3", "e5"], answer: 0 },
    { id: "v4", theme: "Visualization", type: "viz", q: "White has a rook on e4. White king on e1, Black king on e8, and no piece between them on the e-file. Is the Black king in check?", options: ["Yes", "No", "Only if it is Black’s turn", "Only in blitz"], answer: 0 },
    { id: "v5", theme: "Visualization", type: "viz", q: "The moves 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 usually start which opening family?", options: ["King’s Indian Defence", "French Defence", "Scandinavian Defence", "London System only"], answer: 0 },
    { id: "v6", theme: "Visualization", type: "viz", q: "When White castles kingside (O-O), the king moves to which square?", options: ["g1", "c1", "e1", "h1"], answer: 0 }
  ];

  var gk = [
    { id: "g1", theme: "GK/GS", type: "gk", q: "Who won the 2024 FIDE World Chess Championship (classical)?", options: ["Gukesh D", "Ding Liren", "Magnus Carlsen", "Hikaru Nakamura"], answer: 0 },
    { id: "g2", theme: "GK/GS", type: "gk", q: "FIDE is the world governing body of which sport?", options: ["Chess", "Football", "Cricket", "Badminton"], answer: 0 },
    { id: "g3", theme: "GK/GS", type: "gk", q: "Stalemate is when the player to move…", options: ["Has no legal move and is NOT in check", "Is checkmated", "Only has lost on time", "Has two queens"], answer: 0 },
    { id: "g4", theme: "GK/GS", type: "gk", q: "En passant must be played…", options: ["Immediately on the next move after the opponent’s double pawn step", "Anytime later in the game", "Only in bullet chess", "Only by a knight"], answer: 0 },
    { id: "g5", theme: "GK/GS", type: "gk", q: "Which situation makes castling illegal?", options: ["King is in check, or would pass through check, or king/rook already moved", "You still have both bishops", "It is before move 5", "Queens are still on the board"], answer: 0 },
    { id: "g6", theme: "GK/GS", type: "gk", q: "AICF is the national chess federation of which country?", options: ["India", "Indonesia", "Ireland", "Italy"], answer: 0 },
    { id: "g7", theme: "GK/GS", type: "gk", q: "According to the touch-move rule, if you touch one of your pieces…", options: ["You must move it if a legal move exists", "You may switch to any other piece", "The rule applies only online", "The rule applies only to the king"], answer: 0 },
    { id: "g8", theme: "GK/GS", type: "gk", q: "Under the fifty-move rule, a draw can be claimed after how many consecutive moves by each side with no capture and no pawn move?", options: ["50", "25", "100", "10"], answer: 0 },
    { id: "g9", theme: "GK/GS", type: "gk", q: "A passed pawn is a pawn that…", options: ["Has no opposing pawns that can stop it on its own file or the adjacent files", "Has already promoted to a queen", "Is always on the 7th rank", "Is doubled with another friendly pawn"], answer: 0 },
    { id: "g10", theme: "GK/GS", type: "gk", q: "In standard beginner material counting, the queen is worth how many points?", options: ["9", "5", "3", "1"], answer: 0 }
  ];

  function isoWeek(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }
  function shuffle(arr, seed) {
    var a = arr.slice(); var s = seed;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      var j = s % (i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function getWeekId() {
    var now = new Date();
    return now.getUTCFullYear() + "-W" + isoWeek(now);
  }
  function getQuestions() {
    var week = isoWeek(new Date());
    var seed = week * 97 + 2026;
    var all = tactics.concat(visualize).concat(gk);
    return shuffle(all, seed).map(function (q, i) { return Object.assign({}, q, { num: i + 1 }); });
  }
  function fenImg(fen) {
    return "https://lichess1.org/export/fen.gif?fen=" + encodeURIComponent(fen) + "&color=white&piece=cburnett";
  }
  function nextSundayLabel() {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var ist = new Date(utc + 330 * 60000);
    var day = ist.getDay();
    var add = (7 - day) % 7;
    var t = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate() + add, 21, 0, 0);
    if (day === 0 && ist.getHours() >= 21) t.setDate(t.getDate() + 7);
    return t.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
  }
  global.SCAQuiz = {
    WA: WA, ENTRY_FEE: ENTRY_FEE, PRIZES: PRIZES,
    getQuestions: getQuestions, fenImg: fenImg, getWeekId: getWeekId,
    nextSundayLabel: nextSundayLabel, DURATION_SEC: 30 * 60
  };
})(typeof window !== "undefined" ? window : global);
