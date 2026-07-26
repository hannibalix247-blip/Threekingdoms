// 삼국지 영웅전 메인 게임 엔진 (코에이풍 명장 갤러리 카드 & 등급별 필터 등용소)
import { 
  loginWithGoogle, 
  loginAsGuest, 
  logoutUser, 
  listenAuthState, 
  saveGameToCloud, 
  loadGameFromCloud 
} from "./firebase-config.js";

let currentUser = null;
let currentShopFilter = 'all';

let gameState = {
  playerFaction: null,
  currentTurnFaction: null,
  turnCount: 1,
  gold: 1000,
  food: 2000,
  cities: JSON.parse(JSON.stringify(CITIES)),
  recruitingHeroes: [],
  selectedCityId: null,
  pendingBattleCity: null,
  pendingIsDefensive: false,
  battle: null
};

window.selectFaction = selectFaction;
window.buyHero = buyHero;
window.playDuelRoundSimultaneous = playDuelRoundSimultaneous;
window.executeStage3Battle = executeStage3Battle;
window.closeModal = closeModal;
window.openLoginModal = openLoginModal;
window.confirmHeroSelect = confirmHeroSelect;
window.filterHeroShop = filterHeroShop;

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  window.addEventListener('resize', initCanvas);

  const btnStart = document.getElementById('btnStartGameTitle');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      soundManager.playDrum();
      document.getElementById('titleScreen').classList.add('hidden');
    });
  }

  document.getElementById('btnOpenShop').addEventListener('click', openHeroShop);
  document.getElementById('btnEndTurn').addEventListener('click', processEndTurn);
  document.getElementById('btnSaveGame').addEventListener('click', handleSaveGame);
  document.getElementById('btnLoadGame').addEventListener('click', handleLoadGame);

  document.getElementById('btnGoogleAuth').addEventListener('click', handleGoogleLogin);
  document.getElementById('btnGuestAuth').addEventListener('click', handleGuestLogin);
  document.getElementById('btnLogoutAuth').addEventListener('click', handleLogout);

  listenAuthState((user) => {
    if (user) {
      currentUser = user;
      updateUserUI(user);
    } else {
      handleGuestLogin();
    }
  });
});

function openLoginModal() {
  document.getElementById('modalAuth').classList.add('active');
}

function updateUserUI(user) {
  const nameEl = document.getElementById('userName');
  const avatarEl = document.getElementById('userAvatar');
  const logoutBtn = document.getElementById('btnLogoutAuth');

  if (user) {
    nameEl.textContent = user.displayName || (user.isAnonymous ? '익명 군주' : user.email);
    avatarEl.textContent = user.photoURL ? '👤' : (user.isAnonymous ? '👤' : '🌐');
    if (logoutBtn) logoutBtn.style.display = 'block';
  }
}

async function handleGoogleLogin() {
  const user = await loginWithGoogle();
  if (user) {
    currentUser = user;
    updateUserUI(user);
    closeModal('modalAuth');
    alert(`환영합니다, ${user.displayName || '군주'}님! 구글 계정이 연동되었습니다.`);
  }
}

async function handleGuestLogin() {
  const user = await loginAsGuest();
  currentUser = user;
  updateUserUI(user);
  closeModal('modalAuth');
}

async function handleLogout() {
  await logoutUser();
  currentUser = null;
  handleGuestLogin();
}

async function handleSaveGame() {
  if (!gameState.playerFaction) {
    alert("게임을 시작한 후 저장할 수 있습니다.");
    return;
  }

  const saveData = {
    playerFaction: gameState.playerFaction,
    gold: gameState.gold,
    food: gameState.food,
    turnCount: gameState.turnCount,
    cities: gameState.cities,
    recruitingHeroes: gameState.recruitingHeroes
  };

  const userId = currentUser ? currentUser.uid : 'guest';
  const result = await saveGameToCloud(userId, saveData);

  if (result.success) {
    soundManager.playVictory();
    alert(result.isLocal ? "💾 게임 진행 상황이 로컬 저장소에 저장되었습니다." : "☁️ 게임 진행 상황이 Firebase 클라우드에 성공적으로 저장되었습니다!");
  }
}

