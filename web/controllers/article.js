export default function($timeout, $scope, $attrs, gqModel) {
  var categEname = $attrs.categEname;

  gqModel.queryArticle(categEname, 1, 13).then(function(res) {
    $timeout(function() {
      $scope.categs = res.listMenu || [];
      var articles = res.listArticle || [];
      // TODO(wkchan): Dedup latest articles with current article
      $scope.latestArticles = articles;
      $scope.igMedias = res.listInstagram || [];
    });
  });
};
