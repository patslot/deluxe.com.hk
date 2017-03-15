/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, gqModel) {
  var isReady = false;
  var categIdx = 0;
  var loadCategs = createLoadCateg();

  $scope.loading = false;
  $scope.categArticles = [];

  function createLoadCateg() {
    var listArticles = gqModel.consts.listHomeArticles;
    return [
      [listArticles.fashion, listArticles.beauty, listArticles.luxe],
      [listArticles.wedding, listArticles.lifeStyle]
    ];
  }

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
      editorPicks.forEach(function(p) {
        p.image = p.videoThumbnail || p.imgFile;
        p.title = p.title;
      });
      $scope.editorPicks = editorPicks;
      var articles = parseArticles(res.listHomeLatestArticle);
      var aLength = articles.length;
      $scope.latestArticles = articles.slice(0, 2);
      $scope.latestArticlesFacebook = aLength > 2 ? articles.slice(2, 4) : [];
      $scope.latestArticlesInstagram = aLength > 4 ? articles.slice(4, 6) : [];
      $scope.latestArticlesEvent = aLength > 6 ? articles.slice(6, 8) : [];
      var highlights = res.listHomeHighlight || [];
      highlights.forEach(function(h) {
        h.image = h.imgName;
        h.label = h.catName;
        h.title = h.content;
      });
      $scope.highlights = highlights;
      isReady = true;
    });
  });

  $scope.loadCategArticles = function() {
    function updateCategIdx() {
      categIdx++;
      $scope.loading = false;
    }

    if (!isReady) {
      return false;
    }
    if ($scope.loading) {
      return false;
    }
    if (categIdx < loadCategs.length) {
      $scope.loading = true;
      var categs = loadCategs[categIdx];
      gqModel.queryHomeArticles(categs).then(function(res) {
        $timeout(function() {
          categs.forEach(function(categ) {
           $scope.categArticles.push(parseArticles(res[categ]));
          });
          updateCategIdx();
        });
      }, function(err) {
        updateCategIdx();
      });
    }
  };
};
