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

    authDomain: "cc-digital-4f66.firebaseapp.com",

    projectId: "cc-digital-4f66",

    storageBucket: "cc-digital-4f66.firebasestorage.app",

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

    try {

        await addDoc(
            collection(db,"usage_logs"),
            {
                ...data,
                timestamp: serverTimestamp()
            }
        );


        console.log(
            "저장 완료",
            data
        );


    } catch(error){

        console.error(
            "저장 오류",
            error
        );

    }

}
