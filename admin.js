/* =====================================
   관리자 통계 대시보드 스타일
===================================== */


* {

    box-sizing: border-box;

}


body {

    margin: 0;

    font-family: 
    "Pretendard",
    "Noto Sans KR",
    sans-serif;

    background: #f5f7fb;

    color: #333;

}



/* 전체 영역 */

.dashboard {

    max-width: 1200px;

    margin: 0 auto;

    padding: 40px 30px;

}



/* 헤더 */

header {

    background: white;

    padding: 30px;

    border-radius: 16px;

    box-shadow: 
    0 4px 12px rgba(0,0,0,0.08);

    margin-bottom: 30px;

}


header h1 {

    margin: 0;

    font-size: 32px;

    font-weight: 800;

}


header p {

    margin-top: 10px;

    color: #666;

    font-size: 18px;

}



/* 요약 카드 */

.summary {

    display: grid;

    grid-template-columns: 
    repeat(2,1fr);

    gap: 20px;

    margin-bottom: 30px;

}



.summary-card {

    background:white;

    padding:30px;

    border-radius:16px;

    box-shadow:
    0 4px 12px rgba(0,0,0,0.08);

}



.summary-card h3 {

    margin:0;

    font-size:18px;

    color:#666;

}



.summary-card strong {

    display:inline-block;

    margin-top:15px;

    font-size:48px;

    font-weight:800;

    color:#004ea2;

}



.summary-card span {

    font-size:20px;

    margin-left:8px;

}



/* 표 영역 */

.box {

    background:white;

    padding:30px;

    border-radius:16px;

    box-shadow:
    0 4px 12px rgba(0,0,0,0.08);

    margin-bottom:30px;

}



.box h2 {

    margin-top:0;

    font-size:24px;

}



/* 테이블 */

table {

    width:100%;

    border-collapse:collapse;

}



th {

    background:#f0f4fa;

    padding:14px;

    text-align:center;

    font-weight:700;

}



td {

    padding:14px;

    text-align:center;

    border-bottom:1px solid #eee;

}



tr:last-child td {

    border-bottom:none;

}



/* 모바일 대응 */

@media(max-width:700px){


    .dashboard {

        padding:20px 15px;

    }


    .summary {

        grid-template-columns:1fr;

    }


    header h1 {

        font-size:24px;

    }


    .summary-card strong {

        font-size:38px;

    }

}
