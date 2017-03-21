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
    var scrollTop = $(document).scrollTop()
    var targetTop = headerHeight - scrollTop
    targetTop = targetTop > 0 ? targetTop : headerHeight;
    skinnerAD.css('top', targetTop);
}

$(document).scroll(minimizeHeader);
$(document).scroll(updateSkinnerADPos);
