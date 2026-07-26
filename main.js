// 요리왕, 기몌진 메인 애플리케이션 엔진 (로그인 무관 나만의 레시피북 전체 공개 지원)
import { 
  loginWithGoogle, 
  loginAsGuest, 
  logoutUser, 
  listenAuthState, 
  saveGameToCloud, 
  loadGameFromCloud 
} from "./firebase-config.js";

let currentUser = null;
let currentCategory = 'all';
let currentTab = 'recipes';
let activeTimer = null;
let currentQuoteIndex = 0;

// 날짜별 요리 다이어리 저장소
let chefDiaries = {
  '2026-07-26': { name: '투움바 파스타', icon: '🍝', rating: '⭐⭐⭐⭐⭐', memo: '꾸덕한 우유 소스와 고춧가루 조합이 대성공!' }
};

// 공유 커뮤니티 [나만의 레시피북] 기본 목록 (로그인 여부와 전혀 상관없이 누구나 전체 조회 가능)
let userRecipes = [
  {
    id: 'user_1',
    name: '엄마표 참치 마요 비빔밥',
    level: '★☆☆ (초간단)',
    time: '5분',
    servings: '1인분',
    img: './assets/spam_mayo.svg',
    icon: '🍱',
    desc: '5분 만에 쓱쓱 비벼 먹는 자취생 최고 간편식!',
    spoonTip: '참치 1캔 + 마요네즈 2스푼 + 간장 1스푼 + 참기름 0.5스푼',
    ingredients: ['밥 1공기', '참치캔 1개', '마요네즈 2스푼', '진간장 1스푼', '김가루 약간'],
    steps: [
      { step: 1, text: '따뜻한 밥 위에 기름을 뺀 참치 1캔을 올려줍니다.' },
      { step: 2, text: '간장 1스푼과 마요네즈 2스푼, 참기름 0.5스푼을 둘러줍니다.' },
      { step: 3, text: '김가루를 솔솔 뿌려 쓱쓱 비벼 먹으면 완성!' }
    ]
  },
  {
    id: 'user_2',
    name: '자취방 치즈 김치볶음밥',
    level: '★☆☆ (초간단)',
    time: '10분',
    servings: '1인분',
    img: './assets/kimchi_jjigae.svg',
    icon: '🍚',
    desc: '모짜렐라 치즈가 늘어나는 초간단 김치볶음밥!',
    spoonTip: '신김치 1컵 + 고추장 0.5스푼 + 설탕 0.5스푼 + 굴소스 1스푼',
    ingredients: ['밥 1공기', '잘게 썬 신김치 1컵', '피자 치즈 1컵', '고추장 0.5스푼', '참기름 1스푼'],
    steps: [
      { step: 1, text: '팬에 기름을 두르고 신김치와 고추장 0.5스푼, 설탕 0.5스푼을 달달 볶아줍니다.' },
      { step: 2, text: '밥 1공기를 넣고 주걱으로 펴가며 볶은 후, 한쪽으로 밥을 모읍니다.' },
      { step: 3, text: '빈 공간에 모짜렐라 치즈를 듬뿍 넣고 뚜껑을 덮어 치즈를 녹여주면 완성!' }
    ]
  }
];

// 로컬 스토리지에 저장된 유저 레시피가 있다면 불러오기
try {
  const savedUserRecipes = localStorage.getItem('gimyejin_user_recipes');
  if (savedUserRecipes) {
    userRecipes = JSON.parse(savedUserRecipes);
  }
} catch (e) {
  console.warn("로컬 사용자 레시피 로딩 오류:", e);
}

let selectedDiaryDate = '2026-07-26';
let calendarCurrentYear = 2026;
let calendarCurrentMonth = 6;

const CHEF_QUOTES = [
  "오늘 어떤 맛있는 요리를 만들어볼까요? 눌러보세요! 🍳",
  "나만의 레시피북 탭에서는 누구나 로그인 없이도 공유된 레시피를 보실 수 있어요! 📕",
  "나는야 쉐프 탭에서 오늘 내가 만든 요리를 달력에 예쁘게 기록해 보세요! 📅",
  "요리가 약간 탄 것 같다고요? 당황하지 말고 탄 부분을 잘라내고 참기름 한 방울! 💡",
  "밥숟가락 1스푼 = 15ml! 숟가락만 있으면 계량 스푼 없이도 간 맞추기 성공! 🥄",
  "냉장고 파먹기 버튼을 누르고 지금 남아있는 재료를 체크해 보세요! 🧊",
  "양파 써실 땐 찬물에 10분 담가두면 눈물이 쏙 들어간답니다! 🧅"
];

