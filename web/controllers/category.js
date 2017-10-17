export default function($timeout, $scope, $attrs, $window, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var isReady = false;
  var categIdx = 5; // Start article offset of lazy load articles in category
  var articleCount = c.LOAD_CATEG_ARTICLES_COUNT;
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
  var query = null;
  var queryHandleFunc = null;
  if (categName === 'Editor picks') {
    query = function(offset, count) {
      return gqModel.queryEditorPickArticles(offset, count);
    }
    queryHandleFunc = queryHandler.parseCmsArticles;
    listCategArticle = 'listEditorPick';
  } else if (listCategArticle) {
    query = function(offset, count) {
      return gqModel.queryCateg(listCategArticle, offset, count);
    };
    queryHandleFunc = queryHandler.parseArticles;
  }
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
      query(categIdx, articleCount).then(function(res) {
        $timeout(function() {
          var moreArticles = res[listCategArticle];
          moreArticles = queryHandleFunc(categName, moreArticles);
          if (moreArticles.length > 0) {
            $scope.moreArticleGroups.push(moreArticles);
          }
          if (moreArticles.length < articleCount) {
            $scope.noMoreArticles = true;
          }
          updateCategIdx();
        });
      }, function(err) {
        $scope.loadingArticles = false;
      });
    }
  }

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
    
    function scrolltotop (){
       $("html, body").animate({ scrollTop: 0 }, "slow");

    }
    $scope.scrolltotop = function() {
       scrolltotop() ;
    };   
};
