const htmlTpl = `
<div class="nm_section visible-xs">
  <div class="fix_banner_wrapper">
    <div id="<%= divId %>"></div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@fixedbannerId'
    },
    link: function (scope, element, attrs) {
      scope.ready = false;
      scope.$watch(function(newVal) {
        var divId = newVal.divId;
        if (scope.ready || !divId) {
          return;
        }
        var fixedbannerNum = attrs.fixedbannerNum;
        if (fixedbannerNum) {
          fixedbannerNum = +fixedbannerNum;
        } else {
          fixedbannerNum = 1;
        }
        // Only show fixedbanner up to number 4
        if (fixedbannerNum > 4) {
          scope.ready = true;
          return;
        }
        fixedbannerNum = Math.min(fixedbannerNum, 4);
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showMobileAd("Fixedbanner" + fixedbannerNum, divId);
        scope.ready = true;
      });
    }
  };
};
