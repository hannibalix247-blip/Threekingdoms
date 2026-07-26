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
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase 사용자 발급 키 적용
const firebaseConfig = {
  apiKey: "AIzaSyBUULde54TVUziQh3h63bzI7KNCD0Fp8ZU",
  authDomain: "threekingdoms-d975c.firebaseapp.com",
  projectId: "threekingdoms-d975c",
  storageBucket: "threekingdoms-d975c.firebasestorage.app",
  messagingSenderId: "980809250198",
  appId: "1:980809250198:web:218685132a41088bff99b7"
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase 초기화 에러:", e);
}

const googleProvider = new GoogleAuthProvider();

// 1. 구글 로그인
export async function loginWithGoogle() {
  if (!auth) {
    alert("Firebase가 연결되지 않았습니다.");
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
    return { uid: 'guest_' + Date.now(), displayName: '익명 셰프', isAnonymous: true };
  }
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("게스트 로그인 실패:", error);
    return { uid: 'guest_local', displayName: '익명 셰프', isAnonymous: true };
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

// 5. Firestore DB: 공유 커뮤니티 [나만의 레시피] 실시간 클라우드 업로드
export async function saveUserRecipeToCloud(recipeData) {
  if (!db) return false;
  try {
    const recipeRef = doc(db, "user_recipes", recipeData.id);
    await setDoc(recipeRef, {
      ...recipeData,
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Cloud 공유 레시피 저장 오류:", error);
    return false;
  }
}

// 6. Firestore DB: 공유 커뮤니티 [나만의 레시피] 다른 이용자가 올린 전체 글 실시간 불러오기 (누구나 공개)
export async function loadUserRecipesFromCloud() {
  if (!db) return [];
  try {
    const colRef = collection(db, "user_recipes");
    const snapshot = await getDocs(colRef);
    const recipes = [];
    snapshot.forEach(docSnap => {
      recipes.push(docSnap.data());
    });
    return recipes;
  } catch (error) {
    console.error("Cloud 공유 레시피 전체 로딩 오류:", error);
    return [];
  }
}

// 7. Firestore DB: 공유 커뮤니티 [나만의 레시피] 삭제
export async function deleteUserRecipeFromCloud(recipeId) {
  if (!db) return false;
  try {
    const recipeRef = doc(db, "user_recipes", recipeId);
    await deleteDoc(recipeRef);
    return true;
  } catch (error) {
    console.error("Cloud 공유 레시피 삭제 오류:", error);
    return false;
  }
}
