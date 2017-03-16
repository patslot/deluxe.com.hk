export default function($timeout, $scope, $attrs, gqModel, c) {
  var categEname = $attrs.categEname;

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  if (listCategArticle) {
    gqModel.queryArticle(listCategArticle).then(function(res) {
      $timeout(function() {
        $scope.categs = res.listMenu || [];
        var articles = res[listCategArticle]|| [];
        // TODO(wkchan): Dedup latest articles with current article
        $scope.latestArticles = articles;
        $scope.igMedias = res.listInstagram || [];
      });
    });
  }
};