async function handleLoadGame() {
  const userId = currentUser ? currentUser.uid : 'guest';
  const data = await loadGameFromCloud(userId);

  if (!data) {
    alert("저장된 게임 데이터가 없습니다.");
    return;
  }

  gameState.playerFaction = data.playerFaction;
  gameState.gold = data.gold;
  gameState.food = data.food;
  gameState.turnCount = data.turnCount || 1;
  gameState.cities = data.cities;
  gameState.recruitingHeroes = data.recruitingHeroes || [];

  const faction = FACTIONS[gameState.playerFaction];
  if (faction) {
    document.getElementById('playerFactionBadge').textContent = faction.name;
    document.getElementById('playerFactionBadge').className = `faction-badge ${gameState.playerFaction}`;
    document.getElementById('factionRulerText').textContent = `군주: ${faction.ruler}`;
    document.getElementById('factionDescText').textContent = faction.description;
  }

  closeModal('modalFactionSelect');
  document.getElementById('titleScreen').classList.add('hidden');
  updateResourcesUI();
  renderHeroRoster();
  renderCityNodes();
  drawBoardMap();

  soundManager.playVictory();
  alert("📂 저장된 삼국지 영웅전 데이터를 성공적으로 불러왔습니다!");
}

function selectFaction(factionId) {
  gameState.playerFaction = factionId;
  gameState.currentTurnFaction = factionId;
  const faction = FACTIONS[factionId];

  const capitalCity = gameState.cities.find(c => c.name.includes(faction.capital));
  if (capitalCity) {
    capitalCity.owner = factionId;
    capitalCity.troops = 2000;
  }

  let defaultHero;
  if (factionId === 'shu') defaultHero = HEROES.find(h => h.id === 'guan_yu');
  else if (factionId === 'wei') defaultHero = HEROES.find(h => h.id === 'cao_cao');
  else defaultHero = HEROES.find(h => h.id === 'zhou_yu');

  if (defaultHero) {
    const copyHero = JSON.parse(JSON.stringify(defaultHero));
    gameState.recruitingHeroes.push(copyHero);
  }

  document.getElementById('playerFactionBadge').textContent = faction.name;
  document.getElementById('playerFactionBadge').className = `faction-badge ${factionId}`;
  document.getElementById('factionRulerText').textContent = `군주: ${faction.ruler}`;
  document.getElementById('factionDescText').textContent = faction.description;

  closeModal('modalFactionSelect');
  updateResourcesUI();
  renderHeroRoster();
  renderCityNodes();
  drawBoardMap();

  soundManager.playVictory();
}

function updateResourcesUI() {
  document.getElementById('resGold').textContent = gameState.gold.toLocaleString();
  document.getElementById('resFood').textContent = gameState.food.toLocaleString();

  const ownedCount = gameState.cities.filter(c => c.owner === gameState.playerFaction).length;
  document.getElementById('resCities').textContent = `${ownedCount} / ${gameState.cities.length}`;

  if (ownedCount >= gameState.cities.length) {
    document.getElementById('modalVictory').classList.add('active');
    soundManager.playVictory();
  }
}

