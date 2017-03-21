import css from "../assets/css/sharebar.css";

const TEMPLATE = `
<div ng-class="css.artd_article_share_bar">
  <ul>
    <li ng-class="[css.share_item, css.share_fb]">
      <a ng-href="https://www.facebook.com/sharer/sharer.php?u={{url}}"
        target="_blank"></a>
    </li>
    <li ng-class="[css.share_item, css.share_tw]">
      <a ng-href="https://twitter.com/intent/tweet?url={{url}}&text={{title}}"
        target="_blank"></a>
    </li>
    <li ng-class="[css.share_item, css.share_gplus]">
      <a ng-href="https://plus.google.com/share?url={{url}}"
        target="_blank"></a>
    </li>
    <li ng-class="[css.share_item, css.share_whatsapp]">
      <a ng-href="whatsapp://send?text={{url}}"></a>
    </li>
    <li ng-class="[css.share_item, css.share_mail]">
      <a ng-href="mailto:?subject=文章分享&amp;body=请点击：{{url}}"
        target="_blank"></a>
    </li>
  </ul>
</div>
`;

export default function($location) {
  return {
    restrict: 'E',
    scope: {
      title: '@postTitle'
    },
    template: TEMPLATE,
    link: function (scope) {
      scope.url = $location.absUrl();
      scope.css = css;
    }
  };
};
