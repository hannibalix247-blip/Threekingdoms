// 삼국지 영웅전 : 1:1 전술 카드 체스 듀얼 데이터 정의

const AI_STAGES = [
  {
    id: 'stage1',
    level: 1,
    name: '1단계: 남만 정벌 (맹획)',
    bossName: '맹획',
    bossHp: 100,
    bossMaxHp: 100,
    icon: '🐘',
    color: '#d97706',
    desc: '남만의 야만 군단. 보병 위주의 직진형 공격을 시도합니다.',
    deck: ['meng_huo', 'mou_zhang', 'xian_ling', 'fire_attack', 'charge']
  },
  {
    id: 'stage2',
    level: 2,
    name: '2단계: 강동의 수군 (손권)',
    bossName: '손권 & 주유',
    bossHp: 130,
    bossMaxHp: 130,
    icon: '🔥',
    color: '#dc2626',
    desc: '강동의 수군과 궁병 명장. 원거리 사격과 화공 전술을 펼칩니다.',
    deck: ['zhou_yu', 'taishici', 'ganning', 'lu_xun', 'fire_attack', 'ambush']
  },
  {
    id: 'stage3',
    level: 3,
    name: '3단계: 중원의 패자 (조조)',
    bossName: '조조 & 사마의',
    bossHp: 160,
    bossMaxHp: 160,
    icon: '🐉',
    color: '#2563eb',
    desc: '위나라 정예 기병과 철통 방어군. 강력한 무력과 전술 덱을 자랑합니다.',
    deck: ['cao_cao', 'sima_yi', 'zhang_liao', 'xiahoudun', 'cao_ren', 'charge', 'supply_raid']
  },
  {
    id: 'stage4',
    level: 4,
    name: '4단계: 신승의 전술 (사마의)',
    bossName: '사마의 & 여포',
    bossHp: 200,
    bossMaxHp: 200,
    icon: '🐅',
    color: '#7c3aed',
    desc: '최상급 AI. 천하무쌍 여포와 사마의의 치밀한 전술 카운터를 선보입니다.',
    deck: ['lu_bu', 'sima_yi', 'zhang_liao', 'zhuge_liang', 'guan_yu', 'charge', 'fire_attack', 'ambush']
  }
];

// 5x5 그리드 체스 유닛용 무장 카드 데이터
const HERO_CARDS = [
  {
    id: 'lu_bu', name: '여포', rank: 'S', type: 'cavalry', cost: 5,
    atk: 45, maxHp: 90, moveRange: 2, attackRange: 1,
    img: './assets/lu_bu.svg', icon: '🐉', title: '천하무쌍',
    desc: '기병: 2칸 이동 가능. 치명적인 돌파력'
  },
  {
    id: 'guan_yu', name: '관우', rank: 'S', type: 'infantry', cost: 4,
    atk: 38, maxHp: 100, moveRange: 1, attackRange: 1,
    img: './assets/guan_yu.svg', icon: '🗡️', title: '무성',
    desc: '보병: 1칸 이동. 높은 체력과 정면 반격'
  },
  {
    id: 'zhang_fei', name: '장비', rank: 'S', type: 'cavalry', cost: 4,
    atk: 40, maxHp: 90, moveRange: 2, attackRange: 1,
    img: './assets/zhang_fei.svg', icon: '🦁', title: '만인적',
    desc: '기병: 2칸 이동. 주변 1칸 돌파 공격'
  },
  {
    id: 'zhuge_liang', name: '제갈량', rank: 'S', type: 'strategist', cost: 4,
    atk: 25, maxHp: 75, moveRange: 1, attackRange: 2,
    img: './assets/zhuge_liang.svg', icon: '🪶', title: '와룡',
    desc: '군사: 2칸 사거리 원거리 전술 및 사기 증진'
  },
  {
    id: 'zhao_yun', name: '조운', rank: 'S', type: 'cavalry', cost: 4,
    atk: 36, maxHp: 85, moveRange: 2, attackRange: 1,
    img: './assets/zhao_yun.svg', icon: '⚡', title: '조자룡',
    desc: '기병: 2칸 이동. 적 공격 피격 시 데미지 30% 감소'
  },
  {
    id: 'cao_cao', name: '조조', rank: 'S', type: 'cavalry', cost: 5,
    atk: 35, maxHp: 95, moveRange: 2, attackRange: 1,
    img: './assets/cao_cao.svg', icon: '👑', title: '위무제',
    desc: '군주: 아군 전원 공격력 +5 보너스'
  },
  {
    id: 'sima_yi', name: '사마의', rank: 'S', type: 'strategist', cost: 4,
    atk: 28, maxHp: 80, moveRange: 1, attackRange: 2,
    img: './assets/sima_yi.svg', icon: '🐅', title: '총호',
    desc: '군사: 2칸 사거리 원거리 음모 타격'
  },
  {
    id: 'zhou_yu', name: '주유', rank: 'S', type: 'strategist', cost: 4,
    atk: 30, maxHp: 80, moveRange: 1, attackRange: 2,
    img: './assets/zhou_yu.svg', icon: '🔥', title: '미주랑',
    desc: '군사: 적 3명 화공 범위 타격'
  },
  {
    id: 'huang_zhong', name: '황충', rank: 'A', type: 'archer', cost: 3,
    atk: 32, maxHp: 70, moveRange: 1, attackRange: 2,
    img: './assets/huang_zhong.svg', icon: '🎯', title: '노익장',
    desc: '궁병: 2칸 떨어진 적 원거리 저격'
  },
  {
    id: 'taishici', name: '태사자', rank: 'A', type: 'archer', cost: 3,
    atk: 34, maxHp: 75, moveRange: 1, attackRange: 2,
    img: './assets/taishici.svg', icon: '🏹', title: '활신',
    desc: '궁병: 2칸 떨어진 적 원거리 사격'
  },
  {
    id: 'xiahoudun', name: '하후돈', rank: 'A', type: 'cavalry', cost: 3,
    atk: 32, maxHp: 85, moveRange: 2, attackRange: 1,
    img: './assets/xiahoudun.svg', icon: '👁️', title: '맹장',
    desc: '기병: 2칸 이동 맹돌격'
  },
  {
    id: 'cao_ren', name: '조인', rank: 'B', type: 'infantry', cost: 2,
    atk: 22, maxHp: 90, moveRange: 1, attackRange: 1,
    img: './assets/cao_ren.svg', icon: '🛡️', title: '철벽',
    desc: '보병: 1칸 이동. 철통 방어'
  }
];

// 전술 주문 카드
const TACTICAL_SPELL_CARDS = [
  { id: 'fire_attack', name: '화공 (火攻)', cost: 3, icon: '🔥', type: 'spell', power: 35, desc: '적 유닛 또는 컴퓨터 군주에게 불길 35 데미지' },
  { id: 'ambush', name: '복병 (伏兵)', cost: 2, icon: '🌲', type: 'spell', power: 20, desc: '적 유닛 1명을 반격할 수 없는 기습 타격 20 데미지' },
  { id: 'charge', name: '기병 맹돌격', cost: 3, icon: '⚡', type: 'spell', power: 30, desc: '아군 기병대에게 전진 돌파 명령 30 데미지' },
  { id: 'supply_raid', name: '군량 기습', cost: 2, icon: '🌾', type: 'spell', power: 15, desc: '적군 군량을 끊어 적 SP 2 차감 및 체력 감소' }
];
