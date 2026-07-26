// 삼국지 영웅전 : 3단계 스토리텔링 체스 캠페인 데이터 정의

const STORY_CAMPAIGNS = [
  {
    id: 'stage1',
    level: '하 (초보자)',
    levelNum: 1,
    title: '💛 1단계: 황건의 난 (The Yellow Turban Rebellion)',
    bossName: '장각 (황건적 군주)',
    icon: '💛',
    color: '#eab308',
    aiDifficulty: 'easy', // 초보자 AI
    briefing: `184년, "창천이 이미 죽으니 황천이 마땅히 서리라!"\n\n난세의 첫 기치로 일으켜진 황건적의 대군과 맞닥뜨렸습니다.\n장각이 이끄는 황건적 무리는 기세는 높으나 전술이 경솔합니다.\n초보 군주로서 체스의 기본 기동과 기물 잡기를 연습하며 첫 승리를 거두십시오!`,
    aiFaction: {
      name: '황건적 (黃巾)',
      ruler: '장각',
      pieces: {
        king: { name: '장각 (King)', symbol: '♚', img: './assets/liu_shan.svg', pieceType: 'king', owner: 'ai' },
        queen: { name: '장량 (Queen)', symbol: '♛', img: './assets/sima_yi.svg', pieceType: 'queen', owner: 'ai' },
        rook1: { name: '장보 (Rook)', symbol: '♜', img: './assets/cao_ren.svg', pieceType: 'rook', owner: 'ai' },
        rook2: { name: '관해 (Rook)', symbol: '♜', img: './assets/xu_huang.svg', pieceType: 'rook', owner: 'ai' },
        bishop1: { name: '배원소 (Bishop)', symbol: '♝', img: './assets/meng_huo.svg', pieceType: 'bishop', owner: 'ai' },
        bishop2: { name: '등무 (Bishop)', symbol: '♝', img: './assets/yan_yan.svg', pieceType: 'bishop', owner: 'ai' },
        knight1: { name: '정원지 (Knight)', symbol: '♞', img: './assets/xiahou_mao.svg', pieceType: 'knight', owner: 'ai' },
        knight2: { name: '고승 (Knight)', symbol: '♞', img: './assets/xian_ling.svg', pieceType: 'knight', owner: 'ai' },
        pawn: { name: '황건적 도적 (Pawn)', symbol: '♟', img: './assets/mou_zhang.svg', pieceType: 'pawn', owner: 'ai' }
      }
    }
  },
  {
    id: 'stage2',
    level: '중 (중급자)',
    levelNum: 2,
    title: '🔥 2단계: 적벽대전 (The Battle of Red Cliffs)',
    bossName: '조조 (80만 위나라 대군)',
    icon: '🔥',
    color: '#f97316',
    aiDifficulty: 'medium', // 중급자 AI
    briefing: `208년, 장강 삼백 리를 가득 메운 조조의 80만 대군!\n\n동풍이 불어오는 적벽의 강상 위에서 삼국의 운명을 건 대혈전이 시작됩니다.\n조조와 정예 위나라 장수진(하후돈, 장료, 조인 등)은 기물 가치를 정밀히 타산하며 아군 킹을 압박할 것입니다.\n중급 전술 수읽기로 적벽의 승리를 쟁취하십시오!`,
    aiFaction: {
      name: '조위 대군 (曹魏)',
      ruler: '조조',
      pieces: {
        king: { name: '조조 (King)', symbol: '♚', img: './assets/cao_cao.svg', pieceType: 'king', owner: 'ai' },
        queen: { name: '사마의 (Queen)', symbol: '♛', img: './assets/sima_yi.svg', pieceType: 'queen', owner: 'ai' },
        rook1: { name: '하후돈 (Rook)', symbol: '♜', img: './assets/xiahoudun.svg', pieceType: 'rook', owner: 'ai' },
        rook2: { name: '조인 (Rook)', symbol: '♜', img: './assets/cao_ren.svg', pieceType: 'rook', owner: 'ai' },
        bishop1: { name: '장료 (Bishop)', symbol: '♝', img: './assets/zhang_liao.svg', pieceType: 'bishop', owner: 'ai' },
        bishop2: { name: '서황 (Bishop)', symbol: '♝', img: './assets/xu_huang.svg', pieceType: 'bishop', owner: 'ai' },
        knight1: { name: '하후무 (Knight)', symbol: '♞', img: './assets/xiahou_mao.svg', pieceType: 'knight', owner: 'ai' },
        knight2: { name: '위나라 기병 (Knight)', symbol: '♞', img: './assets/xian_ling.svg', pieceType: 'knight', owner: 'ai' },
        pawn: { name: '위나라 선봉 (Pawn)', symbol: '♟', img: './assets/xian_ling.svg', pieceType: 'pawn', owner: 'ai' }
      }
    }
  },
  {
    id: 'stage3',
    level: '상 (상급자)',
    levelNum: 3,
    title: '⚔️ 3단계: 최후의 결전 (The Final Battle for Empire)',
    bossName: '사마의 & 삼국 최정예 신승진',
    icon: '⚔️',
    color: '#dc2626',
    aiDifficulty: 'hard', // 상급자 AI
    briefing: `삼국 삼분의 난세를 마감하고 천하통일을 이룰 최후의 대결!\n\n천하무쌍 여포와 치밀한 묘수의 사마의가 결합한 최정예 신승 군단이 기다립니다.\n이 AI는 기물 보호, 최적 포지셔닝, 킹 체크메이트 압박을 가하는 상급 묘수를 구사합니다.\n당신의 최고 전술 지혜로 체크메이트를 거두어 천하를 평정하십시오!`,
    aiFaction: {
      name: '최종 신승군 (神將)',
      ruler: '사마의',
      pieces: {
        king: { name: '사마의 (King)', symbol: '♚', img: './assets/sima_yi.svg', pieceType: 'king', owner: 'ai' },
        queen: { name: '여포 (Queen)', symbol: '♛', img: './assets/lu_bu.svg', pieceType: 'queen', owner: 'ai' },
        rook1: { name: '관우 (Rook)', symbol: '♜', img: './assets/guan_yu.svg', pieceType: 'rook', owner: 'ai' },
        rook2: { name: '장료 (Rook)', symbol: '♜', img: './assets/zhang_liao.svg', pieceType: 'rook', owner: 'ai' },
        bishop1: { name: '제갈량 (Bishop)', symbol: '♝', img: './assets/zhuge_liang.svg', pieceType: 'bishop', owner: 'ai' },
        bishop2: { name: '주유 (Bishop)', symbol: '♝', img: './assets/zhou_yu.svg', pieceType: 'bishop', owner: 'ai' },
        knight1: { name: '조운 (Knight)', symbol: '♞', img: './assets/zhao_yun.svg', pieceType: 'knight', owner: 'ai' },
        knight2: { name: '태사자 (Knight)', symbol: '♞', img: './assets/taishici.svg', pieceType: 'knight', owner: 'ai' },
        pawn: { name: '최정예 친위대 (Pawn)', symbol: '♟', img: './assets/ganning.svg', pieceType: 'pawn', owner: 'ai' }
      }
    }
  }
];

