export default function($timeout, $scope, $attrs, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var articleId = $attrs.articleId;
  var articleAuthor = $attrs.articleAuthor;
  var offset = 0;
  var recommendCount = 12;

  var handleRes = function (articleKey, res, parseFunc) {
    $timeout(function () {
      $scope.igMedias = queryHandler.parseInstagram(res.listInstagram);
      var articles = (res[articleKey] || []).filter(function (item) {
        return item.id !== articleId;
      }).slice(0, recommendCount);

      $scope.latestArticles = parseFunc(categName, articles);
    });
  };

  if (categEname === 'editor_picks') {
    gqModel.queryEditorPicks(offset, recommendCount + 1).then(function (res) {
      handleRes('listEditorPick', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'contributor') {
    gqModel.queryContributorArticlesInArticle(articleAuthor, offset, recommendCount + 1).then(function (res) {
      handleRes('listContributorArticle', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'event') {
    gqModel.queryPostEvents().then(function (res) {
      handleRes('listPostEvent', res, queryHandler.parseCmsArticles);
    });
  } else {
    var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
    if (listCategArticle) {
      gqModel.queryArticle(listCategArticle, offset, recommendCount + 1).then(function(res) {
        handleRes(listCategArticle, res, queryHandler.parseArticles);
      });
    }
  }
};
