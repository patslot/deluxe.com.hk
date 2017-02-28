import angular from "angular";

const ICON = require("./img/icon.png");

angular
    .module('addv2', [])
    .controller("HelloController", ['$scope', function($scope) {
        $scope.hello = "Hello";
        $scope.icon = ICON;
    }]);
