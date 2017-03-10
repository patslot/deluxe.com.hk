import angular from 'angular';
import 'angular-sanitize';

import {
  homepageController,
  categoryController
} from './controllers';

import dirs from "./directives";

import {
  gqModel,
  constant
} from './services';

angular.module('appServices', [])
  .factory('const', [constant])
  .factory('gqModel', ['const', gqModel]);

angular.module('appDirectives', [])
  .directive('topMenu', [dirs.menu])
  .directive('latestArticles', [dirs.latestArticles])
  .directive('highlightsBlock', [dirs.highlights])
  .directive('editorPicks', [dirs.editorPicks])
  .directive('instagramMedias', [dirs.instagram]);

angular
  .module('addv2', ['ngSanitize', 'appServices', 'appDirectives'])
  .controller('HomepageController', ['$scope', 'gqModel', homepageController])
  .controller('CategController', ['$scope', '$attrs', 'gqModel', categoryController]);
