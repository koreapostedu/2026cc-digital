function playVideo(file){

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
function closeVideo(){

    const popup=document.getElementById("videoPlayer");

    const video=document.getElementById("video");

    video.pause();

    video.currentTime=0;

    popup.style.display="none";

}

function openATM(){

    window.location.href="emulators/ATM에뮬레이터.html";

}
