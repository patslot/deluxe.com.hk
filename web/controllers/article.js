export default function($timeout, $scope, $attrs, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var articleId = $attrs.articleId;

  var handleRes = function (articleKey, res) {
    $timeout(function () {
      var articles = (res[articleKey] || []).filter(function (item) {
        return item.id !== articleId;
      });

      $scope.latestArticles = queryHandler.parseArticles(
        categName, articles.slice(0, 12));
      $scope.igMedias = res.listInstagram || [];
    });
  };

  if (categEname === 'editor_picks') {
    gqModel.queryEditorPicks().then(function (res) {
      res.listEditorPick.forEach(function (item) {
        item.__typename = 'CmsArticle';
      });
      handleRes('listEditorPick', res);
    });
  } else {
    var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
    if (listCategArticle) {
      gqModel.queryArticle(listCategArticle).then(function(res) {
        handleRes('listFashionArticle', res);
      });
    }
  }
};
