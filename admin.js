// =====================================
// 관리자 통계 대시보드
// =====================================

import {
    db
} from "./firebase.js";


import {
    collection,
    getDocs,
    query,
    orderBy
}
from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";



// =====================================
// 통계 데이터 불러오기
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



        const officeCount = {};

        const contentCount = {};



        snapshot.forEach((doc)=>{


            const data = doc.data();



            console.log(
                "데이터:",
                data
            );



            // 방문 기록

            if(data.event === "visit"){


                totalVisit++;


                const office =
                    data.officeName || "미지정";


                if(
                    officeCount[office]
                ){

                    officeCount[office]++;

                } else {

                    officeCount[office] = 1;

                }

            }



            // 콘텐츠 클릭

            if(data.event === "click"){


                totalContent++;


                const content =
                    data.content || "미지정";



                if(
                    contentCount[content]
                ){

                    contentCount[content]++;

                } else {

                    contentCount[content] = 1;

                }

            }



        });



        console.log(
            "방문:",
            totalVisit
        );


        console.log(
            "콘텐츠:",
            totalContent
        );



        // ===============================
        // 숫자 표시
        // ===============================


        document.getElementById(
            "totalVisit"
        ).innerText =
            totalVisit;



        document.getElementById(
            "totalContent"
        ).innerText =
            totalContent;



        // ===============================
        // 총괄국 표 출력
        // ===============================


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

            </tr>

            `;


        });



        // ===============================
        // 콘텐츠 표 출력
        // ===============================


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
