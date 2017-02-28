exports.controller = function($scope, $attrs, $http) {
  $scope.categ = $attrs.category;
  $scope.data = {};

  $http.post('/category', {category: $scope.categ}).then(function(res) {
    $scope.data = res.data;
  }, function(res) {
    console.log('Error code:', res.status);
  });
};
