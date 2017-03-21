const TEMPLATE = `
<div class="artd_instagram_block">
  <h4 class="artd_instagram_header"><img src="/img/icon08.png"></h4>
  <div class="artd_instagram_small_image" ng-repeat="ig in igMedias">
    <a ng-href="{{ig.link}}" target="_blank"><img ng-src="{{ig.images.thumbnail.url}}" /></a>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      igMedias: '='
    },
    template: TEMPLATE
  };
};
