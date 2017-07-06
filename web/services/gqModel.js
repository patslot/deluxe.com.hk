export default function(c) {
  var Lokka = require('lokka').Lokka;
  var Transport = require('lokka-transport-http').Transport;

  var client = new Lokka({
    transport: new Transport(c.GRAPHQL_ENDPOINT, { credentials: false })
  });

  const listInstagram = `listInstagram(limit: 6) {
    link
    type
    videos {
      standard_resolution {
        url
      }
    }
    images {
      thumbnail {
        url
      }
    }
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

  const listHomeEditorPick = `listHomeEditorPick {
    id
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

  const CmsArticle = ` {
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

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  var createQueryWithParams = function(paramStr, queries) {
    return 'query (' + paramStr + ') { ' + queries.join(' ') + ' }';
  };

  var createCmsArticleQuery = function(queryName) {
    return queryName + ' ' + CmsArticle;
  };

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

  return {
    consts: {
      listHomeArticles: {
        fashion: 'listHomeFashionArticle',
        beauty: 'listHomeBeautyArticle',
        luxe: 'listHomeLuxeArticle',
        wedding: 'listHomeWeddingArticle',
        celebrity: 'listHomeCelebrityArticle',
        lifeStyle: 'listHomeLifeStyleArticle'
      },
    },
    queryHomeLazy: function() {
      return client.query(createQuery([listInstagram,
        listHomeEditorPick, createCmsComponeFeedQuery('listBannerForEvent')]));
    },
    queryHomeLazyCategs: function(homeQueryNames) {
      var queries = homeQueryNames.map(function(name) {
        return createCmsComponeFeedQuery(name);
      });
      return client.query(createQuery(queries));
    },
    // TODO(wkchan): Menu sorting and display
    queryHome: function() {
      return client.query(createQuery([
        createCmsComponeFeedQuery('listHomeLatestArticle'),
        createCmsComponeFeedQuery('listHomeHighlight'),
        createCmsComponeFeedQuery('listBannerForContributor')
      ]));
    },
    // Assume listCategArticle is not empty before calling queryCateg()
    queryCateg: function(listCategArticle, offset, count) {
      // Query list<Categ=Fashion|...>Article
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listCategArticle + ' ' + articleModel]),
        {offset: offset, count: count});
    },
    queryArticle: function(listCategArticle, offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [listCategArticle + ' ' + articleModel,
        listInstagram]),
        {offset: offset, count: count});
    },
    // queryEditorPicks used in editor pick articles page, it also query instagram
    queryEditorPicks: function(offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [createCmsArticleQuery('listEditorPick (offset: $offset, count: $count)'),
        listInstagram]),
        {offset: offset, count: count});
    },
    // queryEditorPickArticles only query editor pick articles
    queryEditorPickArticles: function(offset, count) {
      return client.query(createQueryWithParams('$offset: Int, $count: Int',
        [createCmsArticleQuery('listEditorPick (offset: $offset, count: $count)')]),
        {offset: offset, count: count});
    },
    queryContributorIndex: function() {
      return client.query(createQuery([
        createCmsComponeFeedQuery('listContributor')
      ]));
    },
    queryContributorArticlesInArticle: function(contrName, offset, count) {
      return client.query(createQueryWithParams('$name: String, $offset: Int, $count: Int',
        [listContributorArticle, listInstagram]), {name: contrName, offset: offset, count: count});
    },
    queryContributorArticles: function(contrName, offset, count) {
      return client.query(createQueryWithParams('$name: String, $offset: Int, $count: Int',
        [listContributorArticle]), {name: contrName, offset: offset, count: count});
    },
    queryEvents: function(pagesize, page, start) {
      return client.query(createQueryWithParams('$pagesize: Int, $page: Int, $start: Int',
        ['listPostEvent (pagesize: $pagesize, page: $page, start: $start) ' +
          cmsArticleModel]),
        {pagesize: pagesize, page: page, start: start});
    },
    queryPostEvents: function () {
      return client.query(createQuery([
        createCmsArticleQuery('listPostEvent')]));
    }
  };
};
