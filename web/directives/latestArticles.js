export default function() {
  return {
    restrict: 'E',
    scope: {
      articles: '=addArticles'
    },
    templateUrl: '/latestArticles.html'
  };
};
