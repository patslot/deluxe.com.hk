export default function($timeout, $scope, gqModel) {
  gqModel.queryContributorIndex().then(function(res) {
    $timeout(function() {
      $scope.categs = res.listMenu || [];
      $scope.contributors = res.listContributor || [];
    });
  });
};
