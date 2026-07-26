// 삼국지 영웅전 : 8x8 정통 체스 엔진 (외형 실루엣 중심의 3D 체스 피스 디자인 적용)
import { 
  loginWithGoogle, 
  loginAsGuest, 
  logoutUser, 
  listenAuthState, 
  saveGameToCloud, 
  loadGameFromCloud 
} from "./firebase-config.js";

let currentUser = null;

let gameState = {
  playerFactionId: 'shu',
  aiFactionId: 'wei',
  
  board: Array(8).fill(null).map(() => Array(8).fill(null)),
  
  selectedPos: null,
  validMoves: [],
  validAttacks: [],
  
  isPlayerTurn: true,
  isCheck: false,
  isGameOver: false,

  playerCaptured: [],
  aiCaptured: []
};

window.selectFaction = selectFaction;
window.restartGame = restartGame;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnRestart').addEventListener('click', () => {
    document.getElementById('titleScreen').classList.remove('hidden');
  });

  document.getElementById('btnSaveGame').addEventListener('click', handleSaveGame);
  document.getElementById('btnLoadGame').addEventListener('click', handleLoadGame);

  listenAuthState((user) => {
    if (user) currentUser = user;
    else handleGuestLogin();
  });
});

async function handleGuestLogin() {
  const user = await loginAsGuest();
  currentUser = user;
}

async function handleSaveGame() {
  const saveData = {
    playerFactionId: gameState.playerFactionId,
    aiFactionId: gameState.aiFactionId,
    board: gameState.board,
    playerCaptured: gameState.playerCaptured,
    aiCaptured: gameState.aiCaptured,
    isPlayerTurn: gameState.isPlayerTurn
  };

  const userId = currentUser ? currentUser.uid : 'guest';
  const result = await saveGameToCloud(userId, saveData);

  if (result.success) {
    soundManager.playVictory();
    alert("💾 8x8 삼국지 체스 대결 상황이 성공적으로 저장되었습니다!");
  }
}

async function handleLoadGame() {
  const userId = currentUser ? currentUser.uid : 'guest';
  const data = await loadGameFromCloud(userId);

  if (!data) {
    alert("저장된 게임 데이터가 없습니다.");
    return;
  }

  gameState.playerFactionId = data.playerFactionId || 'shu';
  gameState.aiFactionId = data.aiFactionId || 'wei';
  gameState.board = data.board;
  gameState.playerCaptured = data.playerCaptured || [];
  gameState.aiCaptured = data.aiCaptured || [];
  gameState.isPlayerTurn = data.isPlayerTurn !== undefined ? data.isPlayerTurn : true;

  document.getElementById('titleScreen').classList.add('hidden');
  updateFactionInfo();
  renderBoard();
  updateCapturedUI();

  soundManager.playVictory();
  alert("📂 저장된 8x8 체스 게임을 불러왔습니다!");
}

function selectFaction(factionId) {
  gameState.playerFactionId = factionId;
  
  if (factionId === 'shu') gameState.aiFactionId = 'wei';
  else if (factionId === 'wei') gameState.aiFactionId = 'wu';
  else gameState.aiFactionId = 'shu';

  document.getElementById('titleScreen').classList.add('hidden');
  soundManager.playDrum();
  initBoard();
}

function restartGame() {
  document.getElementById('modalResult').classList.remove('active');
  document.getElementById('titleScreen').classList.remove('hidden');
}

