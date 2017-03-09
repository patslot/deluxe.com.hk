export default function($scope, $attrs, gqModel) {
  var categEname = $attrs.categEname;

  gqModel.queryCateg(categEname, 1, 8).then(function(res) {
    $scope.$apply(function() {
      $scope.categs = res.listMenu || [];
      var articles = res.listArticle || [];
      $scope.latestArticles = articles.slice(0, 4);
      $scope.secLatestArticles = articles.slice(4, 8);
    });
  });
};
