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

  var createCmsCompoeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  const listHomeHighlight = createCmsCompoeFeedQuery('listHomeHighlight');
  const listHomeLatestArticle = createCmsCompoeFeedQuery('listHomeLatestArticle');

  var createTagNameQuery = function(queries) {
    return 'query ($tagName: String, $offset: Int, $count: Int) { ' +
      queries.join(' ') + ' }';
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  const homeQ = createQuery([listMenu, listInstagram, listHomeLatestArticle,
    listHomeEditorPick, listHomeHighlight]);
  const listCategArticleQ = createTagNameQuery([listArticle]);

  return {
    queryCategArticles: function(tagName, offset, count) {
      return client.query(listCategArticleQ, { tagName: tagName, offset: offset, count: count });
    },
    // TODO(wkchan): Menu sorting and display
    queryHome: function() {
      return client.query(homeQ);
    },
    // Assume listCategArticle is not empty before calling queryCateg()
    queryCateg: function(listCategArticle) {
      // Query listMenu and list<Categ=Fashion|...>Article
      return client.query(createQuery([listCategArticle+ ' ' + articleModel,
        listMenu]));
    },
    queryArticle: function(listCategArticle) {
      return client.query(createQuery([listCategArticle+ ' ' + articleModel,
        listMenu, listInstagram]));
    }
  };
};
