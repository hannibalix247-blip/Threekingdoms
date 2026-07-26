// 삼국지 연의 : 천하통일 게임 데이터 정의

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

// 12개 주요 도시 및 보드 노드 연결 관계 (좌표는 % 단위)
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

// 도시 간 연결선 (도로 및 이동 경로)
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

// 병종 데이터 및 상성
const TROOP_TYPES = {
  infantry: { id: 'infantry', name: '보병 (步兵)', icon: '🛡️', advantage: 'archer', disadvantage: 'cavalry', desc: '궁병에 강하고 기병에 약함. 높은 방어력' },
  cavalry: { id: 'cavalry', name: '기병 (騎兵)', icon: '🐎', advantage: 'infantry', disadvantage: 'archer', desc: '보병에 강하고 궁병에 약함. 높은 돌파력' },
  archer: { id: 'archer', name: '궁병 (弓兵)', icon: '🏹', advantage: 'cavalry', disadvantage: 'infantry', desc: '기병에 강하고 보병에 약함. 원거리 사격' },
  navy: { id: 'navy', name: '수군 (水軍)', icon: '⛵', advantage: 'none', disadvantage: 'none', desc: '강가 요충지 전투 시 스탯 1.4배 상승' }
};

// 영웅/무장 데이터 목록 (아바타 애니메이션 아이콘 및 컬러 포함)
const HEROES = [
  // S급 (비용: 1000 Gold)
  { id: 'lu_bu', name: '여포 (呂布)', avatar: '🐉', rank: 'S', cost: 1000, war: 100, int: 26, lead: 88, faction: 'neutral', troopType: 'cavalry', title: '천하무쌍', quote: '누가 감히 나 여봉선을 가로막는가!' },
  { id: 'guan_yu', name: '관우 (關羽)', avatar: '🗡️', rank: 'S', cost: 1000, war: 97, int: 79, lead: 95, faction: 'shu', troopType: 'infantry', title: '무성 (武聖)', quote: '내 청룡언월도가 울부짖는다!' },
  { id: 'zhang_fei', name: '장비 (張飛)', avatar: '🦁', rank: 'S', cost: 950, war: 98, int: 30, lead: 86, faction: 'shu', troopType: 'cavalry', title: '만인적', quote: '장판교 아래 장익덕이 있노라!' },
  { id: 'zhuge_liang', name: '제갈량 (諸葛亮)', avatar: '🪶', rank: 'S', cost: 1000, war: 38, int: 100, lead: 98, faction: 'shu', troopType: 'archer', title: '와룡 (臥龍)', quote: '동풍을 불러오겠나이다.' },
  { id: 'zhao_yun', name: '조운 (趙雲)', avatar: '⚡', rank: 'S', cost: 980, war: 96, int: 76, lead: 92, faction: 'shu', troopType: 'cavalry', title: '상산 조자룡', quote: '주군을 굳건히 지키겠나이다!' },
  { id: 'sima_yi', name: '사마의 (司馬懿)', avatar: '🐅', rank: 'S', cost: 980, war: 63, int: 98, lead: 97, faction: 'wei', troopType: 'archer', title: '총호 (冢虎)', quote: '천하의 향방은 참는 자의 것이다.' },
  { id: 'zhou_yu', name: '주유 (周瑜)', avatar: '🔥', rank: 'S', cost: 950, war: 71, int: 96, lead: 95, faction: 'wu', troopType: 'navy', title: '미주랑 (美周郞)', quote: '적벽의 불꽃으로 쳐부수리라!' },

  // A급 (비용: 600 Gold)
  { id: 'zhang_liao', name: '장료 (張遼)', avatar: '🦅', rank: 'A', cost: 650, war: 92, int: 78, lead: 93, faction: 'wei', troopType: 'cavalry', title: '료래료래', quote: '합비의 신화가 또다시 시작된다.' },
  { id: 'xiahoudun', name: '하후돈 (夏侯惇)', avatar: '👁️', rank: 'A', cost: 600, war: 90, int: 63, lead: 89, faction: 'wei', troopType: 'cavalry', title: '맹장', quote: '부모님이 주신 눈을 어찌 버리리오!' },
  { id: 'taishici', name: '태사자 (太史慈)', avatar: '🏹', rank: 'A', cost: 600, war: 93, int: 69, lead: 82, faction: 'wu', troopType: 'archer', title: '강동의 활신', quote: '대장부 세상에 태어나 기개를 펼치리라.' },
  { id: 'ganning', name: '감녕 (甘寧)', avatar: '⚓', rank: 'A', cost: 620, war: 94, int: 56, lead: 86, faction: 'wu', troopType: 'navy', title: '흥패', quote: '밤을 타 적진을 주파해주마!' },
  { id: 'huang_zhong', name: '황충 (黃忠)', avatar: '🎯', rank: 'A', cost: 600, war: 93, int: 65, lead: 84, faction: 'shu', troopType: 'archer', title: '노익장', quote: '내 화살은 결코 빗나가지 않는다.' },
  { id: 'wei_yan', name: '위연 (魏延)', avatar: '⚔️', rank: 'A', cost: 580, war: 91, int: 69, lead: 85, faction: 'shu', troopType: 'infantry', title: '자오곡의 기습', quote: '기습으로 적의 허를 치겠습니다!' },
  { id: 'lu_xun', name: '육손 (陸遜)', avatar: '📜', rank: 'A', cost: 640, war: 69, int: 95, lead: 94, faction: 'wu', troopType: 'infantry', title: '이릉의 화신', quote: '적의 자만을 이용해 불태우겠습니다.' },

  // B급 (비용: 350 Gold)
  { id: 'cao_ren', name: '조인 (曹仁)', avatar: '🛡️', rank: 'B', cost: 380, war: 86, int: 62, lead: 89, faction: 'wei', troopType: 'infantry', title: '철벽의 방패', quote: '이 성은 단 한 걸음도 뚫리지 않는다!' },
  { id: 'xu_huang', name: '서황 (徐晃)', avatar: '🪓', rank: 'B', cost: 360, war: 88, int: 71, lead: 84, faction: 'wei', troopType: 'infantry', title: '대도 (大斧)', quote: '법도를 엄수해 적을 벨 뿐이다.' },
  { id: 'zhutai', name: '주태 (周泰)', avatar: '🪵', rank: 'B', cost: 350, war: 90, int: 48, lead: 77, faction: 'wu', troopType: 'infantry', title: '불사신', quote: '주군을 위해 이 몸이 찢길지라도!' },
  { id: 'meng_huo', name: '맹획 (孟獲)', avatar: '🐘', rank: 'B', cost: 340, war: 87, int: 45, lead: 80, faction: 'neutral', troopType: 'infantry', title: '남만왕', quote: '칠종칠금일지라도 굴하지 않는다!' },
  { id: 'yan_yan', name: '엄안 (嚴顏)', avatar: '🛡️', rank: 'B', cost: 330, war: 83, int: 68, lead: 81, faction: 'shu', troopType: 'archer', title: '파주의 노장', quote: '우리 고을엔 항복하는 장수는 없다!' },

  // C급 (비용: 150 Gold)
  { id: 'xiahou_mao', name: '하후무 (夏侯楙)', avatar: '💰', rank: 'C', cost: 150, war: 52, int: 40, lead: 55, faction: 'wei', troopType: 'infantry', title: '부잣집 도령', quote: '어... 어쩌다 장수가 되었을 뿐입니다.' },
  { id: 'liu_shan', name: '유선 (劉禪)', avatar: '👑', rank: 'C', cost: 150, war: 22, int: 35, lead: 30, faction: 'shu', troopType: 'infantry', title: '아두 (阿斗)', quote: '음, 성도에서는 가무가 즐겁군요.' },
  { id: 'mou_zhang', name: '무명 선봉장', avatar: '🗡️', rank: 'C', cost: 120, war: 65, int: 50, lead: 60, faction: 'neutral', troopType: 'infantry', title: '지방 의병장', quote: '천하의 도탄을 구하러 나섭니다!' },
  { id: 'xian_ling', name: '지방 현령', avatar: '📜', rank: 'C', cost: 100, war: 45, int: 60, lead: 50, faction: 'neutral', troopType: 'archer', title: '수성 군관', quote: '성벽을 사수하십시오!' }
];

