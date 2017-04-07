export default function($timeout, $scope, gqModel, $attrs, queryHandler) {
  var articles = [];
  var articleCount = 4;
  var articleIdx = 4;
  var contrName = $attrs.contrName;

  $scope.noMoreArticles = false;
  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  function updateCategIdx() {
    articleIdx += articleCount;
    $timeout(function() {
      $scope.loadingArticles = false;
    }, 100);
  };

  $scope.loadArticles = function() {
    if ($scope.noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    $scope.loadingArticles = true;
    gqModel.queryContributorArticles(contrName, articleIdx, articleCount).then(function(res) {
      var moreArticles = res.listContributorArticle || [];
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
    }, function(err) {
      $scope.loadingArticles = false;
      console.error(err);
    });
  };
};
