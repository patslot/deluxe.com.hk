export default function($scope, $attrs, gqModel) {
  $scope.categ = $attrs.category;
  $scope.data = {};

  gqModel.queryHome().then(function(res) {
    $scope.$apply(function() {
      $scope.categories = res.listMenu;
    });
  });
};
