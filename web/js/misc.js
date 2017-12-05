$(document).ready(function() {
  var updateSticky = function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
			var nmHeader = $('.nm_header');
      var stickyPlaceholder = $('.sticky-placeholder');
      var skinnerAD = $('.skinner_ad_wrapper .skinner_ad');
      var scrollTop = $(document).scrollTop();
      var skinnerTrigerTop = $('.ls_banner').outerHeight(true) ? 160 + $('.ls_banner').outerHeight(true) : 160;
      skinnerTrigerTop = $('.sub-categories').outerHeight(true) ? skinnerTrigerTop + $('.sub-categories').outerHeight(true) : skinnerTrigerTop;

      if (scrollTop > 80) {
        nmHeader.addClass('fixed');
        stickyPlaceholder.addClass('fixed');
      } else {
        nmHeader.removeClass('fixed');
        stickyPlaceholder.removeClass('fixed');
      }

      if (scrollTop > skinnerTrigerTop - 80) {
        skinnerAD.css('top', 80);
      } else {
        skinnerAD.css('top', skinnerTrigerTop - scrollTop);
      }
    }
  };

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
    
       
function touchWithinElement(tx,ty,element){
     var mpm = {
        mpm_x : element.position().left ,
        mpm_y : element.position().top ,
        mpm_x2 : element.position().left + element.width() ,
        mpm_y2 : element.position().top  + element.height(),
    } 
     if (
            ( (tx>mpm.mpm_x) && (tx < mpm.mpm_x2)) && 
            ( (ty>mpm.mpm_y) && (ty < mpm.mpm_y2))    
        ){
         return true ;
     }else{
         return false;
     }
} 
function handleTouchStart(evt,div) {                                         
     xDown = evt.touches[0].clientX;                                      
     yDown = evt.touches[0].clientY;   
    
    if (touchWithinElement(xDown,yDown, div) ){
        return true ;
    }else {
         xDown = null;                                                        
         yDown = null;  
        return false ;
    }
};       

function handleTouchMove(evt,div) {
  
    if (touchWithinElement(xDown,yDown, div) ){    
        
        
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if(Math.abs( xDiff )+Math.abs( yDiff )>150){ //to deal with to short swipes

            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                if ( xDiff > 0 ) {/* left swipe */ 
                   
                   div.carousel('next');
                } else {/* right swipe */
                  
                   div.carousel('prev');
                }                       
            } else {
                if ( yDiff > 0 ) {/* up swipe */
                    //alert('Up!'); 
                } else { /* down swipe */
                    //alert('Down!');
                }                                                                 
            }
            /* reset values */
            xDown = null;
            yDown = null;
        }
    }else{
        return false ;
    }
};  
    var xDown = null;                                      
    var yDown = null; 
    if($('#home-slidesshow-block').length){
          var targetMPM = $('#home-slideshow-block') ;
         document.addEventListener('touchstart', function(e){handleTouchStart(e,targetMPM);}, false);    
         document.addEventListener('touchmove',  function(e){handleTouchMove(e,targetMPM);}, false); 
    }
  
        
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
