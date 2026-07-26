// 삼국지 영웅전 : 1:1 전술 카드 체스 듀얼 메인 엔진
import { 
  loginWithGoogle, 
  loginAsGuest, 
  logoutUser, 
  listenAuthState, 
  saveGameToCloud, 
  loadGameFromCloud 
} from "./firebase-config.js";

let currentUser = null;

// 게임 듀얼 상태
let gameState = {
  currentStage: AI_STAGES[0],
  playerHp: 100,
  playerMaxHp: 100,
  enemyHp: 100,
  enemyMaxHp: 100,
  playerSp: 3,
  maxSp: 10,
  turnCount: 1,
  isPlayerTurn: true,
  
  // 5x5 체스 그리드 보드 상태 (null 또는 Unit 객체)
  grid: Array(5).fill(null).map(() => Array(5).fill(null)),
  
  // 내 손패 카드 5장
  playerHand: [],
  
  // 현재 선택된 항목 ('card' 또는 'unit')
  selectedType: null,
  selectedCard: null,
  selectedUnitPos: null,
  
  movableCells: [],
  attackableCells: []
};

window.closeModal = closeModal;
window.selectStage = selectStage;

document.addEventListener('DOMContentLoaded', () => {
  initGame();

  const btnStart = document.getElementById('btnStartGameTitle');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      soundManager.playDrum();
      document.getElementById('titleScreen').classList.add('hidden');
    });
  }

  document.getElementById('btnEndTurn').addEventListener('click', endPlayerTurn);
  document.getElementById('btnSelectStage').addEventListener('click', openStageSelectModal);
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
    currentStageId: gameState.currentStage.id,
    playerHp: gameState.playerHp,
    enemyHp: gameState.enemyHp,
    playerSp: gameState.playerSp,
    turnCount: gameState.turnCount
  };

  const userId = currentUser ? currentUser.uid : 'guest';
  const result = await saveGameToCloud(userId, saveData);

  if (result.success) {
    soundManager.playVictory();
    alert("💾 1:1 체스 대결 진행 상황이 성공적으로 저장되었습니다!");
  }
}

async function handleLoadGame() {
  const userId = currentUser ? currentUser.uid : 'guest';
  const data = await loadGameFromCloud(userId);

  if (!data) {
    alert("저장된 게임 데이터가 없습니다.");
    return;
  }

  const stage = AI_STAGES.find(s => s.id === data.currentStageId) || AI_STAGES[0];
  selectStage(stage.id);

  gameState.playerHp = data.playerHp || 100;
  gameState.enemyHp = data.enemyHp || 100;
  gameState.playerSp = data.playerSp || 3;
  gameState.turnCount = data.turnCount || 1;

  updateUI();
  soundManager.playVictory();
  alert("📂 저장된 체스 대결 데이터를 불러왔습니다!");
}

function initGame() {
  gameState.grid = Array(5).fill(null).map(() => Array(5).fill(null));
  gameState.playerHp = 100;
  gameState.enemyHp = gameState.currentStage.bossHp;
  gameState.enemyMaxHp = gameState.currentStage.bossMaxHp;
  gameState.playerSp = 3;
  gameState.turnCount = 1;
  gameState.isPlayerTurn = true;

  // 초기 아군 패 4장 생성
  gameState.playerHand = [
    JSON.parse(JSON.stringify(HERO_CARDS.find(h => h.id === 'guan_yu'))),
    JSON.parse(JSON.stringify(HERO_CARDS.find(h => h.id === 'zhao_yun'))),
    JSON.parse(JSON.stringify(HERO_CARDS.find(h => h.id === 'huang_zhong'))),
    JSON.parse(JSON.stringify(TACTICAL_SPELL_CARDS.find(c => c.id === 'fire_attack')))
  ];

  // 초기 아군 보병 1명 소환된 상태로 시작
  const defaultUnit = JSON.parse(JSON.stringify(HERO_CARDS.find(h => h.id === 'cao_ren')));
  defaultUnit.owner = 'player';
  defaultUnit.hp = defaultUnit.maxHp;
  gameState.grid[4][2] = defaultUnit;

  // 컴퓨터 AI 기본 유닛 소환
  const enemyUnit = JSON.parse(JSON.stringify(HERO_CARDS.find(h => h.id === 'xiahoudun')));
  enemyUnit.owner = 'enemy';
  enemyUnit.hp = enemyUnit.maxHp;
  gameState.grid[0][2] = enemyUnit;

  renderGrid();
  renderHand();
  updateUI();
  logDuel(`[대결 시작] ${gameState.currentStage.name} 대결이 시작되었습니다!`);
}

