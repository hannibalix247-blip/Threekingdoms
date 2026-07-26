const fs = require('fs');
const path = require('path');

const recipes = [
  { id: 'kimchi_jjigae', name: '돼지고기 김치찌개', category: '한식', bg: '#991b1b', icon: '🍲' },
  { id: 'doenjang_jjigae', name: '차돌 된장찌개', category: '한식', bg: '#b45309', icon: '🥘' },
  { id: 'jeyuk', name: '매콤 제육볶음', category: '한식', bg: '#c2410c', icon: '🥩' },
  { id: 'egg_roll', name: '폭신폭신 계란말이', category: '한식', bg: '#d97706', icon: '🍳' },
  
  { id: 'mapo_tofu', name: '초간단 마파두부', category: '중식', bg: '#9a3412', icon: '🍲' },
  { id: 'fried_rice', name: '고슬고슬 계란볶음밥', category: '중식', bg: '#ca8a04', icon: '🍚' },
  
  { id: 'gyudon', name: '달콤 짭조름 규동', category: '일식', bg: '#854d0e', icon: '🍲' },
  { id: 'yakisoba', name: '볶음 야키소바', category: '일식', bg: '#a16207', icon: '🍜' },
  
  { id: 'pasta', name: '매콤 투움바 파스타', category: '양식', bg: '#b45309', icon: '🍝' },
  { id: 'gambas', name: '마늘 향 솔솔 감바스', category: '양식', bg: '#d97706', icon: '🍤' },
  
  { id: 'tteokbokki', name: '국물 떡볶이', category: '분식', bg: '#dc2626', icon: '🥘' },
  { id: 'spam_mayo', name: '스팸마요 덮밥', category: '스페셜', bg: '#2563eb', icon: '🍱' }
];

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

recipes.forEach(r => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g_${r.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="${r.bg}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#g_${r.id})"/>
    <circle cx="200" cy="180" r="120" fill="rgba(255,255,255,0.1)" stroke="#f59e0b" stroke-width="4"/>
    <text x="200" y="200" font-family="'Noto Sans KR', sans-serif" font-size="110" text-anchor="middle" dominant-baseline="middle">${r.icon}</text>
    <rect x="40" y="300" width="320" height="70" rx="16" fill="rgba(15, 23, 42, 0.92)" stroke="#f59e0b" stroke-width="3"/>
    <text x="200" y="345" font-family="'Noto Sans KR', sans-serif" font-size="32" font-weight="900" text-anchor="middle" fill="#fef08a">${r.name}</text>
  </svg>`;
  fs.writeFileSync(path.join(assetsDir, `${r.id}.svg`), svg);
});

console.log('Generated recipe food SVG assets!');
