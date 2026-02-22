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

// 반응형 Masonry 레이아웃 (데스크탑 3열, 태블릿 2열, 모바일 1열)
$(document).ready(function() {
    const $container = $('.flex-masonry');
    if ($container.length === 0) return;

    let $items = $container.find('.portfolio-item');
    if ($items.length === 0) return;

    function getMode() {
        var w = window.innerWidth;
        if (w >= 992) return 'desktop';
        if (w >= 561) return 'tablet';
        return 'mobile';
    }

    var currentMode = getMode();

    layout();

    $(window).on('resize', function() {
        var newMode = getMode();
        if (newMode !== currentMode) {
            currentMode = newMode;
            layout();
        }
    });

    function getItems() {
        var items = [];
        $container.find('.portfolio-item').each(function() {
            items.push($(this));
        });
        items.sort(function(a, b) {
            return $(a).data('order') - $(b).data('order');
        });
        return items;
    }

    function layout() {
        var items = getItems();

        if (currentMode === 'desktop') {
            var col1 = $('<div class="masonry-col" style="flex:1;"></div>');
            var col2 = $('<div class="masonry-col" style="flex:1;"></div>');
            var col3 = $('<div class="masonry-col" style="flex:1;"></div>');

            items.forEach(function($item, index) {
                var r = index % 3;
                if (r === 0) col1.append($item);
                else if (r === 1) col2.append($item);
                else col3.append($item);
            });

            $container.empty().append(col1, col2, col3);
        } else if (currentMode === 'tablet') {
            var col1 = $('<div class="masonry-col" style="flex:1;"></div>');
            var col2 = $('<div class="masonry-col" style="flex:1;"></div>');

            items.forEach(function($item, index) {
                if (index % 2 === 0) col1.append($item);
                else col2.append($item);
            });

            $container.empty().append(col1, col2);
        } else {
            $container.empty();
            items.forEach(function($item) {
                $container.append($item);
            });
        }
    }
});