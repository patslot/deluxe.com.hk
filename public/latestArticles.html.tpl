<h3>Latest {{articles.length}} articles</h3>
<div ng-repeat="a in articles">
  <!-- Handle display layout? MediaGroup of video? -->
  {{a.displayLayoutPreset}}<br />
  <img ng-if="a.mediaGroup.length > 0" ng-src="{{a.mediaGroup[0].smallPath}}" />
  <br />
  <!-- TODO(wkchan): Replace 'Fashion' with a category -->
  <a ng-href="/Fashion/{{a.mlArticleId}}/{{a.title}}">{{a.title}}</a>
  <br />[a.label]<br />
  <div ng-bind-html="a.firstContentBlock.content | trust"></div>
</div>
