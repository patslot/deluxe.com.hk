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

  // TODO(wkchan): Need photos for firstContentBlock in listArticle?
  /*photos {
    ...${photo}
  }*/
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

  var queryWithTagName = function(queries) {
    return 'query ($tagName: String, $offset: Int, $count: Int) { ' +
      queries.join(' ') + ' }';
  };

  const homeQ = queryWithTagName([listMenu, listInstagram, listArticle]);
  const categQ = queryWithTagName([listMenu, listArticle]);
  const articleQ = queryWithTagName([listMenu, listInstagram, listArticle]);

  return {
    // TODO(wkchan): Menu sorting and display
    queryHome: function(offset, count) {
      return client.query(homeQ, {offset: offset, count: count});
    },
    queryCateg: function(tagName, offset, count) {
      return client.query(categQ,
        {tagName: tagName, offset: offset, count: count});
    },
    queryArticle: function(tagName, offset, count) {
      return client.query(articleQ,
        {tagName: tagName, offset: offset, count: count});
    }
  };
};
