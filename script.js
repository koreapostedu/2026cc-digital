// =====================================
// 체험관 동작 스크립트
// =====================================

import { saveUsageLog } from "./firebase.js";
import { offices } from "./offices.js";


// =====================================
// QR 접속 총괄국 확인
// =====================================

const params = new URLSearchParams(
    window.location.search
);

const officeCode = params.get("office") || "000";

const officeName = offices[officeCode] || "미지정";


// =====================================
// 최초 접속 기록 저장
// =====================================

saveUsageLog({

    officeCode: officeCode,

    officeName: officeName,

    event: "visit"

});

console.log(
    "접속 총괄국:",
    officeName
);


// =====================================
// 콘텐츠 클릭 기록
// =====================================

function clickContent(content){

    saveUsageLog({

        officeCode: officeCode,

        officeName: officeName,

        event: "click",

        content: content

    });

}


// =====================================
// 영상 실행
// =====================================

window.playVideo = function(file, content){

    clickContent(content);


    const popup =
        document.getElementById("videoPlayer");

    const video =
        document.getElementById("video");


    video.src = file;

    popup.style.display = "flex";


    video.load();

    video.play();


    video.onended = function(){

        closeVideo();

    };

};


// =====================================
// 영상 닫기
// =====================================

window.closeVideo = function(){

    const popup =
        document.getElementById("videoPlayer");

    const video =
        document.getElementById("video");


    video.pause();

    video.currentTime = 0;

    popup.style.display = "none";

};


// =====================================
// ATM 체험 이동
// =====================================

window.openATM = function(){

    clickContent("atm");

    window.location.href =
        "emulators/ATM에뮬레이터.html";

};


// =====================================
// 잇다뱅킹 체험
// =====================================

window.openBanking = function(){

    clickContent("banking");

};


// =====================================
// 키오스크 앱 안내
// =====================================

window.openKiosk = function(){

    clickContent("kiosk");

};
