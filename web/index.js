import angular from 'angular';
import moment from 'moment/moment.js';
import 'angular-moment/angular-moment.js';
import './lib/lazy-scroll.js';
import 'ejs/ejs.js';

var controllers = require('./controllers');
var services = require('./services');
var dirs = require('./directives');

module.exports = function(options) {
  var constant = function() {
    return {
      TAG_TO_LIST_ARTICLE_API: {
        'add_fash': 'listFashionArticle',
        'add_beau': 'listBeautyArticle',
        'add_luxe': 'listLuxeArticle',
        'add_wedd': 'listWeddingArticle',
        'add_life': 'listLifeStyleArticle'
      },
      LOAD_CATEG_ARTICLES_COUNT: 4,
      GRAPHQL_ENDPOINT: options.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
    };
  };

  angular.module('appServices', [])
    .factory('const', [constant])
    .factory('queryHandler', [services.queryHandler])
    .factory('gqModel', ['const', services.gqModel]);

  angular.module('appDirectives', [])
    .directive('latestArticles', [dirs.latestArticles])
    .directive('articlesInCateg', [dirs.articlesInCateg])
    .directive('addCarousel', ['$timeout', dirs.addCarousel])
    .directive('facebookBlock', [dirs.facebook])
    .directive('instagramMedias', [dirs.instagram])
    .directive('skinnerBlock', [dirs.skinner])
    .directive('midbanner', [dirs.midbanner])
    .directive('fixedbanner', [dirs.fixedbanner])
    .directive('splashScreen', ['$timeout', dirs.splashScreen])
    .directive('homeArticle', [dirs.homeArticle])
    .directive('shareBar', ['$location', dirs.shareBar])
    .directive('contributorBlock', [dirs.contributorBlock])

  angular
    .module('addv2', ['lazy-scroll', 'appServices', 'appDirectives',
      'angularMoment'])
    .filter("trust", ['$sce', function($sce) {
      return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('HomepageController', ['$timeout', '$scope', 'gqModel', 'const',
      'queryHandler', controllers.homepage])
    .controller('CategController', ['$timeout', '$scope', '$attrs', 'gqModel',
      'const', 'queryHandler', controllers.category])
    .controller('ArticleController', ['$timeout', '$scope', '$attrs', 'gqModel',
      'const', 'queryHandler', controllers.article])
    .controller('ContributorController', ['$timeout', '$scope', 'gqModel',
      'queryHandler', controllers.contributor])
    .controller('ContributorArticlesController', ['$timeout', '$scope',
      'gqModel', '$attrs', 'queryHandler', controllers.contributorArticles])
    .controller('EventsController', ['$timeout', '$scope',
      'gqModel', '$attrs', 'queryHandler', controllers.events]);
}
