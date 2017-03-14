export default function() {
  return {
    restrict: 'E',
    scope: {
      articles: '=addArticles'
    },
    templateUrl: '/partials/articlesInCateg.html'
  };
};
