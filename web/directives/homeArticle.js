export default function() {
  return {
    restrict: 'E',
    scople: {
      article: '=addArticle',
    },
    templateUrl: '/partials/homeArticle.html'
  };
};
