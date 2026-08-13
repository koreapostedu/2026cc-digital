// =====================================
// 총괄국 상세 운영 현황
// 기간 조회 + 일반접속 지원
// =====================================


import { db } from "./firebase.js";


import {
    collection,
    getDocs,
    query,
    orderBy
}
from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";





// =====================================
// 전체 로그 저장
// =====================================


let allLogs = [];



let currentOffice = "";







// =====================================
// 데이터 불러오기
// =====================================


async function loadOfficeDetail(){



    console.log(
        "상세 조회 시작"
    );





    try {



        const params =
        new URLSearchParams(
            window.location.search
        );



        currentOffice =
        params.get("office");






        if(!currentOffice){



            document.getElementById(
                "officeTitle"
            ).innerText =
            "정보 없음";


            return;


        }







        const q =
        query(

            collection(
                db,
                "usage_logs"
            ),

            orderBy(
                "timestamp",
                "desc"
            )

        );







        const snapshot =
        await getDocs(q);






        allLogs = [];






        snapshot.forEach((doc)=>{


            const data =
            doc.data();




            allLogs.push(
                data
            );



        });







        renderOfficeDetail(
            filterByDate(
                allLogs
            )
        );



    }

    catch(error){


        console.error(
            "상세 조회 오류",
            error
        );


    }



}









// =====================================
// 기간 필터
// =====================================


function filterByDate(logs){



    const startDate =
    document.getElementById(
        "detailStartDate"
    ).value;




    const endDate =
    document.getElementById(
        "detailEndDate"
    ).value;







    if(
        !startDate &&
        !endDate
    ){

        return logs;

    }







    return logs.filter((data)=>{



        if(!data.timestamp){

            return false;

        }




        const date =
        data.timestamp.toDate();




        const current =
        date
        .toISOString()
        .slice(0,10);






        if(
            startDate &&
            current < startDate
        ){

            return false;

        }






        if(
            endDate &&
            current > endDate
        ){

            return false;

        }






        return true;



    });



}


// =====================================
// 상세 통계 계산
// =====================================


function renderOfficeDetail(logs){



    let totalVisit = 0;


    let totalContent = 0;





    const contentCount = {};



    const monthlyCount = {};






    logs.forEach((data)=>{





        // =============================
        // 대상 데이터 필터
        // =============================



        let isTarget = false;





        if(
            currentOffice === "미지정"
        ){


            if(
                !data.officeName ||
                data.officeName === "미지정"
            ){


                isTarget = true;


            }



        }
        else{


            if(
                data.officeName === currentOffice
            ){


                isTarget = true;


            }


        }






        if(!isTarget){

            return;

        }








        // =============================
        // 월 정보 생성
        // =============================



        let monthKey =
        "기타";




        if(data.timestamp){



            const date =
            data.timestamp.toDate();




            monthKey =
            `${date.getFullYear()}년 ${
            String(
                date.getMonth()+1
            )
            .padStart(2,"0")
            }월`;



        }







        if(!monthlyCount[monthKey]){


            monthlyCount[monthKey] = {


                visit:0,


                click:0



            };


        }







        // =============================
        // 방문 기록
        // =============================



        if(data.event === "visit"){



            totalVisit++;



            monthlyCount[monthKey]
            .visit++;



        }







        // =============================
        // 콘텐츠 이용 기록
        // =============================



        if(data.event === "click"){



            totalContent++;



            monthlyCount[monthKey]
            .click++;





            let content =
            data.content || "기타";






            if(content === "campaign"){


                content =
                "금융사기 예방 캠페인송";


            }







            if(contentCount[content]){


                contentCount[content]++;


            }
            else{


                contentCount[content] = 1;


            }





        }





    });







    // =====================================
    // 제목 표시
    // =====================================



    const title =
    document.getElementById(
        "officeTitle"
    );





    if(currentOffice === "미지정"){


        title.innerText =
        "일반 접속 운영 상세 현황";


    }
    else{


        title.innerText =
        `${currentOffice} 총괄국 운영 상세 현황`;


    }









    // =====================================
    // 숫자 출력
    // =====================================



    document.getElementById(
        "detailVisit"
    ).innerText =
    totalVisit;





    document.getElementById(
        "detailContent"
    ).innerText =
    totalContent;







    // =====================================
    // 운영 현황 문구
    // =====================================



    let targetName =
    currentOffice === "미지정"
    ? "일반 접속"
    : `${currentOffice} 총괄국`;




    document.getElementById(
        "detailMessage"
    ).innerText =



    `${targetName}에서 총 ${totalVisit}회의 접속과 ${totalContent}회의 콘텐츠 이용이 확인되었습니다.`;

// =====================================
// 월별 운영 현황 출력
// =====================================


const monthlyTable =
document.getElementById(
    "detailMonthlyTable"
);



if(monthlyTable){


    monthlyTable.innerHTML = "";



    Object.keys(monthlyCount)
    .sort((a,b)=>{


        return b.localeCompare(a);


    })
    .forEach((month)=>{



        monthlyTable.innerHTML += `


        <tr>


            <td>
                ${month}
            </td>



            <td>
                ${monthlyCount[month].visit}
            </td>



            <td>
                ${monthlyCount[month].click}
            </td>



        </tr>


        `;



    });



}









// =====================================
// 콘텐츠 이용 현황 출력
// =====================================



const contentTable =
document.getElementById(
    "detailContentTable"
);



if(contentTable){



    contentTable.innerHTML = "";




    Object.keys(contentCount)
    .forEach((content)=>{



        contentTable.innerHTML += `


        <tr>


            <td>
                ${content}
            </td>



            <td>
                ${contentCount[content]}
            </td>



        </tr>


        `;



    });



}



}









// =====================================
// 조회 버튼 이벤트
// =====================================



document.addEventListener(
"DOMContentLoaded",
()=>{



    const searchBtn =
    document.getElementById(
        "detailSearchBtn"
    );





    if(searchBtn){



        searchBtn.addEventListener(
        "click",
        ()=>{



            const filteredLogs =
            filterByDate(
                allLogs
            );




            renderOfficeDetail(
                filteredLogs
            );



        });



    }



});









// =====================================
// 실행
// =====================================


loadOfficeDetail();
