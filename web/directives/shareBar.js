import css from "../assets/css/sharebar.css";

const htmlTpl = `
<div class="<%= css.artd_article_share_bar %>">
  <ul>
    <li class="<%= css.share_item %> <%= css.share_fb %>">
      <a href="https://www.facebook.com/sharer/sharer.php?u=<%= url %>"
        target="_blank"></a>
    </li>
    <li class="<%= css.share_item %> <%= css.share_tw %>">
      <a href="https://twitter.com/intent/tweet?url=<%= url %>&text=<%= title %>"
        target="_blank"></a>
    </li>
    <li class="<%= css.share_item %> <%= css.share_gplus %>">
      <a href="https://plus.google.com/share?url=<%= url %>"
        target="_blank"></a>
    </li>
    <li class="visible-xs-inline-block <%= css.share_item %> <%= css.share_whatsapp %>">
      <a href="whatsapp://send?text=<%= url %>"></a>
    </li>
    <li class="<%= css.share_item %> <%= css.share_mail %>">
      <a href="mailto:?subject=<%= title %>&amp;body=<%= title %> - <%= url %>"></a>
    </li>
  </ul>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      title: '@postTitle',
      id: '@postId'
    },
    link: function (scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var title = newVal.title;
        var id = newVal.id;
        if (!title || !id) {
          return;
        }
        scope.url = window.location.protocol + '//' + window.location.host +
          '/article/' + scope.id;
        scope.css = css;
        element.html(ejs.render(htmlTpl, scope));
        unwatch();
      });
    }
  };
};
