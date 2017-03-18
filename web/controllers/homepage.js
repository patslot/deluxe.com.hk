/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, gqModel, c) {
  var isReady = false;
  var latestArticles = [];

  $scope.loading = false;
  $scope.loaded = false;
  $scope.categArticles = [];

  function createLoadCateg() {
    var listArticles = gqModel.consts.listHomeArticles;
    return [listArticles.fashion, listArticles.beauty, listArticles.luxe,
      listArticles.wedding, listArticles.lifeStyle];
  }

  function getImageStyle(imgName) {
    var s = 'background: url(' + imgName +
      ') center center no-repeat; background-size: cover;';
    return s;
  }

  function parseArticles(origArticles) {
    var articles = origArticles || [];
    articles.forEach(function (a) {
      a.style = getImageStyle(a.imgName);
    });
    return articles;
  }

  gqModel.queryHome().then(function(res) {
    $timeout(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      $scope.categs = res.listMenu || [];
      latestArticles = parseArticles(res.listHomeLatestArticle);
      var aLength = latestArticles.length;
      $scope.latestArticlesFacebook = latestArticles.slice(0, 2);
      $scope.latestArticles = aLength > 2 ? latestArticles.slice(2, 4) : [];
      var highlights = res.listHomeHighlight || [];
      highlights.forEach(function(h) {
        h.image = h.imgName;
        h.label = h.catName;
        h.title = h.content;
      });
      $scope.highlights = highlights;
      var cBanners = res.listBannerForContributor || [];
      if (cBanners.length > 0) {
        $scope.cBannerStyle = getImageStyle(cBanners[0].imgName);
      }
      isReady = true;
    });
  });

  // Only lazy load one time in homepage
  $scope.lazyLoadHomepage = function() {
    if (!isReady) {
      return false;
    }
    if ($scope.loading) {
      return false;
    }
    if ($scope.loaded) {
      return false;
    }
    $scope.loading = true;

    var aLength = latestArticles.length;
    $scope.latestArticlesInstagram = aLength > 4 ? latestArticles.slice(4, 6) : [];
    $scope.latestArticlesEvent = aLength > 6 ? latestArticles.slice(6, 8) : [];

    //listInstagram, listHomeEditorPick
    var categs = createLoadCateg();
    gqModel.queryHomeLazy(categs).then(function(res) {
      $timeout(function() {
        categs.forEach(function(categ) {
         $scope.categArticles.push(parseArticles(res[categ]));
        });
        $scope.igMedias = res.listInstagram || [];
        var editorPicks = res.listHomeEditorPick || [];
        // TODO(wkchan): Handle video thumbnail?
        editorPicks.forEach(function(p) {
          p.image = p.videoThumbnail || p.imgFile;
          p.title = p.title;
          p.hasVideo = p.videoFile !== '';
        });
        $scope.editorPicks = editorPicks;
        var eBanners = res.listBannerForEvent || [];
        if (eBanners.length > 0) {
          $scope.eBannerStyle = getImageStyle(eBanners[0].imgName);
        }
        $scope.loading = false;
        $scope.loaded = true;
      });
    }, function(err) {
      $timeout(function() {
        $scope.loading = false;
      }, 1000);
    });
  };
};
