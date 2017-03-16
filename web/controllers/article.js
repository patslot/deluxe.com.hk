export default function($timeout, $scope, $attrs, gqModel, c, articleHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  if (listCategArticle) {
    gqModel.queryArticle(listCategArticle).then(function(res) {
      $timeout(function() {
        $scope.categs = res.listMenu || [];
        // TODO(wkchan): Dedup latest articles with current article
        $scope.latestArticles = articleHandler.parseArticles(
          categName, res[listCategArticle]);
        $scope.igMedias = res.listInstagram || [];
      });
    });
  }
};
