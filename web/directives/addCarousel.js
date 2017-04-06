const htmlTpl = `
<div class="nm_section">
  <div class="row nm_row front">
    <div class="col-sm-4 col-sm-offset-4">
      <div class="nm_section_header_ball <%= titleClass %>">
      </div>
    </div>
  </div>
  <div class="row nm_row nm_section_border">
    <div class="col-xs-12 col-sm-10 col-md-12 four_col_slide">
      <!-- Compile html with ejs in this div -->
      <div class="carousel carousel-showmanymoveone slide"
        id="<%= div %>" style="display: none">
        <div class="carousel-inner">
        <% carouselItems.forEach(function(i, idx) { %>
          <% var _class = 'item'; if (idx === 0) { _class += ' active'; } %>
          <div class="<%= _class %>">
            <div class="col-xs-12 col-sm-5 col-md-3 item_block">
              <% if (showLink) { %>
                <a href="<%= i.linkURL %>" target="<%= i.linkTarget %>">
              <% } else { %>
                <a>
              <% } %>
                <div class="pos-relative">
                  <% if (i.hasVideo) { %>
                  <img class="play" src="/img/icon-play.png" />
                  <% } %>
                  <img src="<%= i.image %>" alt="">
                </div>
              </a>
              <div class="four_col_slide_content">
                <% if (i.label) { %>
                <div class="nm_section_block_title_cat">[<%= i.label %>]</div>
                <% } %>
                <div class="nm_section_block_title">
                  <% if (showLink) { %>
                    <a href="<%= i.linkURL %>" target="<%= i.linkTarget %>">
                  <% } else { %>
                    <a>
                  <% } %>
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
      </div>
    </div>
  </div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      titleClass: '=',
      carouselItems: '=',
      carouselDiv: '=',
      showLink: '='
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var carouselItems = newVal.carouselItems;
        var div = newVal.carouselDiv;
        var cDiv = '#' + div;
        var titleClass = newVal.titleClass;
        var showLink = (titleClass === 'nm_editor_pick') && !newVal.showLink
                       ? false : true;
        if (!carouselItems || !cDiv || !titleClass) {
          return;
        }
        if (carouselItems.length === 0) {
          unwatch();
          return;
        }
        element.html(ejs.render(htmlTpl, {carouselItems: carouselItems,
          div: div, cDiv: cDiv, titleClass: titleClass,
          showLink: showLink}));

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
        (angular.element)(cDiv).carousel({interval: 5000})
          .show();
        unwatch();
      });
    }
  };
};
