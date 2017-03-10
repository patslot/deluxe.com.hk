import angular from 'angular';

var controllers = require('./controllers');
var services = require('./services');
var dirs = require('./directives');

var constant = function() {
  return {
    GRAPHQL_ENDPOINT: 'http://localhost:4000/graphql'
  };
};

angular.module('appServices', [])
  .factory('const', [constant])
  .factory('gqModel', ['const', services.gqModel]);

angular.module('appDirectives', [])
  .directive('topMenu', [dirs.menu])
  .directive('latestArticles', [dirs.latestArticles])
  .directive('highlightsBlock', [dirs.highlights])
  .directive('editorPicks', [dirs.editorPicks])
  .directive('instagramMedias', [dirs.instagram]);

angular
  .module('addv2', ['appServices', 'appDirectives'])
  .filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }])
  .controller('HomepageController', ['$scope', 'gqModel', controllers.homepage])
  .controller('CategController', ['$scope', '$attrs', 'gqModel', controllers.category])
  .controller('ArticleController', ['$scope', '$attrs', 'gqModel', controllers.article]);
