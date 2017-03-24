export default function($timeout, $scope, gqModel, $attrs, queryHandler) {
  var categName = $attrs.categName;
  var eventCount = 7;
  $scope.events = [];

  $scope.loadEvents = function(pageNum, eventsDiv) {
    var startPos = 1 + eventCount * (pageNum - 1);
    gqModel.queryEvents(eventCount, 1, startPos).then(function(res) {
      $timeout(function() {
        $scope.events = queryHandler.parsePostEvents(categName, res.listPostEvent);
        eventsDiv.show();
      })
    });
  };
};
