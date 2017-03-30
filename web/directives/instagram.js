const htmlTpl = `
<div class="row">
<h4 class="artd_instagram_header col-md-12 col-xs-12 col-sm-12"><img src="/img/icon08.jpg"></h4>
</div>
<div class="row">
<div class="col-md-12 col-xs-12 col-sm-12">
<% igMedias.forEach(function(ig) { %>
<div class="artd_instagram_small_image">
  <a href="<%= ig.link %>" target="_blank"><img src="<%= ig.images.thumbnail.url %>" /></a>
</div>
<% }) %>
</div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      igMedias: '='
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var igMedias = newVal.igMedias;
        if (!igMedias) {
          return;
        }
        element.html(ejs.render(htmlTpl, {igMedias: igMedias}));
        unwatch();
      });
    }
  };
};