function renderHeroRoster() {
  const container = document.getElementById('heroRoster');
  container.innerHTML = '';

  document.getElementById('heroCountText').textContent = `${gameState.recruitingHeroes.length}명`;

  gameState.recruitingHeroes.forEach(hero => {
    const hpPercent = Math.max(0, Math.round((hero.hp / hero.maxHp) * 100));
    const isHpDanger = hpPercent < 40;

    const chip = document.createElement('div');
    chip.className = `hero-chip rank-${hero.rank}`;
    chip.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <img class="hero-portrait-img" src="${hero.img}" alt="${hero.name}" onerror="this.src='${hero.fallbackImg || 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_Officer_Portrait.jpg/400px-Chinese_Officer_Portrait.jpg'}';">
        <div>
          <div><strong style="color: #f8fafc;">${hero.name}</strong> <span class="hero-chip-rank ${hero.rank}">${hero.rank}</span></div>
          <div style="font-size: 0.75rem; color: var(--gold-light);">⚔️${hero.war} | 🧠${hero.int}</div>
        </div>
      </div>
      <div class="hero-hp-container">
        <div class="hero-hp-bar">
          <div class="hp-fill ${isHpDanger ? 'danger' : ''}" style="width: ${hpPercent}%;"></div>
        </div>
        <div class="hp-text">HP ${hero.hp}/${hero.maxHp}</div>
      </div>
    `;
    container.appendChild(chip);
  });
}

function initCanvas() {
  const canvas = document.getElementById('boardCanvas');
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  drawBoardMap();
}

function drawBoardMap() {
  const canvas = document.getElementById('boardCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ROAD_CONNECTIONS.forEach(([fromId, toId]) => {
    const fromCity = gameState.cities.find(c => c.id === fromId);
    const toCity = gameState.cities.find(c => c.id === toId);

    if (fromCity && toCity) {
      const x1 = (fromCity.x / 100) * width;
      const y1 = (fromCity.y / 100) * height;
      const x2 = (toCity.x / 100) * width;
      const y2 = (toCity.y / 100) * height;

      const isPlayerPath = (fromCity.owner === gameState.playerFaction && toCity.owner === gameState.playerFaction);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = isPlayerPath ? 4 : 2;
      ctx.strokeStyle = isPlayerPath ? '#f59e0b' : 'rgba(148, 163, 184, 0.35)';
      if (!isPlayerPath) ctx.setLineDash([6, 6]);
      else ctx.setLineDash([]);
      ctx.stroke();
    }
  });

  renderCityNodes();
}

function renderCityNodes() {
  const layer = document.getElementById('mapNodesLayer');
  if (!layer) return;
  layer.innerHTML = '';

  gameState.cities.forEach(city => {
    const node = document.createElement('div');
    node.className = `city-node`;
    node.style.left = `${city.x}%`;
    node.style.top = `${city.y}%`;

    const isAdjacent = isCityAdjacentToPlayer(city.id);
    const isOwner = city.owner === gameState.playerFaction;

    if (!isOwner && isAdjacent) {
      node.classList.add('selectable');
    }

    const firstChar = city.name.charAt(0);
    node.innerHTML = `
      <div class="city-flag owner-${city.owner}">
        ${firstChar}
      </div>
      <div class="city-label">
        ${city.name}
        <div class="city-troops">🗡️ ${city.troops}</div>
      </div>
    `;

    node.addEventListener('click', () => onCityClick(city));
    layer.appendChild(node);
  });
}

function isCityAdjacentToPlayer(cityId) {
  const playerCityIds = gameState.cities.filter(c => c.owner === gameState.playerFaction).map(c => c.id);

  return ROAD_CONNECTIONS.some(([from, to]) => {
    if (from === cityId && playerCityIds.includes(to)) return true;
    if (to === cityId && playerCityIds.includes(from)) return true;
    return false;
  });
}

function onCityClick(city) {
  gameState.selectedCityId = city.id;
  soundManager.playGong();

  const container = document.getElementById('selectedCityBox');
  const isOwner = city.owner === gameState.playerFaction;
  const isAdjacent = isCityAdjacentToPlayer(city.id);

  const ownerFactionName = FACTIONS[city.owner]?.name || '중립 영주';

  container.innerHTML = `
    <div style="font-size: 1.1rem; font-weight: 700; color: var(--gold-light);">${city.name}</div>
    <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">지배 세력: ${ownerFactionName}</div>
    <div style="font-size: 0.85rem; color: #cbd5e1;">수성 병력: 🗡️ ${city.troops}명</div>
    <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">${city.desc}</div>
  `;

  if (!isOwner && isAdjacent) {
    const attackBtn = document.createElement('button');
    attackBtn.className = 'header-btn';
    attackBtn.style.cssText = 'width: 100%; margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #dc2626, #ef4444);';
    attackBtn.innerHTML = '⚔️ 출진하기 (선봉장 선택)';
    attackBtn.onclick = () => openHeroSelectModal(city, false);
    container.appendChild(attackBtn);
  } else if (isOwner) {
    const infoText = document.createElement('div');
    infoText.style.cssText = 'margin-top: 10px; font-size: 0.85rem; color: #34d399; text-align: center;';
    infoText.textContent = '아군이 점령한 거점입니다.';
    container.appendChild(infoText);
  } else {
    const infoText = document.createElement('div');
    infoText.style.cssText = 'margin-top: 10px; font-size: 0.8rem; color: #94a3b8; text-align: center;';
    infoText.textContent = '인접한 아군 거점이 없어 공격할 수 없습니다.';
    container.appendChild(infoText);
  }
}

// -------------------------------------------------------------
// 🪖 출전 장수 선택 갤러리 모달
// -------------------------------------------------------------
function openHeroSelectModal(targetCity, isDefensive = false) {
  gameState.pendingBattleCity = targetCity;
  gameState.pendingIsDefensive = isDefensive;

  const grid = document.getElementById('heroSelectGrid');
  grid.innerHTML = '';

  document.getElementById('heroSelectTitle').textContent = isDefensive ? `🛡️ ${targetCity.name} 수성 방어전 선봉장 선택 🛡️` : `⚔️ ${targetCity.name} 공성전 선봉장 선택 ⚔️`;

  gameState.recruitingHeroes.forEach((hero, index) => {
    const hpPercent = Math.max(0, Math.round((hero.hp / hero.maxHp) * 100));

    const card = document.createElement('div');
    card.className = 'hero-select-card';
    card.innerHTML = `
      <img class="portrait-large" src="${hero.img}" alt="${hero.name}" onerror="this.src='${hero.fallbackImg || 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_Officer_Portrait.jpg/400px-Chinese_Officer_Portrait.jpg'}';">
      <div class="hero-select-name">${hero.name}</div>
      <div class="hero-select-title">${hero.title}</div>
      
      <div class="stat-row">
        <span>⚔️ 무력: <b>${hero.war}</b></span>
        <span>🧠 지력: <b>${hero.int}</b></span>
      </div>

      <div class="hero-hp-container" style="width: 100%;">
        <div class="hero-hp-bar"><div class="hp-fill" style="width: ${hpPercent}%;"></div></div>
        <div class="hp-text">HP ${hero.hp} / ${hero.maxHp}</div>
      </div>

      <button class="btn-select-hero-action">⚔️ 선봉장으로 출전!</button>
    `;

    card.onclick = () => confirmHeroSelect(index);
    grid.appendChild(card);
  });

  document.getElementById('modalHeroSelect').classList.add('active');
}

function confirmHeroSelect(heroIndex) {
  const selectedHero = gameState.recruitingHeroes[heroIndex];
  if (!selectedHero) return;

  closeModal('modalHeroSelect');
  startBattle(gameState.pendingBattleCity, selectedHero, gameState.pendingIsDefensive);
}

// -------------------------------------------------------------
// 📜 인재 등용 창 (코에이 삼국지 갤러리 방식 & 필터링)
// -------------------------------------------------------------
function filterHeroShop(rankFilter) {
  currentShopFilter = rankFilter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderHeroShop();
}

function openHeroShop() {
  soundManager.playGong();
  renderHeroShop();
  document.getElementById('modalHeroShop').classList.add('active');
}

function renderHeroShop() {
  const grid = document.getElementById('heroShopGrid');
  grid.innerHTML = '';

  const filteredHeroes = HEROES.filter(h => {
    if (currentShopFilter === 'all') return true;
    return h.rank === currentShopFilter;
  });

  filteredHeroes.forEach(hero => {
    const isRecruited = gameState.recruitingHeroes.some(h => h.id === hero.id);
    const canAfford = gameState.gold >= hero.cost;

    const card = document.createElement('div');
    card.className = `hero-shop-card rank-${hero.rank}`;
    card.innerHTML = `
      <div class="shop-portrait-container">
        <img class="shop-portrait-img" src="${hero.img}" alt="${hero.name}" onerror="this.src='${hero.fallbackImg || 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_Officer_Portrait.jpg/400px-Chinese_Officer_Portrait.jpg'}';">
        <span class="shop-rank-badge ${hero.rank}">${hero.rank}급</span>
      </div>

      <div class="shop-hero-name">${hero.name}</div>
      <div class="shop-hero-title">${hero.title}</div>

      <div class="shop-stat-bar-box">
        <div class="shop-stat-item"><span>⚔️ 무력 수치</span><span class="shop-stat-value">${hero.war}</span></div>
        <div class="shop-stat-item"><span>🧠 지력 수치</span><span class="shop-stat-value">${hero.int}</span></div>
        <div class="shop-stat-item"><span>🛡️ 통솔 수치</span><span class="shop-stat-value">${hero.lead}</span></div>
        <div class="shop-stat-item"><span>❤️ 최대 체력</span><span class="shop-stat-value">${hero.maxHp} HP</span></div>
      </div>

      <div style="font-size: 0.72rem; color: #94a3b8; font-style: italic; margin-bottom: 12px; height: 32px;">"${hero.quote}"</div>

      <button class="buy-hero-btn" ${isRecruited || !canAfford ? 'disabled' : ''} onclick="buyHero('${hero.id}')">
        ${isRecruited ? '등용 완료' : `🪙 ${hero.cost} 금으로 명장 등용`}
      </button>
    `;
    grid.appendChild(card);
  });
}

function buyHero(heroId) {
  const hero = HEROES.find(h => h.id === heroId);
  if (!hero || gameState.gold < hero.cost) return;

  gameState.gold -= hero.cost;
  const copyHero = JSON.parse(JSON.stringify(hero));
  gameState.recruitingHeroes.push(copyHero);

  soundManager.playVictory();
  updateResourcesUI();
  renderHeroRoster();
  renderHeroShop();
}

function startBattle(targetCity, selectedHero, isDefensive = false) {
  const enemyWar = Math.floor(65 + Math.random() * 25);
  const enemyMaxHp = 100;
  
  const enemyHero = { 
    name: `${targetCity.name} 수성 장수`, 
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_Officer_Portrait.jpg/400px-Chinese_Officer_Portrait.jpg',
    fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_Officer_Portrait.jpg/400px-Chinese_Officer_Portrait.jpg', 
    war: enemyWar, 
    int: Math.floor(50 + Math.random() * 30), 
    lead: Math.floor(60 + Math.random() * 30),
    maxHp: enemyMaxHp,
    hp: enemyMaxHp
  };

  gameState.battle = {
    city: targetCity,
    isDefensive: isDefensive,
    playerHero: selectedHero,
    enemyHero: enemyHero,
    stage: 1,
    duelScore: 0,
    sp: Math.floor(selectedHero.int / 20) + 2,
    moraleBuff: 1.0,
    playerArmy: 1500 + selectedHero.lead * 5,
    enemyArmy: targetCity.troops
  };

  document.getElementById('battleCityTitle').textContent = isDefensive ? `🛡️ ${targetCity.name} 수성 방어전 🛡️` : `⚔️ ${targetCity.name} 공성전 ⚔️`;
  
  document.getElementById('playerDuelHeroImg').src = selectedHero.img;
  document.getElementById('playerDuelHeroName').textContent = selectedHero.name;
  document.getElementById('playerDuelWar').textContent = `무력: ${selectedHero.war} (${selectedHero.title})`;

  document.getElementById('enemyDuelHeroImg').src = enemyHero.img;
  document.getElementById('enemyDuelHeroName').textContent = enemyHero.name;
  document.getElementById('enemyDuelWar').textContent = `무력: ${enemyHero.war}`;

  updateHeroHpUI();
  resetRevealCards();
  switchBattleStageView(1);
  document.getElementById('modalBattle').classList.add('active');
  logBattle(`[전투 개시] 선봉장 [${selectedHero.name}] (HP:${selectedHero.hp}/${selectedHero.maxHp}) 이(가) 출전합니다.`);
}

function updateHeroHpUI() {
  const b = gameState.battle;
  if (!b) return;

  const pHpPercent = Math.max(0, Math.round((b.playerHero.hp / b.playerHero.maxHp) * 100));
  const eHpPercent = Math.max(0, Math.round((b.enemyHero.hp / b.enemyHero.maxHp) * 100));

  const pHpFill = document.getElementById('playerHpFill');
  const eHpFill = document.getElementById('enemyHpFill');

  if (pHpFill) pHpFill.style.width = `${pHpPercent}%`;
  if (eHpFill) eHpFill.style.width = `${eHpPercent}%`;

  document.getElementById('playerHpText').textContent = `HP: ${b.playerHero.hp} / ${b.playerHero.maxHp}`;
  document.getElementById('enemyHpText').textContent = `HP: ${b.enemyHero.hp} / ${b.enemyHero.maxHp}`;
}

function resetRevealCards() {
  const pCard = document.getElementById('playerChoiceReveal');
  const eCard = document.getElementById('enemyChoiceReveal');
  if (pCard && eCard) {
    pCard.className = 'reveal-card hidden';
    pCard.innerHTML = '<span style="font-size: 2rem;">❓</span><span>아군 선택</span>';
    eCard.className = 'reveal-card hidden';
    eCard.innerHTML = '<span style="font-size: 2rem;">❓</span><span>적군 선택</span>';
  }

  const pCard2 = document.getElementById('playerCardReveal');
  const eCard2 = document.getElementById('enemyCardReveal');
  if (pCard2 && eCard2) {
    pCard2.className = 'reveal-card hidden';
    pCard2.innerHTML = '<span style="font-size: 2rem;">🃏</span><span>아군 전술</span>';
    eCard2.className = 'reveal-card hidden';
    eCard2.innerHTML = '<span style="font-size: 2rem;">🃏</span><span>적군 전술</span>';
  }
}

function switchBattleStageView(stageNum) {
  gameState.battle.stage = stageNum;
  document.getElementById('viewStage1').style.display = stageNum === 1 ? 'block' : 'none';
  document.getElementById('viewStage2').style.display = stageNum === 2 ? 'block' : 'none';
  document.getElementById('viewStage3').style.display = stageNum === 3 ? 'block' : 'none';

  if (stageNum === 1) {
    document.getElementById('battleStageStep').textContent = '1단계 [난이도: 하]';
    document.getElementById('battleStageTitle').textContent = '일기토 (Single Combat) 동시 공개 심리전';
  } else if (stageNum === 2) {
    document.getElementById('battleStageStep').textContent = '2단계 [난이도: 중]';
    document.getElementById('battleStageTitle').textContent = '전술 카드 동시 제출 (Tactical Clash)';
    renderTacticalCards();
  } else if (stageNum === 3) {
    document.getElementById('battleStageStep').textContent = '3단계 [난이도: 상]';
    document.getElementById('battleStageTitle').textContent = '종합 전면전 (Full Battlefield)';
    updateBattleMeterUI();
  }
}

function playDuelRoundSimultaneous(playerChoice) {
  const choices = ['attack', 'defense', 'surprise'];
  const enemyChoice = choices[Math.floor(Math.random() * choices.length)];

  soundManager.playSwordClash();

  const choiceIcons = { attack: '🗡️ 맹공', defense: '🛡️ 견고', surprise: '⚡ 치명' };

  const pCard = document.getElementById('playerChoiceReveal');
  const eCard = document.getElementById('enemyChoiceReveal');

  pCard.className = 'reveal-card hidden';
  pCard.innerHTML = '<span>카드 제출 중...</span>';
  eCard.className = 'reveal-card hidden';
  eCard.innerHTML = '<span>카드 제출 중...</span>';

  setTimeout(() => {
    soundManager.playGong();

    pCard.className = 'reveal-card clash-anim';
    pCard.innerHTML = `<span style="font-size: 2.2rem;">${choiceIcons[playerChoice].split(' ')[0]}</span><span>${choiceIcons[playerChoice].split(' ')[1]}</span>`;

    eCard.className = 'reveal-card clash-anim';
    eCard.innerHTML = `<span style="font-size: 2.2rem;">${choiceIcons[enemyChoice].split(' ')[0]}</span><span>${choiceIcons[enemyChoice].split(' ')[1]}</span>`;

    let result = 'draw';
    if (
      (playerChoice === 'attack' && enemyChoice === 'surprise') ||
      (playerChoice === 'defense' && enemyChoice === 'attack') ||
      (playerChoice === 'surprise' && enemyChoice === 'defense')
    ) {
      result = 'win';
    } else if (playerChoice !== enemyChoice) {
      result = 'lose';
    }

    const b = gameState.battle;

    if (result === 'win') {
      b.duelScore += 1;
      b.moraleBuff += 0.2;
      b.sp += 2;
      const dmg = 25;
      b.enemyHero.hp = Math.max(0, b.enemyHero.hp - dmg);
      logBattle(`💥 [아군 승리!] 아군 (${choiceIcons[playerChoice]}) VS 적군 (${choiceIcons[enemyChoice]}) -> 적 장수 체력 -${dmg}!`);
    } else if (result === 'lose') {
      b.duelScore -= 1;
      const dmg = 25;
      b.playerHero.hp = Math.max(0, b.playerHero.hp - dmg);
      logBattle(`💥 [적군 승리!] 아군 (${choiceIcons[playerChoice]}) VS 적군 (${choiceIcons[enemyChoice]}) -> 아군 무장 체력 -${dmg}!`);
    } else {
      logBattle(`⚖️ [무승부!] 양측 무장이 팽팽히 맞섰습니다.`);
    }

    updateHeroHpUI();
    renderHeroRoster();

    if (b.playerHero.hp <= 0) {
      soundManager.playDefeat();
      logBattle(`☠️ [무장 전사!] ${b.playerHero.name} 장수가 치명상을 입고 사망(전열 이탈)했습니다!`);
      gameState.recruitingHeroes = gameState.recruitingHeroes.filter(h => h.name !== b.playerHero.name);
      renderHeroRoster();

      setTimeout(() => {
        alert(`☠️ [무장 전사] 아군 무장 ${b.playerHero.name}이(가) 전투 중 사망했습니다!`);
        closeModal('modalBattle');
      }, 1200);
      return;
    }

    setTimeout(() => {
      switchBattleStageView(2);
    }, 1500);
  }, 500);
}

function renderTacticalCards() {
  document.getElementById('currentManaText').textContent = gameState.battle.sp;
  const hand = document.getElementById('tacticalCardHand');
  hand.innerHTML = '';

  TACTICAL_CARDS.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'tactical-card';
    cardEl.innerHTML = `
      <div class="card-cost">⚡ ${card.cost}</div>
      <div class="card-icon">${card.icon}</div>
      <div class="card-title">${card.name}</div>
      <div class="card-desc">${card.desc}</div>
    `;

    cardEl.onclick = () => useTacticalCardSimultaneous(card);
    hand.appendChild(cardEl);
  });
}

function useTacticalCardSimultaneous(playerCard) {
  if (gameState.battle.sp < playerCard.cost) {
    logBattle(`전술 포인트(SP)가 부족합니다! (필요: ${playerCard.cost})`);
    return;
  }

  gameState.battle.sp -= playerCard.cost;
  soundManager.playGong();

  const enemyCard = TACTICAL_CARDS[Math.floor(Math.random() * TACTICAL_CARDS.length)];

  const pCard = document.getElementById('playerCardReveal');
  const eCard = document.getElementById('enemyCardReveal');

  pCard.className = 'reveal-card clash-anim';
  pCard.innerHTML = `<span style="font-size: 2rem;">${playerCard.icon}</span><span>${playerCard.name}</span>`;

  eCard.className = 'reveal-card clash-anim';
  eCard.innerHTML = `<span style="font-size: 2rem;">${enemyCard.icon}</span><span>${enemyCard.name}</span>`;

  const playerDmg = playerCard.power * 10;
  const enemyDmg = enemyCard.power * 8;

  const b = gameState.battle;
  b.enemyArmy = Math.max(0, b.enemyArmy - playerDmg);
  b.playerArmy = Math.max(0, b.playerArmy - enemyDmg);
  b.moraleBuff += 0.15;

  logBattle(`🔥 [전술 덱 Clash!] 아군 [${playerCard.name}] VS 적군 [${enemyCard.name}] 동시에 발동!`);

  document.getElementById('currentManaText').textContent = b.sp;

  setTimeout(() => {
    switchBattleStageView(3);
  }, 1600);
}

function updateBattleMeterUI() {
  const b = gameState.battle;
  document.getElementById('playerArmyLabel').textContent = `아군 병력: ${Math.round(b.playerArmy)}`;
  document.getElementById('enemyArmyLabel').textContent = `적군 병력: ${Math.round(b.enemyArmy)}`;
  document.getElementById('playerArmyBar').style.width = `50%`;
  document.getElementById('enemyArmyBar').style.width = `50%`;
}

function executeStage3Battle() {
  soundManager.playDrum();

  const b = gameState.battle;
  const playerPower = b.playerArmy * (b.playerHero.lead / 80) * b.moraleBuff;
  const enemyPower = b.enemyArmy * 0.9;

  const total = playerPower + enemyPower;
  const playerPercent = Math.round((playerPower / total) * 100);
  const enemyPercent = 100 - playerPercent;

  document.getElementById('playerArmyBar').style.width = `${playerPercent}%`;
  document.getElementById('enemyArmyBar').style.width = `${enemyPercent}%`;

  const isWin = playerPower > enemyPower;

  setTimeout(() => {
    if (isWin) {
      soundManager.playVictory();
      b.city.owner = gameState.playerFaction;
      b.city.troops = Math.floor(b.playerArmy * 0.7);

      const rewardGold = 400;
      const rewardFood = 500;
      gameState.gold += rewardGold;
      gameState.food += rewardFood;

      logBattle(`🎉 [전면전 대승리!] ${b.city.name} 거점을 점령했습니다! (보상: 🪙+${rewardGold}, 🌾+${rewardFood})`);
      updateResourcesUI();
      drawBoardMap();

      setTimeout(() => {
        closeModal('modalBattle');
      }, 1500);
    } else {
      soundManager.playDefeat();
      logBattle(`💥 [전면전 패배] 적의 방어선에 밀렸습니다.`);
      setTimeout(() => {
        closeModal('modalBattle');
      }, 1500);
    }
  }, 1000);
}

function logBattle(msg) {
  const box = document.getElementById('battleLogBox');
  const p = document.createElement('p');
  p.style.marginBottom = '4px';
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function processEndTurn() {
  soundManager.playGong();

  const ownedCities = gameState.cities.filter(c => c.owner === gameState.playerFaction);
  const incomeGold = ownedCities.length * 150;
  const incomeFood = ownedCities.length * 250;

  gameState.gold += incomeGold;
  gameState.food += incomeFood;

  gameState.recruitingHeroes.forEach(h => {
    h.hp = Math.min(h.maxHp, h.hp + 15);
  });

  updateResourcesUI();
  renderHeroRoster();

  const otherFactions = Object.keys(FACTIONS).filter(f => f !== gameState.playerFaction);

  runAiFactionTurn(otherFactions[0], () => {
    runAiFactionTurn(otherFactions[1], () => {
      gameState.turnCount++;
      renderCityNodes();
      drawBoardMap();
    });
  });
}

function runAiFactionTurn(factionId, onComplete) {
  const faction = FACTIONS[factionId];
  const overlay = document.getElementById('aiTurnOverlay');
  document.getElementById('aiTurnIcon').textContent = factionId === 'wei' ? '🐉' : (factionId === 'shu' ? '🍃' : '🔥');
  document.getElementById('aiTurnTitle').textContent = `${faction.name} 턴 진행 중...`;
  document.getElementById('aiTurnDesc').textContent = `${faction.ruler} 군주가 병력을 충원하고 영토 확장을 모색합니다.`;

  overlay.classList.add('active');

  setTimeout(() => {
    const aiCities = gameState.cities.filter(c => c.owner === factionId);
    aiCities.forEach(c => {
      c.troops = Math.min(c.maxTroops, c.troops + 200);
    });

    let attackedPlayerCity = null;
    if (aiCities.length > 0) {
      for (let aiCity of aiCities) {
        const adjacentCityIds = ROAD_CONNECTIONS.filter(([f, t]) => f === aiCity.id || t === aiCity.id).map(([f, t]) => f === aiCity.id ? t : f);
        const playerAdjacent = gameState.cities.find(c => adjacentCityIds.includes(c.id) && c.owner === gameState.playerFaction);
        const neutralAdjacent = gameState.cities.find(c => adjacentCityIds.includes(c.id) && c.owner === 'neutral');

        if (neutralAdjacent) {
          neutralAdjacent.owner = factionId;
          neutralAdjacent.troops = 1000;
          break;
        } else if (playerAdjacent && Math.random() < 0.4) {
          attackedPlayerCity = playerAdjacent;
          break;
        }
      }
    }

    overlay.classList.remove('active');

    if (attackedPlayerCity) {
      alert(`⚠️ [침공 경보!] ${faction.name} 군대가 아군의 [${attackedPlayerCity.name}] 거점을 침공했습니다! 방어전에 임하십시오.`);
      openHeroSelectModal(attackedPlayerCity, true);
    }

    if (onComplete) onComplete();
  }, 1200);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}
