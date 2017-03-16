export default function($timeout, $scope, $attrs, gqModel, c) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;
  var isReady = false;
  var categIdx = 5; // Start article offset of lazy load articles in category
  var articleCount = c.LOAD_CATEG_ARTICLES_COUNT;
  var noMoreArticles = false;

  $scope.loadingArticles = false;
  $scope.moreArticleGroups = [];

  function currentCateg(categs, categEname) {
    for (var i = 0; i < categs.length; i++) {
      if (('add' + categs[i].eName) === categEname) {
        return categs[i];
      }
    }
    return null;
  }

  function parseArticles(origArticles) {
    var articles = origArticles || [];
    // TODO(wkchan): Check if is news article or CMS article
    articles.forEach(function(a, idx) {
      if (a.__typename === 'NewsArticle') {
        a.image = a.mediaGroup[0].largePath;
      } else if (a.__typename === 'CmsArticle') {
        a.label = categName;
        a.image = a.videoThumbnail || a.articleThumbnail;
      }
      a.detailLink = categName + '/' + a.id + '/' + a.title;
    });
    return articles;
  }

  var listCategArticle = c.TAG_TO_LIST_ARTICLE_API[categEname];
  if (listCategArticle) {
    gqModel.queryCateg(listCategArticle).then(function(res) {
      $timeout(function() {
        var categs = res.listMenu || [];
        $scope.currentCateg = currentCateg(categs, categEname);
        $scope.categs = categs;
        var articles = parseArticles(res[listCategArticle]);
        if (articles.length === 0) {
          return;
        }
        $scope.latestArticle = articles[0];
        $scope.latestArticles = articles.slice(1, 5);
        isReady = true;
      });
    });
  }

  function updateCategIdx() {
    categIdx += articleCount;
    $scope.loadingArticles = false;
  };

  $scope.loadCategArticles = function() {
    if (!isReady || noMoreArticles) {
      return false;
    }
    if ($scope.loadingArticles) {
      return false;
    }
    // TODO(wkchan): Max number of articles?
    if (categIdx < 20) {
      $scope.loadingArticles = true;
      gqModel.queryCategArticles(categEname, categIdx, articleCount).then(function(res) {
        $timeout(function() {
          var articles = res.listArticle || [];
          if (articles.length > 0) {
            $scope.moreArticleGroups.push(parseArticles(articles));
          }
          updateCategIdx();
          // No more articles
          if (articles.length < articleCount) {
            noMoreArticles = true;
          }
        });
      }, function(err) {
        updateCategIdx();
      });
    }
  };
};
