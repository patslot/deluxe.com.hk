export default function() {
  function parseArticles(categName, origArticles) {
    var articles = origArticles || [];
    // TODO(wkchan): Check if is news article or CMS article
    articles.forEach(function(a, idx) {
      if (a.__typename === 'NewsArticle') {
        a.image = a.mediaGroup[0].largePath;
      } else if (a.__typename === 'CmsArticle') {
        a.label = categName;
        a.image = a.videoThumbnail || a.articleThumbnail;
      }
      a.detailLink = categName + '/' + a.id + '/' + a.title;
    });
    return articles;
  }

  return {
    parseArticles: parseArticles
  };
}
