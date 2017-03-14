/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, gqModel) {
  $scope.categArticles = [];
  var isReady = false;
  var loading = false;
  var categIdx = 0;

  function parseArticles(articles) {
    var _articles = articles || [];
    _articles.forEach(function (a) {
      // TODO(wkchan): Check if mediaGroup.length > 0?
      a.style = 'background: url(' + a.mediaGroup[0].largePath +
        ') center center no-repeat; background-size: cover;';
    });
    return _articles;
  }

  gqModel.queryHome(1, 8).then(function(res) {
    $timeout(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      $scope.categs = res.listMenu || [];
      $scope.igMedias = res.listInstagram || [];

      var editorPicks = res.listEditorPick || [];
      // TODO(wkchan): Handle video thumbnail?
      editorPicks.forEach(function (p) {
        var thumbnail = p.articleThumbnail || p.videoThumbnail;
        p.style = 'background: url(' + thumbnail +
          ') center center no-repeat; background-size: cover;';
      });
      $scope.editorPicks = editorPicks;
      var articles = parseArticles(res.listArticle);
      $scope.latestArticles = articles.slice(0, 2);
      $scope.latestArticlesFacebook = articles.slice(2, 4);
      $scope.latestArticlesInstagram = articles.slice(4, 6);
      $scope.latestArticlesEvent = articles.slice(6, 8);
      $scope.highlights = 'Sample highlights';
      isReady = true;
    });
  });

  $scope.loadCategArticles = function() {
    function updateCategIdx() {
      categIdx++;
      loading = false;
    }

    if (!isReady) {
      return false;
    }
    var categs = $scope.categs;
    // TODO(wkchan): Exclude category without eName?
    if (loading) {
      return false;
    }
    if (categIdx < 5 && categIdx < categs.length) {
      loading = true;
      gqModel.queryCategArticles('add' + categs[categIdx].eName, 1, 3).then(function(res) {
        $timeout(function() {
          $scope.categArticles.push(parseArticles(res.listArticle ));
          updateCategIdx();
        });
      }, function(err) {
        updateCategIdx();
      });
    }
  };
};
