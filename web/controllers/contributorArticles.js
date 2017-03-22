export default function($timeout, $scope, gqModel, $attrs, queryHandler) {
  var articles = [];
  var articleCount = 4;
  var isReady = false;
  var articleIdx = 4;

  $scope.noMoreArticles = false;
  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  gqModel.queryContributorArticles($attrs.contrName).then(function(res) {
    $timeout(function() {
      articles = res.listContributorArticle || [];
      var latest4Articles = articles.slice(0, articleCount);
      latest4Articles.forEach(function(a) {
        queryHandler.parseCmsArticle('Contributor', a);
      });
      $scope.latest4Articles = latest4Articles;
      isReady = true;
    });
  });

  function updateCategIdx() {
    articleIdx += articleCount;
    $scope.loadingArticles = false;
  };

  $scope.loadArticles = function() {
    if (!isReady || $scope.noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    // TODO(wkchan): Max number of articles?
    if (articleIdx < articles.length) {
      $scope.loadingArticles = true;
      var moreArticles = articles.slice(articleIdx, articleIdx + articleCount);
      moreArticles.forEach(function(a) {
        queryHandler.parseCmsArticle('Contributor', a);
      });
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