function updateFactionInfo() {
  const pFact = CHESS_FACTIONS[gameState.playerFactionId];
  const aFact = CHESS_FACTIONS[gameState.aiFactionId];

  document.getElementById('playerFactionName').textContent = `아군 (${pFact.name})`;
  document.getElementById('playerKingName').textContent = `킹: ${pFact.pieces.king.name.split(' ')[0]} | 퀸: ${pFact.pieces.queen.name.split(' ')[0]}`;
  document.getElementById('playerFactionIcon').textContent = gameState.playerFactionId === 'shu' ? '🍃' : (gameState.playerFactionId === 'wei' ? '🐉' : '🔥');

  document.getElementById('aiFactionName').textContent = `컴퓨터 AI (${aFact.name})`;
  document.getElementById('aiKingName').textContent = `킹: ${aFact.pieces.king.name.split(' ')[0]} | 퀸: ${aFact.pieces.queen.name.split(' ')[0]}`;
  document.getElementById('aiFactionIcon').textContent = gameState.aiFactionId === 'shu' ? '🍃' : (gameState.aiFactionId === 'wei' ? '🐉' : '🔥');
}

// -------------------------------------------------------------
// ♟️ 8x8 체스판 초기화 (Standard Chess Board Setup)
// -------------------------------------------------------------
function initBoard() {
  gameState.board = Array(8).fill(null).map(() => Array(8).fill(null));
  gameState.playerCaptured = [];
  gameState.aiCaptured = [];
  gameState.selectedPos = null;
  gameState.validMoves = [];
  gameState.validAttacks = [];
  gameState.isPlayerTurn = true;
  gameState.isGameOver = false;

  updateFactionInfo();

  const pFact = CHESS_FACTIONS[gameState.playerFactionId];
  const aFact = CHESS_FACTIONS[gameState.aiFactionId];

  // AI 기물 배치
  const mainOrder = ['rook1', 'knight1', 'bishop1', 'queen', 'king', 'bishop2', 'knight2', 'rook2'];
  for (let c = 0; c < 8; c++) {
    const key = mainOrder[c];
    const pType = key.replace(/[0-9]/g, '');
    gameState.board[0][c] = { ...aFact.pieces[key], pieceType: pType, owner: 'ai' };
    gameState.board[1][c] = { ...aFact.pieces.pawn, pieceType: 'pawn', owner: 'ai' };
  }

  // 플레이어 기물 배치
  for (let c = 0; c < 8; c++) {
    const key = mainOrder[c];
    const pType = key.replace(/[0-9]/g, '');
    gameState.board[7][c] = { ...pFact.pieces[key], pieceType: pType, owner: 'player' };
    gameState.board[6][c] = { ...pFact.pieces.pawn, pieceType: 'pawn', owner: 'player' };
  }

  renderBoard();
  updateCapturedUI();
  logChess(`♟️ 8x8 삼국지 체스가 시작되었습니다! [${pFact.name}] VS [${aFact.name}]`);
}

