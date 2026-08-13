// =====================================
// 관리자 통계 대시보드
// 기간 조회 기능 포함 버전
// =====================================


import { db } from "./firebase.js";

import { offices } from "./offices.js";


import {
    collection,
    getDocs,
    query,
    orderBy
}
from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";





// =====================================
// 전체 데이터 저장
// =====================================


let allLogs = [];




// =====================================
// 통계 불러오기
// =====================================


async function loadStatistics(){



    console.log(
        "통계 불러오기 시작"
    );



    try {



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


            allLogs.push(
                doc.data()
            );


        });





        console.log(
            "전체 데이터",
            allLogs
        );





        // 최초 전체 기간 표시

        renderStatistics(
            allLogs
        );




    }

    catch(error){


        console.error(
            "데이터 조회 오류:",
            error
        );


    }



}









// =====================================
// 기간 필터
// =====================================


function filterByDate(logs){



    const startInput =
    document.getElementById(
        "startDate"
    );



    const endInput =
    document.getElementById(
        "endDate"
    );





    const startDate =
    startInput.value;



    const endDate =
    endInput.value;





    // 날짜 선택 없으면 전체

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
        data.timestamp
        .toDate();




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
// 통계 계산 시작
// =====================================


function renderStatistics(logs){



    let totalVisit = 0;


    let totalContent = 0;





    const totalOfficeCount =
    Object.keys(offices)
    .length;






    const officeCount = {};


    const contentCount = {};


    const officeContentCount = {};



    const participateOffice =
    new Set();




    const monthlyCount = {};







    Object.keys(offices)
    .forEach((code)=>{


        officeCount[
            offices[code]
        ] = 0;


    });







    logs.forEach((data)=>{



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







        // ==========================
        // 방문
        // ==========================


        if(data.event === "visit"){



            totalVisit++;


            monthlyCount[monthKey]
            .visit++;





            const officeName =
            data.officeName;





            if(
                officeName &&
                officeName !== "미지정"
            ){



                participateOffice.add(
                    officeName
                );





                if(
                    officeCount[officeName]
                    !== undefined
                ){


                    officeCount[officeName]++;


                }



            }



        }

                        // ==========================
        // 콘텐츠 이용
        // ==========================


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







            const officeName =
            data.officeName;





            if(
                officeName &&
                officeName !== "미지정"
            ){



                if(
                    !officeContentCount[officeName]
                ){


                    officeContentCount[officeName]
                    = {};


                }






                if(
                    officeContentCount[officeName][content]
                ){


                    officeContentCount[officeName][content]++;


                }
                else{


                    officeContentCount[officeName][content] = 1;


                }



            }



        }





    });








    // =====================================
    // 계산
    // =====================================



    const participateCount =
    participateOffice.size;




    let participateRate = 0;




    if(totalOfficeCount > 0){


        participateRate =
        Math.round(
            (participateCount /
            totalOfficeCount)
            * 100
        );


    }





    let contentRate = 0;




    if(totalVisit > 0){


        contentRate =
        Math.round(
            (totalContent /
            totalVisit)
            * 100
        );


    }








    const notParticipateOffice = [];





    Object.values(offices)
    .forEach((office)=>{


        if(
            !participateOffice.has(office)
        ){


            notParticipateOffice.push(
                office
            );


        }


    });









    // =====================================
    // 상단 카드
    // =====================================



    document.getElementById(
        "totalVisit"
    ).innerText =
    totalVisit;





    document.getElementById(
        "totalContent"
    ).innerText =
    totalContent;





    document.getElementById(
        "totalOffice"
    ).innerText =
    `${participateCount} / ${totalOfficeCount}`;





    document.getElementById(
        "contentRate"
    ).innerText =
    contentRate;









    // =====================================
    // 참여 현황
    // =====================================



    document.getElementById(
        "totalOfficeTarget"
    ).innerText =
    `${totalOfficeCount}개`;





    document.getElementById(
        "participateOfficeCount"
    ).innerText =
    `${participateCount}개`;





    document.getElementById(
        "participateRate"
    ).innerText =
    `${participateRate}%`;






    const notElement =
    document.getElementById(
        "notParticipateOffice"
    );




    if(
        notParticipateOffice.length === 0
    ){


        notElement.innerText =
        "없음";


    }
    else{


        notElement.innerText =
        notParticipateOffice.join(", ");


    }









    // =====================================
    // 월별 운영 현황
    // =====================================



    const monthlyTable =
    document.getElementById(
        "monthlyTable"
    );



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
    // =====================================
    // 총괄국별 접속 현황
    // =====================================


    const officeTable =
    document.getElementById(
        "officeTable"
    );



    officeTable.innerHTML = "";






    Object.keys(officeCount)
    .forEach((office)=>{


        officeTable.innerHTML += `


        <tr>


            <td>
                ${office}
            </td>



            <td>
                ${officeCount[office]}
            </td>



            <td>

                <a href="office-detail.html?office=${encodeURIComponent(office)}">

                    상세보기

                </a>

            </td>



        </tr>


        `;


    });









    // =====================================
    // 콘텐츠별 이용 현황
    // =====================================



    const contentTable =
    document.getElementById(
        "contentTable"
    );



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









    // =====================================
    // 총괄국별 콘텐츠 이용 현황
    // =====================================



    const officeContentTable =
    document.getElementById(
        "officeContentTable"
    );



    officeContentTable.innerHTML = "";








    Object.keys(officeContentCount)
    .forEach((office)=>{



        Object.keys(
            officeContentCount[office]
        )
        .forEach((content)=>{



            officeContentTable.innerHTML += `


            <tr>


                <td>
                    ${office}
                </td>



                <td>
                    ${content}
                </td>



                <td>
                    ${officeContentCount[office][content]}
                </td>



            </tr>


            `;


        });



    });





}









// =====================================
// 조회 버튼 이벤트
// =====================================



document.addEventListener(
"DOMContentLoaded",
()=>{



    const searchBtn =
    document.getElementById(
        "searchBtn"
    );





    if(searchBtn){



        searchBtn.addEventListener(
        "click",
        ()=>{



            const filteredLogs =
            filterByDate(
                allLogs
            );




            renderStatistics(
                filteredLogs
            );



        });



    }



});








// =====================================
// 실행
// =====================================


loadStatistics();
