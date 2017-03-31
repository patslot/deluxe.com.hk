$(document).ready(function() {
  var minimizeHeader = function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
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
  }

  var updateSkinnerADPos = function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
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
  }

  $(document).scroll(minimizeHeader);
  $(document).scroll(updateSkinnerADPos);

  var toggleMenu = function() {
    var $content = $('[vmenu="content"]').first();
    var $siblingContent = $('[vmenu="sibling"]');
    var $nmHome = $('.nm_home');
    var $nmHeader = $('.nm_header');
    var $mobilePanel = $('.nm_v_menu');
    if ($nmHome.hasClass('nav-panel-active')) {
      $nmHome.removeClass('nav-panel-active');
      $nmHeader.removeClass('nav-panel-active');
      $mobilePanel.removeClass('nav-panel-active')
    } else {
      $nmHome.addClass('nav-panel-active');
      $nmHeader.addClass('nav-panel-active');
      $mobilePanel.addClass('nav-panel-active')
    }
  }

  $('[vmenu="trigger"]').on('click', toggleMenu);
  $('[vmenu="menu_close_trigger"]').on('click', toggleMenu);
  $(window).resize(function() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      var $mobilePanel = $('.nm_v_menu');
      if ($mobilePanel.hasClass('nav-panel-active')) {
        var $nmHome = $('.nm_home');
        var $nmHeader = $('.nm_header');
        $nmHome.removeClass('nav-panel-active');
        $nmHeader.removeClass('nav-panel-active');
        $mobilePanel.removeClass('nav-panel-active')
      }
    }
  });

  $('#upcoming_events_content').endlessScroll({
    callback: function() {
      var $eventItem = $('#upcoming_events_content div.nm_section_content:nth-last-child('
        + numOfUpcomingEvents.toString() + ')').clone();
      $('#upcoming_events_content .endless_scroll_inner_wrap').append($eventItem);
    }
  });
});
