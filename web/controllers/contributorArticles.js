export default function($timeout, $scope, gqModel, $attrs, queryHandler) {
  gqModel.queryContributorArticles($attrs.contrName).then(function(res) {
    $timeout(function() {
      $scope.categs = queryHandler.parseMenu(res.listMenu);
      $scope.contributors = res.listContributorArticle || [];
    });
  });
};
