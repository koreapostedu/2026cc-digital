// =========================
// Firebase 연결
// =========================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyArYxYll7yn4JtcdiAL1PSvng2Kg7dNf9E",

    authDomain: "cc-digital-4f66.firebaseapp.com",

    projectId: "cc-digital-4f66",

    storageBucket: "cc-digital-4f66.firebasestorage.app",

    messagingSenderId: "193293634741",

    appId: "1:193293634741:web:02713287593358959502fc"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// =========================
// 방문 기록 저장
// =========================

function saveLog(content){

    addDoc(collection(db,"usage_logs"),{

        office:"test",

        event:"click",

        content:content,

        timestamp:serverTimestamp()

    });

}



// =========================
// 영상 실행
// =========================

window.playVideo = function(file){

    saveLog(file);

    const popup=document.getElementById("videoPlayer");

    const video=document.getElementById("video");


    video.src=file;

    popup.style.display="flex";


    video.load();

    video.play();


    video.onended = function(){

        closeVideo();

    };

}



// =========================
// 영상 닫기
// =========================

window.closeVideo = function(){

    const popup=document.getElementById("videoPlayer");

    const video=document.getElementById("video");


    video.pause();

    video.currentTime=0;

    popup.style.display="none";

}



// =========================
// ATM 이동
// =========================

window.openATM = function(){

    saveLog("ATM 사용 체험");

    window.location.href="emulators/ATM에뮬레이터.html";

}
