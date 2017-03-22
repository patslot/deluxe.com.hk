/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, gqModel, c, queryHandler) {
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

  gqModel.queryHome().then(function(res) {
    $timeout(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      latestArticles = res.listHomeLatestArticle || [];
      var highlights = res.listHomeHighlight || [];
      highlights.forEach(function(h) {
        h.image = h.imgName;
        h.label = h.catName;
        h.title = h.content;
        queryHandler.parseLinkURL(h);
      });
      $scope.highlights = highlights;
      var cBanners = res.listBannerForContributor || [];
      if (cBanners.length > 0) {
        $scope.cBanner = cBanners[0];
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

    // NOTE: Used when event pages are ready
    /*var latestArticles5to8 = latestArticles.length > 4 ?
      latestArticles.slice(4, 8) : [];
    $scope.latestArticles5to8 = queryHandler.parseHomeArticles(latestArticles5to8);*/
    // NOTE: Used when event pages are not ready
    var latestArticles5to9 = latestArticles.length > 4 ?
      latestArticles.slice(4, 9) : [];
    latestArticles5to9 = queryHandler.parseHomeArticles(latestArticles5to9);
    $scope.latestArticles5to6 = latestArticles5to9.slice(0, 2);
    $scope.latestArticles7to9 = latestArticles5to9.slice(2, 5);

    //listInstagram, listHomeEditorPick
    var categs = createLoadCateg();
    gqModel.queryHomeLazy(categs).then(function(res) {
      $timeout(function() {
        categs.forEach(function(categ) {
         $scope.categArticles.push(queryHandler.parseHomeArticles(res[categ]));
        });
        $scope.igMedias = res.listInstagram || [];
        var editorPicks = res.listHomeEditorPick || [];
        // TODO(wkchan): Handle video thumbnail?
        editorPicks.forEach(function(p) {
          p.image = p.videoThumbnail || p.imgFile;
          p.title = p.title;
          p.hasVideo = p.videoFile !== '';
          p.linkURL = '/Editor picks/' + p.id + '/' + p.title;
          p.linkTarget = '_self';
        });
        $scope.editorPicks = editorPicks;
        var eBanners = res.listBannerForEvent || [];
        if (eBanners.length > 0) {
          $scope.eBanner = eBanners[0];
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
