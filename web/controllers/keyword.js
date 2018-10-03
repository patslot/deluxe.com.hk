export default function($timeout, $scope, $attrs, $window, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var hashTag = $attrs.hashTag;
  var isReady = false;
  var categIdx = 5; // Start article offset of lazy load articles in category
  var articleCount = 5;
  var articles = [];
  var maxArticles = 200;
    $scope.screenHeight = $window.innerHeight;
    $scope.scrollYPosition =  $window.pageYOffset;
    angular.element($window).bind("scroll", function(e) {
        $scope.scrollYPosition =  $window.pageYOffset;
        $scope.$apply();
    })
  $scope.noMoreArticles = false;
  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  var query = function(hashTag, offset,  count) {
    return  gqModel.keywordQuery(hashTag, offset,  count);
  }
  var queryHandleFunc = queryHandler.parseKeywordArticle;
  
  if (query) {
    isReady = true;
  }

  function updateCategIdx() {
    categIdx += articleCount;
    $timeout(function() {
      $scope.loadingArticles = false;
    }, 100);
  };

  function loadCategArticles() {
    if (categIdx < maxArticles) {
      $scope.loadingArticles = true;
      query(hashTag, categIdx,  articleCount).then(function(res) {
        $timeout(function() {
          var moreArticles = res['listByKeyword'];
          moreArticles = queryHandleFunc(hashTag, moreArticles);
          if (moreArticles.length > 0) {
             $scope.moreArticleGroups.push(moreArticles);
             updateCategIdx();
          }
          if (moreArticles.length < articleCount) {
            $scope.noMoreArticles = true;
          }
        });
      }, function(err) {
          $scope.loadingArticles = false;
      });
    }
  }
 loadCategArticles(); 
  $scope.loadCategArticles = function() {
    if (!isReady || $scope.noMoreArticles || !queryHandleFunc) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    if (query) {
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
