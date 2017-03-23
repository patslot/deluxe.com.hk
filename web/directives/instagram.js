const htmlTpl = `
<div class="row">
<h4 class="artd_instagram_header"><img src="/img/icon08.png"></h4>
</div>
<div class="row">
<% igMedias.forEach(function(ig) { %>
<div class="artd_instagram_small_image">
  <a href="<%= ig.link %>" target="_blank"><img src="<%= ig.images.thumbnail.url %>" /></a>
</div>
<% }) %>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      igMedias: '='
    },
    link: function(scope, element) {
      scope.ready = false;
      scope.$watch(function(newVal) {
        var igMedias = newVal.igMedias;
        if (scope.ready || !igMedias) {
          return;
        }
        element.html(ejs.render(htmlTpl, {igMedias: igMedias}));
        scope.ready = true;
      });
    }
  };
};
