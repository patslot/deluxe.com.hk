const htmlTpl = `
<a href="<%= a.linkURL %>" target="<%= a.linkTarget %>">
  <% if (a.hasVideo) { %>
  <img class="play" src="/img/icon-play.png" />
  <% } %>
  <img src="<%= a.imgName %>" />
</a>
<div class="text-left">
  <div class="nm_section_block_title_cat">[<%= a.catName %>]</div>
  <div class="nm_section_block_title">
    <a href="<%= a.linkURL %>" target=<%= a.linkTarget %>><%= a.content %></a>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      article: '=addArticle',
    },
    link: function(scope, element) {
      scope.ready = false;
      scope.$watch(function(newVal) {
        var article = newVal.article;
        if (scope.ready || !article) {
          return;
        }
        element.html(ejs.render(htmlTpl, {a: article}));
        scope.ready = true;
      });
    }
  };
};
