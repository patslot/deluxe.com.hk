const htmlTpl = `
<div class="nm_section hidden-xs">
  <div class="head_banner_wrapper">
    <div class="superhead_banner">
      <div id="<%= divId %>"></div>
    </div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@midbannerId'
    },
    link: function (scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var divId = newVal.divId;
        if (!divId) {
          return;
        }
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showWebAd("Midbanner", divId);
        unwatch();
      });
    }
  };
};
