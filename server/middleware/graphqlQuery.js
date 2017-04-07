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
      logging {
        krux_app_brand
        krux_app_subsection_suffix
        pixelAuthor
        pixelCat
        pixelCategory
        pixelKeyword
        pixelNews
        pixelNewsType
        pixelSrc
      }
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

  const cmsComponeFeedModel = `{
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

  const articleModel = ` (offset: $offset, count: $count) {
    __typename
    id
    title
    lastUpdate
    ... on NewsArticle {
      mediaGroup {
        type
        largePath
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

  const listCampaign = `listCampaign {
    imgName
    linkURL
    content
  }`;

  const listContributorArticle = `listContributorArticle(name: $name, offset: $offset, count: $count) {
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

  const cmsArticleModel = `{
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
        [listMenu, listCampaign, getNewsArticleDetail]), {id: articleID});
    },
    // For CMS article or editor pick article
    cmsArticleQuery: function(articleID) {
      return client.query(createQueryWithParams('$id: String',
        [listMenu, listCampaign, getCMSArticleDetail, getContributorName]), {id: articleID});
    },
    homeQuery: function() {
      return client.query(createQuery(['listMPM ' + cmsComponeFeedModel,
        listMenu,
        listCampaign,
        createCmsComponeFeedQuery('listHomeLatestArticle')
      ]));
    },
    categQuery: function(listCategArticle, offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listCategArticle + ' ' + articleModel,
        listMenu, listCampaign]),
        {offset: offset, count: count});
    },
    contributorIndexQuery: function() {
      return client.query(createQuery([listMenu, listCampaign,
        createCmsComponeFeedQuery('listContributor')
      ]));
    },
    contributorArticlesQuery: function(contrName, offset, count) {
      return client.query(createQueryWithParams('$name: String, $offset: Int, $count: Int',
        [listMenu, listCampaign,
          createCmsComponeFeedQuery('listContributor'),
          listContributorArticle
        ]),
        {name: contrName, offset: offset, count: count});
    },
    queryEditorPicks: function(offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listMenu, listCampaign,
        'listEditorPick (offset: $offset, count: $count) ' + cmsArticleModel]),
        {offset: offset, count: count});
    },
    eventsQuery: function(pagesize, page) {
      return client.query(createQueryWithParams('$pagesize: Int, $page: Int',
        [listMenu, listCampaign, 'totalPostEvent',
          'listUpcomingEvent ' + cmsComponeFeedModel,
          'listPostEvent (pagesize: $pagesize, page: $page) ' +
          cmsArticleModel]),
        {pagesize: pagesize, page: page});
    },
    upcomingEventQuery: function () {
      return client.query(createQuery([
        createCmsComponeFeedQuery('listUpcomingEvent')
      ]));
    }
  };
};
