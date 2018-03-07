export default function($timeout, $scope, gqModel, $attrs, queryHandler) {
  var categName = $attrs.categName;
  var numOfEvents = $attrs.numOfEvents;
  var eventCount = 7;
  var lazyLoadCount = 0; 
  $scope.noMoreEvent = false ; 
  $scope.events = [];
  $scope.moreEvents = [];
    
  $scope.loadEvents = function(pageNum, eventsDiv) {
    var startPos = 1 + eventCount * (pageNum - 1);
    gqModel.queryEvents(eventCount, 1, startPos).then(function(res) {
      $timeout(function() {
        $scope.events = queryHandler.parsePostEvents(categName, res.listPostEvent);
        //console.log($scope.events);
        //eventsDiv.show();
      })
    });
  };
    
    $scope.lazyLoadEvents = function() {
        
            
            var targetDiv = $('')
            lazyLoadCount = lazyLoadCount+1;
            var startPos = ( 1 + eventCount )* lazyLoadCount ;
        if (!$scope.noMoreEvent ) {
            //console.log(startPos);
            gqModel.queryEvents(eventCount, 1, startPos).then(function(res) {
              $timeout(function() {
                  var temp = queryHandler.parsePostEvents(categName, res.listPostEvent);
                  if (temp.length > 0) {
                      Array.prototype.push.apply( $scope.moreEvents, temp);
                     
                      console.log($scope.moreEvents);
                  }
                  if (temp.length < eventCount) {
                     $scope.noMoreEvent = true; 
                  }
                //eventsDiv.show();
              })
            });
        }
    };
};
