// =====================================
// 관리자 통계 대시보드
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
// 통계 불러오기
// =====================================


async function loadStatistics(){


    console.log("통계 불러오기 시작");



    try {



        const q = query(

            collection(db,"usage_logs"),

            orderBy("timestamp","desc")

        );



        const snapshot = await getDocs(q);




        let totalVisit = 0;

        let totalContent = 0;




        // =====================================
        // 데이터 저장 공간
        // =====================================


        const officeCount = {};



        const contentCount = {};



        const officeContentCount = {};



        const participateOffice = new Set();




        // =====================================
        // 총괄국 초기화
        // =====================================


        Object.keys(offices).forEach(code=>{


            officeCount[offices[code]] = 0;


        });






        // =====================================
        // 데이터 분석
        // =====================================


        snapshot.forEach((doc)=>{


            const data = doc.data();



            console.log(
                "데이터:",
                data
            );






            // =================================
            // 방문 기록
            // =================================


            if(data.event === "visit"){



                totalVisit++;




                const officeName =
                    data.officeName;



                if(officeName){



                    participateOffice.add(
                        officeName
                    );




                    if(
                        officeCount[officeName]
                        !== undefined
                    ){


                        officeCount[officeName]++;


                    }
                    else{


                        officeCount[officeName] = 1;


                    }


                }



            }







            // =================================
            // 콘텐츠 이용 기록
            // =================================


            if(data.event === "click"){



                totalContent++;




                let content =
                    data.content || "기타";





                // 기존 테스트 명칭 정리

                if(content === "campaign"){


                    content =
                    "금융사기 예방 캠페인송";


                }





                // 콘텐츠별 합계

                if(contentCount[content]){


                    contentCount[content]++;


                }
                else{


                    contentCount[content] = 1;


                }








                // =============================
                // 총괄국별 콘텐츠 집계
                // =============================



                const officeName =
                    data.officeName;




                if(officeName){



                    if(
                        !officeContentCount[officeName]
                    ){


                        officeContentCount[officeName] = {};


                    }





                    if(
                        officeContentCount[officeName][content]
                    ){


                        officeContentCount[officeName][content]++;


                    }
                    else{


                        officeContentCount[officeName][content]=1;


                    }



                }



            }




        });








        // =====================================
        // 상단 카드 표시
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
            participateOffice.size;







        let rate = 0;



        if(totalVisit > 0){


            rate =
            Math.round(
                (totalContent / totalVisit)
                * 100
            );


        }






        document.getElementById(
            "contentRate"
        ).innerText =
            rate;








        // =====================================
        // 총괄국별 접속 현황
        // =====================================



        const officeTable =
            document.getElementById(
                "officeTable"
            );



        officeTable.innerHTML="";





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




        contentTable.innerHTML="";






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




        officeContentTable.innerHTML="";






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

    catch(error){



        console.error(

            "통계 오류:",

            error

        );



    }



}






// =====================================
// 실행
// =====================================


loadStatistics();
