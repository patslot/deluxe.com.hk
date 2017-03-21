export default function() {
  return {
    restrict: 'E',
    scope: {
      contributors: '='
    },
    templateUrl: '/partials/contributorBlock.html'
  };
};
