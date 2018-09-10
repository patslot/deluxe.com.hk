const htmlTpl = `
<% articles.forEach(function(a, idx) { %>
            <div class="al_two_image col-sm-12 col-md-6 col-xs-12">
            <a href="<%= a.link %>">
            <div class="pos-relative artsListImg">
            <img src="<%= a.ogimage %>"> 
            </div>
        </a>
        </div>
        <div class="keyword_content al_two_content col-sm-12 col-md-6 col-xs-12">
        <div class="al_two_content_label">[<%= a.displayCategory %>]</div>
        <a href="<%= a.link %>">
            <div class="other_article al_two_content_title">
            <%= a.title %>
            </div>
        </a>
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
