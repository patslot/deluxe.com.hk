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

  const getNewsArticleDetail = `
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
      categoryName
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
  `

  const getCMSArticleDetail = `
    getCMSArticleDetail(articleID: $id) {
      categoryID
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
      categoryName
    }
  `;

  const getContributorName = `
    getCMSArticleDetail(articleID: $id) {
      ... on ContributorArticleDetail {
        contributorName
      }
    }
  `;

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

  const listMenu = `listMenu {
    categoryID
    campaignID
    name
    eName
    showNew
    genCatJSON
    subCategory
    display
    sort
    memo
    img
  }`;

  const listContributorArticle = `listContributorArticle(name: $name) {
    id
    categoryID
    publish
    lastUpdate
    title
    articleThumbnail
    videoThumbnail
    videoFile
    anvato
    youtube
    intro
  }`;

  const listEditorPick = `listEditorPick {
    id
    categoryID
    publish
    lastUpdate
    title
    articleThumbnail
    videoThumbnail
    videoFile
    anvato
    youtube
    intro
  }`;

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  var createQueryWithParams = function(paramStr, queries) {
    return 'query (' + paramStr + ') { ' + queries.join(' ') + ' }';
  };

  return {
    newsArticleQuery: function(articleID) {
      return client.query(createQueryWithParams('$id: String',
        [listMenu, getNewsArticleDetail]), {id: articleID});
    },
    // For CMS article or editor pick article
    cmsArticleQuery: function(articleID) {
      return client.query(createQueryWithParams('$id: String',
        [listMenu, getCMSArticleDetail, getContributorName]), {id: articleID});
    },
    homeQuery: function() {
      return client.query(createQuery([listMPM,
        listMenu,
        createCmsComponeFeedQuery('listHomeLatestArticle')
      ]));
    },
    categQuery: function(listCategArticle) {
      return client.query(createQuery([listCategArticle + ' ' + articleModel,
        listMenu]));
    },
    contributorIndexQuery: function() {
      return client.query(createQuery([listMenu,
        createCmsComponeFeedQuery('listContributor')
      ]));
    },
    contributorArticlesQuery: function(contrName) {
      return client.query(createQueryWithParams('$name: String',
        [listMenu,
          createCmsComponeFeedQuery('listContributor'),
          listContributorArticle
        ]),
        {name: contrName});
    },
    queryEditorPicks: function() {
      return client.query(createQuery([listMenu, listEditorPick]));
    },
  };
};
