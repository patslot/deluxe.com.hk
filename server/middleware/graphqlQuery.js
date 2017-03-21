var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

module.exports = function(GRAPHQL_ENDPOINT) {
  var client = new Lokka({transport: new Transport(GRAPHQL_ENDPOINT)});

  const photo = client.createFragment(`
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

  const newsArticleQ = `
    query ($id: String) {
      getNewsArticleDetail(articleID: $id) {
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

  const cmsArticleQ = `query($id: String) {
    getCMSArticleDetail(articleID: $id) {
      categoryID
      categoryName
      publish
      expire
      lastUpdate
      title
      subTitle
      videoFile
      videoThumbnail
      anvato
      youtube
      artBlock {
        blockID
        articleID
        subTitle
        content
        imgFile
        caption
        sort
        imgWidth
        imgHeight
      }
      imgBlock {
        imgFile
        caption
        imgWidth
        imgHeight
      }
      oldCatName
      oldSecName
      tag
      restricted
    }
  }`;

  const listMPM = `listMPM {
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
  }`;

  const CmsComponeFeedItem = `{
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
  }`;

  const articleModel = `{
    __typename
    id
    title
    lastUpdate
    ... on NewsArticle {
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
      firstContentBlock {
        subHead
        content
      }
    }
    ... on CmsArticle {
      anvato
      articleThumbnail
      categoryID
      intro
      lastUpdate
      publish
      title
      videoFile
      videoThumbnail
      youtube
    }
  }`;

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  return {
    newsArticleQuery: function(articleID) {
      return client.query(newsArticleQ, {id: articleID});
    },
    // For CMS article or editor pick article
    cmsArticleQuery: function(articleID) {
      return client.query(cmsArticleQ, {id: articleID});
    },
    homeQuery: function() {
      return client.query(createQuery([listMPM,
        createCmsComponeFeedQuery('listHomeLatestArticle')
      ]));
    },
    categQuery: function(listCategArticle) {
      return client.query(createQuery([listCategArticle + ' ' + articleModel]));
    },
    contributorIndex: function() {
      return client.query('query { ' +
        createCmsComponeFeedQuery('listContributor') + ' }');
    }
  };
};
