const htmlTpl = `
<div class="row">
<h4 class="artd_instagram_header col-md-12 col-xs-12 col-sm-12"><img src="/img/icon08.png"></h4>
</div>
<div class="row">
<div class="col-md-12 col-xs-12 col-sm-12">
<% igMedias.forEach(function(ig) { %>
<div class="artd_instagram_small_image">
  <% if (ig.imageUrl) { %>
  <a href="<%= ig.link %>" target="_blank">
    <% if (ig.videoUrl) { %>
    <img class="play36px" src="/img/icon-play.png" />
    <% } %>
    <img src="<%= ig.imageUrl %>" />
  </a>
  <% } %>
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
