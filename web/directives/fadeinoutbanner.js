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
      divId: '@fadeinoutbannerId',
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
        showMobileAd("FadeInOutBanner" , divId, articleId);
        unwatch();
      });
    }
  };
};
