export default function() {
  return {
    restrict: 'E',
    scope: {
      highlights: '=addHighlights'
    },
    templateUrl: '/highlights.html'
  };
};
