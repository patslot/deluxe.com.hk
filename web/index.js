import angular from 'angular';

import {
  helloController,
  categoryController
} from "./controllers";

angular
  .module('addv2', [])
  .controller('HelloController', ['$scope', helloController])
  .controller('CategController', ['$scope', '$attrs', '$http', categoryController]);
