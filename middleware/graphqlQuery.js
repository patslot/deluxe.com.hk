var config = require('../config.json');
var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

var _client = new Lokka({transport: new Transport(config.graphqlEndpoint)});

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

const articleQuery = `
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

module.exports = {
  articleQuery: function(articleID) {
    return _client.query(articleQuery, {id: articleID});
  }
};
