export default function($timeout) {
   var htmlTpl = `
     <div class="carousel-inner">
     <% highlights.forEach(function(h, idx) { %>
       <% var _class = 'item'; if (idx === 0) { _class += ' active'; } %>
       <div class="<%= _class %>">
         <div class="col-xs-12 col-sm-6 col-md-3 item_block">
           <img src="<%= h.imgName %>" alt="">
           <div class="four_col_slide_content">
             <div class="nm_section_block_title_cat">[<%= h.catName %>]</div>
             <div class="nm_section_block_title"><%- h.content %></div>
           </div>
         </div>
       </div>
     <% }) %>
     </div>
     <a class="left carousel-control" href="#carousel123" data-slide="prev"></a>
     <a class="right carousel-control" href="#carousel123" data-slide="next"></a>
  `;

  return {
    restrict: 'E',
    scope: {
      highlights: '=addHighlights'
    },
    link: function(scope, element) {
      scope.ready = false;
      scope.$watch(function(newVal) {
        if (scope.ready) {
          return;
        }
        var highlights = newVal.highlights;
        if (!highlights) {
          return;
        }
        var $ = angular.element;
        $('#carousel123').html(ejs.render(htmlTpl, {highlights: highlights}))
          .carousel({interval: 5000});

        $('.four_col_slide .carousel-showmanymoveone .item').each(function() {
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
    templateUrl: '/highlights.html'
  };
};
