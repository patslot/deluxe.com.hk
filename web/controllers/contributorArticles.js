export default function($timeout, $scope, gqModel, $attrs) {
  gqModel.queryContributorArticles($attrs.contrName).then(function(res) {
    $timeout(function() {
      $scope.categs = res.listMenu || [];
      $scope.contributors = res.listContributorArticle || [];
    });
  });
};
