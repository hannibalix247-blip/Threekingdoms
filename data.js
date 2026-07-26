// 삼국지 영웅전 : 8x8 삼국지 체스 (Three Kingdoms Chess) 데이터 정의

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
      queen: { name: '제갈량 (Queen)', symbol: '♛', img: './assets/zhuge_liang.svg', desc: '군사: 와룡 제갈공명. 사방무제한 이동' },
      rook1: { name: '관우 (Rook)', symbol: '♜', img: './assets/guan_yu.svg', desc: '무성 관운장. 직선 강력 기동' },
      rook2: { name: '장비 (Rook)', symbol: '♜', img: './assets/zhang_fei.svg', desc: '장판교 장익덕. 직선 강력 기동' },
      bishop1: { name: '황충 (Bishop)', symbol: '♝', img: './assets/huang_zhong.svg', desc: '노익장 황충. 대각선 전술 사격' },
      bishop2: { name: '위연 (Bishop)', symbol: '♝', img: './assets/wei_yan.svg', desc: '자오곡 위연. 대각선 기습' },
      knight1: { name: '조운 (Knight)', symbol: '♞', img: './assets/zhao_yun.svg', desc: '상산 조자룡. L자 장애물 돌파 기동' },
      knight2: { name: '엄안 (Knight)', symbol: '♞', img: './assets/yan_yan.svg', desc: '파주 노장 엄안. L자 돌파 기동' },
      pawn: { name: '촉나라 보병 (Pawn)', symbol: '♟', img: './assets/mou_zhang.svg', desc: '촉나라 정예 전열 보병' }
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
      queen: { name: '사마의 (Queen)', symbol: '♛', img: './assets/sima_yi.svg', desc: '군사: 총호 사마중달. 사방무제한 이동' },
      rook1: { name: '하후돈 (Rook)', symbol: '♜', img: './assets/xiahoudun.svg', desc: '맹장 하후돈. 직선 강력 기동' },
      rook2: { name: '조인 (Rook)', symbol: '♜', img: './assets/cao_ren.svg', desc: '철벽 조인. 직선 철통 기동' },
      bishop1: { name: '장료 (Bishop)', symbol: '♝', img: './assets/zhang_liao.svg', desc: '료래료래 장료. 대각선 전술' },
      bishop2: { name: '서황 (Bishop)', symbol: '♝', img: './assets/xu_huang.svg', desc: '대도 서황. 대각선 기동' },
      knight1: { name: '하후무 (Knight)', symbol: '♞', img: './assets/xiahou_mao.svg', desc: '위나라 기병. L자 장애물 돌파' },
      knight2: { name: '수성 군관 (Knight)', symbol: '♞', img: './assets/xian_ling.svg', desc: '위나라 기병. L자 장애물 돌파' },
      pawn: { name: '위나라 기병 (Pawn)', symbol: '♟', img: './assets/xian_ling.svg', desc: '위나라 선봉 돌격 기병' }
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
      queen: { name: '주유 (Queen)', symbol: '♛', img: './assets/zhou_yu.svg', desc: '군사: 미주랑 주유. 사방무제한 이동' },
      rook1: { name: '태사자 (Rook)', symbol: '♜', img: './assets/taishici.svg', desc: '활신 태사자. 직선 강력 기동' },
      rook2: { name: '감녕 (Rook)', symbol: '♜', img: './assets/ganning.svg', desc: '흥패 감녕. 직선 강력 기동' },
      bishop1: { name: '육손 (Bishop)', symbol: '♝', img: './assets/lu_xun.svg', desc: '화신 육손. 대각선 전술' },
      bishop2: { name: '맹획 (Bishop)', symbol: '♝', img: './assets/meng_huo.svg', desc: '남만왕 맹획. 대각선 기동' },
      knight1: { name: '주태 (Knight)', symbol: '♞', img: './assets/zhutai.svg', desc: '불사신 주태. L자 장애물 돌파' },
      knight2: { name: '강동 수군 (Knight)', symbol: '♞', img: './assets/ganning.svg', desc: '오나라 수군. L자 장애물 돌파' },
      pawn: { name: '오나라 수군 (Pawn)', symbol: '♟', img: './assets/ganning.svg', desc: '오나라 수군 선봉대' }
    }
  }
};
