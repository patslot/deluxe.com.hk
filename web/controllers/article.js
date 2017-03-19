export default function($timeout, $scope, $attrs, gqModel, c, articleHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var articleId = $attrs.articleId;

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  if (listCategArticle) {
    gqModel.queryArticle(listCategArticle).then(function(res) {
      $timeout(function() {
        $scope.categs = res.listMenu || [];
        var articles = (res.listFashionArticle || []).filter(function (item) {
          return item.id !== articleId;
        });

        $scope.latestArticles = articleHandler.parseArticles(
          categName, articles.slice(0, 12));
        $scope.igMedias = res.listInstagram || [];
      });
    });
  }
};
