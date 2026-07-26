# ⚔️ 삼국지 연의 : 천하통일 (Romance of the Three Kingdoms)

중국 고대 역사 **삼국지 연의**를 바탕으로 한 보드게임 스타일의 영토 점령 & 3단계 미니게임 웹 애플리케이션입니다.

---

## 🌟 주요 기능
1. **보드게임 스타일 12개 거점 지도**: 낙양, 허창, 성도, 건업 등 도로망으로 연계된 인접 거점 침공.
2. **3국 동적 턴제 (위·촉·오 AI)**: 플레이어 턴 ➔ 위나라 AI ➔ 오나라 AI 순환 및 컴퓨터 침공 수성 방어전.
3. **3단계 난이도 미니게임 전투**:
   - 1단계: 일기토 동시 공개 심리전 (맹공 > 치명 > 견고 > 맹공)
   - 2단계: 전술 카드 동시 제출 (화공, 복병, 수성, 기습, 맹돌격)
   - 3단계: 장수 통솔력 + 병력 + 사기 종합 결산 전면전
4. **S/A/B/C 영웅 등용 & 자원 시스템**: 관우, 여포, 제갈량 등 삼국지 명장 고용.
5. **Firebase 인증 & DB Sync**:
   - 구글 1-Click 로그인 및 비로그인 게스트 모드 연동
   - Firestore 클라우드 게임 진행률 저장 / 불러오기
6. **Vercel 원클릭 배포 연동**: `vercel.json` 구성 완료.

---

## 🚀 GitHub 업로드 방법

터미널에서 아래 명령어로 GitHub 저장소에 코드를 올립니다:

```bash
git init
git add .
git commit -m "Initial commit: 삼국지 연의 천하통일 보드게임 미니게임"
git branch -M main
git remote add origin https://github.com/사용자이름/저장소이름.git
git push -u origin main
```

---

## 🔥 Firebase 연동 설정 가이드

1. [Firebase Console](https://console.firebase.google.com/) 접속 ➔ 프로젝트 생성
2. **Authentication** ➔ 로그인 방법에서 **Google** 및 **익명(Anonymous)** 활성화
3. **Firestore Database** ➔ 데이터베이스 생성 (테스트 모드로 시작)
4. **웹 앱 추가** ➔ 발급받은 Firebase SDK Config 정보를 `firebase-config.js`의 `firebaseConfig` 객체에 붙여넣기.

```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};
```

---

## ⚡ Vercel 배포 가이드

1. [Vercel](https://vercel.com/) 접속 ➔ 계정 로그인
2. **Add New...** ➔ **Project** ➔ 본인의 GitHub 저장소 선택 (`Import`)
3. Framework Preset: **Other** (정적 웹 호스팅)
4. `Deploy` 버튼 클릭 ➔ 10초 만에 서비스 배포 완료! 🎉
