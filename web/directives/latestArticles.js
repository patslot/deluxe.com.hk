const htmlTpl = `
<div class="hidden-xs">
  <% articles.forEach(function(a, idx) { %>
  <div>
    <% var isEven = idx % 2 === 0; %>
    <% if (!isEven) { %>
    <div>
      <div class="ctb_two_content col-md-6 col-xs-12">
        <div class="ctb_two_content_label">[Contributor]</div>
        <a href="<%= a.linkURL %>" target=<%= a.linkTarget %>>
          <div class="ctb_two_content_title"><%= a.title %></div>
          <div class="ctb_two_content_content">
            <%- a.intro %>
          </div>
        </a>
      </div>
      <div class="ctb_two_image col-md-6 col-xs-12">
        <a href="<%= a.linkURL %>" target="<%= a.linkTarget %>">
          <% if (a.hasVideo) { %>
          <img class="play" src="/img/icon-play.png" />
          <% } %>
          <img src="<%= a.image %>" />
        </a>
      </div>
    </div>
    <% } else if (isEven) { %>
    <div>
      <div class="ctb_two_image col-md-6 col-xs-12">
        <a href="<%= a.linkURL %>" target="<%= a.linkTarget %>">
          <% if (a.hasVideo) { %>
          <img class="play" src="/img/icon-play.png" />
          <% } %>
          <img src="<%= a.image %>" />
        </a>
      </div>
      <div class="ctb_two_content col-md-6 col-xs-12">
        <div class="ctb_two_content_label">[Contributor]</div>
        <a href="<%= a.linkURL %>" target=<%= a.linkTarget %>>
          <div class="ctb_two_content_title"><%= a.title %></div>
          <div class="ctb_two_content_content">
            <%- a.intro %>
          </div>
        </a>
      </div>
    </div>
    <% } %>
  </div>
  <% }) %>
</div>
<div class="visible-xs">
  <% articles.forEach(function(a, idx) { %>
  <div>
    <div class="ctb_two_image col-md-6 col-xs-12">
      <a href="<%= a.linkURL %>" target="<%= a.linkTarget %>">
        <% if (a.hasVideo) { %>
        <img class="play" src="/img/icon-play.png" />
        <% } %>
        <img src="<%= a.image %>" />
      </a>
    </div>
    <div class="ctb_two_content col-md-6 col-xs-12">
      <div class="ctb_two_content_label">[Contributor]</div>
      <a href="<%= a.linkURL %>" target=<%= a.linkTarget %>>
        <div class="ctb_two_content_title"><%= a.title %></div>
        <div class="ctb_two_content_content">
          <%- a.intro %>
        </div>
      </a>
    </div>
  </div>
  <% }) %>
</div>
<div style="clear:both"></div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      articles: '=addArticles'
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var articles = newVal.articles;
        if (!articles) {
          return;
        }
        element.html(ejs.render(htmlTpl, {articles: articles}));
        unwatch();
      });
    }
  };
};
