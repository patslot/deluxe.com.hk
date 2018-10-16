export default function($timeout, $scope, $attrs, $window, gqModel, c, queryHandler) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var searchQuery = $attrs.searchQuery;
  var excludeterms = "keyword"; 
  var isReady = false;
  var categIdx = 1; // Start article offset of lazy load articles in category
  var articleCount = 10;
  var articles = [];
  var maxArticles = 91;
    $scope.screenHeight = $window.innerHeight;
    $scope.scrollYPosition =  $window.pageYOffset;
    angular.element($window).bind("scroll", function(e) {
        $scope.scrollYPosition =  $window.pageYOffset;
        $scope.$apply();
    })
  $scope.noMoreArticles = false;
  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  var query = function(searchQuery, offset,  excludeterms) {
    return  gqModel.searchQuery(searchQuery, offset,  excludeterms);
  }
  // var queryHandleFunc = queryHandler.parseKeywordArticle;
  
  if (query) {
    isReady = true;
  }

  function updateCategIdx() {
    $timeout(function() {
      $scope.loadingArticles = false;
    }, 3000);
  };

  function loadSearchArticles() {
      var searchstart = (categIdx * articleCount) + 1 ; 
      console.log(searchstart);
    if (searchstart <= maxArticles) {
      $scope.loadingArticles = true;
      query(searchQuery, searchstart,  excludeterms).then(function(res) {
        $timeout(function() {
          var moreArticles = res['getGoogleSearchResult'];
          var moreArticles = moreArticles.map(function(x){
              var rResult = x; 
              var link = x.link ; 
              var temp = link.split('/');
              rResult['displayCategory'] = temp[3];
              return rResult ;
          });
          // moreArticles = queryHandleFunc(hashTag, moreArticles);
          if (moreArticles.length > 0) {
            $scope.moreArticleGroups.push(moreArticles);
            categIdx = categIdx + 1;
          }
          if (moreArticles.length < articleCount) {
            // $scope.noMoreArticles = true;
          }
          updateCategIdx();
        });
      }, function(err) {
        console.log(err);
          $scope.loadingArticles = false;
      });
    }
  }
// loadCategArticles(); 
  $scope.loadSearchArticles = function() {
    // console.log('load - ' + isReady + ' ' + $scope.noMoreArticles + ' ' +   $scope.loadingArticles );
    if (!isReady || $scope.noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    if (query) {
      loadSearchArticles(); 
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
