export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@fixedbannerId'
    },
    templateUrl: '/partials/fixedbanner.html',
    link: function ($scope, element, attrs) {
      var fixedbannerId = attrs.fixedbannerId;
      var fixedbannerNum = attrs.fixedbannerNum;
      if (fixedbannerNum) {
        fixedbannerNum = +fixedbannerNum;
      } else {
        fixedbannerNum = 1;
      }
      fixedbannerNum = Math.min(fixedbannerNum, 4);
      setTimeout(function() {
        showMobileAd("Fixedbanner" + fixedbannerNum, fixedbannerId);
      }, 0);
    }
  };
};
