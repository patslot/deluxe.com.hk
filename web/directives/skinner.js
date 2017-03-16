export default function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/skinner.html',
    link: function ($scope, element, attrs) {
      var updateSkinnerAd = function(){
        var $alignTop = angular.element('[skinner_ad="align_top"]').first();
        if ($alignTop.length === 0) {
          return;
        }
        var top = $alignTop.position().top;
        var scrollTop = $(document).scrollTop();
        var targetTop = 0;
        if (scrollTop < top){
          targetTop = top - scrollTop;
        }
        $('.skinner_ad').css('top', targetTop);
      }
      $(window).scroll(updateSkinnerAd);
    }
  };
};
