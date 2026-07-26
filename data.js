// 삼국지 영웅전 게임 데이터 정의 (통일된 삼국지 인시그니아 일러스트 & HP 체력)

// 통일된 삼국지 무장 수묵화/일러스트 SVG Data URI 생성 함수
function generateHeroPortraitSVG(name, factionColor, mainIcon, bgGradient) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad_${name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}"/>
        <stop offset="100%" stop-color="${bgGradient[1]}"/>
      </linearGradient>
      <radialGradient id="aura_${name}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${factionColor}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" rx="20" fill="url(#grad_${name})"/>
    <circle cx="100" cy="100" r="80" fill="url(#aura_${name})"/>
    <circle cx="100" cy="85" r="55" fill="none" stroke="${factionColor}" stroke-width="4" stroke-dasharray="8,4"/>
    <text x="100" y="102" font-family="'Noto Serif KR', serif" font-size="52" text-anchor="middle" dominant-baseline="middle" fill="#ffffff">${mainIcon}</text>
    <rect x="20" y="148" width="160" height="36" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="2"/>
    <text x="100" y="172" font-family="'Noto Serif KR', serif" font-size="20" font-weight="900" text-anchor="middle" fill="#fef08a">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const FACTIONS = {
  wei: {
    id: 'wei',
    name: '위 (魏)',
    ruler: '조조',
    color: '#2563eb',
    lightColor: '#60a5fa',
    accentColor: '#1d4ed8',
    description: '풍부한 병력 회복량과 다수의 인재 보유 (매 턴 군량/병력 보급 +20%)',
    capital: '허창',
    bgGradient: 'linear-gradient(135deg, #1e293b, #1e40af)'
  },
  shu: {
    id: 'shu',
    name: '촉 (蜀)',
    ruler: '유비',
    color: '#059669',
    lightColor: '#34d399',
    accentColor: '#047857',
    description: '장수의 일기토 무력 보정 +15% 및 높은 사기 유지력',
    capital: '성도',
    bgGradient: 'linear-gradient(135deg, #064e3b, #047857)'
  },
  wu: {
    id: 'wu',
    name: '오 (吳)',
    ruler: '손권',
    color: '#dc2626',
    lightColor: '#f87171',
    accentColor: '#b91c1c',
    description: '강가 요충지 전투 시 전투력 +25% 및 수군 전용 보너스',
    capital: '건업',
    bgGradient: 'linear-gradient(135deg, #7f1d1d, #b91c1c)'
  }
};

const CITIES = [
  { id: 'luoyang', name: '낙양 (洛陽)', x: 48, y: 38, owner: 'neutral', troops: 1200, maxTroops: 2500, isWater: false, desc: '중원의 중심이자 옛 황제의 수도' },
  { id: 'xuchang', name: '허창 (許昌)', x: 56, y: 44, owner: 'wei', troops: 1500, maxTroops: 3000, isWater: false, desc: '위나라 조조의 근거지' },
  { id: 'ye', name: '업 (鄴)', x: 57, y: 26, owner: 'wei', troops: 1200, maxTroops: 2500, isWater: false, desc: '기주의 요충지' },
  { id: 'xiapi', name: '하비 (下邳)', x: 68, y: 40, owner: 'neutral', troops: 1000, maxTroops: 2000, isWater: false, desc: '서주의 전장' },
  { id: 'changan', name: '장안 (長安)', x: 36, y: 36, owner: 'wei', troops: 1400, maxTroops: 2800, isWater: false, desc: '관중의 서쪽 요새' },
  { id: 'hanzhong', name: '한중 (漢中)', x: 30, y: 48, owner: 'neutral', troops: 1000, maxTroops: 2200, isWater: false, desc: '익주로 통하는 관문' },
  { id: 'chengdu', name: '성도 (成都)', x: 22, y: 62, owner: 'shu', troops: 1500, maxTroops: 3000, isWater: false, desc: '촉한 유비의 수도' },
  { id: 'jingzhou', name: '형주 (荊州)', x: 45, y: 65, owner: 'shu', troops: 1200, maxTroops: 2500, isWater: true, desc: '천하 삼분의 격전지' },
  { id: 'xiangyang', name: '양양 (襄陽)', x: 46, y: 52, owner: 'wei', troops: 1100, maxTroops: 2200, isWater: true, desc: '형북의 전진기지' },
  { id: 'jianye', name: '건업 (建業)', x: 74, y: 56, owner: 'wu', troops: 1500, maxTroops: 3000, isWater: true, desc: '오나라 손권의 수도' },
  { id: 'wujun', name: '오군 (吳郡)', x: 82, y: 64, owner: 'wu', troops: 1100, maxTroops: 2200, isWater: true, desc: '강동 손가의 터전' },
  { id: 'chaisang', name: '시상 (柴桑)', x: 62, y: 66, owner: 'wu', troops: 1200, maxTroops: 2500, isWater: true, desc: '적벽 부근 강동 수군 요새' }
];

