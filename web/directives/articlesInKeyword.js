const htmlTpl = `
<% articles.forEach(function(a, idx) { %>
        <div class="keyword_image al_two_image col-sm-12 col-md-6 col-xs-12">
                <a href="#">
                    <div class="pos-relative artsListImg">
                    <% if (a.hasVideo) { %>
                        <% var playClass = a.playClass ? a.playClass : "play"; %>
                    <img class="<%= playClass %>" src="/img/icon-play.png" />
                    <% } %>
                    <img src="<%= a.image %>" />
                    </div>
                </a>
            </div>
            <div class="keyword_content al_two_content col-sm-12 col-md-6 col-xs-12">
                <div class="al_two_content_label">[<%= a.categoryName %>]</div>
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
        <div class="clearfix"></div>              
<% }) %>
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
