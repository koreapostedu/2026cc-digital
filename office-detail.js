// =====================================
// 총괄국 상세 통계
// =====================================


import { db } from "./firebase.js";


import {
    collection,
    getDocs,
    query,
    where,
    orderBy
}
from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";




// =====================================
// 상세 통계 불러오기
// =====================================


async function loadOfficeDetail(){



    console.log("총괄국 상세 조회 시작");




    try {



        // =============================
        // URL에서 국명 가져오기
        // =============================


        const params =
            new URLSearchParams(
                window.location.search
            );


        const officeName =
            params.get("office");





        if(!officeName){


            document.getElementById(
                "officeTitle"
            ).innerText =
            "총괄국 정보 없음";


            return;


        }








        // =============================
        // 제목 표시
        // =============================



        document.getElementById(
            "officeTitle"
        ).innerText =
        `${officeName} 총괄국 운영 상세 현황`;









        // =============================
        // Firebase 조회
        // =============================



        const q = query(

            collection(db,"usage_logs"),

            where(
                "officeName",
                "==",
                officeName
            ),

            orderBy(
                "timestamp",
                "desc"
            )

        );





        const snapshot =
            await getDocs(q);







        let totalVisit = 0;

        let totalContent = 0;



        const contentCount = {};








        snapshot.forEach((doc)=>{



            const data =
                doc.data();





            // 방문 기록

            if(
                data.event === "visit"
            ){


                totalVisit++;


            }






            // 콘텐츠 이용 기록

            if(
                data.event === "click"
            ){


                totalContent++;




                let content =
                    data.content || "기타";





                if(
                    content === "campaign"
                ){


                    content =
                    "금융사기 예방 캠페인송";


                }





                if(
                    contentCount[content]
                ){


                    contentCount[content]++;


                }
                else{


                    contentCount[content]=1;


                }



            }




        });










        // =============================
        // 숫자 표시
        // =============================



        document.getElementById(
            "detailVisit"
        ).innerText =
            totalVisit;






        document.getElementById(
            "detailContent"
        ).innerText =
            totalContent;









        // =============================
        // 콘텐츠 표 출력
        // =============================



        const table =
            document.getElementById(
                "detailContentTable"
            );



        table.innerHTML = "";







        if(
            Object.keys(contentCount).length === 0
        ){



            table.innerHTML = `

            <tr>

                <td colspan="2">

                콘텐츠 이용 기록이 없습니다.

                </td>

            </tr>

            `;


        }

        else{



            Object.keys(contentCount)
            .forEach((content)=>{



                table.innerHTML += `

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









        // =============================
        // 운영 현황 메시지
        // =============================



        const message =
            document.getElementById(
                "detailMessage"
            );





        if(
            totalVisit === 0
        ){


            message.innerText =
            "현재 해당 총괄국의 이용 기록이 없습니다.";


        }
        else{


            message.innerText =
            `${officeName} 총괄국에서 총 ${totalVisit}회의 접속과 ${totalContent}회의 콘텐츠 이용이 확인되었습니다.`;

        }







    }

    catch(error){


        console.error(
            "상세 조회 오류:",
            error
        );


    }



}







// 실행

loadOfficeDetail();
