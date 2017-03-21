const TEMPLATE = `
<div class="nm_section visible-xs">
  <div class="fix_banner_wrapper">
    <div ng-attr-id="{{divId}}"></div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@fixedbannerId'
    },
    template: TEMPLATE,
    link: function ($scope, element, attrs) {
      var fixedbannerId = attrs.fixedbannerId;
      var fixedbannerNum = attrs.fixedbannerNum;
      if (fixedbannerNum) {
        fixedbannerNum = +fixedbannerNum;
      } else {
        fixedbannerNum = 1;
      }
      fixedbannerNum = Math.min(fixedbannerNum, 4);
      setTimeout(function() {
        showMobileAd("Fixedbanner" + fixedbannerNum, fixedbannerId);
      }, 0);
    }
  };
};