function openStageSelectModal() {
  const container = document.getElementById('stageCardGrid');
  container.innerHTML = '';

  AI_STAGES.forEach(stage => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 2px solid ${stage.color};
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease;
    `;
    card.innerHTML = `
      <div style="font-size: 2.5rem;">${stage.icon}</div>
      <div style="font-size: 1.2rem; font-weight: 900; color: #fff;">${stage.name}</div>
      <div style="font-size: 0.85rem; color: var(--gold-light);">보스 체력: ${stage.bossHp} HP</div>
      <div style="font-size: 0.78rem; color: #cbd5e1; text-align: center;">${stage.desc}</div>
      <button class="header-btn" style="margin-top: 8px; width: 100%; background: ${stage.color};">⚔️ 도전하기</button>
    `;

    card.onclick = () => selectStage(stage.id);
    container.appendChild(card);
  });

  document.getElementById('modalStageSelect').classList.add('active');
}

function selectStage(stageId) {
  const stage = AI_STAGES.find(s => s.id === stageId);
  if (!stage) return;

  gameState.currentStage = stage;
  closeModal('modalStageSelect');
  initGame();
}

function updateUI() {
  document.getElementById('enemyLeaderName').textContent = `${gameState.currentStage.bossName}`;
  document.getElementById('enemyStageBadge').textContent = `${gameState.currentStage.name.split(':')[0]}`;

  const enemyHpPercent = Math.max(0, Math.round((gameState.enemyHp / gameState.enemyMaxHp) * 100));
  const playerHpPercent = Math.max(0, Math.round((gameState.playerHp / gameState.playerMaxHp) * 100));

  document.getElementById('enemyLeaderHpFill').style.width = `${enemyHpPercent}%`;
  document.getElementById('enemyLeaderHpText').textContent = `HP ${gameState.enemyHp} / ${gameState.enemyMaxHp}`;

  document.getElementById('playerLeaderHpFill').style.width = `${playerHpPercent}%`;
  document.getElementById('playerLeaderHpText').textContent = `HP ${gameState.playerHp} / ${gameState.playerMaxHp}`;

  document.getElementById('currentSpText').textContent = gameState.playerSp;
}

// -------------------------------------------------------------
// ♟️ 5x5 그리드 렌더링 및 클릭 상호작용
// -------------------------------------------------------------
function renderGrid() {
  const gridEl = document.getElementById('tacticsGrid');
  gridEl.innerHTML = '';

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';

      const isMovable = gameState.movableCells.some(m => m.r === r && m.c === c);
      const isAttackable = gameState.attackableCells.some(a => a.r === r && a.c === c);

      if (isMovable) cell.classList.add('cell-movable');
      if (isAttackable) cell.classList.add('cell-attackable');

      const unit = gameState.grid[r][c];
      if (unit) {
        const unitEl = document.createElement('div');
        unitEl.className = `grid-unit ${unit.owner === 'player' ? 'player-unit' : 'enemy-unit'}`;
        
        if (gameState.selectedUnitPos && gameState.selectedUnitPos.r === r && gameState.selectedUnitPos.c === c) {
          unitEl.classList.add('selected');
        }

        const hpPercent = Math.max(0, Math.round((unit.hp / unit.maxHp) * 100));

        unitEl.innerHTML = `
          <img class="unit-img" src="${unit.img}" alt="${unit.name}">
          <div class="unit-hp-bar"><div class="unit-hp-fill" style="width: ${hpPercent}%;"></div></div>
          <div class="unit-atk-badge">⚔️${unit.atk}</div>
        `;
        cell.appendChild(unitEl);
      }

      cell.addEventListener('click', () => onCellClick(r, c));
      gridEl.appendChild(cell);
    }
  }
}

function onCellClick(r, c) {
  if (!gameState.isPlayerTurn) return;

  const targetUnit = gameState.grid[r][c];

  // 1. 손패 카드가 선택되어 있는 경우 (소환 또는 주문)
  if (gameState.selectedType === 'card' && gameState.selectedCard) {
    const card = gameState.selectedCard;

    if (card.type === 'spell') {
      // 전술 주문 사용
      executeSpell(card, r, c);
      return;
    }

    // 무장 소환: 아군 진영 (행 3 또는 4의 빈 공간)
    if ((r === 3 || r === 4) && !targetUnit) {
      if (gameState.playerSp < card.cost) {
        logDuel(`군량(SP)이 부족합니다! (필요: ${card.cost})`);
        return;
      }

      gameState.playerSp -= card.cost;
      const newUnit = JSON.parse(JSON.stringify(card));
      newUnit.owner = 'player';
      newUnit.hp = newUnit.maxHp;

      gameState.grid[r][c] = newUnit;

      // 손패에서 제거
      gameState.playerHand = gameState.playerHand.filter(h => h !== card);
      clearSelection();

      soundManager.playGong();
      logDuel(`♟️ [소환] ${newUnit.name} 무장이 전장 (${r + 1}행 ${c + 1}열)에 소환되었습니다!`);
      renderGrid();
      renderHand();
      updateUI();
      return;
    }
  }

  // 2. 이미 배치된 아군 유닛을 선택한 경우
  if (targetUnit && targetUnit.owner === 'player') {
    gameState.selectedType = 'unit';
    gameState.selectedCard = null;
    gameState.selectedUnitPos = { r, c };

    calculateUnitActions(r, c, targetUnit);
    renderGrid();
    renderHand();
    return;
  }

  // 3. 체스 이동 실행
  const isMovable = gameState.movableCells.some(m => m.r === r && m.c === c);
  if (isMovable && gameState.selectedUnitPos) {
    const { r: sr, c: sc } = gameState.selectedUnitPos;
    const unit = gameState.grid[sr][sc];

    gameState.grid[r][c] = unit;
    gameState.grid[sr][sc] = null;

    soundManager.playDrum();
    logDuel(`🐎 [이동] ${unit.name} 무장이 (${r + 1}행 ${c + 1}열) 위치로 기동했습니다.`);

    clearSelection();
    renderGrid();
    renderHand();
    return;
  }

  // 4. 공격 실행
  const isAttackable = gameState.attackableCells.some(a => a.r === r && a.c === c);
  if (isAttackable && gameState.selectedUnitPos) {
    const { r: sr, c: sc } = gameState.selectedUnitPos;
    const attacker = gameState.grid[sr][sc];

    if (targetUnit && targetUnit.owner === 'enemy') {
      soundManager.playSwordClash();
      targetUnit.hp -= attacker.atk;
      logDuel(`💥 [공격] ${attacker.name} -> 적 ${targetUnit.name}에게 ${attacker.atk} 데미지!`);

      if (targetUnit.hp <= 0) {
        logDuel(`☠️ [파괴] 적 ${targetUnit.name} 부대가 파괴되었습니다!`);
        gameState.grid[r][c] = null;
      }
    } else if (r === 0) {
      // 적 군주 본체 타격
      soundManager.playSwordClash();
      gameState.enemyHp = Math.max(0, gameState.enemyHp - attacker.atk);
      logDuel(`⚡ [본체 타격!] ${attacker.name} 장수가 적 군주 본체에 ${attacker.atk} 데미지를 입혔습니다!`);

      if (gameState.enemyHp <= 0) {
        handleVictory();
        return;
      }
    }

    clearSelection();
    renderGrid();
    renderHand();
    updateUI();
    return;
  }

  clearSelection();
  renderGrid();
  renderHand();
}

function calculateUnitActions(r, c, unit) {
  gameState.movableCells = [];
  gameState.attackableCells = [];

  const range = unit.moveRange || 1;

  // 이동 가능 셀 (상하좌우 4방향)
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  dirs.forEach(([dr, dc]) => {
    for (let step = 1; step <= range; step++) {
      const nr = r + dr * step;
      const nc = c + dc * step;

      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
        if (!gameState.grid[nr][nc]) {
          gameState.movableCells.push({ r: nr, c: nc });
        } else {
          break; // 다른 유닛에 막힘
        }
      }
    }
  });

  // 공격 가능 셀 (적 유닛 위치 또는 행 0 적 HQ)
  dirs.forEach(([dr, dc]) => {
    const nr = r + dr * unit.attackRange;
    const nc = c + dc * unit.attackRange;

    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
      const target = gameState.grid[nr][nc];
      if (target && target.owner === 'enemy') {
        gameState.attackableCells.push({ r: nr, c: nc });
      }
    }
  });

  // 적 HQ(컴퓨터 본체) 타격 가능 여부 (행 0에 접했을 때)
  if (r === 0 || (r === 1 && unit.attackRange >= 2)) {
    gameState.attackableCells.push({ r: 0, c: c });
  }
}

function executeSpell(spellCard, r, c) {
  if (gameState.playerSp < spellCard.cost) {
    logDuel(`군량(SP)이 부족합니다! (필요: ${spellCard.cost})`);
    return;
  }

  const targetUnit = gameState.grid[r][c];

  if (targetUnit && targetUnit.owner === 'enemy') {
    gameState.playerSp -= spellCard.cost;
    soundManager.playGong();

    targetUnit.hp -= spellCard.power;
    logDuel(`🔥 [전술 주문] ${spellCard.name} 발동! 적 ${targetUnit.name}에게 ${spellCard.power} 피해!`);

    if (targetUnit.hp <= 0) {
      gameState.grid[r][c] = null;
    }

    gameState.playerHand = gameState.playerHand.filter(h => h !== spellCard);
    clearSelection();
    renderGrid();
    renderHand();
    updateUI();
  } else if (r === 0) {
    gameState.playerSp -= spellCard.cost;
    soundManager.playGong();

    gameState.enemyHp = Math.max(0, gameState.enemyHp - spellCard.power);
    logDuel(`🔥 [전술 주문] ${spellCard.name} 발동! 적 군주 본체에 ${spellCard.power} 피해!`);

    if (gameState.enemyHp <= 0) {
      handleVictory();
      return;
    }

    gameState.playerHand = gameState.playerHand.filter(h => h !== spellCard);
    clearSelection();
    renderGrid();
    renderHand();
    updateUI();
  } else {
    logDuel(`전술 주문은 적 유닛이나 적 본체(행 1)를 타겟으로 지정해야 합니다.`);
  }
}

function clearSelection() {
  gameState.selectedType = null;
  gameState.selectedCard = null;
  gameState.selectedUnitPos = null;
  gameState.movableCells = [];
  gameState.attackableCells = [];
}

// -------------------------------------------------------------
// 🎴 내 손패 렌더링
// -------------------------------------------------------------
function renderHand() {
  const container = document.getElementById('handCardsList');
  container.innerHTML = '';

  gameState.playerHand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'hand-card';

    if (gameState.selectedCard === card) {
      cardEl.classList.add('selected-card');
    }

    cardEl.innerHTML = `
      <div class="hand-card-cost">${card.cost}</div>
      <img class="hand-card-img" src="${card.img || './assets/guan_yu.svg'}" alt="${card.name}">
      <div class="hand-card-name">${card.name}</div>
      <div class="hand-card-desc">${card.desc}</div>
    `;

    cardEl.onclick = () => {
      if (!gameState.isPlayerTurn) return;
      gameState.selectedType = 'card';
      gameState.selectedCard = card;
      gameState.selectedUnitPos = null;
      gameState.movableCells = [];
      gameState.attackableCells = [];

      renderGrid();
      renderHand();
    };

    container.appendChild(cardEl);
  });
}

// -------------------------------------------------------------
// ⏭️ 턴 종료 & 컴퓨터 AI 턴 수행
// -------------------------------------------------------------
function endPlayerTurn() {
  if (!gameState.isPlayerTurn) return;

  gameState.isPlayerTurn = false;
  clearSelection();
  renderGrid();

  logDuel(`--- 턴 종료 ---`);
  logDuel(`🤖 컴퓨터 AI (${gameState.currentStage.bossName}) 턴 수행 중...`);

  setTimeout(processAiTurn, 1000);
}

function processAiTurn() {
  // 1. AI 전장에 있는 적 유닛들의 전진 & 공격
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const unit = gameState.grid[r][c];
      if (unit && unit.owner === 'enemy') {
        // 아군 유닛 또는 플레이어 HQ(행 4) 공격 시도
        if (r === 3 || r === 4) {
          // 아군 HQ 타격
          gameState.playerHp = Math.max(0, gameState.playerHp - unit.atk);
          logDuel(`💥 [적 AI 타격!] ${unit.name} 부대가 아군 본체를 공격하여 ${unit.atk} 피해!`);

          if (gameState.playerHp <= 0) {
            handleDefeat();
            return;
          }
        } else if (r < 4 && !gameState.grid[r + 1][c]) {
          // 전진
          gameState.grid[r + 1][c] = unit;
          gameState.grid[r][c] = null;
        }
      }
    }
  }

  // 2. AI 새로운 무장 소환 (행 0 또는 행 1의 빈 공간)
  const availableAiCardIds = gameState.currentStage.deck;
  const randomCardId = availableAiCardIds[Math.floor(Math.random() * availableAiCardIds.length)];

  const heroCard = HERO_CARDS.find(h => h.id === randomCardId);
  if (heroCard) {
    for (let c = 0; c < 5; c++) {
      if (!gameState.grid[0][c]) {
        const newEnemy = JSON.parse(JSON.stringify(heroCard));
        newEnemy.owner = 'enemy';
        newEnemy.hp = newEnemy.maxHp;
        gameState.grid[0][c] = newEnemy;
        logDuel(`🤖 [적 AI 소환] ${newEnemy.name} 장수를 (${c + 1}열)에 소환했습니다.`);
        break;
      }
    }
  }

  // 3. 턴 복귀 & 자원 획득
  setTimeout(() => {
    gameState.turnCount++;
    gameState.playerSp = Math.min(gameState.maxSp, gameState.playerSp + 2);

    // 내 손패 카드 1장 드로우 (최대 5장)
    if (gameState.playerHand.length < 5) {
      const randomHero = HERO_CARDS[Math.floor(Math.random() * HERO_CARDS.length)];
      gameState.playerHand.push(JSON.parse(JSON.stringify(randomHero)));
    }

    gameState.isPlayerTurn = true;
    updateUI();
    renderGrid();
    renderHand();
    logDuel(`--- 턴 ${gameState.turnCount} 시작 (아군 턴) ---`);
  }, 1000);
}

function handleVictory() {
  soundManager.playVictory();
  document.getElementById('resultTitle').textContent = `🏆 대 승 리 🏆`;
  document.getElementById('resultTitle').style.color = `#f59e0b`;
  document.getElementById('resultDesc').textContent = `적 ${gameState.currentStage.bossName}의 HQ를 격파하고 1:1 체스 대결에서 승리했습니다!`;
  document.getElementById('modalResult').classList.add('active');
}

function handleDefeat() {
  soundManager.playDefeat();
  document.getElementById('resultTitle').textContent = `💥 대 패 배 💥`;
  document.getElementById('resultTitle').style.color = `#ef4444`;
  document.getElementById('resultDesc').textContent = `아군 HQ가 적에게 함락되었습니다. 전술을 재정비하십시오!`;
  document.getElementById('modalResult').classList.add('active');
}

function logDuel(msg) {
  const box = document.getElementById('duelLogBox');
  const p = document.createElement('p');
  p.style.marginBottom = '4px';
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}
