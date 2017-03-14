export default function() {
  return {
    restrict: 'E',
    scope: {
      picks: '=addPicks',
    },
    templateUrl: '/editorPicks.html'
  };
};
