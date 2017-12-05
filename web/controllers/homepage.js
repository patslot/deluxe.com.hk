/**
 * HomepageController for homepage
 */
export default function($timeout, $scope, $window, gqModel, c, queryHandler) {
  var maxCategArticles = 3;
  var isReady = false;
  var latestArticles = [];

  $scope.loading = false;
  $scope.loadIdx = 0;
  $scope.categArticles = [];
    $scope.screenHeight = $window.innerHeight;
    $scope.scrollYPosition =  $window.pageYOffset;
    angular.element($window).bind("scroll", function(e) {
        $scope.scrollYPosition =  $window.pageYOffset;
        $scope.$apply();
    })
    
  function createLoadCateg() {
    var listArticles = gqModel.consts.listHomeArticles;
    return [listArticles.fashion, listArticles.beauty, listArticles.luxe,
      listArticles.celebrity, listArticles.lifeStyle];
  }

  gqModel.queryHome().then(function(res) {
    $timeout(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      latestArticles = res.listHomeLatestArticle || [];
      var highlights = res.listHomeHighlight || [];
      highlights.forEach(function(h) {
        queryHandler.parseLinkURL(h);
        h.image = h.imgName;
        h.catName = h.catName.toLowerCase();
        queryHandler.handleArticleCateg(h);
        h.label = h.disCatName;
        h.title = h.content;
      });
      $scope.highlights = highlights;
      var cBanners = res.listBannerForContributor || [];
      if (cBanners.length > 0) {
        $scope.cBanner = cBanners[0];
      }
      isReady = true;
    });
  });

  function updateLoaded() {
    $timeout(function() {
      $scope.loading = false;
      $scope.loadIdx = $scope.loadIdx + 1;
    }, 100);
  }

  function loadHomeArticles() {
    var latestArticles5to8 = latestArticles.length > 4 ?
      latestArticles.slice(4, 8) : [];
    $scope.latestArticles5to8 = queryHandler.parseHomeArticles(latestArticles5to8);
    gqModel.queryHomeLazy().then(function(res) {
      $timeout(function() {
        $scope.igMedias = queryHandler.parseInstagram(res.listInstagram);
        var editorPicks = res.listHomeEditorPick || [];
        // TODO(wkchan): Handle video thumbnail?
        editorPicks.forEach(function(p) {
          p.image = p.videoThumbnail || p.imgFile;
          p.title = p.title;
          p.hasVideo = p.videoFile !== '';
          p.linkURL = '/Editor picks/' + p.id + '/' + encodeURIComponent(p.title);
          p.linkTarget = '_self';
        });
        $scope.editorPicks = editorPicks;
        var eBanners = res.listBannerForEvent || [];
        if (eBanners.length > 0) {
          $scope.eBanner = eBanners[0];
        }
        updateLoaded();
      });
    }, function(err) {
      $timeout(function() {
        $scope.loading = false;
      }, 1000);
    });
  }

  function loadCategArticles() {
    var categs = createLoadCateg();
    gqModel.queryHomeLazyCategs(categs).then(function(res) {
      $timeout(function() {
        categs.forEach(function(categ) {
          $scope.categArticles.push(queryHandler.parseHomeArticles(
            (res[categ] || []).slice(0, maxCategArticles)));
        });
        updateLoaded();
      });
    }, function(err) {
      $timeout(function() {
        $scope.loading = false;
      }, 1000);
    });
  }

  // Only lazy load one time in homepage
  $scope.lazyLoadHomepage = function() {
    if (!isReady) {
      return false;
    }
    if ($scope.loading) {
      return false;
    }
    if ($scope.loadIdx > 1) {
      return false;
    }
    $scope.loading = true;
    if ($scope.loadIdx === 0) {
      loadHomeArticles();
    } else if ($scope.loadIdx === 1) {
      loadCategArticles();
    }
  };
    
     function readMoreButton (){
         var docheight = $(document).height() ;
       $("html, body").animate({ scrollTop: docheight }, "slow");

    }
    $scope.readMoreButton = function() {
        readMoreButton() ;
    };   
};
