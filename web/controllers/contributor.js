export default function($timeout, $scope, gqModel, queryHandler) {
  var contributors = [];
  var contributorCount = 6;
  var isReady = false;
  var contributorIdx = 6;

  $scope.noMoreContributor = false;
  $scope.loadingContributors = false;
  $scope.moreContributorGroups = [];

  var processContributors = function (contributors) {
    for (var i = 0, len = contributors.length; i < len; i++) {
      var contributor = contributors[i];
      var splitPos = contributor.content.indexOf('|');
      if (splitPos > 0) {
        contributor.post = contributor.content.slice(0, splitPos);
        contributor.desc = contributor.content.slice(splitPos+1).trim();
      }
    }
    return contributors;
  };
  gqModel.queryContributorIndex().then(function(res) {
    $timeout(function() {
      $scope.categs = queryHandler.parseMenu(res.listMenu);
      contributors = res.listContributor || [];
      var firstBlockContributors  = processContributors(
        contributors.slice(0, contributorCount));
      $scope.firstContributor = firstBlockContributors[0];
      $scope.restContributorsIn1stBlock = firstBlockContributors.slice(
        1, contributorCount);
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
          processContributors(moreContributors));
      }
      if (moreContributors.length < contributorCount) {
        $scope.noMoreContributor = true;
      }
      updateCategIdx();
    }
  };
};
