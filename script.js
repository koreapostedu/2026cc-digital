// =====================================
// 체험관 동작 스크립트
// =====================================

import { saveUsageLog } from "./firebase.js";
import { offices } from "./offices.js";


// =====================================
// QR 총괄국 확인
// =====================================

const params = new URLSearchParams(
    window.location.search
);


const officeCode = params.get("office") || "000";


const officeName = offices[officeCode] || "미지정";


console.log(
    "접속 총괄국:",
    officeCode,
    officeName
);



// =====================================
// QR 접속 기록 저장
// =====================================

saveUsageLog({

    officeCode: officeCode,

    officeName: officeName,

    event: "visit"

});



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
// 잇다뱅킹 체험
// =====================================

window.openBanking = function(){


    clickContent("잇다뱅킹 체험");


    window.open(
        "https://www.posid.or.kr/menu_v2.html",
        "_blank"
    );


};



// =====================================
// ATM 체험
// =====================================

window.openATM = function(){


    clickContent("ATM 체험");

    window.location.href =
        "emulators/ATM에뮬레이터.html";


};



// =====================================
// 키오스크 앱 설치
// =====================================

window.openKiosk = function(){


    clickContent("키오스크 설치");


    window.open(
        "https://play.google.com/store/search?q=%EC%97%94%EB%B8%8C%EB%A0%88%EC%9D%B8%20%EA%B5%90%EC%9C%A1%EC%9A%A9%20%ED%82%A4%EC%98%A4%EC%8A%A4%ED%81%AC&c=apps",
        "_blank"
    );


};
