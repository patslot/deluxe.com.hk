import angular from 'angular';
import moment from 'moment/moment.js';
import 'angular-moment/angular-moment.js';
import 'angular-filter/dist/angular-filter.js';
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
    .factory('articleHandler', [services.articleHandler])
    .factory('gqModel', ['const', services.gqModel]);

  angular.module('appDirectives', [])
    .directive('topMenu', [dirs.menu])
    // TODO: Check if latestArticles is used and remove it later if not used
    .directive('latestArticles', [dirs.latestArticles])
    .directive('articlesInCateg', [dirs.articlesInCateg])
    .directive('addCarousel', ['$timeout', dirs.addCarousel])
    .directive('facebookBlock', [dirs.facebook])
    .directive('instagramMedias', [dirs.instagram])
    .directive('skinnerBlock', [dirs.skinner])
    .directive('homeArticle', [dirs.homeArticle])
    .directive('shareBar', ['$location', dirs.shareBar]);

  angular
    .module('addv2', ['lazy-scroll', 'appServices', 'appDirectives',
      'angularMoment', 'angular.filter'])
    .filter("trust", ['$sce', function($sce) {
      return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('HomepageController', ['$timeout', '$scope', 'gqModel', 'const',
      controllers.homepage])
    .controller('CategController', ['$timeout', '$scope', '$attrs', 'gqModel',
      'const', 'articleHandler', controllers.category])
    .controller('ArticleController', ['$timeout', '$scope', '$attrs', 'gqModel',
      'const', 'articleHandler', controllers.article])
    .controller('ContributorController', ['$timeout', '$scope', 'gqModel',
      controllers.contributor])
    .controller('ContributorArticlesController', ['$timeout', '$scope',
      'gqModel', '$attrs', controllers.contributorArticles]);
}
