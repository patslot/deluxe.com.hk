export default function(c) {
  var Lokka = require('lokka').Lokka;
  var Transport = require('lokka-transport-http').Transport;

  var client = new Lokka({
    transport: new Transport(c.GRAPHQL_ENDPOINT)
  });

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

  var createCmsComponeFeedQuery = function(queryName) {
    return queryName + ' ' + CmsComponeFeedItem;
  };

  var createQuery = function(queries) {
    return 'query { ' + queries.join(' ') + ' }';
  };

  var createQueryWithParams = function(paramStr, queries) {
    return 'query (' + paramStr + ') { ' + queries.join(' ') + ' }';
  };

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
      return client.query(createQuery([
        createCmsComponeFeedQuery('listHomeLatestArticle'),
        createCmsComponeFeedQuery('listHomeHighlight'),
        createCmsComponeFeedQuery('listBannerForContributor')
      ]));
    },
    // Assume listCategArticle is not empty before calling queryCateg()
    queryCateg: function(listCategArticle) {
      // Query list<Categ=Fashion|...>Article
      return client.query(createQuery([listCategArticle + ' ' + articleModel]));
    },
    queryArticle: function(listCategArticle) {
      return client.query(createQuery([listCategArticle + ' ' + articleModel,
        listInstagram]));
    },
    // queryEditorPicks used in editor pick articles page, it also query instagram
    queryEditorPicks: function() {
      return client.query(createQuery([listEditorPick,
        listInstagram]));
    },
    // queryEditorPickArticles only query editor pick articles
    queryEditorPickArticles: function() {
      return client.query(createQuery([listEditorPick]));
    },
    queryContributorIndex: function() {
      return client.query(createQuery([
        createCmsComponeFeedQuery('listContributor')
      ]));
    },
    queryContributorArticles: function(contrName) {
      return client.query(createQueryWithParams('$name: String',
        [listContributorArticle]), {name: contrName});
    }
  };
};
