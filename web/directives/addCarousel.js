
const htmlTpl = `
  <div class="carousel-inner">
  <% carouselItems.forEach(function(i, idx) { %>
    <% var _class = 'item'; if (idx === 0) { _class += ' active'; } %>
    <div class="<%= _class %>">
      <div class="col-xs-12 col-sm-6 col-md-3 item_block">
        <a href="<%= i.linkURL %>" target="<%= i.linkTarget %>">
         <% if (i.hasVideo) { %>
         <img class="play" src="/img/icon-play.png" />
         <% } %>
         <img src="<%= i.image %>" alt="">
        </a>
        <div class="four_col_slide_content">
          <% if (i.label) { %>
          <div class="nm_section_block_title_cat">[<%= i.label %>]</div>
          <% } %>
          <div class="nm_section_block_title">
            <a href="<%= i.linkURL %>" target="<%= i.linkTarget %>">
              <%- i.title %>
            </a>
          </div>
        </div>
      </div>
    </div>
  <% }) %>
  </div>
  <a class="left carousel-control" href="<%= cDiv %>" data-slide="prev"></a>
  <a class="right carousel-control" href="<%= cDiv %>" data-slide="next"></a>
`;

const TEMPLATE = `
<div class="nm_section">
  <div class="row nm_row front">
    <div class="col-sm-4 col-sm-offset-4">
      <div class="nm_section_header_ball" ng-class="titleClass">
      </div>
    </div>
  </div>
  <div class="row nm_row nm_section_border">
    <div class="col-md-12 four_col_slide">
      <!-- Compile html with ejs in this div -->
      <div class="carousel carousel-showmanymoveone slide"
        ng-attr-id="{{::carouselDiv}}" ng-show="ready">
      </div>
    </div>
  </div>
</div>
<link rel="stylesheet" href="/css/scrolls.css" />
`;

export default function($timeout) {
  return {
    restrict: 'E',
    scope: {
      titleClass: '=',
      carouselItems: '=',
      carouselDiv: '='
    },
    link: function(scope) {
      scope.ready = false;
      scope.$watch(function(newVal) {
        var carouselItems = newVal.carouselItems;
        var cDiv = '#' + newVal.carouselDiv;
        if (scope.ready || !carouselItems || !cDiv) {
          return;
        }
        var $ = angular.element;
        $(cDiv).html(ejs.render(htmlTpl, {carouselItems: carouselItems,
          cDiv: cDiv}))
          .carousel({interval: 5000});

        $('.four_col_slide ' + cDiv + ' .item').each(function() {
          var itemToClone = $(this);
          for (var i = 1; i < 4; i++) {
            itemToClone = itemToClone.next();
            // wrap around if at end of item collection
            if (!itemToClone.length) {
              itemToClone = $(this).siblings(':first');
            }
            // grab item, clone, add marker class, add to collection
            itemToClone.children(':first-child').clone()
              .addClass("cloneditem-" + (i))
              .appendTo($(this));
          }
        });
        scope.ready = true;
      });
    },
    template: TEMPLATE
  };
};
