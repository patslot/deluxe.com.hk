import css from "../assets/css/splash.css";

const htmlTpl = `
<div class="<%= css.splash_section %> visible-xs">
  <div class="<%= css.overlay %>">
    <div class="<%= css.overlay_content %>">
      <div class="<%= css.splash_wrapper %>">
        <div id="splashad" class="<%= css.splash_content %>"></div>
        <div class="<%= css.splash_close %>" id="adCloseBtn"></div>
      </div>
    </div>
  </div>
</div>
`;

export default function($timeout) {
  return {
    restrict: 'E',
    link: function (scope, element) {
      scope.css = css;
      element.hide().html(ejs.render(htmlTpl, scope));
      angular.element('#adCloseBtn').click(function() {
        element.hide();
      });
      // show splash ad only if came from other site
      if (typeof location.host != "undefined" &&
        typeof document.referrer != "undefined" &&
        document.referrer !== "") {
        var referrerHost =  document.referrer.match(/:\/\/(.[^/]+)/)[1];
        if (location.host !== referrerHost) {
          element.show();
          showMobileAd("SplashAd", "splashad");
        }
      }
    }
  };
};
