export default function($timeout, $scope, $attrs, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var isReady = false;
  var categIdx = 5; // Start article offset of lazy load articles in category
  var articleCount = c.LOAD_CATEG_ARTICLES_COUNT;
  var articles = [];

  $scope.noMoreArticles = false;
  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  if (listCategArticle) {
    gqModel.queryCateg(listCategArticle).then(function(res) {
      $timeout(function() {
        articles = res[listCategArticle] || [];
        if (articles.length === 0) {
          return;
        }
        isReady = true;
      });
    });
  }

  function updateCategIdx() {
    categIdx += articleCount;
    $scope.loadingArticles = false;
  };

  $scope.loadCategArticles = function() {
    if (!isReady || $scope.noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    // TODO(wkchan): Max number of articles?
    if (categIdx < articles.length) {
      $scope.loadingArticles = true;
      var moreArticles = articles.slice(categIdx, categIdx + articleCount);
      moreArticles = queryHandler.parseArticles(categName, moreArticles);
      if (moreArticles.length > 0) {
        $scope.moreArticleGroups.push(moreArticles);
      }
      if (moreArticles.length < articleCount) {
        $scope.noMoreArticles = true;
      }
      updateCategIdx();
    }
  };
};
