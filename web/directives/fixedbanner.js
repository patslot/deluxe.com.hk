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
      var unwatch = scope.$watch(function(newVal) {
        var divId = newVal.divId;
        if (!divId) {
          return;
        }
        var fixedbannerNum = attrs.fixedbannerNum;
        if (fixedbannerNum) {
          fixedbannerNum = +fixedbannerNum;
        } else {
          fixedbannerNum = 1;
        }
        // Only show fixedbanner up to number 8
        if (fixedbannerNum > 8) {
          unwatch();
          return;
        }
        fixedbannerNum = Math.min(fixedbannerNum, 8);
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showMobileAd("Fixedbanner" + fixedbannerNum, divId);
        unwatch();
      });
    }
  };
};
