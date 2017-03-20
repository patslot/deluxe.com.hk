export default function($timeout, $scope, gqModel, queryHandler) {
  gqModel.queryContributorIndex().then(function(res) {
    $timeout(function() {
      $scope.categs = queryHandler.parseMenu(res.listMenu);
      $scope.contributors = res.listContributor || [];
    });
  });
};
