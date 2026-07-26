// 요리왕, 기몌진 메인 애플리케이션 엔진 (기몌진 셰프 말풍선 인터랙션 포함)

let currentCategory = 'all';
let currentTab = 'recipes';
let activeTimer = null;
let currentQuoteIndex = 0;

const CHEF_QUOTES = [
  "오늘 어떤 맛있는 요리를 만들어볼까요? 눌러보세요! 🍳",
  "요리가 약간 탄 것 같다고요? 당황하지 말고 탄 부분을 잘라내고 참기름 한 방울! 💡",
  "밥숟가락 1스푼 = 15ml! 숟가락만 있으면 계량 스푼 없이도 간 맞추기 성공! 🥄",
  "냉장고 파먹기 버튼을 누르고 지금 남아있는 재료를 체크해 보세요! 🧊",
  "양파 써실 땐 찬물에 10분 담가두면 눈물이 쏙 들어간답니다! 🧅",
  "찌개가 짜면 양파나 무를 더 넣고, 싱거우면 국간장 0.5스푼! 🍲",
  "오늘도 맛있는 한 끼 먹고 힘내세요! 기몌진이 항상 응원합니다 🧡"
];

window.filterCategory = filterCategory;
window.switchMainTab = switchMainTab;
window.openFridgeModal = openFridgeModal;
window.closeModal = closeModal;
window.openRecipeDetail = openRecipeDetail;
window.findFridgeRecipes = findFridgeRecipes;
window.startRecipeTimer = startRecipeTimer;
window.nextChefQuote = nextChefQuote;

document.addEventListener('DOMContentLoaded', () => {
  renderRecipes();
  renderTips();
  initFridgeChecklist();
});

function nextChefQuote() {
  currentQuoteIndex = (currentQuoteIndex + 1) % CHEF_QUOTES.length;
  const quoteEl = document.getElementById('chefQuoteText');
  if (quoteEl) {
    quoteEl.style.opacity = 0;
    setTimeout(() => {
      quoteEl.textContent = `"${CHEF_QUOTES[currentQuoteIndex]}"`;
      quoteEl.style.opacity = 1;
    }, 150);
  }
}

function switchMainTab(tabName) {
  currentTab = tabName;

  document.getElementById('btnTabRecipes').classList.toggle('active', tabName === 'recipes');
  document.getElementById('btnTabTips').classList.toggle('active', tabName === 'tips');

  document.getElementById('recipesMainView').style.display = tabName === 'recipes' ? 'block' : 'none';
  document.getElementById('categorySection').style.display = tabName === 'recipes' ? 'block' : 'none';
  document.getElementById('tipsMainView').style.display = tabName === 'tips' ? 'block' : 'none';
}

function filterCategory(catId) {
  currentCategory = catId;

  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.remove('active');
  });
  const activeCard = document.getElementById(`cat_${catId}`);
  if (activeCard) activeCard.classList.add('active');

  const catObj = CATEGORIES.find(c => c.id === catId);
  document.getElementById('currentCategoryLabel').textContent = catObj ? `${catObj.name} 레시피` : '전체 추천 레시피';

  renderRecipes();
}

function renderRecipes(recipesToRender = null) {
  const container = document.getElementById('recipeGridList');
  if (!container) return;
  container.innerHTML = '';

  const list = recipesToRender || RECIPES.filter(r => currentCategory === 'all' || r.category === currentCategory);

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🍳</div>
        <div>해당 재료로 만들 수 있는 레시피를 찾는 중입니다!</div>
      </div>
    `;
    return;
  }

  list.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="recipe-img-box">
        <img class="recipe-img" src="${r.img}" alt="${r.name}">
        <span class="recipe-badge-level">${r.level}</span>
      </div>
      <div class="recipe-info-body">
        <div class="recipe-title">${r.icon} ${r.name}</div>
        <div class="recipe-desc">${r.desc}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;">
          ⏱️ 조리시간: <b>${r.time}</b> | 👨‍👩‍👧 ${r.servings}
        </div>
        <div class="spoon-cheat-box">
          🥄 밥숟가락 계량 팁: ${r.spoonTip.split('+')[0]}...
        </div>
      </div>
    `;

    card.onclick = () => openRecipeDetail(r);
    container.appendChild(card);
  });
}

