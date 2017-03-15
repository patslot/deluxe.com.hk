/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, gqModel) {
  $scope.categArticles = [];
  var isReady = false;
  var loading = false;
  var categIdx = 0;

  function parseArticles(origArticles) {
    var articles = origArticles || [];
    articles.forEach(function (a) {
      a.style = 'background: url(' + a.imgName +
        ') center center no-repeat; background-size: cover;';
    });
    return articles;
  }

  gqModel.queryHome(0, 7).then(function(res) {
    $timeout(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      $scope.categs = res.listMenu || [];
      $scope.igMedias = res.listInstagram || [];

      var editorPicks = res.listHomeEditorPick || [];
      // TODO(wkchan): Handle video thumbnail?
      editorPicks.forEach(function (p) {
        var thumbnail = p.videoThumbnail || p.imgFile;
        p.style = 'background: url(' + thumbnail +
          ') center center no-repeat; background-size: cover;';
      });
      $scope.editorPicks = editorPicks;
      var articles = parseArticles(res.listHomeLatestArticle);
      var aLength = articles.length;
      $scope.latestArticles = articles.slice(0, 2);
      $scope.latestArticlesFacebook = aLength > 2 ? articles.slice(2, 4) : [];
      $scope.latestArticlesInstagram = aLength > 4 ? articles.slice(4, 6) : [];
      $scope.latestArticlesEvent = aLength > 6 ? articles.slice(6, 8) : [];
      $scope.highlights = res.listHomeHighlight || [];
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