const CHESS_FACTIONS = {
  shu: {
    id: 'shu',
    name: '촉한 (蜀漢)',
    ruler: '유비',
    color: '#059669',
    lightColor: '#34d399',
    symbolColor: '#10b981',
    pieces: {
      king: { name: '유비 (King)', symbol: '♚', img: './assets/liu_shan.svg', fallbackImg: './assets/guan_yu.svg', desc: '군주: 촉한의 대덕 영주' },
      queen: { name: '제갈량 (Queen)', symbol: '♛', img: './assets/zhuge_liang.svg', desc: '군사: 와룡 제갈공명' },
      rook1: { name: '관우 (Rook)', symbol: '♜', img: './assets/guan_yu.svg', desc: '무성 관운장' },
      rook2: { name: '장비 (Rook)', symbol: '♜', img: './assets/zhang_fei.svg', desc: '장판교 장익덕' },
      bishop1: { name: '황충 (Bishop)', symbol: '♝', img: './assets/huang_zhong.svg', desc: '노익장 황충' },
      bishop2: { name: '위연 (Bishop)', symbol: '♝', img: './assets/wei_yan.svg', desc: '자오곡 위연' },
      knight1: { name: '조운 (Knight)', symbol: '♞', img: './assets/zhao_yun.svg', desc: '상산 조자룡' },
      knight2: { name: '엄안 (Knight)', symbol: '♞', img: './assets/yan_yan.svg', desc: '파주 노장 엄안' },
      pawn: { name: '촉나라 보병 (Pawn)', symbol: '♟', img: './assets/mou_zhang.svg', desc: '촉나라 정예 보병' }
    }
  },
  wei: {
    id: 'wei',
    name: '조위 (曹魏)',
    ruler: '조조',
    color: '#2563eb',
    lightColor: '#60a5fa',
    symbolColor: '#3b82f6',
    pieces: {
      king: { name: '조조 (King)', symbol: '♚', img: './assets/cao_cao.svg', desc: '군주: 위무제 조맹덕' },
      queen: { name: '사마의 (Queen)', symbol: '♛', img: './assets/sima_yi.svg', desc: '군사: 총호 사마중달' },
      rook1: { name: '하후돈 (Rook)', symbol: '♜', img: './assets/xiahoudun.svg', desc: '맹장 하후돈' },
      rook2: { name: '조인 (Rook)', symbol: '♜', img: './assets/cao_ren.svg', desc: '철벽 조인' },
      bishop1: { name: '장료 (Bishop)', symbol: '♝', img: './assets/zhang_liao.svg', desc: '료래료래 장료' },
      bishop2: { name: '서황 (Bishop)', symbol: '♝', img: './assets/xu_huang.svg', desc: '대도 서황' },
      knight1: { name: '하후무 (Knight)', symbol: '♞', img: './assets/xiahou_mao.svg', desc: '위나라 기병' },
      knight2: { name: '수성 군관 (Knight)', symbol: '♞', img: './assets/xian_ling.svg', desc: '위나라 기병' },
      pawn: { name: '위나라 기병 (Pawn)', symbol: '♟', img: './assets/xian_ling.svg', desc: '위나라 선봉 기병' }
    }
  },
  wu: {
    id: 'wu',
    name: '손오 (孫吳)',
    ruler: '손권',
    color: '#dc2626',
    lightColor: '#f87171',
    symbolColor: '#ef4444',
    pieces: {
      king: { name: '손권 (King)', symbol: '♚', img: './assets/zhou_yu.svg', fallbackImg: './assets/zhou_yu.svg', desc: '군주: 강동의 군주 손권' },
      queen: { name: '주유 (Queen)', symbol: '♛', img: './assets/zhou_yu.svg', desc: '군사: 미주랑 주유' },
      rook1: { name: '태사자 (Rook)', symbol: '♜', img: './assets/taishici.svg', desc: '활신 태사자' },
      rook2: { name: '감녕 (Rook)', symbol: '♜', img: './assets/ganning.svg', desc: '흥패 감녕' },
      bishop1: { name: '육손 (Bishop)', symbol: '♝', img: './assets/lu_xun.svg', desc: '화신 육손' },
      bishop2: { name: '맹획 (Bishop)', symbol: '♝', img: './assets/meng_huo.svg', desc: '남만왕 맹획' },
      knight1: { name: '주태 (Knight)', symbol: '♞', img: './assets/zhutai.svg', desc: '불사신 주태' },
      knight2: { name: '강동 수군 (Knight)', symbol: '♞', img: './assets/ganning.svg', desc: '오나라 수군' },
      pawn: { name: '오나라 수군 (Pawn)', symbol: '♟', img: './assets/ganning.svg', desc: '오나라 수군 선봉대' }
    }
  }
};
