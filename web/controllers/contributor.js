export default function($timeout, $scope, gqModel, queryHandler) {
  var contributors = [];
  var contributorCount = 6;
  var isReady = false;
  var contributorIdx = 6;

  $scope.noMoreContributor = false;
  $scope.loadingContributors = false;
  $scope.moreContributorGroups = [];

  gqModel.queryContributorIndex().then(function(res) {
    $timeout(function() {
      contributors = res.listContributor || [];
      isReady = true;
    });
  });

  function updateCategIdx() {
    contributorIdx += contributorCount;
    $scope.loadingContributors = false;
  };

  $scope.loadContributors = function() {
    // TODO: refactor lazyload code of fetching data for pages
    if (!isReady || $scope.noMoreContributor) {
      return false;
    }
    if ($scope.loadingContributors) {
      return false;
    }
    if (contributorIdx < contributors.length) {
      $scope.loadingContributors = true;
      var moreContributors = contributors.slice(
        contributorIdx, contributorIdx + contributorCount);
      if (moreContributors.length > 0) {
        $scope.moreContributorGroups.push(
          queryHandler.parseContributors(moreContributors));
      }
      if (moreContributors.length < contributorCount) {
        $scope.noMoreContributor = true;
      }
      updateCategIdx();
    }
  };
};
