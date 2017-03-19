export default function($location) {
  return {
    restrict: 'E',
    scope: {
      title: '@postTitle'
    },
    templateUrl: '/partials/shareBar.html',
    link: function (scope) {
      scope.url = $location.absUrl();
    }
  };
};
