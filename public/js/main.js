var minimizeHeader = function () {
    var nmHeader = $('.nm_header');
    var nmHeaderLogo = $('.nm_header .index-logo');
    var scrollTop = $(document).scrollTop();
    var height = nmHeaderLogo.height()
    if (nmHeaderLogo.css('display') === 'none') {
        height = 0;
    }
    if (scrollTop > height) {
        nmHeader.addClass('fixed');
    } else {
        nmHeader.removeClass('fixed');
    }
}

var updateSkinnerADPos = function () {
    var skinnerAD = $('.skinner_ad_wrapper');
    var headerHeight = $('.nm_header').height();
    var stickyWrapHeight = $('.nm_header.fixed #sticky-wrap').height();
    var scrollTop = $(document).scrollTop()
    if (headerHeight) {
        var targetTop = headerHeight - scrollTop
        skinnerAD.css('top', targetTop);
        return;
    }
    skinnerAD.css('top', stickyWrapHeight);
}

$(document).scroll(minimizeHeader);
$(document).scroll(updateSkinnerADPos);