// -------------------------------------------------------------
// 🎨 3D 체스 피스 실루엣 SVG 외형 디자인 생성기
// -------------------------------------------------------------
function generateVisualPieceSVG(pieceType, isPlayer) {
  const primaryColor = isPlayer ? '#f59e0b' : '#ef4444';
  const strokeColor = isPlayer ? '#fef08a' : '#f87171';
  const baseGradStart = isPlayer ? '#d97706' : '#991b1b';
  const baseGradEnd = isPlayer ? '#451a03' : '#450a0a';

  let pathData = '';

  // 정통 체스 피스 외형 실루엣 셰이프
  if (pieceType === 'king') {
    // 십자가 왕관 킹 셰이프
    pathData = `
      M 34,10 L 46,10 L 46,18 L 54,18 L 54,26 L 46,26 L 46,32 C 55,32 64,24 64,40 C 64,52 56,58 56,66 L 68,70 L 68,76 L 12,76 L 12,70 L 24,66 C 24,58 16,52 16,40 C 16,24 25,32 34,32 L 34,26 L 26,26 L 26,18 L 34,18 Z
    `;
  } else if (pieceType === 'queen') {
    // 5봉 봉우리 퀸 왕관 셰이프
    pathData = `
      M 16,24 L 24,44 L 32,20 L 40,44 L 48,20 L 56,44 L 64,24 L 60,56 C 60,64 56,68 56,70 L 68,74 L 68,78 L 12,78 L 12,74 L 24,70 C 24,68 20,64 20,56 Z
    `;
  } else if (pieceType === 'rook') {
    // 성곽 탑 룩 셰이프
    pathData = `
      M 18,20 L 28,20 L 28,28 L 36,28 L 36,20 L 44,20 L 44,28 L 52,28 L 52,20 L 62,20 L 58,40 L 56,68 L 66,72 L 66,78 L 14,78 L 14,72 L 24,68 L 22,40 Z
    `;
  } else if (pieceType === 'knight') {
    // 말머리 나이트 셰이프
    pathData = `
      M 32,16 C 44,16 58,24 58,38 C 58,46 50,52 54,58 C 58,64 64,66 64,72 L 64,78 L 16,78 L 16,72 C 16,62 26,56 26,44 C 26,34 18,36 18,28 C 18,20 24,16 32,16 Z
    `;
  } else if (pieceType === 'bishop') {
    // 뾰족한 비숍 성직자 모자 셰이프
    pathData = `
      M 40,12 C 43,12 45,14 45,17 C 45,20 43,22 40,22 C 37,22 35,20 35,17 C 35,14 37,12 40,12 Z M 40,24 C 52,24 60,38 56,56 C 56,64 58,68 58,72 L 66,74 L 66,78 L 14,78 L 14,74 L 22,72 C 22,68 24,64 24,56 C 20,38 28,24 40,24 Z
    `;
  } else {
    // 둥근 폰 셰이프
    pathData = `
      M 40,18 C 48,18 54,24 54,32 C 54,38 48,42 46,46 L 50,62 L 60,68 L 60,76 L 20,76 L 20,68 L 30,62 L 34,46 C 32,42 26,38 26,32 C 26,24 32,18 40,18 Z
    `;
  }

  return `
    <svg class="piece-svg-container" viewBox="0 0 80 85" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad_${pieceType}_${isPlayer}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="50%" stop-color="${baseGradStart}" />
          <stop offset="100%" stop-color="${baseGradEnd}" />
        </linearGradient>
      </defs>
      <path d="${pathData}" fill="url(#grad_${pieceType}_${isPlayer})" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>
  `;
}

// -------------------------------------------------------------
// ♟️ 외형 실루엣 체스 피스 렌더링
// -------------------------------------------------------------
function renderBoard() {
  const boardEl = document.getElementById('chessBoard8x8');
  boardEl.innerHTML = '';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      square.className = `chess-square ${isLight ? 'square-light' : 'square-dark'}`;

      if (gameState.selectedPos && gameState.selectedPos.r === r && gameState.selectedPos.c === c) {
        square.classList.add('square-selected');
      }

      const isMovable = gameState.validMoves.some(m => m.r === r && m.c === c);
      const isAttackable = gameState.validAttacks.some(a => a.r === r && a.c === c);

      if (isMovable) square.classList.add('square-movable');
      if (isAttackable) square.classList.add('square-attackable');

      const piece = gameState.board[r][c];
      if (piece) {
        if (piece.pieceType === 'king' && gameState.isCheck && ((piece.owner === 'player' && gameState.isPlayerTurn) || (piece.owner === 'ai' && !gameState.isPlayerTurn))) {
          square.classList.add('square-check');
        }

        const heroFirstName = piece.name.split(' ')[0];
        const isPlayer = piece.owner === 'player';

        const visualPiece = document.createElement('div');
        visualPiece.className = 'chess-visual-piece';

        // 1. 체스 피스 실루엣 SVG
        const svgHTML = generateVisualPieceSVG(piece.pieceType, isPlayer);

        // 2. 무장 초상화 원형 인셋
        visualPiece.innerHTML = `
          ${svgHTML}
          <img class="piece-portrait-inset" src="${piece.img}" alt="${piece.name}" onerror="this.src='${piece.fallbackImg || './assets/guan_yu.svg'}';">
          <span class="piece-name-label">${heroFirstName}</span>
        `;

        square.appendChild(visualPiece);
      }

      square.addEventListener('click', () => onSquareClick(r, c));
      boardEl.appendChild(square);
    }
  }
}

