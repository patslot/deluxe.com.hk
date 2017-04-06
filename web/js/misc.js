$(document).ready(function() {
  var updateSticky = function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
      var nmHeader = $('.nm_header');
      var stickyPlaceholder = $('.sticky-placeholder');
      var skinnerAD = $('.skinner_ad_wrapper');
      var scrollTop = $(document).scrollTop();

      if (scrollTop > 95) {
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
        skinnerAD.css('top', 65);
      } else {
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
        skinnerAD.css('top', 160 - scrollTop);
      }
    }
  };

  $(document).scroll(updateSticky);

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

/* Disable for later use
  $('#upcoming_events_content').endlessScroll({
    callback: function() {
      var $eventItem = $('#upcoming_events_content div.nm_section_content:nth-last-child('
        + numOfUpcomingEvents.toString() + ')').clone();
      $('#upcoming_events_content .endless_scroll_inner_wrap').append($eventItem);
    }
  });
*/
});
