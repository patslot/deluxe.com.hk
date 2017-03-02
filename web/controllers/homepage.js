/**
 * HomepageController for homepage
 */
export default function($scope, gqModel) {
  gqModel.queryHome().then(function(res) {
    $scope.$apply(function() {
      // TODO(wkchan): Move this parts as a function for unit test
      $scope.categories = res.listMenu || [];
      $scope.igMedias = res.listInstagram || [];
      var articles = res.listArticle || [];
      $scope.latestArticles = articles.slice(0, 4);
      $scope.secLatestArticles = articles.slice(4, 8);
      $scope.highlights = 'Sample highlights';
      $scope.editorPicks = 'Sample editor picks';
    });
  });
};
