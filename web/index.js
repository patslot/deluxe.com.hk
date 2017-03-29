import $ from "jquery";
window.jQuery = $;
window.$ = $;

import angular from 'angular';
import moment from 'moment/moment.js';
import './lib/lazy-scroll.js';
import 'ejs/ejs.js';
import 'bootpag/lib/jquery.bootpag.js';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";


var controllers = require('./controllers');
var services = require('./services');
var dirs = require('./directives');


(function() {
  var minimizeHeader = function () {
    var nmHeader = $('.nm_header');
    var logo = $('.nm_header .index-logo .logo');
    var stickyWrap = $('.nm_header #sticky-wrap');
    var scrollTop = $(document).scrollTop();
    var height = logo.height();

    if (scrollTop > height) {
      nmHeader.addClass('fixed');
    } else {
      nmHeader.removeClass('fixed');
    }
  }

  var updateSkinnerADPos = function () {
    var skinnerAD = $('.skinner_ad_wrapper');
    var header = $('.nm_header');
    var logo = $('.nm_header .index-logo .logo');
    var stickyWrap = $('.nm_header #sticky-wrap');
    var scrollTop = $(document).scrollTop();

    if (header.hasClass('fixed')) {
      skinnerAD.css('top', stickyWrap.height());
    } else {
      var targetTop = logo.outerHeight(true) + stickyWrap.height() - scrollTop;
      skinnerAD.css('top', targetTop);
    }
  }

  $(document).scroll(minimizeHeader);
  $(document).scroll(updateSkinnerADPos);
})();


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
