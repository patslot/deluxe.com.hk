$(document).ready(function() {

  var updateSticky = function () {
    var nmHeader = $('.nm_header');
    var stickyPlaceholder = $('.sticky-placeholder');
    var skinnerAD = $('.skinner_ad_wrapper .skinner_ad');
    var scrollTop = $(document).scrollTop();
    var GDPRLargeScreen = window.matchMedia('(min-width: 1025px)').matches;
    var skinnerTrigerTop = $('.ls_banner').outerHeight(true) ? 160 + $('.ls_banner').outerHeight(true) : 160;
    skinnerTrigerTop = $('.sub-categories').outerHeight(true) ? skinnerTrigerTop + $('.sub-categories').outerHeight(true) : skinnerTrigerTop;
  if (window.matchMedia('(min-width: 970px)').matches) {
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
     
      $('.nm_v_menu').css('top','auto');
      if (scrollTop > 80) {
        $('.nm_header').css('margin-top','130px');
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
        $('.nm_header.fixed #sticky-wrap .nav').css('top','130px');
      } else {
        $('.nm_header').css('margin-top','0px');
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
        $('.nm_header #sticky-wrap .nav').css('top','auto');
      }
    }else{

      $('.nm_v_menu').css('top','0');
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

  var isLargeScreen = window.matchMedia('(min-width: 970px)').matches;
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
    if (window.matchMedia('(min-width: 970px)').matches) {
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

$('#searchdropdown').on( "click", function() {
    $('#search-dropdown').css('display','flex');
    $('#search-dropdown').removeClass("fadeOutRight");
    $('#search-dropdown').toggleClass("fadeInRight");
    $('#search-dropdown').css('animation-delay','0ms');
    
    setTimeout(
      function() 
      {
        $('#search-dropdown').css('display','flex');
        $( "input[name='query']" ).focus();
      }, 1000);
});
$('#searchclose').on( "click", function() {
  $('#search-dropdown').removeClass("fadeInRight");
    $('#search-dropdown').toggleClass("fadeOutRight");
    $('#search-dropdown').css('animation-delay','0ms');
    setTimeout(
      function() 
      {
        $('#search-dropdown').css('display','');
      }, 500);
    
}); 

$('#mobilesearchdropdown').on( "click", function() {
  $('#mobile-search-dropdown').css('display','flex');
  $('#mobile-search-dropdown').removeClass("fadeOutRight");
  $('#mobile-search-dropdown').toggleClass("fadeInRight");
  $('#mobile-search-dropdown').css('animation-delay','0ms');
  setTimeout(
    function() 
    {
      $('#mobile-search-dropdown').css('display','flex');
      $( "input[name='mobilequery2']" ).focus();
      
    }, 1000);
});
$('#mobilesearchclose').on( "click", function() {
$('#mobile-search-dropdown').removeClass("fadeInRight");
  $('#mobile-search-dropdown').toggleClass("fadeOutRight");
  $('#mobile-search-dropdown').css('animation-delay','0ms');
  setTimeout(
    function() 
    {
      $('#mobile-search-dropdown').css('display','');
    }, 500);
  
}); 
$('.mobilesearchform').submit(function( event ) {
  var pathname = $(location).attr('host');;
  event.preventDefault();
  if ( $( "input[name='mobilequery']" ).val() != "" ) {
    window.location.href = "http://" + pathname + "/Search/" + $( "input[name='mobilequery']" ).val() ;
    return;
  }
});
$('.mobilesearchform2').submit(function( event ) {
  var pathname = $(location).attr('host');;
  event.preventDefault();
  if ( $( "input[name='mobilequery2']" ).val() != "" ) {
    window.location.href = "http://" + pathname + "/Search/" + $( "input[name='mobilequery2']" ).val() ;
    return;
  }
});
$('.searchform').submit(function( event ) {
  var pathname = $(location).attr('host');;
  event.preventDefault();
  if ( $( "input[name='query']" ).val() != "" ) {
    window.location.href = "http://" + pathname + "/Search/" + $( "input[name='query']" ).val() ;
    return;
  }
});

var Showfadeinoutbanner = true ; 
function hidefadeinoutbanner(){
  $("#fadeinoutbanner").css('bottom','-360px');
  Showfadeinoutbanner = false ; 
}
$(document).scroll(function(){
  if(($(document).scrollTop() > 500) && (Showfadeinoutbanner == true )){
    $("#fadeinoutbanner").css('bottom','0');
    setTimeout(hidefadeinoutbanner, 10000);
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
