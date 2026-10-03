// Weekly Chess Quiz — question bank (rotate by ISO week)
// 30 Q: 14 tactics (2 each theme) + 6 visualization + 10 GK/GS
(function (global) {
  const WA = "919354811377";
  const ENTRY_FEE = 300;
  const PRIZES = [
    { rank: "1st", amount: 2500 },
    { rank: "2nd", amount: 2000 },
    { rank: "3rd", amount: 1500 },
    { rank: "4th", amount: 1000 },
    { rank: "5th–6th", amount: 500 }
  ];

  const tactics = [
    { id: "pin1", theme: "Pin", type: "tactic", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", q: "White to move. Which move pins the knight on f6 against the queen?", options: ["Bb5", "Ng5", "d4", "O-O"], answer: 0 },
    { id: "pin2", theme: "Pin", type: "tactic", fen: "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5", q: "White to move. Best developing way to deal with the pin on Nc3?", options: ["a3", "Bd2", "Qc2", "Qb3"], answer: 1 },
    { id: "fork1", theme: "Fork", type: "tactic", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", q: "White to move. Classic dual threat on f7?", options: ["Qxf7#", "Bxf7+", "Qxe5+", "Nf3"], answer: 0 },
    { id: "fork2", theme: "Fork", type: "tactic", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", q: "After 1.e4 e5 2.Nf3 Nc6, White threatens the e5 pawn. Best capture defence for Black later often involves which idea?", options: ["Defend e5 / develop", "Resign", "Only a6", "Only h6"], answer: 0 },
    { id: "sk1", theme: "Skewer", type: "tactic", fen: "4k3/8/8/8/8/8/4R3/4K2r w - - 0 1", q: "White to move. Win the rook with a skewer?", options: ["Re8+", "Ke2", "Re1", "Rf2"], answer: 0 },
    { id: "sk2", theme: "Skewer", type: "tactic", fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", q: "White to move. Skewer on the 8th rank?", options: ["Ra8+", "Rd1", "h4", "Kg2"], answer: 0 },
    { id: "da1", theme: "Discovered Attack", type: "tactic", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5", q: "White to move. Natural safe developing move?", options: ["Ng5", "O-O", "Nc3", "Bg5"], answer: 1 },
    { id: "da2", theme: "Discovered Attack", type: "tactic", fen: "rnbqk2r/ppp2ppp/3b1n2/3pp3/4P3/3P1N2/PPP1BPPP/RNBQK2R w KQkq - 0 5", q: "White to move. Open the centre with tempo?", options: ["exd5", "Nxe5", "Bg5", "O-O"], answer: 0 },
    { id: "m11", theme: "Mate in 1", type: "tactic", fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1", q: "White to move. Mate in 1?", options: ["Rd8#", "Rd7", "Re1", "h4"], answer: 0 },
    { id: "m12", theme: "Mate in 1", type: "tactic", fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4", q: "Black to move is in check from Qf7. Is the king mated?", options: ["Yes — king cannot escape or capture safely", "No — Black can capture the queen", "No — interpose on e7", "Draw by stalemate"], answer: 0 },
    { id: "m21", theme: "Mate in 2", type: "tactic", fen: "5k2/8/5K2/8/8/8/8/7R w - - 0 1", q: "White to move. Start of a mate-in-2 with the rook?", options: ["Rh8+", "Rh7", "Ke6", "Rh5"], answer: 0 },
    { id: "m22", theme: "Mate in 2", type: "tactic", fen: "6k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1", q: "White to move. Back-rank idea begins with?", options: ["Rc8+", "Rc7", "h3", "Kh1"], answer: 0 },
    { id: "m31", theme: "Mate in 3", type: "tactic", fen: "4k3/8/4K3/8/8/8/8/7Q w - - 0 1", q: "White (K+Q vs K). Best first idea to restrict the king?", options: ["Qd7+ / cut the king", "Qh8+", "Kf6", "Qe5+"], answer: 0 },
    { id: "m32", theme: "Mate in 3", type: "tactic", fen: "7k/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", q: "White to move. Typical back-rank start?", options: ["Ra8+", "Rd1", "h4", "Kf1"], answer: 0 }
  ];

  const visualize = [
    { id: "v1", theme: "Visualization", type: "viz", q: "From the starting position, after 1.e4 e5 2.Nf3 Nc6 3.Bb5, Black’s knight is on which square?", options: ["c6", "f6", "c5", "e7"], answer: 0 },
    { id: "v2", theme: "Visualization", type: "viz", q: "White: Ka1, Rb1. Black: Ka3. White to move. Mate in one?", options: ["Yes — Rb3#", "Yes — Ra1#", "No", "Yes — Kb1"], answer: 0 },
    { id: "v3", theme: "Visualization", type: "viz", q: "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4, White’s knight is on?", options: ["d4", "f3", "c3", "e5"], answer: 0 },
    { id: "v4", theme: "Visualization", type: "viz", q: "White rook on e-file (e2), kings on e1 and e8, nothing between — is Black in check?", options: ["Yes", "No", "Only if White just moved", "Only in endgame"], answer: 0 },
    { id: "v5", theme: "Visualization", type: "viz", q: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 — typical start of?", options: ["King’s Indian setup", "French Defence", "Scandinavian", "London only"], answer: 0 },
    { id: "v6", theme: "Visualization", type: "viz", q: "White castles short (O-O). King goes to?", options: ["g1", "c1", "e1", "h1"], answer: 0 }
  ];

  const gk = [
    { id: "g1", theme: "GK/GS", type: "gk", q: "Who won the 2024 FIDE World Championship (classical)?", options: ["Gukesh D", "Ding Liren", "Magnus Carlsen", "Fabiano Caruana"], answer: 0 },
    { id: "g2", theme: "GK/GS", type: "gk", q: "FIDE stands for?", options: ["Fédération Internationale des Échecs", "Federal Indian Chess Entity", "Fast International Drawing Event", "Federation of Internet Chess"], answer: 0 },
    { id: "g3", theme: "GK/GS", type: "gk", q: "Stalemate means?", options: ["Side to move has no legal move and is not in check", "King is checkmated", "Both flags fell", "Triple repetition only"], answer: 0 },
    { id: "g4", theme: "GK/GS", type: "gk", q: "En passant must be played?", options: ["Immediately on the next move after the double-step", "Anytime", "Only in blitz", "Only with the queen"], answer: 0 },
    { id: "g5", theme: "GK/GS", type: "gk", q: "Castling is illegal if?", options: ["King in check / passes through check / king or rook already moved", "You still have both rooks", "It is move 10", "Queens are on the board"], answer: 0 },
    { id: "g6", theme: "GK/GS", type: "gk", q: "Youngest undisputed World Champion from India (2024)?", options: ["Gukesh D", "Praggnanandhaa", "Anand", "Harikrishna"], answer: 0 },
    { id: "g7", theme: "GK/GS", type: "gk", q: "Touch-move rule means?", options: ["If you touch your piece you must move it if legal", "Adjust any piece freely", "Only online", "Only the king"], answer: 0 },
    { id: "g8", theme: "GK/GS", type: "gk", q: "Fifty-move rule: draw after how many moves without capture or pawn move?", options: ["50 moves by each side", "25 moves", "100 moves", "10 moves"], answer: 0 },
    { id: "g9", theme: "GK/GS", type: "gk", q: "A passed pawn is a pawn that?", options: ["Has no opposing pawns that can stop it on its file or adjacent files", "Has been promoted", "Is on the 2nd rank", "Is doubled"], answer: 0 },
    { id: "g10", theme: "GK/GS", type: "gk", q: "AICF is the national chess body of?", options: ["India", "Argentina", "Australia", "Italy"], answer: 0 }
  ];

  function isoWeek(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  function shuffle(arr, seed) {
    const a = arr.slice();
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const j = s % (i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function getWeekId() {
    const now = new Date();
    return now.getUTCFullYear() + "-W" + isoWeek(now);
  }

  function getQuestions() {
    const week = isoWeek(new Date());
    const seed = week * 97 + 2026;
    const all = tactics.concat(visualize).concat(gk);
    return shuffle(all, seed).map(function (q, i) {
      return Object.assign({}, q, { num: i + 1 });
    });
  }

  function fenImg(fen) {
    return "https://lichess1.org/export/fen.gif?fen=" + encodeURIComponent(fen) + "&color=white&piece=cburnett";
  }

  function nextSundayLabel() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 330 * 60000);
    const day = ist.getDay();
    var add = (7 - day) % 7;
    const t = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate() + add, 21, 0, 0);
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
    DURATION_SEC: 30 * 60
  };
})(typeof window !== "undefined" ? window : global);
