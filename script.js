document.addEventListener("DOMContentLoaded", () => {
    const cardGrid = document.getElementById("card-grid");
    const navItems = document.querySelectorAll(".nav-item");
    let allData = []; // 원본 데이터를 저장할 배열

    // 1. data.json 파일 가져오기
    fetch("data.json")
        .then(response => {
            if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
            return response.json();
        })
        .then(data => {
            allData = data;
            renderCards(allData); // 처음에는 전체 카드 렌더링
            initFilter();         // 필터 인터랙션 초기화
        })
        .catch(error => {
            console.error("데이터 로드 중 에러 발생:", error);
            cardGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:60px; color:#9CA3AF;">콘텐츠를 로드하지 못했습니다.</p>`;
        });

    // 2. 카드 렌더링 함수
    function renderCards(cards) {
        cardGrid.innerHTML = ""; // 기존 그리드 초기화

        if(cards.length === 0) {
            cardGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:60px; color:#9CA3AF;">등록된 콘텐츠가 없습니다.</p>`;
            return;
        }

        cards.forEach((item, index) => {
            // 링크 감싸기
            const aTag = document.createElement("a");
            // data.json의 원본 인덱스를 찾아 detail.html로 연결
            const originalIndex = allData.indexOf(item);
            aTag.href = `html/detail.html?index=${originalIndex}`;
            aTag.classList.add("card-link");

            const imageUrl = "./" + item["output-image"];

            // 카드 레이아웃 바인딩
            aTag.innerHTML = `
                <div class="card">
                    <div class="card-thumb">
                        <img src="${imageUrl}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <span class="card-tag">${item.category}</span>
                        <h3 class="card-title">${item.title}</h3>
                    </div>
                </div>
            `;
            cardGrid.appendChild(aTag);
        });
    }

    // 3. 상단 내비게이션 메뉴 카테고리 필터링 기능
    function initFilter() {
        navItems.forEach(button => {
            button.addEventListener("click", (e) => {
                // 기존 활성화 클래스 제거 후 클릭한 버튼에 부여
                navItems.forEach(nav => nav.classList.remove("active"));
                e.target.classList.add("active");

                const targetCategory = e.target.getAttribute("data-category");

                // '🔮 AINote' 버튼(전체보기)이거나 데이터 속성이 'all'일 때
                if (targetCategory === "all") {
                    renderCards(allData);
                } else {
                    // 카테고리가 일치하는 데이터만 걸러서 화면 업데이트
                    const filteredData = allData.filter(item => item.category === targetCategory);
                    renderCards(filteredData);
                }
            });
        });
    }
});
