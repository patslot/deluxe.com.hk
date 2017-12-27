export default function($timeout, $scope, $attrs, $window,  gqModel, c, queryHandler,
  articleUtil) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var articleId = $attrs.articleId;
  var articleAuthor = $attrs.articleAuthor;
  var isSharedUrl = $attrs.isSharedUrl === 'true';
  var numOfEvents = 0 ;
  var offset = 0;
  var recommendCount = 12;
  var recommendArticles = [];
  var cmsNewsType = 'OTHER';

  var isReady = false;
  var curArticleID = articleId;
  // Map current article ID to next article ID
  var nextArticleIDMap = {};
  $scope.nextArticles = [];
  $scope.noMoreArticles = false;
  $scope.loadingArticle = false;
      
    // Get Scroll Y postion for Back to top button 
    $scope.screenHeight = $window.innerHeight;
    $scope.scrollYPosition =  $window.pageYOffset;
    angular.element($window).bind("scroll", function(e) {
        $scope.scrollYPosition =  $window.pageYOffset;
        $scope.$apply();
    })
    
  function parseRecommendArticles(articleId, parseFunc) {
    var articles = recommendArticles.filter(function (item) {
      return item.id !== articleId;
    }).slice(0, recommendCount);
    return parseFunc(categName, articles);
  }

  var handleRes = function (articleKey, res, parseFunc, listCategArticle) {
    $timeout(function () {
      $scope.igMedias = queryHandler.parseInstagram(res.listInstagram);
      recommendArticles = res[articleKey] || [];
      $scope.latestArticles = parseRecommendArticles(recommendArticles, parseFunc);
      if (listCategArticle) {
        gqModel.queryArticleIDs(listCategArticle, 0, c.MAX_CATEG_ARTICLES).then(function(res) {
          $timeout(function() {
            var articleIDs = res[listCategArticle];
            var i;
            for (i = 0; i < articleIDs.length - 1; i++) {
              nextArticleIDMap[articleIDs[i].id.toString()] =
                articleIDs[i+1].id.toString();
            }
            isReady = true;
          });
        });
      }else if (articleKey == "listPostEvent"){
          
          gqModel.queryNumOfEvents().then(function(res){
               numOfEvents =  res["totalPostEvent"];
          });
          gqModel.queryEvents(numOfEvents, 0, 0).then(function(res) {
              $timeout(function() {
                var articleIDs = res["listPostEvent"];
                var i;
                for (i = 0; i < articleIDs.length - 1; i++) {
                     nextArticleIDMap[articleIDs[i].id.toString()] =
                    articleIDs[i+1].id.toString();
                }
                  
                isReady = true;
              });
            });
      }else if (articleKey == "listContributorArticleAll"){
          gqModel.queryContributorArticlesAll(0, 10).then(function(res) {
              $timeout(function() {
                var articleIDs = res["listContributorArticleAll"];
                var i;
                for (i = 0; i < articleIDs.length - 1; i++) {
                     nextArticleIDMap[articleIDs[i].id.toString()] =
                    articleIDs[i+1].id.toString();
                }
                  
                isReady = true;
              });
            });
      }else if (articleKey == "listEditorPick"){
          gqModel.queryHomeLazy().then(function(res) {
              $timeout(function() {
                var articleIDs = res["listEditorPick"];
                var i;
                for (i = 0; i < articleIDs.length - 1; i++) {
                     nextArticleIDMap[articleIDs[i].id.toString()] =
                    articleIDs[i+1].id.toString();
                }
                  
                isReady = true;
              });
            });
      }
    });
  };

  if (categEname === 'editor_picks') {
    gqModel.queryEditorPicks(offset, recommendCount + 1).then(function (res) {
      handleRes('listEditorPick', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'contributor') {
    gqModel.queryContributorArticlesAll(offset, recommendCount + 1).then(function (res) {
      
      handleRes('listContributorArticleAll', res, queryHandler.parseCmsArticles);
    });
  } else if (categEname === 'event') {
    gqModel.queryPostEvents().then(function (res) {
         handleRes('listPostEvent', res, queryHandler.parseCmsArticles);
    });
  } else {
    var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
    if (listCategArticle) {
      gqModel.queryArticle(listCategArticle, offset, recommendCount + 1).then(function(res) {
        handleRes(listCategArticle, res, queryHandler.parseArticles, listCategArticle);
      });
    }
  }

  function updateLoading() {
    $timeout(function() {
      $scope.loadingArticle = false;
    }, 100);
  }

  function loadArticle() {
    
    $scope.loadingArticle = true;
    var nextArticleID = nextArticleIDMap[curArticleID];
    if (!nextArticleID) {
      $scope.loadingArticle = false;
      $scope.noMoreArticles = true;
      return;
    }
    var articleType = articleUtil.getArticleType(nextArticleID);
    var queryFunc = null;
    var queryResName = '';
    if (articleUtil.isCMSArticle(articleType)) {
      queryFunc = gqModel.queryCmsArticleDetail;
      queryResName = 'getCMSArticleDetail';
    } else if (articleUtil.isNewsArticle(articleType)) {
      queryFunc = gqModel.queryNewsArticleDetail;
      queryResName = 'getNewsArticleDetail';
    }
    if (!queryFunc) {
      $scope.loadingArticle = false;
      return;
    }
    queryFunc(nextArticleID).then(function(res) {
      $timeout(function() {
        var nextArticle = res[queryResName];
        nextArticle.type = articleType;
        nextArticle.id = nextArticleID;
        nextArticle.idx = $scope.nextArticles.length.toString();
        nextArticle.isSharedUrl = isSharedUrl;
        nextArticle.latestArticles = parseRecommendArticles(nextArticleID,
            queryHandler.parseArticles);
        if (articleUtil.isNewsArticle(articleType)) {
          queryHandler.parseNewsArticleDetail(nextArticle);
          nextArticle.pvLog = articleUtil.articlePageviewLog(
            nextArticle.categoryName, (nextArticle.logging || {}).pixelNews,
            nextArticle.id, nextArticle.issueId, nextArticle.title, '');
        } else if (articleUtil.isCMSArticle(articleType)) {
          queryHandler.parseCmsArticleDetail(nextArticle);
          nextArticle.pvLog = articleUtil.articlePageviewLog(
            nextArticle.categoryName, cmsNewsType,
            nextArticle.id, nextArticle.issueId, nextArticle.title, '');
        }
        queryHandler.handleArticleDetailCateg(nextArticle);
        $scope.nextArticles.push(nextArticle);
        
        curArticleID = nextArticleID;
        updateLoading();
          gaPageview(nextArticle);  
      });
    }, function(err) {
      $scope.loadingArticle = false;
    });
  }
    
//lazy load article GA pageview     
  function gaPageview(nextArticle){
      var url = '';
      if(nextArticle.isSharedUrl){
          url = '/article/' + nextArticle.id;
      }
      else{
          url =nextArticle.categoryName +'/'+ nextArticle.id +'/'+ nextArticle.title.replace("'", "\\'") ;
      }
     //console.log(url);
       ga('send', 'pageview', url);   
  }
  function isScrolledIntoView(elem) {
    var $win = angular.element(window);
    var docViewTop = $win.scrollTop();
    var docViewBottom = docViewTop + $win.height();
    var $elem = angular.element(elem);
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  $scope.loadArticle = function() {
    if (!isReady || $scope.noMoreArticles) {
         return false;
    }
    if ($scope.loadingArticle) {
      return false;
    }
    if (isScrolledIntoView('#loading-trigger')) {
      loadArticle();
       
    }
  };
    
    //Scroll to top function 
     function readMoreButton (){
       var docheight = $('#loading-trigger').position().top ;
        $("html, body").animate({ scrollTop: docheight }, "slow");

    }
    $scope.readMoreButton = function() {
       
       readMoreButton() ;
    };   
};
