const htmlTpl = `
<div class="nm_section">
  <div class="row nm_row front">
    <div class="col-sm-12">
      <div class="nm_section_header_ball <%= titleClass %>">
      </div>
    </div>
  </div>
  <div class="row nm_row nm_section_border">
    <div class="slide" id="<%= div %>slick">
     <% carouselItems.forEach(function(i, idx) { %>
            <div class="col-xs-12 col-sm-6 col-md-3 item_block">
              <% if (showLink) { %>
                <a href="<%= i.linkURL %>" target="<%= i.linkTarget %>">
              <% } else { %>
                <a>
              <% } %>
                <div class="pos-relative">
                  <% if (i.hasVideo) { %>
                  <img class="play" style="width: 100%;" src="/img/icon-play.png" />
                  <% } %>
                  <img src="<%= i.image %>" style="width: 100%;" alt="">
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
         <% }) %>
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
      showLink: '=',
      numCarousel: '='
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var carouselItems = newVal.carouselItems;
        var div = newVal.carouselDiv;
        var cDiv = '#' + div;
        var titleClass = newVal.titleClass;
        var numCarousel = newVal.numCarousel; 
        var showLink = (titleClass === 'nm_editor_pick') && !newVal.showLink
                       ? false : true;
        if (!carouselItems || !cDiv || !titleClass) {
          return;
        }
        if (!numCarousel){
            numCarousel =4; 
        }
        if (carouselItems.length === 0) {
          unwatch();
          return;
        }
        
          
          
        element.html(ejs.render(htmlTpl, {carouselItems: carouselItems,
          div: div, cDiv: cDiv, titleClass: titleClass,
          showLink: showLink}));
       
       
          
        (angular.element)(cDiv+'slick').slick({
                        dots: false,
                      infinite: true,
                      speed: 300,
                      slidesToShow: numCarousel,
                      slidesToScroll: numCarousel,
            nextArrow: '<a class="right carousel-control"></a>',
  prevArrow: '<a class="left carousel-control" style="z-index:300;"></a>',
                      responsive: [
                        {
                          breakpoint: 991,
                          settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            infinite: true,
                            dots: true
                          }
                        },
                        {
                          breakpoint: 767,
                          settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                          }
                        }
                        // You can unslick at a given breakpoint now by adding:
                        // settings: "unslick"
                        // instead of a settings object
                      ]
            }).show(); 
          
        $(cDiv+'slick').slick('setPosition');
        unwatch();
      });
    }
  };
};
