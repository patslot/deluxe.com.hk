const htmlTpl = `
<div class="nm_section visible-xs">
    <div id="<%= divId %>"></div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@bannerId',
      articleId: '@articleId'
    },
    link: function (scope, element, attrs) {
      var unwatch = scope.$watch(function(newVal) {
        var divId = newVal.divId;
        var articleId = newVal.articleId || "";
        if (!divId) {
          return;
        }
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showMobileAd("1x1", divId, articleId);
        unwatch();
      });
    }
  };
};
