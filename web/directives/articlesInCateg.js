const htmlTpl = `
<% articles.forEach(function(a, idx) { %>
<div class="al_two_col_container hidden-xs">
  <% var isEven = idx % 2 === 0; %>
  <% if (!isEven) { %>
  <div class="row">
    <div class="al_two_content col-sm-5 col-md-6 col-xs-12">
      <div class="al_two_content_label">[<%= a.disCatName %>]</div>
      <a href="<%= a.linkURL %>">
        <div class="other_article al_two_content_title">
          <%= a.title %>
        </div>
        <div class="other_article al_two_content_content">
          <%- a.content %>
        </div>
      </a>
    </div>
    <div class="al_two_image col-sm-5 col-md-6 col-xs-12">
      <a href="<%= a.linkURL %>">
        <div class="pos-relative artsListImg">
          <% if (a.hasVideo) { %>
          <img class="play" src="/img/icon-play.png" />
          <% } %>
          <img src="<%= a.image %>" />
        </div>
      </a>
    </div>
  </div>
  <% } else if (isEven) { %>
  <div class="row">
    <div class="al_two_image col-sm-5 col-md-6 col-xs-12">
      <a href="<%= a.linkURL %>">
        <div class="pos-relative artsListImg">
          <% if (a.hasVideo) { %>
          <img class="play" src="/img/icon-play.png" />
          <% } %>
          <img src="<%= a.image %>" />
        </div>
      </a>
    </div>
    <div class="al_two_content col-sm-5 col-md-6 col-xs-12">
      <div class="al_two_content_label">[<%= a.disCatName %>]</div>
      <a href="<%= a.linkURL %>">
        <div class="other_article al_two_content_title">
          <%= a.title %>
        </div>
        <div class="other_article al_two_content_content">
          <%- a.content %>
        </div>
      </a>
    </div>
  </div>
  <% } %>
</div>
<% }) %>
<% articles.forEach(function(a) { %>
<div class="al_two_col_container visible-xs">
  <div class="row">
    <div class="al_two_image col-sm-5 col-md-6 col-xs-12">
      <a href="<%= a.linkURL %>">
        <div class="pos-relative artsListImg">
          <% if (a.hasVideo) { %>
          <img class="play" src="/img/icon-play.png" />
          <% } %>
          <img src="<%= a.image %>" />
        </div>
      </a>
    </div>
    <div class="al_two_content col-sm-5 col-md-6 col-xs-12">
      <div class="al_two_content_label">[<%= a.disCatName %>]</div>
      <a href="<%= a.linkURL %>">
        <div class="other_article al_two_content_title">
          <%= a.title %>
        </div>
      </a>
    </div>
  </div>
</div>
<% }) %>
<div style="clear:both"></div>
`

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
