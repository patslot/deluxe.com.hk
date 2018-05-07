import css from "../assets/css/splash.css";

const htmlTpl = `
<div id="splashad" class="<%= css.splash_section %> visible-xs">
</div>
`;

const closeBtnHtmlTpl = `
<div class="<%= css.splash_close_wrapper %>">
  <div class="<%= css.splash_close %>" id="adCloseBtn"></div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      articleId: '@articleId'
    },
    link: function (scope, element, attrs) {

      var unwatch = scope.$watch(function(newVal) {
          var articleId = newVal.articleId || "";
          scope.css = css;
          element.hide().html(ejs.render(htmlTpl, scope));
          // show splash ad if not come from next media or apple daily
          if (!/(http|https)?:\/\/[\w\.]{2,}.(nextmedia.com|appledaily.com)/i.test(document.referrer)) {
            element.show();
                showMobileAd("SplashAd", "splashad", articleId, function(isEmpty) {
                  if (isEmpty) {
                    element.hide();
                  } else {
                    angular.element("#splashad").addClass(css.splash_section_visible);
                    angular.element("#splashad").prepend(ejs.render(closeBtnHtmlTpl, scope));
                    angular.element('#adCloseBtn').click(function() {
                      element.hide();
                    });
                    try {
                      angular.element('#adCloseBtn').addEventListener("touchend", function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        element.hide();
                        return false;
                      });
                    } catch(e) {
                    }
                    /* avoid windows phone 7.5 click through */
                    var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
                    if (isWindowsPhone) {
                      angular.element('#splashad').click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                      });
                    }
                  }
                  
                });
            unwatch();
          }
      });
    }
  };
};
