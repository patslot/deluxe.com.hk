<h3>Latest 4 articles</h3>
<div ng-repeat="a in articles">
  <!-- Handle display layout? MediaGroup of video? -->
  {{a.displayLayoutPreset}}<br />
  <img ng-if="a.mediaGroup.length > 0" src="{{a.mediaGroup[0].smallPath}}" />
  <br />{{a.title}}
  <br />[a.label]<br />
  <div ng-bind-html="a.firstContentBlock.content"></div>
</div>
