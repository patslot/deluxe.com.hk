import angular from 'angular';

var category = require('./category.js');

var helloController = function($scope) {
  $scope.hello = 'Hello';
};

angular.module('addv2', []).
  controller('HelloController', ['$scope', helloController]).
  controller('CategController', ['$scope', '$attrs', '$http',
    category.controller]);
