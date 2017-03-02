export default function() {
  return {
    restrict: 'E',
    scope: {
      categories: '=ngCategories'
    },
    templateUrl: '/menu.html.tpl'
  };
};
