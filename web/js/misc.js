$(document).ready(function() {
  var updateSticky = function () {
    var nmHeader = $('.nm_header');
    var stickyPlaceholder = $('.sticky-placeholder');
    var skinnerAD = $('.skinner_ad_wrapper .skinner_ad');
    var scrollTop = $(document).scrollTop();
    var GDPRLargeScreen = window.matchMedia('(min-width: 1025px)').matches;
    var skinnerTrigerTop = $('.ls_banner').outerHeight(true) ? 160 + $('.ls_banner').outerHeight(true) : 160;
    skinnerTrigerTop = $('.sub-categories').outerHeight(true) ? skinnerTrigerTop + $('.sub-categories').outerHeight(true) : skinnerTrigerTop;
  if (window.matchMedia('(min-width: 768px)').matches) {
    if ( $('#div-GDPR-message').css('display') != "none" && $('#div-GDPR-message').length > 0 ) {
      var GDPR_height = $('#div-GDPR-message').outerHeight(true);
      if (scrollTop > 80) {
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
        $('.nm_header.fixed #sticky-wrap .nav').css('top','65px');
      } else {
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
        $('.nm_header #sticky-wrap .nav').css('top','auto');
      }
      if (scrollTop > skinnerTrigerTop - 80) {
        skinnerAD.css('top', 145);
      } else {
        skinnerAD.css('top', skinnerTrigerTop - scrollTop + 60);
      }
    }
    else{
      if (scrollTop > 80) {
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
        $('.nm_header.fixed #sticky-wrap .nav').css('top','0px');
      } else {
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
        $('.nm_header #sticky-wrap .nav').css('top','auto');
      }
      if (scrollTop > skinnerTrigerTop - 80) {
        skinnerAD.css('top', 80);
      } else {
        skinnerAD.css('top', skinnerTrigerTop - scrollTop);
      }
    }
  }
  else{
    if ( $('#div-GDPR-message').css('display') != "none" && $('#div-GDPR-message').length > 0 ) {
     
      if (scrollTop > 80) {
        $('.nm_header').css('margin-top','140px');
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
        $('.nm_header.fixed #sticky-wrap .nav').css('top','140px');
      } else {
        $('.nm_header').css('margin-top','0px');
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
        $('.nm_header #sticky-wrap .nav').css('top','auto');
      }
    }else{
      $('.nm_header').css('margin-top','0px');
      $('.nm_header #sticky-wrap .nav').css('top','auto');
    }
  }
};
var GDPRcheck = setInterval(function(){
      updateSticky();
}, 100);

setTimeout(function(){
  window.clearInterval(GDPRcheck);
},5000);


	updateSticky();
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

  var isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  $(window).resize(function() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      if (!isLargeScreen) {
        updateSticky();
      }
      isLargeScreen = true;
      var $mobilePanel = $('.nm_v_menu');
      if ($mobilePanel.hasClass('nav-panel-active')) {
        var $nmHome = $('.nm_home');
        var $nmHeader = $('.nm_header');
        $nmHome.removeClass('nav-panel-active');
        $nmHeader.removeClass('nav-panel-active');
        $mobilePanel.removeClass('nav-panel-active')
      }
    } else {
      isLargeScreen = false;
    }
  });
    
       
 $('#homempm').slick({
                        dots: false,
                      infinite: true,
                      speed: 300,
                      autoplay: true,
     nextArrow: '<a class="right carousel-control"></a>',
  prevArrow: '<a class="left carousel-control" style="z-index:99;"></a>'
            }).show();  

  
        
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
