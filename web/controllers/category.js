export default function($timeout, $scope, $attrs, gqModel) {
  var categEname = $attrs.categEname;
  var categName = $attrs.categName;

  function currentCateg(categs, categEname) {
    for (var i = 0; i < categs.length; i++) {
      console.log(categs[i], categEname);
      if (('add' + categs[i].eName) === categEname) {
        return categs[i];
      }
    }
    return null;
  }

  gqModel.queryCateg(categEname, 1, 5).then(function(res) {
    $timeout(function() {
      var categs = res.listMenu || [];
      $scope.currentCateg = currentCateg(categs, categEname);
      $scope.categs = categs;
      var articles = res.listArticle || [];
      if (articles.length === 0) {
        return;
      }
      // TODO(wkchan): Check mediaGroup.length and is image or video?
      articles.forEach(function(a) {
        a.image = a.mediaGroup[0].largePath;
        a.detailLink = categName + '/' + a.mlArticleId + '/' + a.title;
      });
      $scope.latestArticle = articles[0];
      $scope.latestArticles = articles.slice(1, 5);
    });
  });
};
