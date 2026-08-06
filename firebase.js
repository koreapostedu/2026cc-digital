// =====================================
// Firebase 연결 설정
// =====================================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// 기존 Firebase 프로젝트 연결 정보
const firebaseConfig = {

    apiKey: "AIzaSyArYxYll7yn4JtcdiAL1PSvng2Kg7dNf9E",

    authDomain: "cc-digital-4f66f.firebaseapp.com",

    projectId: "cc-digital-4f66f",

    storageBucket: "cc-digital-4f66f.firebasestorage.app",

    messagingSenderId: "193293634741",

    appId: "1:193293634741:web:02713287593358959502fc"

};


// Firebase 초기화

const app = initializeApp(firebaseConfig);


// Firestore 연결

const db = getFirestore(app);


// =====================================
// 이용 기록 저장 함수
// =====================================

export async function saveUsageLog(data){

    console.log("saveUsageLog 호출됨:", data);

    try {

        const result = await addDoc(
            collection(db,"usage_logs"),
            {
                ...data,
                timestamp: serverTimestamp()
            }
        );


        console.log(
            "Firestore 저장 성공:",
            result.id
        );


    } catch(error){

        console.error(
            "Firestore 저장 오류:",
            error
        );

    }

}


// 관리자 페이지에서 사용할 수 있도록 export
export { db };
