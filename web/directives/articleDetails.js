const htmlTpl = `
<div class="main_content" style="margin-top: 50px">
  <div class="nm_section">
    <headbanner headbanner-id="headbanner_<%= idx %>"></headbanner>
    <div class="row">
      <% if (type === "news") { %>
        <div class="nm_mpm col-md-6 col-xs-12">
          <div class="mpm_content artd_container">
            <div class="artd_article_label">[<%- disCategoryName %>]</div>
            <div class="artd_article_title"><%- title %></div>
            <div id="article-<%= idx %>" class="artd_article_publish_date">
              日期：<%- pubDate %>
            </div>
            <share-bar post-id="<%- id %>"
              post-title="<%- title %>"></share-bar>
            <div class="artd_article_video">
              <div id="video_player-<%= idx %>"></div>
            </div>
            <div class="artd_article_intro">
            <% if (introPhotos && introPhotos.length > 0) { %>
              <% introPhotos.forEach(function (photo) { %>
                <div align="center" class="artd_intro_photo"><div class="artd_article_Photo">
                  <img src="<%- photo.imagePathZoom %>"></div>
                  <div class="artd_article_caption"><%- photo.caption %></div>
                </div>
              <% }) %>
            <% } %>
            <%- intro %>
            </div>
            <% if (contentBlocks && contentBlocks.length > 0) { %>
              <% contentBlocks.forEach(function (content, index) { %>
                <div class="artd_article_subHead">
                  <%- content.subHead %>
                </div>
                <% if (content.photos && content.photos.length > 0) { %>
                  <% content.photos.forEach(function (photo) { %>
                    <div align="center" class="artd_intro_photo"><div class="artd_article_Photo">
                      <img src="<%- photo.imagePathZoom %>"></div>
                      <div class="artd_article_caption"><%- photo.caption %></div>
                    </div>
                  <% }) %>
                <% } %>
                <% if (content.content === "<p>FIXBANNER1</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner1_<%= idx %>_<%= index %>"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER2</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner2_<%= idx %>_<%= index %>" fixedbanner-num="2"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER3</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner3_<%= idx %>_<%= index %>" fixedbanner-num="3"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER4</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner4_<%= idx %>_<%= index %>" fixedbanner-num="4"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER5</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner5_<%= idx %>_<%= index %>" fixedbanner-num="5"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER6</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner6_<%= idx %>_<%= index %>" fixedbanner-num="6"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER7</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner7_<%= idx %>_<%= index %>" fixedbanner-num="7"></fixedbanner>
                <% } else if (content.content === "<p>FIXBANNER8</p>") { %>
                  <fixedbanner fixedbanner-id="fixedbanner8_<%= idx %>_<%= index %>" fixedbanner-num="8"></fixedbanner>
                <% } else { %>
                  <div class="artd_article_Text">
                    <%- content.content %>
                  </div>
                <% } %>
              <% }) %>
            <% } %>
          </div>
        </div>
      <% } else if (type === "cms") { %>
        <div class="nm_mpm col-md-6 col-xs-12">
          <div class="mpm_content artd_container">
            <div class="artd_article_label">[<%- disCategoryName %>]</div>
            <div class="artd_article_title"><%- title %></div>
            <div class="artd_article_sub_title"><%- subTitle %></div>
            <div id="article-<%= idx %>" class="artd_article_publish_date">
              日期：<%- publish %>
            </div>
            <% if (disCategoryName === "contributors") { %>
                          <div class="col-xs-12 contributorblock">
                                  
                                       <div class="row">
                                        <a ng-href="/Contributor/<%= contributor.catName %>">
                                          <div class="col-xs-2 col-sm-2 contributorImg">
                                            <img src="<%= contributor.imgName %>" />
                                          </div>
                                          <div class="col-xs-10  col-sm-10 ctb_item_container">
                                            <div class="contributorName">
                                              <%= contributor.catName %> <%= contributor.post %> 
                                            </div>
                                            <div class="contributorDesc">
                                              <%- contributor.desc %>
                                            </div>
                                          </div>
                                        </a>
                                      </div>

                                  
                          </div>
            <% } %>
            <share-bar post-id="<%- id %>"
              post-title="<%- title %>"></share-bar>
            <div class="artd_article_video">
              <div id="video_player-<%= idx %>"></div>
            </div>
            <% if (artBlock && artBlock.length > 0) { %>
              <% artBlock.forEach(function (content, index) { %>
                  <% if (content.subTitle == "video") { %>
                        <div class="artd_article_video">
                        <div id="video_player_<%- content.blockID %>"></div>
                      </div>
                      <script type="text/javascript">
                        $(document).ready(function() {
                          var videoId = "_<%- content.blockID %>" || "";
                          var anvpId = "anvp" + videoId; // Unique player id
                          var anvpInstance = new AnvatoPlayer(anvpId);
                          var videourl = "<%- content.content %>" ;
                          
                          videourl = videourl.replace('<p>','') ;
                          videourl = videourl.replace('</p>','') ;
                          anvpInstance.setVideoUrl(videourl);
                          anvpInstance.setPlayerSize("100%", "100%");
                          anvpInstance.setVolume(0.5); // Value between 0 - 1
                          anvpInstance.setShareEnable(false);
                          anvpInstance.createInstance("video_player_<%- content.blockID %>"); // Div Id match
                        });
                      </script>
                <% }else { %>
                <div class="artd_article_subHead">
                  <%- content.subTitle %>
                </div>
                <div align="center" class="artd_intro_photo">
                   <a href="#" data-featherlight="<%- content.imgFile %>">
                        <div class="artd_article_Photo"><img src="<%- content.imgFile %>"></div>
                        <div class="artd_article_caption"><%- content.caption %></div>
                    </a>
                </div>
                  <div class="artd_article_Text">
                    <%- content.content %>
                            <% if (index == 3) { %>
                              <flyingcarpetfixedbanner fixedbanner-id="fixedbanner2_<%= index %>" fixedbanner-num="2"></fixedbanner>
                            <% } %>
                              <% if (index == 7) { %>
                              <flyingcarpetfixedbanner fixedbanner-id="fixedbanner3_<%= index %>" fixedbanner-num="3"></fixedbanner>
                            <% } %>
                              <% if (index == 11) { %>
                              <flyingcarpetfixedbanner fixedbanner-id="fixedbanner4_<%= index %>" fixedbanner-num="4" ></fixedbanner>
                            <% } %>
                              <% if (index == 15) { %>
                              <flyingcarpetfixedbanner fixedbanner-id="fixedbanner5_<%= index %>" fixedbanner-num="5"></fixedbanner>
                            <% } %>
                              <% if (content.content === "<p>FIXBANNER6</p>") { %>
                                <fixedbanner fixedbanner-id="fixedbanner6_<%= index %>" fixedbanner-num="6"></fixedbanner>
                            <% } %>
                            <% if (content.content === "<p>FIXBANNER7</p>") { %>
                              <fixedbanner fixedbanner-id="fixedbanner7_<%= index %>" fixedbanner-num="7"></fixedbanner>
                            <% } %>
                            <% if (content.content === "<p>FIXBANNER8</p>") { %>
                              <fixedbanner fixedbanner-id="fixedbanner8_<%= index %>" fixedbanner-num="8"></fixedbanner>
                            <% } %>
                    </div>
                    <% } %>
              <% }) %>
            <% } %>
          </div>
        </div>
      <% } %>
      <div class="lrec_ad_wrapper col-md-3 col-xs-12">
        <lrec lrec-id="lrec1_<%= idx %>" lrec-num="1"></lrec>
        <lrec lrec-id="lrec2_<%= idx %>" lrec-num="2"></lrec>
      </div>
    </div>
  </div>

  <midbanner midbanner-id="midbanner_<%= idx %>"></midbanner>
</div>

<div id="article-end-<%= idx %>"></div>

<% if (categoryName != "Contributor") { %>
  <add-carousel-recommend title-class="'nm_recommend'" carousel-items="article.latestArticles"
  carousel-div="'recommend-carousel-<%= idx %>'"></add-carousel-recommend>
<% } %>

<% if (categoryName === "Contributor") { %>
  <add-carousel title-class="'nm_recommend'" carousel-items="article.latestArticles"
  carousel-div="'recommend-carousel-<%= idx %>'"></add-carousel>
<% } %>
<script>
  ['#article-<%= idx %>', '#article-end-<%= idx %>'].forEach(function(divID) {
    scrollAnchors.push({
      id: divID,
      title: '<%- eTitle %>',
      url: <% if (isSharedUrl) { %> '/article/<%- id %>' <% } else { %> '/<%- categoryName %>/<%- id %>/<%- eTitle %>' <% } %>,
      nxmObj: {"region": "HK", "prod": "ADD", "site": "deluxe.com.hk",
        "platform": "WEB", "section": "<%= pvLog.section %>", "media": "TEXT",
        "content": "<%= pvLog.content %>", "issueid": "<%= pvLog.issueid %>",
        "title": "<%= pvLog.title %>", "cid": "<%= pvLog.cid %>", "news": "<%= pvLog.news %>",
        "edm": "", "action": "PAGEVIEW", "subsect": "<%= pvLog.subsect %>", "subsubsect": "",
        "menu": "<%= pvLog.menu %>", "auth": "<%= pvLog.auth %>", "src": "AD", "L": "TC",
        "ch": "<%= pvLog.channel %>", "cat": "<%= pvLog.category %>", "ky": "<%= pvLog.ky %>", "ngsid": "", "ref": ""
      }
    });
  });

  disableLogPageview(); // For 1st article
</script>
`;

export default function($compile) {
  return {
    restrict: 'E',
    scope: {
      article: '=',
    },
    link: function(scope, element) {
      var unwatch = scope.$watch(function(newVal) {
        var article = newVal.article;
        if (!article) {
          return;
        }
        article.eTitle = article.title.replace("'", "\\'");
        element.html($compile(ejs.render(htmlTpl, article))(scope));
        renderVideo(article.video, article.title, 'video_player-' + article.idx);
        unwatch();
      });
    }
  };
};
