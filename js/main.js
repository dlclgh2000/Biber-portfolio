//메뉴토글
$(document).on('click', '.navbar-toggler', function (e) {
    e.preventDefault();
    $('.menu-trigger').toggleClass('active-7');
});

// 모바일 메뉴 열기/닫기 토글
$(document).on('click', '.mobile-menu-btn', function (e) {
    e.preventDefault();
    const $sidebar = $('.side-list');
    const $btn = $(this);
    
    // active 클래스 토글 (버튼 자체에도 active 클래스 추가하여 애니메이션 작동)
    if ($sidebar.hasClass('active')) {
        $sidebar.removeClass('active');
        $btn.removeClass('active'); // 햄버거로 복귀
        $('body').css('overflow', ''); // 스크롤 복구
    } else {
        $sidebar.addClass('active');
        $btn.addClass('active'); // X로 변환
        $('body').css('overflow', 'hidden'); // 스크롤 방지
    }
});

// 모바일 메뉴 내부 닫기 버튼 (사이드바 내부 X 버튼)
$(document).on('click', '.mobile-menu-close', function (e) {
    e.preventDefault();
    $('.side-list').removeClass('active');
    $('.mobile-menu-btn').removeClass('active'); // 상단 버튼도 초기화
    $('body').css('overflow', '');
});

// 모바일 메뉴 외부 클릭 시 닫기
$(document).on('click', function(e) {
    if ($(window).width() < 992) { 
        if (!$(e.target).closest('.side-list').length && !$(e.target).closest('.mobile-menu-btn').length) {
            $('.side-list').removeClass('active');
            $('.mobile-menu-btn').removeClass('active'); // 상단 버튼도 초기화
            $('body').css('overflow', '');
        }
    }
});

// 반응형 Masonry 레이아웃 (모바일 순서 최적화)
$(document).ready(function() {
    const $container = $('.flex-masonry');
    if ($container.length === 0) return;

    // 아이템들을 캐싱해둠 (초기 로드 시점의 아이템들)
    // data-order가 없으면 인덱스로 할당
    let $items = $container.find('.portfolio-item');
    if ($items.length === 0) {
        // 만약 portfolio-item 클래스가 아직 없다면 (기존 HTML 구조일 경우 대비 - 하지만 HTML도 같이 바꿀 것이므로 괜찮음)
        return;
    }

    let isDesktop = window.innerWidth >= 960;
    
    // 초기 로드시 실행
    layout();

    $(window).on('resize', function() {
        const newIsDesktop = window.innerWidth >= 960;
        if (newIsDesktop !== isDesktop) {
            isDesktop = newIsDesktop;
            layout();
        }
    });

    function layout() {
        if (isDesktop) {
            // PC: 3컬럼으로 분배
            if ($container.find('.masonry-col').length > 0) return; // 이미 분배됨

            const col1 = $('<div class="masonry-col" style="flex:1;"></div>');
            const col2 = $('<div class="masonry-col" style="flex:1;"></div>');
            const col3 = $('<div class="masonry-col" style="flex:1;"></div>');

            // 현재 컨테이너에 있는 아이템들을 모두 가져와서 정렬
            const currentItems = [];
            $container.find('.portfolio-item').each(function() {
                currentItems.push($(this));
            });
            
            // data-order 기준으로 정렬
            currentItems.sort(function(a, b) {
                return $(a).data('order') - $(b).data('order');
            });

            currentItems.forEach(function($item, index) {
                const remainder = index % 3;
                if (remainder === 0) col1.append($item);
                else if (remainder === 1) col2.append($item);
                else col3.append($item);
            });

            $container.empty().append(col1, col2, col3);
        } else {
            // Mobile: 1컬럼으로 병합 (순서대로)
            if ($container.find('.masonry-col').length === 0) return; // 이미 1컬럼임

            const currentItems = [];
            $container.find('.portfolio-item').each(function() {
                currentItems.push($(this));
            });

            // data-order 기준으로 정렬
            currentItems.sort(function(a, b) {
                return $(a).data('order') - $(b).data('order');
            });

            $container.empty();
            currentItems.forEach(function($item) {
                $container.append($item);
            });
        }
    }
});