const htmlTpl = `
<div class="lrec_ad_large hidden-xs">
  <div id="<%= divId %>"></div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@lrecId',
      articleId: '@articleId'
    },
    link: function (scope, element, attrs) {
      var unwatch = scope.$watch(function(newVal) {
        var divId = newVal.divId;
        var articleId = newVal.articleId || "";
        if (!divId) {
          return;
        }
        var lrecNum = attrs.lrecNum;
        if (lrecNum) {
          lrecNum = +lrecNum;
        } else {
          unwatch();
          return;
        }
        // Only support LREC1 and LREC2
        if (lrecNum !== 1 && lrecNum !== 2) {
          unwatch();
          return;
        }
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showWebAd("LREC" + lrecNum, divId, articleId);
        unwatch();
      });
    }
  };
};