function onSquareClick(r, c) {
  if (gameState.isGameOver || !gameState.isPlayerTurn) return;

  const clickedPiece = gameState.board[r][c];

  if (gameState.selectedPos) {
    const isMovable = gameState.validMoves.some(m => m.r === r && m.c === c);
    const isAttackable = gameState.validAttacks.some(a => a.r === r && a.c === c);

    if (isMovable || isAttackable) {
      makeMove(gameState.selectedPos.r, gameState.selectedPos.c, r, c);
      return;
    }
  }

  if (clickedPiece && clickedPiece.owner === 'player') {
    gameState.selectedPos = { r, c };
    calculateValidMoves(r, c, clickedPiece);
    renderBoard();
  } else {
    gameState.selectedPos = null;
    gameState.validMoves = [];
    gameState.validAttacks = [];
    renderBoard();
  }
}

// -------------------------------------------------------------
// ♟️ 정통 체스 기물 이동 알고리즘
// -------------------------------------------------------------
function calculateValidMoves(r, c, piece) {
  gameState.validMoves = [];
  gameState.validAttacks = [];

  const type = piece.pieceType;
  const isPlayer = piece.owner === 'player';

  if (type === 'pawn') {
    const dir = isPlayer ? -1 : 1;
    const startRow = isPlayer ? 6 : 1;

    if (r + dir >= 0 && r + dir < 8 && !gameState.board[r + dir][c]) {
      gameState.validMoves.push({ r: r + dir, c });

      if (r === startRow && !gameState.board[r + 2 * dir][c]) {
        gameState.validMoves.push({ r: r + 2 * dir, c });
      }
    }

    [c - 1, c + 1].forEach(nc => {
      if (r + dir >= 0 && r + dir < 8 && nc >= 0 && nc < 8) {
        const target = gameState.board[r + dir][nc];
        if (target && target.owner !== piece.owner) {
          gameState.validAttacks.push({ r: r + dir, c: nc });
        }
      }
    });
  } else if (type === 'knight') {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    knightMoves.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = gameState.board[nr][nc];
        if (!target) gameState.validMoves.push({ r: nr, c: nc });
        else if (target.owner !== piece.owner) gameState.validAttacks.push({ r: nr, c: nc });
      }
    });
  } else if (type === 'bishop' || type === 'rook' || type === 'queen') {
    const dirs = [];
    if (type === 'bishop' || type === 'queen') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    if (type === 'rook' || type === 'queen') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);

    dirs.forEach(([dr, dc]) => {
      for (let step = 1; step < 8; step++) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = gameState.board[nr][nc];
          if (!target) {
            gameState.validMoves.push({ r: nr, c: nc });
          } else {
            if (target.owner !== piece.owner) gameState.validAttacks.push({ r: nr, c: nc });
            break;
          }
        } else break;
      }
    });
  } else if (type === 'king') {
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    dirs.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = gameState.board[nr][nc];
        if (!target) gameState.validMoves.push({ r: nr, c: nc });
        else if (target.owner !== piece.owner) gameState.validAttacks.push({ r: nr, c: nc });
      }
    });
  }
}

