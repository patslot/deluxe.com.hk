import css from "../assets/css/splash.css";

const TEMPLATE = `
<div ng-class="[css.splash_section, sectionClass]">
  <div ng-class="css.overlay">
    <div ng-class="css.overlay_content">
      <div ng-class="css.splash_wrapper">
        <div id="splashad" ng-class="css.splash_content"></div>
        <div ng-class="css.splash_close" ng-click="splashClose()"></div>
      </div>
    </div>
  </div>
</div>
`;

export default function($timeout) {
  return {
    restrict: 'E',
    template: TEMPLATE,
    link: function (scope) {
      scope.css = css;
      scope.sectionClass = css.inactive;
      scope.splashClose = function() {
        scope.sectionClass = css.inactive;
      };
      $timeout(function() {
        // show splash ad only if came from other site
        if (typeof location.host != "undefined" &&
          typeof document.referrer != "undefined" &&
          document.referrer !== "") {
          var referrerHost =  document.referrer.match(/:\/\/(.[^/]+)/)[1];
          if (location.host !== referrerHost) {
              scope.sectionClass = "visible-xs";
              setTimeout(function() {
                showMobileAd("SplashAd", "splashad");
              }, 0);
          }
        }
      }, 0);
    }
  };
};
