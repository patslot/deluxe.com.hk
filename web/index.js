import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

import angular from 'angular';
import moment from 'moment/moment.js';
import 'ejs/ejs.js';
import 'bootpag/lib/jquery.bootpag.js';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";

import './assets/css/topMenu.css';
import './assets/css/mobileMenu.css';
import './assets/css/articleDetail.css';
import './assets/css/common.css';
import './assets/css/contributorArticles.css';
import './assets/css/scrolls.css';
import './assets/css/articleList.css';
import './assets/css/contributor.css';
import './assets/css/events.css';
import './assets/css/campaign.css';
import './assets/css/mpm.css';
import './assets/css/newsletter.css';
import './assets/css/upcomingEvents.css';

import './js/lazy-scroll.js';
import './js/jquery.endless-scroll.js';
import './js/misc.js';

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
    .directive('splashScreen', [dirs.splashScreen])
    .directive('homeArticle', [dirs.homeArticle])
    .directive('shareBar', [dirs.shareBar])
    .directive('contributorBlock', [dirs.contributorBlock])

  angular
    .module('addv2', ['lazy-scroll', 'appServices', 'appDirectives'])
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
