<div class="nm_section">
  <div class="row nm_row front">
    <div class="col-sm-4 col-sm-offset-4">
      <div class="nm_section_header_ball">
        <h4 class="text-center nm_section_header">editor's<br/>picks</h4>
      </div>
    </div>
  </div>
  <div class="row nm_row nm_section_border">
    <div class="col-sm-3 nm_section_block" ng-repeat="p in picks">
      <div class="nm_img_wrapper" style="{{::p.style}}">
      </div>
      <div class="text-left">
        <div class="nm_section_block_title_cat">[TODO: beauty]</div>
        <div class="nm_section_block_title">{{::p.title}}</div>
      </div>
    </div>
  </div>
</div>
