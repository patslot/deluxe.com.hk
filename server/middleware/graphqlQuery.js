var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

module.exports = function(GRAPHQL_ENDPOINT) {
  var _client = new Lokka({transport: new Transport(GRAPHQL_ENDPOINT)});

  const photo = _client.createFragment(`
    fragment on PhotoItem {
      imageId
      imagePath
      imagePathZoom
      caption
      width
      height
      source
    }
  `);

  const articleQ = `
    query sampleArtilce($id: String) {
      getArticleDetail(id: $id) {
        brandId
        brandArticleId
        brandCategoryId
        brandCategoryName
        brandName
        mlCategoryId
        mlArticleId
        issueId
        magIssueId
        pubDate
        lastUpdate
        displayTime
        forceToShowDate
        title
        subTitle
        intro
        label
        pageName
        allowComment
        pollingWidgetId
        tags
        newsTrack
        themeTags
        level3Category
        level2Category
        level1Category
        level0Category
        showRelatedArticleAtTop
        mediaGroup {
          type
          smallPath
          largePath
          width
          height
          source
          videoId
          url
          quality
        }
        contentBlocks {
          subHead
          photos {
            ...${photo}
          }
          content
        }
        introPhotos {
          ...${photo}
        }
      }
    }
  `

  const homeQ = `{
    listMPM {
      homeGalleryID
      apID
      catName
      imgName
      caption
      content
      linkURL
      sort
      startDateTime
      endDateTime
      confirm
      hasVideo
      adCode
      apCatID
    }
  }`

  return {
    articleQuery: function(articleID) {
      return _client.query(articleQ, {id: articleID});
    },
    homeQuery: function() {
      return _client.query(homeQ);
    }
  };
};
