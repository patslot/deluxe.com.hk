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
                <div class="artd_article_Text">
                  <%- content.content %>
                </div>
                <fixedbanner fixedbanner-id="fixedbanner_<%= idx %>_<%= index %>"></fixedbanner>
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
            <share-bar post-id="<%- id %>"
              post-title="<%- title %>"></share-bar>
            <div class="artd_article_video">
              <div id="video_player-<%= idx %>"></div>
            </div>
            <% if (artBlock && artBlock.length > 0) { %>
              <% artBlock.forEach(function (content, index) { %>
                <div class="artd_article_subHead">
                  <%- content.subTitle %>
                </div>
                <div align="center" class="artd_intro_photo"><div class="artd_article_Photo">
                  <img src="<%- content.imgFile %>"></div>
                  <div class="artd_article_caption"><%- content.caption %></div>
                </div>
                <div class="artd_article_Text">
                  <%- content.content %>
                </div>
                <fixedbanner fixedbanner-id="fixedbanner_<%= idx %>_<%= index %>"></fixedbanner>
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
<add-carousel title-class="'nm_recommend'"
  carousel-items="article.latestArticles"
  carousel-div="recommend-carousel-<%= idx %>"></add-carousel>

<script>
  ['#article-<%= idx %>', '#article-end-<%= idx %>'].forEach(function(divID) {
    scrollAnchors.push({
      id: divID,
      title: '<%- eTitle %>',
      url: <% if (isSharedUrl) { %> '/article/<%- id %>' <% } else { %> '/<%- categoryName %>/<%- id %>/<%- eTitle %>' <% } %>,
      nxmObj: {"region": "HK", "prod": "ADD", "site": "https://add.appledaily.com.hk",
        "platform": "WEB", "section": "<%= pvLog.section %>", "media": "TEXT",
        "content": "<%= pvLog.content %>", "issueid": "<%= pvLog.issueid %>",
        "title": "<%= pvLog.title %>", "cid": "<%= pvLog.cid %>", "news": "<%= pvLog.news %>",
        "edm": "", "action": "PAGEVIEW", "subsect": "<%= pvLog.subsect %>", "subsubsect": "",
        "menu": "<%= pvLog.menu %>", "auth": "<%= pvLog.auth %>", "src": "AD", "L": "TC",
        "ch": "<%= pvLog.channel %>", "cat": "<%= pvLog.category %>", "ky": "", "ngsid": "", "ref": ""
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
