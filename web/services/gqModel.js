export default function(c) {
  var Lokka = require('lokka').Lokka;
  var Transport = require('lokka-transport-http').Transport;

  var client = new Lokka({
    transport: new Transport(c.GRAPHQL_ENDPOINT)
  });

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

  const listInstagram = `listInstagram(limit: 6) {
    link
    type
    videos {
      thumbnail {
        url
        width
        height
      }
    }
    images {
      thumbnail {
        url
        width
        height
      }
    }
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
      categoryID
      publish
      articleThumbnail
      videoThumbnail
      anvato
      youtube
      intro
    }
  }`;

  const listArticle = `listArticle(tagName: $tagName, offset: $offset, count: $count) {
    order
    highlight
    brandId
    brandName
    brandArticleId
    brandCategoryId
    mlCategoryId
    mlArticleId
    issueId
    pubDate
    updateDate
    displayLayoutPreset
    displayTime
    forceToShowDate
    title
    label
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
    sharing {
      image
      url
    }
    social {
      likeCount
      commentCount
      viewCount
      videoViewCount
      facebookCommentId
    }
    logging {
      pixelCategory
      pixelNewsType
      pixelKeyword
      pixelSrc
      pixelAuthor
      krux_app_brand
      krux_app_subsection_suffix
      pixelCat
      pixelNews
    }
    firstContentBlock {
      subHead
      content
    }
  }`;

  const listHomeEditorPick = `listHomeEditorPick {
    expire
    lastUpdate
    title
    videoFile
    videoThumbnail
    youtube
    imgFile
    oldCatName
    oldSecName
    intro
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

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  return {
    consts: {
      listHomeArticles: {
        fashion: 'listHomeFashionArticle',
        beauty: 'listHomeBeautyArticle',
        luxe: 'listHomeLuxeArticle',
        wedding: 'listHomeWeddingArticle',
        lifeStyle: 'listHomeLifeStyleArticle'
      },
    },
    queryHomeLazy: function(homeQueryNames) {
      var queries = homeQueryNames.map(function(name) {
        return createCmsComponeFeedQuery(name);
      });
      queries.push(listInstagram);
      queries.push(listHomeEditorPick);
      queries.push(createCmsComponeFeedQuery('listBannerForEvent'));
      return client.query(createQuery(queries));
    },
    queryCategArticles: function(listCategArticle) {
      return client.query(createQuery([listCategArticle + ' ' + articleModel]));
    },
    // TODO(wkchan): Menu sorting and display
    queryHome: function() {
      return client.query(createQuery([listMenu,
        createCmsComponeFeedQuery('listHomeLatestArticle'),
        createCmsComponeFeedQuery('listHomeHighlight'),
        createCmsComponeFeedQuery('listBannerForContributor')
      ]));
    },
    // Assume listCategArticle is not empty before calling queryCateg()
    queryCateg: function(listCategArticle) {
      // Query listMenu and list<Categ=Fashion|...>Article
      return client.query(createQuery([listCategArticle + ' ' + articleModel,
        listMenu]));
    },
    queryArticle: function(listCategArticle) {
      return client.query(createQuery([listCategArticle + ' ' + articleModel,
        listMenu, listInstagram]));
    }
  };
};