function renderTips() {
  const container = document.getElementById('ingredientTipsGrid');
  if (!container) return;
  container.innerHTML = '';

  INGREDIENT_TIPS.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tip-card';
    card.innerHTML = `
      <div class="tip-card-header">
        <div class="tip-icon-box">${t.icon}</div>
        <div>
          <div class="tip-title">${t.name}</div>
          <span style="font-size: 0.78rem; background: #e2e8f0; padding: 2px 8px; border-radius: 12px; color: #475569;">${t.category}</span>
        </div>
      </div>

      <div class="tip-content-block">
        <strong style="color: #c2410c;">✂️ 손질 & 썰기 꿀팁:</strong><br>
        ${t.cutTip}
      </div>

      <div class="tip-content-block" style="background: #f0fdf4;">
        <strong style="color: #047857;">🧊 싱싱한 보관법:</strong><br>
        ${t.keepTip}
      </div>
    `;
    container.appendChild(card);
  });
}

// -------------------------------------------------------------
// 🧊 냉장고 파먹기 재료 체크리스트 & 검색
// -------------------------------------------------------------
const COMMON_INGREDIENTS = [
  '돼지고기', '차돌박이', '스팸', '새우', '계란', '두부', 
  '신김치', '대파', '양파', '청양고추', '애호박', '떡볶이 떡', '어묵', '파스타면'
];

function initFridgeChecklist() {
  const container = document.getElementById('fridgeIngredientChecklist');
  if (!container) return;
  container.innerHTML = '';

  COMMON_INGREDIENTS.forEach(ing => {
    const label = document.createElement('label');
    label.style.cssText = `
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      cursor: pointer;
    `;
    label.innerHTML = `
      <input type="checkbox" value="${ing}" class="fridge-checkbox">
      <span>${ing}</span>
    `;
    container.appendChild(label);
  });
}

function openFridgeModal() {
  document.getElementById('modalFridge').classList.add('active');
}

function findFridgeRecipes() {
  const checkedNodes = document.querySelectorAll('.fridge-checkbox:checked');
  const selectedIngs = Array.from(checkedNodes).map(n => n.value);

  if (selectedIngs.length === 0) {
    alert("냉장고에 있는 재료를 1개 이상 선택해 주세요!");
    return;
  }

  const matchedRecipes = RECIPES.filter(r => {
    return selectedIngs.some(ing => r.ingredients.some(ri => ri.includes(ing)));
  });

  closeModal('modalFridge');
  switchMainTab('recipes');
  renderRecipes(matchedRecipes);
  alert(`🎉 선택하신 재료로 조리 가능한 ${matchedRecipes.length}개의 맞춤 레시피를 찾았습니다!`);
}

// -------------------------------------------------------------
// ⏱️ 단계별 상세 레시피 모달 & 조리 타이머
// -------------------------------------------------------------
function openRecipeDetail(recipe) {
  document.getElementById('detailImg').src = recipe.img;
  document.getElementById('detailBadge').textContent = recipe.level;
  document.getElementById('detailTitle').textContent = `${recipe.icon} ${recipe.name}`;
  document.getElementById('detailDesc').textContent = recipe.desc;
  document.getElementById('detailSpoonTip').innerHTML = `🥄 <b>기몌진의 밥숟가락 계량 팁:</b><br>${recipe.spoonTip}`;

  // 재료
  const ingContainer = document.getElementById('detailIngredients');
  ingContainer.innerHTML = '';
  recipe.ingredients.forEach(ing => {
    const chip = document.createElement('span');
    chip.style.cssText = `
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.85rem;
      color: #334155;
      font-weight: 500;
    `;
    chip.textContent = ing;
    ingContainer.appendChild(chip);
  });

  // 단계별 순서 (Steps)
  const stepsContainer = document.getElementById('detailSteps');
  stepsContainer.innerHTML = '';

  recipe.steps.forEach(s => {
    const stepEl = document.createElement('div');
    stepEl.className = 'recipe-step-item';
    stepEl.innerHTML = `
      <div>
        <strong style="color: var(--orange-dark);">Step ${s.step}.</strong> ${s.text}
      </div>
      ${s.timer ? `<button class="timer-btn" onclick="startRecipeTimer(${s.timer}, this)">⏱️ ${Math.floor(s.timer / 60)}분 타이머</button>` : ''}
    `;
    stepsContainer.appendChild(stepEl);
  });

  document.getElementById('modalRecipeDetail').classList.add('active');
}

function startRecipeTimer(seconds, btnEl) {
  if (activeTimer) clearInterval(activeTimer);

  let timeLeft = seconds;
  btnEl.disabled = true;

  activeTimer = setInterval(() => {
    timeLeft--;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    btnEl.textContent = `⏱️ ${min}:${sec < 10 ? '0' : ''}${sec} 남음`;

    if (timeLeft <= 0) {
      clearInterval(activeTimer);
      btnEl.textContent = '🔔 시간 완료!';
      btnEl.style.background = '#10b981';
      alert("⏰ 조리 시간이 완료되었습니다!");
    }
  }, 1000);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
