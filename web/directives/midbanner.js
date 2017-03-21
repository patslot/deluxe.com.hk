const TEMPLATE = `
<div class="nm_section hidden-xs">
  <div class="head_banner_wrapper">
    <div class="superhead_banner">
      <div ng-attr-id="{{divId}}"></div>
    </div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@midbannerId'
    },
    template: TEMPLATE,
    link: function ($scope, element, attrs) {
      var midbannerId = attrs.midbannerId;
      setTimeout(function() {
        showWebAd("Midbanner", midbannerId);
      }, 0);
    }
  };
};