function makeMove(fromR, fromC, toR, toC) {
  const movingPiece = gameState.board[fromR][fromC];
  const targetPiece = gameState.board[toR][toC];

  if (targetPiece) {
    soundManager.playSwordClash();
    if (movingPiece.owner === 'player') gameState.playerCaptured.push(targetPiece);
    else gameState.aiCaptured.push(targetPiece);

    logDuelAlert(`💥 [기물 잡기] ${movingPiece.name} 이(가) 상대 ${targetPiece.name}을(를) 체스판에서 격파했습니다!`);

    if (targetPiece.pieceType === 'king') {
      gameState.board[toR][toC] = movingPiece;
      gameState.board[fromR][fromC] = null;
      renderBoard();
      updateCapturedUI();
      handleGameOver(movingPiece.owner === 'player');
      return;
    }
  } else {
    soundManager.playDrum();
  }

  gameState.board[toR][toC] = movingPiece;
  gameState.board[fromR][fromC] = null;

  gameState.selectedPos = null;
  gameState.validMoves = [];
  gameState.validAttacks = [];

  renderBoard();
  updateCapturedUI();

  if (gameState.isPlayerTurn) {
    gameState.isPlayerTurn = false;
    logChess(`--- 아군 턴 완료 -> 컴퓨터 AI 턴 ---`);
    setTimeout(makeAiChessMove, 1000);
  } else {
    gameState.isPlayerTurn = true;
    logChess(`--- 컴퓨터 AI 턴 완료 -> 아군 턴 ---`);
  }
}

// -------------------------------------------------------------
// 🤖 컴퓨터 지능형 체스 AI Engine
// -------------------------------------------------------------
function makeAiChessMove() {
  if (gameState.isGameOver) return;

  const allAiMoves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = gameState.board[r][c];
      if (piece && piece.owner === 'ai') {
        calculateValidMoves(r, c, piece);

        gameState.validAttacks.forEach(att => {
          const target = gameState.board[att.r][att.c];
          let score = 10;
          if (target.pieceType === 'king') score = 1000;
          else if (target.pieceType === 'queen') score = 90;
          else if (target.pieceType === 'rook') score = 50;
          else if (target.pieceType === 'bishop' || target.pieceType === 'knight') score = 30;

          allAiMoves.push({ from: { r, c }, to: { r: att.r, c: att.c }, score });
        });

        gameState.validMoves.forEach(mv => {
          allAiMoves.push({ from: { r, c }, to: { r: mv.r, c: mv.c }, score: 1 });
        });
      }
    }
  }

  if (allAiMoves.length > 0) {
    allAiMoves.sort((a, b) => b.score - a.score);
    const bestMove = allAiMoves[0];

    makeMove(bestMove.from.r, bestMove.from.c, bestMove.to.r, bestMove.to.c);
  } else {
    logChess(`🤖 컴퓨터 AI가 이동할 기물이 없어 턴을 넘깁니다.`);
    gameState.isPlayerTurn = true;
  }
}

function updateCapturedUI() {
  const pBox = document.getElementById('playerCapturedBox');
  const aBox = document.getElementById('aiCapturedBox');

  pBox.innerHTML = '';
  aBox.innerHTML = '';

  gameState.playerCaptured.forEach(p => {
    const span = document.createElement('span');
    span.className = 'captured-icon';
    span.textContent = p.symbol;
    pBox.appendChild(span);
  });

  gameState.aiCaptured.forEach(p => {
    const span = document.createElement('span');
    span.className = 'captured-icon';
    span.textContent = p.symbol;
    aBox.appendChild(span);
  });
}

function handleGameOver(isPlayerWin) {
  gameState.isGameOver = true;
  if (isPlayerWin) {
    soundManager.playVictory();
    document.getElementById('resultTitle').textContent = `🏆 체크메이트! (대승리) 🏆`;
    document.getElementById('resultTitle').style.color = `#f59e0b`;
    document.getElementById('resultDesc').textContent = `축하합니다! 적 킹(군주)을 격파하고 천하 삼국의 8x8 체스판에서 완승했습니다!`;
  } else {
    soundManager.playDefeat();
    document.getElementById('resultTitle').textContent = `💥 체크메이트 (패배) 💥`;
    document.getElementById('resultTitle').style.color = `#ef4444`;
    document.getElementById('resultDesc').textContent = `아군 킹(군주)이 체크메이트 당했습니다. 전술을 재정비하십시오!`;
  }
  document.getElementById('modalResult').classList.add('active');
}

function logChess(msg) {
  const box = document.getElementById('chessLogBox');
  const p = document.createElement('p');
  p.style.marginBottom = '4px';
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function logDuelAlert(msg) {
  logChess(msg);
}
