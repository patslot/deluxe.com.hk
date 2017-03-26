const htmlTpl = `
<% contributors.forEach(function(contributor) { %>
<div class="ctb_item col-xs-12 col-md-4">
  <a href="/Contributor/<%= contributor.catName %>">
    <div class="ctb_item_image">
      <img src="<%= contributor.imgName %>">
    </div>
    <div class="ctb_item_container">
      <div class="ctb_item_name">
        <%= contributor.catName %>
      </div>
      <div class="ctb_item_post">
        <%= contributor.post %>
      </div>
      <div class="ctb_item_content">
        <%- contributor.desc %>
      </div>
    </div>
  </a>
</div>
<% }) %>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      contributors: '='
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var contributors = newVal.contributors;
        if (!contributors) {
          return;
        }
        element.html(ejs.render(htmlTpl, {contributors: contributors}));
        unwatch();
      });
    }
  };
};
