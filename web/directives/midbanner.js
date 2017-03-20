export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@midbannerId'
    },
    templateUrl: '/partials/midbanner.html',
    link: function ($scope, element, attrs) {
      var midbannerId = attrs.midbannerId;
      setTimeout(function() {
        showWebAd("Midbanner", midbannerId);
      }, 0);
    }
  };
};
