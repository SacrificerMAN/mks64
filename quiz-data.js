// Saran Chess Academy — Weekly Quiz
// This Sunday paper: 30 Q | 30 min | 14 tactics + 6 viz + 10 GK
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

  // —— PIN (2) ——
  var tactics = [
    {
      id: "pin1", theme: "Pin", type: "tactic",
      fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      q: "Black to move. White’s bishop on b5 is pinning which piece?",
      options: ["The knight on c6 (against the king)", "The pawn on e5", "The queen on d8", "Nothing — it is not a pin"],
      answer: 0
    },
    {
      id: "pin2", theme: "Pin", type: "tactic",
      fen: "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
      q: "White to move. Which move pins Black’s knight on f6 against the queen?",
      options: ["Bg5", "Ng5", "d3", "O-O"],
      answer: 0
    },
    // —— FORK (2) ——
    {
      id: "fork1", theme: "Fork", type: "tactic",
      fen: "rnbqkb1r/pppp1ppp/5n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 3",
      q: "White to move (Scholar’s-style). Best dual threat on f7?",
      options: ["Qxf7#", "Bxf7+", "Qxe5+", "Nc3"],
      answer: 0
    },
    {
      id: "fork2", theme: "Fork", type: "tactic",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
      q: "White to move. If Black took on d4 earlier, a common knight fork idea targets which two pieces?",
      options: ["King and rook / queen (classic N forks)", "Only two pawns", "Only bishops", "Nothing"],
      answer: 0
    },
    // —— SKEWER (2) ——
    {
      id: "sk1", theme: "Skewer", type: "tactic",
      fen: "4k3/8/8/8/8/8/4R3/4K2r w - - 0 1",
      q: "White to move. Win Black’s rook with a skewer?",
      options: ["Re8+", "Ke2", "Rf2", "Re3"],
      answer: 0
    },
    {
      id: "sk2", theme: "Skewer", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
      q: "White to move. Skewer the king and win material on the back rank?",
      options: ["Ra8+", "Rd1", "h3", "Kg2"],
      answer: 0
    },
    // —— DISCOVERED ATTACK (2) ——
    {
      id: "da1", theme: "Discovered Attack", type: "tactic",
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
      q: "White to move. A safe developing move that also prepares discoveries later?",
      options: ["O-O", "Ng5", "Bxf7+", "a3"],
      answer: 0
    },
    {
      id: "da2", theme: "Discovered Attack", type: "tactic",
      fen: "rnbqk2r/ppp2ppp/3b1n2/3pp3/4P3/3P1N2/PPP1BPPP/RNBQK2R w KQkq - 0 5",
      q: "White to move. Open the centre and create tension with?",
      options: ["exd5", "Nxe5", "Bg5", "h3"],
      answer: 0
    },
    // —— MATE IN 1 (2) ——
    {
      id: "m11", theme: "Mate in 1", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
      q: "White to move. Mate in 1?",
      options: ["Rd8#", "Rd7", "Re1", "h4"],
      answer: 0
    },
    {
      id: "m12", theme: "Mate in 1", type: "tactic",
      fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
      q: "Black is in check from Qf7. Is this checkmate?",
      options: ["Yes — king has no safe square and cannot capture/block", "No — Black captures the queen with the king", "No — Nd4 blocks", "Stalemate"],
      answer: 0
    },
    // —— MATE IN 2 (2) ——
    {
      id: "m21", theme: "Mate in 2", type: "tactic",
      fen: "5k2/8/5K2/8/8/8/8/7R w - - 0 1",
      q: "White to move. Start of forced mate in 2 with the rook?",
      options: ["Rh8+", "Rh7", "Ke5", "Rh2"],
      answer: 0
    },
    {
      id: "m22", theme: "Mate in 2", type: "tactic",
      fen: "6k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1",
      q: "White to move. Back-rank mate idea starts with?",
      options: ["Rc8+", "Rc7", "h3", "Kh1"],
      answer: 0
    },
    // —— MATE IN 3 (2) ——
    {
      id: "m31", theme: "Mate in 3", type: "tactic",
      fen: "4k3/8/4K3/8/8/8/8/7Q w - - 0 1",
      q: "White (King + Queen vs King). Best first idea to restrict the king?",
      options: ["Cut the king with the queen (e.g. checks that shrink the box)", "Only move the king closer", "Give stalemate", "Trade the queen"],
      answer: 0
    },
    {
      id: "m32", theme: "Mate in 3", type: "tactic",
      fen: "7k/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
      q: "White to move. Typical way to start a back-rank / ladder idea?",
      options: ["Ra8+", "Rd1", "h4", "Kf1"],
      answer: 0
    }
  ];

  // —— VISUALIZATION (6) — no board ——
  var visualize = [
    {
      id: "v1", theme: "Visualization", type: "viz",
      q: "From the start: 1.e4 e5 2.Nf3 Nc6 3.Bb5 — Black’s knight is on which square?",
      options: ["c6", "f6", "c5", "e7"], answer: 0
    },
    {
      id: "v2", theme: "Visualization", type: "viz",
      q: "White pieces: King a1, Rook b1. Black: King a3. White to move — mate in one?",
      options: ["Yes — Rb3#", "Yes — Ra1#", "No legal mate", "Yes — Kb2"], answer: 0
    },
    {
      id: "v3", theme: "Visualization", type: "viz",
      q: "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 — White’s knight stands on?",
      options: ["d4", "f3", "c3", "e5"], answer: 0
    },
    {
      id: "v4", theme: "Visualization", type: "viz",
      q: "White rook on e2, White king e1, Black king e8, no pieces between on the e-file. Is Black in check?",
      options: ["Yes", "No", "Only if it is Black’s move", "Only in the endgame"], answer: 0
    },
    {
      id: "v5", theme: "Visualization", type: "viz",
      q: "Moves: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 — this is typically the start of?",
      options: ["King’s Indian Defence setup", "French Defence", "Scandinavian", "Only the London System"], answer: 0
    },
    {
      id: "v6", theme: "Visualization", type: "viz",
      q: "White castles kingside (O-O). The king ends on which square?",
      options: ["g1", "c1", "e1", "h1"], answer: 0
    }
  ];

  // —— GK & GS (10) ——
  var gk = [
    {
      id: "g1", theme: "GK/GS", type: "gk",
      q: "Who won the 2024 FIDE World Chess Championship (classical)?",
      options: ["Gukesh D", "Ding Liren", "Magnus Carlsen", "Fabiano Caruana"], answer: 0
    },
    {
      id: "g2", theme: "GK/GS", type: "gk",
      q: "FIDE is the international federation for?",
      options: ["Chess", "Football", "Cricket", "Tennis"], answer: 0
    },
    {
      id: "g3", theme: "GK/GS", type: "gk",
      q: "Stalemate is when the side to move…",
      options: ["Has no legal move and is NOT in check", "Is checkmated", "Ran out of time only", "Has two queens"], answer: 0
    },
    {
      id: "g4", theme: "GK/GS", type: "gk",
      q: "En passant capture must be played…",
      options: ["On the very next move after the double pawn step", "Anytime later in the game", "Only in blitz", "Only by the king"], answer: 0
    },
    {
      id: "g5", theme: "GK/GS", type: "gk",
      q: "You cannot castle if…",
      options: ["King is in check, passes through check, or king/rook already moved", "You still have both bishops", "It is before move 10", "Queens are on the board"], answer: 0
    },
    {
      id: "g6", theme: "GK/GS", type: "gk",
      q: "AICF is the national chess body of which country?",
      options: ["India", "Indonesia", "Ireland", "Italy"], answer: 0
    },
    {
      id: "g7", theme: "GK/GS", type: "gk",
      q: "Touch-move rule: if you touch your own piece…",
      options: ["You must move it if you have a legal move with it", "You may change to any piece", "Only applies online", "Only applies to the king"], answer: 0
    },
    {
      id: "g8", theme: "GK/GS", type: "gk",
      q: "The fifty-move rule can claim a draw after how many moves without a capture or pawn move?",
      options: ["50 moves by each side", "25 moves", "100 moves", "10 moves"], answer: 0
    },
    {
      id: "g9", theme: "GK/GS", type: "gk",
      q: "A passed pawn is a pawn that…",
      options: ["Has no opposing pawns that can stop it on its file or adjacent files", "Has already promoted", "Is always on the 7th rank", "Is doubled with another pawn"], answer: 0
    },
    {
      id: "g10", theme: "GK/GS", type: "gk",
      q: "Value of a queen in standard beginner material counting is usually taken as…",
      options: ["9 points", "5 points", "3 points", "1 point"], answer: 0
    }
  ];

  function isoWeek(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  function shuffle(arr, seed) {
    var a = arr.slice();
    var s = seed;
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
    return shuffle(all, seed).map(function (q, i) {
      return Object.assign({}, q, { num: i + 1 });
    });
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
    WA: WA,
    ENTRY_FEE: ENTRY_FEE,
    PRIZES: PRIZES,
    getQuestions: getQuestions,
    fenImg: fenImg,
    getWeekId: getWeekId,
    nextSundayLabel: nextSundayLabel,
    DURATION_SEC: 30 * 60,
    PAPER: "Sunday Ready"
  };
})(typeof window !== "undefined" ? window : global);
