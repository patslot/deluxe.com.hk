const htmlTpl = `<div class="visible-xs" style="min-height: 548px; 
    min-width: 350px;z-index: 1; position: relative;    margin-right: -30px;  margin-left: -30px;">
      <div style="overflow: hidden; display: block; background: #e4e4e4 ; width: 100%; min-height: 548px; height: 548px; position: absolute; left: auto; right: auto; top: 0px; bottom: auto;">
          <div style="width: 100%; height: 15px; background-color: #e4e4e4; color: black;  font-size: 10px; line-height: 15px; text-align: center; position: absolute; top: 0px; z-index: 10;">Advertisement</div>
                <div  style="width: 100%; height: 548px; background-color: #e4e4e4;  text-align: center;  overflow: hidden; position: absolute;  margin: 0px !important;">
                     <div style="width: 100%; height: 548px; background-color: #e4e4e4; overflow: hidden; clip: rect(auto auto auto auto); position: absolute; margin: 0px !important;">
                           <div id="<%= divId %>" style="width: 100%; background-color: #e4e4e4; transform: translateZ(0px);  position: fixed; padding-bottom: 0px; left:0; top: 15%; ">
   
                                    </div>
                       </div>
                  </div>
      </div>
      <div style="width: 100%; height: 15px; background-color: #e4e4e4; color: black;   font-size: 10px; line-height: 15px; text-align: center; position: absolute; bottom: 0px; z-index: 10;">SCROLL TO CONTINUE WITH CONTENT</div>
</div>
`;

export default function() {
  return {
    restrict: 'E',
    scope: {
      divId: '@fixedbannerId',
      articleId: '@articleId'
    },
    link: function (scope, element, attrs) {
      var unwatch = scope.$watch(function(newVal) {
          
        var divId = newVal.divId;
        var articleId = newVal.articleId || "";
        if (!divId) {
          return;
        }
         var rand = new Date().valueOf();
         divId = divId + "-" + rand ;
        var fixedbannerNum = attrs.fixedbannerNum;
        if (fixedbannerNum) {
          fixedbannerNum = +fixedbannerNum;
        } else {
          fixedbannerNum = 1;
        }
        // Only show fixedbanner up to number 8
        if (fixedbannerNum > 8) {
          unwatch();
          return;
        }
        fixedbannerNum = Math.min(fixedbannerNum, 8);
        element.html(ejs.render(htmlTpl, {divId: divId}));
        showMobileAd("Fixedbanner" + fixedbannerNum, divId, articleId);
        unwatch();
      });
    }
  };
};