window.filterCategory = filterCategory;
window.switchMainTab = switchMainTab;
window.openFridgeModal = openFridgeModal;
window.openAddRecipeModal = openAddRecipeModal;
window.editUserRecipe = editUserRecipe;
window.deleteUserRecipe = deleteUserRecipe;
window.openLoginModal = openLoginModal;
window.closeModal = closeModal;
window.openRecipeDetail = openRecipeDetail;
window.findFridgeRecipes = findFridgeRecipes;
window.startRecipeTimer = startRecipeTimer;
window.nextChefQuote = nextChefQuote;
window.handleSaveUserRecipe = handleSaveUserRecipe;
window.handleSaveChefDiary = handleSaveChefDiary;
window.handleDeleteChefDiary = handleDeleteChefDiary;
window.changeMonth = changeMonth;

document.addEventListener('DOMContentLoaded', () => {
  renderRecipes();
  renderUserRecipes(); // 로그인 여부와 무관하게 모든 공유 게시글 즉시 공개 렌더링
  renderTips();
  initFridgeChecklist();

  document.getElementById('btnGoogleAuth').addEventListener('click', handleGoogleLogin);
  document.getElementById('btnGuestAuth').addEventListener('click', handleGuestLogin);

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

  if (user) {
    nameEl.textContent = user.displayName || (user.isAnonymous ? '익명 셰프' : user.email);
    avatarEl.textContent = user.photoURL ? '👤' : (user.isAnonymous ? '👤' : '🌐');
  }
}

async function handleGoogleLogin() {
  const user = await loginWithGoogle();
  if (user) {
    currentUser = user;
    updateUserUI(user);
    closeModal('modalAuth');
    alert(`환영합니다, ${user.displayName || '셰프'}님! 구글 계정이 연동되었습니다.`);
  }
}

async function handleGuestLogin() {
  const user = await loginAsGuest();
  currentUser = user;
  updateUserUI(user);
  closeModal('modalAuth');
}

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
  document.getElementById('btnTabUserRecipes').classList.toggle('active', tabName === 'userRecipes');
  document.getElementById('btnTabChefDiary').classList.toggle('active', tabName === 'chefDiary');
  document.getElementById('btnTabTips').classList.toggle('active', tabName === 'tips');

  document.getElementById('recipesMainView').style.display = tabName === 'recipes' ? 'block' : 'none';
  document.getElementById('categorySection').style.display = (tabName === 'recipes' || tabName === 'userRecipes') ? 'block' : 'none';
  document.getElementById('userRecipesMainView').style.display = tabName === 'userRecipes' ? 'block' : 'none';
  document.getElementById('chefDiaryMainView').style.display = tabName === 'chefDiary' ? 'block' : 'none';
  document.getElementById('tipsMainView').style.display = tabName === 'tips' ? 'block' : 'none';

  if (tabName === 'userRecipes') {
    renderUserRecipes(); // 탭 전환 시에도 로그인 여부 상관없이 100% 전체 공개
  } else if (tabName === 'chefDiary') {
    renderCalendar();
  }
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

  if (currentTab === 'userRecipes') renderUserRecipes();
  else renderRecipes();
}

function renderRecipes(recipesToRender = null) {
  const container = document.getElementById('recipeGridList');
  if (!container) return;
  container.innerHTML = '';

  const list = recipesToRender || RECIPES.filter(r => currentCategory === 'all' || r.category === currentCategory);

  list.forEach(r => {
    const card = createRecipeCard(r, false);
    container.appendChild(card);
  });
}