const ROAD_CONNECTIONS = [
  ['changan', 'luoyang'],
  ['changan', 'hanzhong'],
  ['luoyang', 'ye'],
  ['luoyang', 'xuchang'],
  ['luoyang', 'xiangyang'],
  ['ye', 'xiapi'],
  ['xuchang', 'xiapi'],
  ['xuchang', 'xiangyang'],
  ['xiapi', 'jianye'],
  ['hanzhong', 'chengdu'],
  ['hanzhong', 'jingzhou'],
  ['chengdu', 'jingzhou'],
  ['xiangyang', 'jingzhou'],
  ['jingzhou', 'chaisang'],
  ['jianye', 'wujun'],
  ['jianye', 'chaisang'],
  ['chaisang', 'wujun']
];

// 통일된 삼국지 일러스트 화풍의 영웅 20여 명 데이터 정의
const HEROES = [
  // S급
  { 
    id: 'lu_bu', name: '여포', avatar: '🐉', 
    img: generateHeroPortraitSVG('여포', '#f59e0b', '🐉', ['#451a03', '#9a3412']),
    rank: 'S', cost: 1000, war: 100, int: 26, lead: 88, maxHp: 120, hp: 120, faction: 'neutral', troopType: 'cavalry', title: '천하무쌍 (天下無雙)', quote: '누가 감히 나 여봉선을 가로막는가!' 
  },
  { 
    id: 'guan_yu', name: '관우', avatar: '🗡️', 
    img: generateHeroPortraitSVG('관우', '#10b981', '🗡️', ['#064e3b', '#047857']),
    rank: 'S', cost: 1000, war: 97, int: 79, lead: 95, maxHp: 115, hp: 115, faction: 'shu', troopType: 'infantry', title: '무성 (武聖)', quote: '내 청룡언월도가 울부짖는다!' 
  },
  { 
    id: 'zhang_fei', name: '장비', avatar: '🦁', 
    img: generateHeroPortraitSVG('장비', '#059669', '🦁', ['#022c22', '#065f46']),
    rank: 'S', cost: 950, war: 98, int: 30, lead: 86, maxHp: 115, hp: 115, faction: 'shu', troopType: 'cavalry', title: '만인적 (萬人敵)', quote: '장판교 아래 장익덕이 있노라!' 
  },
  { 
    id: 'zhuge_liang', name: '제갈량', avatar: '🪶', 
    img: generateHeroPortraitSVG('제갈량', '#34d399', '🪶', ['#064e3b', '#0d9488']),
    rank: 'S', cost: 1000, war: 38, int: 100, lead: 98, maxHp: 90, hp: 90, faction: 'shu', troopType: 'archer', title: '와룡 (臥龍)', quote: '동풍을 불러오겠나이다.' 
  },
  { 
    id: 'zhao_yun', name: '조운', avatar: '⚡', 
    img: generateHeroPortraitSVG('조운', '#10b981', '⚡', ['#064e3b', '#0284c7']),
    rank: 'S', cost: 980, war: 96, int: 76, lead: 92, maxHp: 110, hp: 110, faction: 'shu', troopType: 'cavalry', title: '상산 조자룡', quote: '주군을 굳건히 지키겠나이다!' 
  },
  { 
    id: 'sima_yi', name: '사마의', avatar: '🐅', 
    img: generateHeroPortraitSVG('사마의', '#3b82f6', '🐅', ['#1e1b4b', '#1e40af']),
    rank: 'S', cost: 980, war: 63, int: 98, lead: 97, maxHp: 95, hp: 95, faction: 'wei', troopType: 'archer', title: '총호 (冢虎)', quote: '천하의 향방은 참는 자의 것이다.' 
  },
  { 
    id: 'zhou_yu', name: '주유', avatar: '🔥', 
    img: generateHeroPortraitSVG('주유', '#ef4444', '🔥', ['#450a0a', '#b91c1c']),
    rank: 'S', cost: 950, war: 71, int: 96, lead: 95, maxHp: 95, hp: 95, faction: 'wu', troopType: 'navy', title: '미주랑 (美周郞)', quote: '적벽의 불꽃으로 쳐부수리라!' 
  },

  // A급
  { 
    id: 'zhang_liao', name: '장료', avatar: '🦅', 
    img: generateHeroPortraitSVG('장료', '#60a5fa', '🦅', ['#1e293b', '#2563eb']),
    rank: 'A', cost: 650, war: 92, int: 78, lead: 93, maxHp: 105, hp: 105, faction: 'wei', troopType: 'cavalry', title: '료래료래', quote: '합비의 신화가 또다시 시작된다.' 
  },
  { 
    id: 'xiahoudun', name: '하후돈', avatar: '👁️', 
    img: generateHeroPortraitSVG('하후돈', '#2563eb', '👁️', ['#0f172a', '#1d4ed8']),
    rank: 'A', cost: 600, war: 90, int: 63, lead: 89, maxHp: 100, hp: 100, faction: 'wei', troopType: 'cavalry', title: '맹장 (猛將)', quote: '부모님이 주신 눈을 어찌 버리리오!' 
  },
  { 
    id: 'taishici', name: '태사자', avatar: '🏹', 
    img: generateHeroPortraitSVG('태사자', '#f87171', '🏹', ['#7f1d1d', '#dc2626']),
    rank: 'A', cost: 600, war: 93, int: 69, lead: 82, maxHp: 100, hp: 100, faction: 'wu', troopType: 'archer', title: '강동의 활신', quote: '대장부 세상에 태어나 기개를 펼치리라.' 
  },
  { 
    id: 'ganning', name: '감녕', avatar: '⚓', 
    img: generateHeroPortraitSVG('감녕', '#ef4444', '⚓', ['#450a0a', '#991b1b']),
    rank: 'A', cost: 620, war: 94, int: 56, lead: 86, maxHp: 100, hp: 100, faction: 'wu', troopType: 'navy', title: '흥패 (興霸)', quote: '밤을 타 적진을 주파해주마!' 
  },
  { 
    id: 'huang_zhong', name: '황충', avatar: '🎯', 
    img: generateHeroPortraitSVG('황충', '#34d399', '🎯', ['#064e3b', '#047857']),
    rank: 'A', cost: 600, war: 93, int: 65, lead: 84, maxHp: 95, hp: 95, faction: 'shu', troopType: 'archer', title: '노익장 (老益壯)', quote: '내 화살은 결코 빗나가지 않는다.' 
  },
  { 
    id: 'wei_yan', name: '위연', avatar: '⚔️', 
    img: generateHeroPortraitSVG('위연', '#10b981', '⚔️', ['#065f46', '#047857']),
    rank: 'A', cost: 580, war: 91, int: 69, lead: 85, maxHp: 100, hp: 100, faction: 'shu', troopType: 'infantry', title: '자오곡 기습', quote: '기습으로 적의 허를 치겠습니다!' 
  },
  { 
    id: 'lu_xun', name: '육손', avatar: '📜', 
    img: generateHeroPortraitSVG('육손', '#f87171', '📜', ['#7f1d1d', '#b91c1c']),
    rank: 'A', cost: 640, war: 69, int: 95, lead: 94, maxHp: 90, hp: 90, faction: 'wu', troopType: 'infantry', title: '이릉의 화신', quote: '적의 자만을 이용해 불태우겠습니다.' 
  },

  // B급
  { 
    id: 'cao_ren', name: '조인', avatar: '🛡️', 
    img: generateHeroPortraitSVG('조인', '#3b82f6', '🛡️', ['#1e293b', '#1d4ed8']),
    rank: 'B', cost: 380, war: 86, int: 62, lead: 89, maxHp: 90, hp: 90, faction: 'wei', troopType: 'infantry', title: '철벽의 방패', quote: '이 성은 단 한 걸음도 뚫리지 않는다!' 
  },
  { 
    id: 'xu_huang', name: '서황', avatar: '🪓', 
    img: generateHeroPortraitSVG('서황', '#60a5fa', '🪓', ['#0f172a', '#2563eb']),
    rank: 'B', cost: 360, war: 88, int: 71, lead: 84, maxHp: 85, hp: 85, faction: 'wei', troopType: 'infantry', title: '대도 (大斧)', quote: '법도를 엄수해 적을 벨 뿐이다.' 
  },
  { 
    id: 'zhutai', name: '주태', avatar: '🪵', 
    img: generateHeroPortraitSVG('주태', '#ef4444', '🪵', ['#450a0a', '#b91c1c']),
    rank: 'B', cost: 350, war: 90, int: 48, lead: 77, maxHp: 95, hp: 95, faction: 'wu', troopType: 'infantry', title: '불사신 (不死身)', quote: '주군을 위해 이 몸이 찢길지라도!' 
  },
  { 
    id: 'meng_huo', name: '맹획', avatar: '🐘', 
    img: generateHeroPortraitSVG('맹획', '#d97706', '🐘', ['#451a03', '#78350f']),
    rank: 'B', cost: 340, war: 87, int: 45, lead: 80, maxHp: 90, hp: 90, faction: 'neutral', troopType: 'infantry', title: '남만왕 (南蠻王)', quote: '칠종칠금일지라도 굴하지 않는다!' 
  },
  { 
    id: 'yan_yan', name: '엄안', avatar: '🛡️', 
    img: generateHeroPortraitSVG('엄안', '#34d399', '🛡️', ['#064e3b', '#047857']),
    rank: 'B', cost: 330, war: 83, int: 68, lead: 81, maxHp: 85, hp: 85, faction: 'shu', troopType: 'archer', title: '파주의 노장', quote: '우리 고을엔 항복하는 장수는 없다!' 
  },

  // C급
  { 
    id: 'xiahou_mao', name: '하후무', avatar: '💰', 
    img: generateHeroPortraitSVG('하후무', '#94a3b8', '💰', ['#1e293b', '#475569']),
    rank: 'C', cost: 150, war: 52, int: 40, lead: 55, maxHp: 70, hp: 70, faction: 'wei', troopType: 'infantry', title: '부잣집 도령', quote: '어... 어쩌다 장수가 되었을 뿐입니다.' 
  },
  { 
    id: 'liu_shan', name: '유선', avatar: '👑', 
    img: generateHeroPortraitSVG('유선', '#94a3b8', '👑', ['#1e293b', '#334155']),
    rank: 'C', cost: 150, war: 22, int: 35, lead: 30, maxHp: 70, hp: 70, faction: 'shu', troopType: 'infantry', title: '아두 (阿斗)', quote: '음, 성도에서는 가무가 즐겁군요.' 
  },
  { 
    id: 'mou_zhang', name: '무명 선봉장', avatar: '🗡️', 
    img: generateHeroPortraitSVG('의병장', '#94a3b8', '🗡️', ['#1e293b', '#475569']),
    rank: 'C', cost: 120, war: 65, int: 50, lead: 60, maxHp: 75, hp: 75, faction: 'neutral', troopType: 'infantry', title: '지방 의병장', quote: '천하의 도탄을 구하러 나섭니다!' 
  },
  { 
    id: 'xian_ling', name: '지방 현령', avatar: '📜', 
    img: generateHeroPortraitSVG('현령', '#94a3b8', '📜', ['#1e293b', '#334155']),
    rank: 'C', cost: 100, war: 45, int: 60, lead: 50, maxHp: 70, hp: 70, faction: 'neutral', troopType: 'archer', title: '수성 군관', quote: '성벽을 사수하십시오!' 
  }
];

