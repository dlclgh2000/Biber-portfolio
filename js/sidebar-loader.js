$(document).ready(function () {
    // #sidebar-container 요소에 sidebar.html 내용을 로드
    $("#sidebar-container").load("sidebar.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("Sidebar load failed: " + xhr.status + " " + xhr.statusText);
            return;
        }

        // 로드 완료 후 현재 페이지 활성화 로직 실행
        var currentPage = window.location.pathname.split("/").pop();
        if (currentPage === "" || currentPage === undefined) {
            currentPage = "index.html";
        }

        // 모든 list-block 링크를 순회하며 현재 페이지와 일치하는지 확인
        $(".list-block").each(function () {
            var linkHref = $(this).attr("href");
            
            // 링크가 현재 페이지와 같다면 스타일 변경 (선택사항)
            if (linkHref === currentPage) {
                $(this).addClass("active-page");
                
                // 예시: 활성화된 메뉴의 배경색을 살짝 변경하거나 테두리 추가
                // $(this).css("border", "2px solid #3B4259");
                // $(this).css("border-radius", "12px");
            }
        });
    });
});
