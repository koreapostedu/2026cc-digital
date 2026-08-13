// =====================================
// 관리자 통계 대시보드
// 최종 버전
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
// 전체 로그 저장
// =====================================


let allLogs = [];




// =====================================
// 데이터 불러오기
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
            "전체 로그",
            allLogs
        );




        renderStatistics(
            allLogs
        );



    }

    catch(error){


        console.error(
            "통계 오류",
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
        "startDate"
    ).value;



    const endDate =
    document.getElementById(
        "endDate"
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
// 통계 계산
// =====================================


function renderStatistics(logs){



    let totalVisit = 0;


    let totalContent = 0;



    let generalVisitCount = 0;





    const officeCount = {};



    const contentCount = {};



    const participateOffice =
    new Set();



    const monthlyCount = {};




    const totalOfficeCount =
    Object.keys(offices)
    .length;





    Object.values(offices)
    .forEach((office)=>{


        officeCount[office] = 0;


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
            else{


                generalVisitCount++;


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
            (
                participateCount /
                totalOfficeCount
            )
            * 100
        );


    }






    let contentRate = 0;



    if(totalVisit > 0){


        contentRate =
        Math.round(
            (
                totalContent /
                totalVisit
            )
            * 100
        );


    }








    const officeTotal =
    Object.values(
        officeCount
    )
    .reduce(
        (sum,value)=>
        sum + value,
        0
    );









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
    // 상단 카드 출력
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
// 총괄국별 접속 현황
// =====================================


const officeTable =
document.getElementById(
    "officeTable"
);



if(officeTable){


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


}







// =====================================
// 총괄국 접속 합계
// =====================================



const officeTotalElement =
document.getElementById(
    "officeTotal"
);



if(officeTotalElement){


    officeTotalElement.innerText =
    officeTotal;


}









// =====================================
// 일반 접속 현황
// =====================================



const generalTable =
document.getElementById(
    "generalTable"
);



if(generalTable){



    generalTable.innerHTML = "";




    generalTable.innerHTML += `


    <tr>


        <td>
            일반 접속
        </td>



        <td>
            ${generalVisitCount}
        </td>



        <td>


            <a href="office-detail.html?office=${encodeURIComponent("미지정")}">

                상세보기


            </a>


        </td>



    </tr>


    `;


}









// =====================================
// 콘텐츠별 이용 현황
// =====================================



const contentTable =
document.getElementById(
    "contentTable"
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
// 엑셀 다운로드 기능
// =====================================


async function downloadExcel(){


    console.log(
        "엑셀 다운로드 시작"
    );



    // 현재 조회 조건 적용

    const logs =
    filterByDate(
        allLogs
    );




    const officeCount = {};

    const contentCount = {};

    const monthlyCount = {};



    let generalVisitCount = 0;

    let totalVisit = 0;

    let totalContent = 0;



    const participateOffice =
    new Set();





    Object.values(offices)
    .forEach((office)=>{


        officeCount[office] = 0;


    });






    logs.forEach((data)=>{



        let monthKey =
        "기타";



        if(data.timestamp){


            const date =
            data.timestamp.toDate();


            monthKey =
            `${date.getFullYear()}년 ${
            String(date.getMonth()+1)
            .padStart(2,"0")
            }월`;


        }





        if(!monthlyCount[monthKey]){


            monthlyCount[monthKey] = {

                visit:0,

                click:0

            };


        }






        // 방문

        if(data.event === "visit"){


            totalVisit++;


            monthlyCount[monthKey]
            .visit++;




            if(
                data.officeName &&
                data.officeName !== "미지정"
            ){


                participateOffice.add(
                    data.officeName
                );



                if(
                    officeCount[data.officeName]
                    !== undefined
                ){

                    officeCount[data.officeName]++;

                }


            }
            else{


                generalVisitCount++;


            }


        }





        // 콘텐츠


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




    const officeTotal =
    Object.values(officeCount)
    .reduce(
        (sum,value)=>sum+value,
        0
    );




    const participateCount =
    participateOffice.size;



    const participateRate =
    Math.round(
        (
            participateCount /
            Object.keys(offices).length
        )
        *100
    );
    // =====================================
    // 엑셀 데이터 생성
    // =====================================



    const summaryData = [


        ["항목","실적"],


        ["총 접속 건수", totalVisit],


        ["총괄국 접속", officeTotal],


        ["일반 접속", generalVisitCount],


        ["콘텐츠 이용 건수", totalContent],


        [
            "참여 총괄국",
            `${participateCount} / ${Object.keys(offices).length}`
        ],


        [
            "참여율",
            `${participateRate}%`
        ]


    ];









    const monthlyData = [


        [
            "월",
            "접속 건수",
            "콘텐츠 이용"
        ]


    ];





    Object.keys(monthlyCount)
    .sort()
    .forEach((month)=>{


        monthlyData.push([


            month,


            monthlyCount[month].visit,


            monthlyCount[month].click



        ]);


    });









    const officeData = [


        [
            "총괄국",
            "접속 건수"
        ]


    ];





    Object.keys(officeCount)
    .forEach((office)=>{


        if(
            officeCount[office] > 0
        ){


            officeData.push([


                office,


                officeCount[office]


            ]);


        }


    });





    officeData.push([


        "총괄국 접속 합계",


        officeTotal


    ]);









    const generalData = [


        [
            "구분",
            "접속 건수"
        ],


        [
            "일반 접속",
            generalVisitCount
        ]


    ];









    const contentData = [


        [
            "콘텐츠",
            "이용 횟수"
        ]


    ];





    Object.keys(contentCount)
    .forEach((content)=>{


        contentData.push([


            content,


            contentCount[content]


        ]);


    });









    // =====================================
    // 엑셀 생성
    // =====================================



    const workbook =
    XLSX.utils.book_new();






    XLSX.utils.book_append_sheet(

        workbook,

        XLSX.utils.aoa_to_sheet(summaryData),

        "전체 현황"

    );





    XLSX.utils.book_append_sheet(

        workbook,

        XLSX.utils.aoa_to_sheet(monthlyData),

        "월별 운영 현황"

    );






    XLSX.utils.book_append_sheet(

        workbook,

        XLSX.utils.aoa_to_sheet(officeData),

        "총괄국별 접속"

    );






    XLSX.utils.book_append_sheet(

        workbook,

        XLSX.utils.aoa_to_sheet(generalData),

        "일반 접속"

    );






    XLSX.utils.book_append_sheet(

        workbook,

        XLSX.utils.aoa_to_sheet(contentData),

        "콘텐츠 이용"

    );









    // =====================================
    // 파일명 생성
    // =====================================



    const startDate =
    document.getElementById(
        "startDate"
    ).value;



    const endDate =
    document.getElementById(
        "endDate"
    ).value;





    let fileName =
    "디지털금융체험관_운영현황";





    if(
        startDate &&
        endDate
    ){


        fileName +=
        `_${startDate}_${endDate}`;


    }
    else{


        fileName +=
        "_전체기간";


    }





    fileName += ".xlsx";







    XLSX.writeFile(

        workbook,

        fileName

    );



}

// =====================================
// 조회 / 엑셀 다운로드 버튼
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    // ==========================
    // 조회 버튼
    // ==========================


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






    // ==========================
    // 엑셀 다운로드 버튼
    // ==========================


    const excelBtn =
    document.getElementById(
        "excelBtn"
    );



    if(excelBtn){



        excelBtn.addEventListener(
        "click",
        ()=>{


            console.log(
                "엑셀 다운로드 버튼 클릭"
            );



            downloadExcel();



        });



    }



});









// =====================================
// 실행
// =====================================


loadStatistics();
