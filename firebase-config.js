// Firebase Auth & Firestore DB 연동 모듈 (firebase-config.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase 설정 객체 (사용자의 Firebase 프로젝트 발급 키를 입력하거나 기본 테스트 키 사용)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase 초기화 대기 중: Config 설정을 확인해주세요.", e);
}

const googleProvider = new GoogleAuthProvider();

// 1. 구글 로그인
export async function loginWithGoogle() {
  if (!auth) {
    alert("Firebase Config가 설정되지 않았습니다. firebase-config.js에 본인의 키를 넣어주세요!");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google 로그인 실패:", error);
    alert(`로그인 오류: ${error.message}`);
    return null;
  }
}

// 2. 게스트 비로그인 (익명 로그인)
export async function loginAsGuest() {
  if (!auth) {
    // Firebase 연결 없이 로컬 세션 게스트 모드 반환
    return { uid: 'guest_' + Date.now(), displayName: '익명 군주 (게스트)', isAnonymous: true };
  }
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("게스트 로그인 실패:", error);
    return { uid: 'guest_local', displayName: '익명 군주 (로컬)', isAnonymous: true };
  }
}

// 3. 로그아웃
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}

// 4. 인증 상태 감지 리스너
export function listenAuthState(callback) {
  if (auth) {
    onAuthStateChanged(auth, callback);
  } else {
    callback(null);
  }
}

// 5. Firestore DB: 게임 진행 상태 저장 (Save)
export async function saveGameToCloud(userId, saveData) {
  if (!db || !userId) {
    localStorage.setItem('local_game_save', JSON.stringify(saveData));
    return { success: true, isLocal: true };
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...saveData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, isLocal: false };
  } catch (error) {
    console.error("Cloud 저장 오류 -> 로컬 저장소 대체:", error);
    localStorage.setItem('local_game_save', JSON.stringify(saveData));
    return { success: true, isLocal: true };
  }
}

// 6. Firestore DB: 게임 진행 상태 불러오기 (Load)
export async function loadGameFromCloud(userId) {
  if (!db || !userId) {
    const local = localStorage.getItem('local_game_save');
    return local ? JSON.parse(local) : null;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      const local = localStorage.getItem('local_game_save');
      return local ? JSON.parse(local) : null;
    }
  } catch (error) {
    console.error("Cloud 불러오기 오류 -> 로컬 불러오기 대체:", error);
    const local = localStorage.getItem('local_game_save');
    return local ? JSON.parse(local) : null;
  }
}