const TACTICAL_CARDS = [
  { id: 'fire_attack', name: '화공 (火攻)', cost: 3, icon: '🔥', type: 'attack', power: 30, desc: '적 부대에 불길을 일으켜 사기 -30 및 체력 25 손상' },
  { id: 'ambush', name: '복병 (伏兵)', cost: 2, icon: '🌲', type: 'counter', power: 20, desc: '수풀에 숨어 적의 공격을 반격하고 적 체력 15 손상' },
  { id: 'fortify', name: '수성 (守城)', cost: 2, icon: '🏰', type: 'defense', power: 25, desc: '성벽과 방패로 이번 턴 받는 데미지 60% 감소' },
  { id: 'supply_raid', name: '군량 기습', cost: 3, icon: '🌾', type: 'drain', power: 20, desc: '적의 보급선을 끊어 적 전술 마나 2 차감 및 자원 획득' },
  { id: 'charge', name: '기병 맹돌격', cost: 4, icon: '⚡', type: 'attack', power: 45, desc: '기병대를 진두지휘하여 적 체력 35 파괴' },
  { id: 'taunt', name: '도발 & 음모', cost: 1, icon: '🗣️', type: 'debuff', power: 15, desc: '적 장수를 도발하여 적의 방어 자세를 무력화' }
];