// 2단계 전술 카드 데이터
const TACTICAL_CARDS = [
  { id: 'fire_attack', name: '화공 (火攻)', cost: 3, icon: '🔥', type: 'attack', power: 30, desc: '적 부대에 불길을 일으켜 사기 -30 및 큰 데미지' },
  { id: 'ambush', name: '복병 (伏兵)', cost: 2, icon: '🌲', type: 'counter', power: 20, desc: '수풀에 숨어 적의 공격을 반격하고 데미지' },
  { id: 'fortify', name: '수성 (守城)', cost: 2, icon: '🏰', type: 'defense', power: 25, desc: '성벽과 방패로 이번 턴 받는 데미지 60% 감소' },
  { id: 'supply_raid', name: '군량 기습', cost: 3, icon: '🌾', type: 'drain', power: 20, desc: '적의 보급선을 끊어 적 전술 마나 2 차감 및 자원 획득' },
  { id: 'charge', name: '기병 맹돌격', cost: 4, icon: '⚡', type: 'attack', power: 45, desc: '기병대를 진두지휘하여 적 진형에 회복 불능 괴멸격' },
  { id: 'taunt', name: '도발 & 음모', cost: 1, icon: '🗣️', type: 'debuff', power: 15, desc: '적 장수를 도발하여 적의 방어 자세를 무력화' }
];
