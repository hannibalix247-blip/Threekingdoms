const fs = require('fs');
const path = require('path');

const heroes = [
  { id: 'cao_cao', name: '조조', color: '#2563eb', bg: '#1e40af', icon: '👑', title: '위무제' },
  { id: 'lu_bu', name: '여포', color: '#f59e0b', bg: '#9a3412', icon: '🐉', title: '천하무쌍' },
  { id: 'guan_yu', name: '관우', color: '#10b981', bg: '#047857', icon: '🗡️', title: '무성' },
  { id: 'zhang_fei', name: '장비', color: '#059669', bg: '#065f46', icon: '🦁', title: '만인적' },
  { id: 'zhuge_liang', name: '제갈량', color: '#34d399', bg: '#0d9488', icon: '🪶', title: '와룡' },
  { id: 'zhao_yun', name: '조운', color: '#10b981', bg: '#0284c7', icon: '⚡', title: '조자룡' },
  { id: 'sima_yi', name: '사마의', color: '#3b82f6', bg: '#1e40af', icon: '🐅', title: '총호' },
  { id: 'zhou_yu', name: '주유', color: '#ef4444', bg: '#b91c1c', icon: '🔥', title: '미주랑' },
  { id: 'zhang_liao', name: '장료', color: '#60a5fa', bg: '#2563eb', icon: '🦅', title: '료래료래' },
  { id: 'xiahoudun', name: '하후돈', color: '#2563eb', bg: '#1d4ed8', icon: '👁️', title: '맹장' },
  { id: 'taishici', name: '태사자', color: '#f87171', bg: '#dc2626', icon: '🏹', title: '활신' },
  { id: 'ganning', name: '감녕', color: '#ef4444', bg: '#991b1b', icon: '⚓', title: '흥패' },
  { id: 'huang_zhong', name: '황충', color: '#34d399', bg: '#047857', icon: '🎯', title: '노익장' },
  { id: 'wei_yan', name: '위연', color: '#10b981', bg: '#047857', icon: '⚔️', title: '기습' },
  { id: 'lu_xun', name: '육손', color: '#f87171', bg: '#b91c1c', icon: '📜', title: '화신' },
  { id: 'cao_ren', name: '조인', color: '#3b82f6', bg: '#1d4ed8', icon: '🛡️', title: '철벽' },
  { id: 'xu_huang', name: '서황', color: '#60a5fa', bg: '#2563eb', icon: '🪓', title: '대도' },
  { id: 'zhutai', name: '주태', color: '#ef4444', bg: '#b91c1c', icon: '🪵', title: '불사신' },
  { id: 'meng_huo', name: '맹획', color: '#d97706', bg: '#78350f', icon: '🐘', title: '남만왕' },
  { id: 'yan_yan', name: '엄안', color: '#34d399', bg: '#047857', icon: '🛡️', title: '파주노장' },
  { id: 'xiahou_mao', name: '하후무', color: '#94a3b8', bg: '#475569', icon: '💰', title: '도령' },
  { id: 'liu_shan', name: '유선', color: '#94a3b8', bg: '#334155', icon: '👑', title: '아두' },
  { id: 'mou_zhang', name: '무명 선봉장', color: '#94a3b8', bg: '#475569', icon: '🗡️', title: '의병장' },
  { id: 'xian_ling', name: '지방 현령', color: '#94a3b8', bg: '#334155', icon: '📜', title: '현령' }
];

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

heroes.forEach(h => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g_${h.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="${h.bg}"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <radialGradient id="glow_${h.id}" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="${h.color}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.1"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#g_${h.id})"/>
    <circle cx="200" cy="180" r="130" fill="url(#glow_${h.id})"/>
    <circle cx="200" cy="170" r="100" fill="none" stroke="#f59e0b" stroke-width="6" stroke-dasharray="14,8"/>
    <text x="200" y="200" font-family="'Noto Serif KR', 'Segoe UI', serif" font-size="110" text-anchor="middle" dominant-baseline="middle">${h.icon}</text>
    <rect x="40" y="300" width="320" height="70" rx="16" fill="rgba(15, 23, 42, 0.95)" stroke="#f59e0b" stroke-width="4"/>
    <text x="200" y="345" font-family="'Noto Serif KR', serif" font-size="36" font-weight="900" text-anchor="middle" fill="#fef08a">${h.name}</text>
  </svg>`;
  fs.writeFileSync(path.join(assetsDir, `${h.id}.svg`), svg);
});

console.log('Generated all hero SVG assets!');
