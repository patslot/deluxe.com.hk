var minimizeHeader = function () {
  var nmHeader = $('.nm_header');
  var logo = $('.nm_header .index-logo .logo');
  var stickyWrap = $('.nm_header #sticky-wrap');
  var scrollTop = $(document).scrollTop();
  var height = logo.height();

  if (scrollTop > height) {
    nmHeader.addClass('fixed');
  } else {
    nmHeader.removeClass('fixed');
  }
}

var updateSkinnerADPos = function () {
  var skinnerAD = $('.skinner_ad_wrapper');
  var header = $('.nm_header');
  var logo = $('.nm_header .index-logo .logo');
  var stickyWrap = $('.nm_header #sticky-wrap');
  var scrollTop = $(document).scrollTop();

  if (header.hasClass('fixed')) {
    skinnerAD.css('top', stickyWrap.height());
  } else {
    var targetTop = logo.outerHeight(true) + stickyWrap.height() - scrollTop;
    skinnerAD.css('top', targetTop);
  }
}

$(document).scroll(minimizeHeader);
$(document).scroll(updateSkinnerADPos);