// 로그인 여부와 관계없이 나만의 레시피북 전체 게시글 누구나 공개 렌더링
function renderUserRecipes() {
  const container = document.getElementById('userRecipeGridList');
  if (!container) return;
  container.innerHTML = '';

  if (userRecipes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
        <div style="font-size: 3rem; margin-bottom: 10px;">📕</div>
        <div>아직 공유된 나만의 레시피가 없습니다. 첫 번째 레시피를 공유해 보세요!</div>
      </div>
    `;
    return;
  }

  userRecipes.forEach(r => {
    const card = createRecipeCard(r, true);
    container.appendChild(card);
  });
}

function createRecipeCard(r, isUserShare = false) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.innerHTML = `
    <div class="recipe-img-box">
      <img class="recipe-img" src="${r.img}" alt="${r.name}">
      <span class="recipe-badge-level">${r.level}</span>
      ${isUserShare ? `
        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 10;">
          <button onclick="event.stopPropagation(); editUserRecipe('${r.id}')" style="background: rgba(15,23,42,0.85); color: #fff; border: 1px solid #38bdf8; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; cursor: pointer; font-weight: 700;">✏️ 수정</button>
          <button onclick="event.stopPropagation(); deleteUserRecipe('${r.id}')" style="background: rgba(220,38,38,0.85); color: #fff; border: none; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; cursor: pointer; font-weight: 700;">🗑️ 삭제</button>
        </div>
      ` : ''}
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
  return card;
}

function openAddRecipeModal(editRecipe = null) {
  const titleEl = document.getElementById('recipeModalTitle');
  const editIdEl = document.getElementById('recipeEditingId');
  const btnSubmit = document.getElementById('btnSubmitRecipe');

  if (editRecipe) {
    titleEl.textContent = `✏️ 나만의 레시피 수정하기`;
    editIdEl.value = editRecipe.id;
    btnSubmit.innerHTML = `✏️ 레시피 수정 완료`;

    document.getElementById('recipeInputName').value = editRecipe.name;
    document.getElementById('recipeInputIcon').value = editRecipe.icon;
    document.getElementById('recipeInputTime').value = editRecipe.time;
    document.getElementById('recipeInputImg').value = editRecipe.img;
    document.getElementById('recipeInputDesc').value = editRecipe.desc;
    document.getElementById('recipeInputSpoonTip').value = editRecipe.spoonTip;
    document.getElementById('recipeInputIngredients').value = editRecipe.ingredients.join(', ');
    document.getElementById('recipeInputSteps').value = editRecipe.steps.map(s => s.text).join('\n');
  } else {
    titleEl.textContent = `📕 나만의 레시피 올리기`;
    editIdEl.value = '';
    btnSubmit.innerHTML = `🚀 레시피 저장하기`;

    document.getElementById('addRecipeForm').reset();
    document.getElementById('recipeInputIcon').value = '🍳';
  }

  document.getElementById('modalAddRecipe').classList.add('active');
}

function editUserRecipe(recipeId) {
  const target = userRecipes.find(r => r.id === recipeId);
  if (target) {
    openAddRecipeModal(target);
  }
}

function deleteUserRecipe(recipeId) {
  if (confirm("정말 이 레시피를 삭제하시겠습니까?")) {
    userRecipes = userRecipes.filter(r => r.id !== recipeId);
    saveUserRecipesToLocal();
    renderUserRecipes();
    alert("🗑️ 해당 레시피가 성공적으로 삭제되었습니다.");
  }
}

function handleSaveUserRecipe(e) {
  e.preventDefault();

  const editingId = document.getElementById('recipeEditingId').value;
  const name = document.getElementById('recipeInputName').value;
  const icon = document.getElementById('recipeInputIcon').value || '🍳';
  const time = document.getElementById('recipeInputTime').value || '15분';
  const img = document.getElementById('recipeInputImg').value;
  const desc = document.getElementById('recipeInputDesc').value;
  const spoonTip = document.getElementById('recipeInputSpoonTip').value;
  const ingredientsStr = document.getElementById('recipeInputIngredients').value;
  const stepsStr = document.getElementById('recipeInputSteps').value;

  const ingredients = ingredientsStr.split(',').map(s => s.trim()).filter(Boolean);
  const steps = stepsStr.split('\n').map((s, idx) => ({ step: idx + 1, text: s.trim() })).filter(s => s.text);

  if (editingId) {
    const target = userRecipes.find(r => r.id === editingId);
    if (target) {
      target.name = name;
      target.icon = icon;
      target.time = time;
      target.img = img;
      target.desc = desc;
      target.spoonTip = spoonTip;
      target.ingredients = ingredients;
      target.steps = steps;
    }
    alert("✏️ 레시피가 성공적으로 수정되었습니다!");
  } else {
    const newRecipe = {
      id: `user_${Date.now()}`,
      name,
      level: '★☆☆ (초보)',
      time,
      servings: '1~2인분',
      img,
      icon,
      desc,
      spoonTip,
      ingredients,
      steps
    };
    userRecipes.unshift(newRecipe);
    alert("🎉 나만의 레시피가 성공적으로 공개 등록되었습니다! 누구나 자유롭게 이 게시글을 보실 수 있습니다.");
  }

  saveUserRecipesToLocal();
  closeModal('modalAddRecipe');
  renderUserRecipes();
}

function saveUserRecipesToLocal() {
  try {
    localStorage.setItem('gimyejin_user_recipes', JSON.stringify(userRecipes));
  } catch (e) {
    console.warn("로컬 사용자 레시피 저장 실패:", e);
  }
}

// -------------------------------------------------------------
// 📅 마이페이지 [나는야 쉐프] 달력 다이어리
// -------------------------------------------------------------
function changeMonth(delta) {
  calendarCurrentMonth += delta;
  if (calendarCurrentMonth < 0) {
    calendarCurrentMonth = 11;
    calendarCurrentYear--;
  } else if (calendarCurrentMonth > 11) {
    calendarCurrentMonth = 0;
    calendarCurrentYear++;
  }
  renderCalendar();
}

function renderCalendar() {
  const monthTitle = document.getElementById('calendarMonthTitle');
  if (monthTitle) {
    monthTitle.textContent = `${calendarCurrentYear}년 ${calendarCurrentMonth + 1}월 - 나는야 쉐프 요리 다이어리`;
  }

  const grid = document.getElementById('calendarDaysGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const firstDay = new Date(calendarCurrentYear, calendarCurrentMonth, 1).getDay();
  const lastDate = new Date(calendarCurrentYear, calendarCurrentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.style.background = '#f1f5f9';
    empty.style.borderRadius = '14px';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${calendarCurrentYear}-${String(calendarCurrentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const diary = chefDiaries[dateStr];

    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    cell.innerHTML = `
      <div class="day-number ${dateStr === '2026-07-26' ? 'today' : ''}">${day}</div>
      ${diary ? `
        <div class="diary-badge">
          <span>${diary.icon}</span>
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${diary.name}</span>
        </div>
      ` : ''}
    `;

    cell.onclick = () => openAddDiaryModal(dateStr);
    grid.appendChild(cell);
  }
}

function openAddDiaryModal(dateStr) {
  selectedDiaryDate = dateStr;
  document.getElementById('diaryModalDateTitle').textContent = `📅 ${dateStr} 요리 다이어리`;

  const existing = chefDiaries[dateStr];
  const btnDelete = document.getElementById('btnDeleteDiary');

  if (existing) {
    document.getElementById('diaryInputName').value = existing.name;
    document.getElementById('diaryInputIcon').value = existing.icon;
    document.getElementById('diaryInputRating').value = existing.rating;
    document.getElementById('diaryInputMemo').value = existing.memo;
    if (btnDelete) btnDelete.style.display = 'block';
  } else {
    document.getElementById('diaryInputName').value = '';
    document.getElementById('diaryInputMemo').value = '';
    if (btnDelete) btnDelete.style.display = 'none';
  }

  document.getElementById('modalAddDiary').classList.add('active');
}

function handleSaveChefDiary(e) {
  e.preventDefault();

  const name = document.getElementById('diaryInputName').value;
  const icon = document.getElementById('diaryInputIcon').value;
  const rating = document.getElementById('diaryInputRating').value;
  const memo = document.getElementById('diaryInputMemo').value;

  chefDiaries[selectedDiaryDate] = { name, icon, rating, memo };

  closeModal('modalAddDiary');
  renderCalendar();
  alert(`📅 ${selectedDiaryDate} 날짜에 만든 요리가 저장되었습니다!`);
}

function handleDeleteChefDiary() {
  if (confirm(`정말 ${selectedDiaryDate} 날짜의 요리 기록을 삭제하시겠습니까?`)) {
    delete chefDiaries[selectedDiaryDate];
    closeModal('modalAddDiary');
    renderCalendar();
    alert("🗑️ 해당 날짜의 요리 다이어리가 삭제되었습니다.");
  }
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
