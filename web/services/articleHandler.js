export default function() {
  function parseArticles(categName, origArticles) {
    var articles = origArticles || [];
    articles.forEach(function(a, idx) {
      if (a.__typename === 'NewsArticle') {
        a.image = a.mediaGroup[0].largePath;
        a.hasVideo = a.mediaGroup.filter(function(item) {
          return item.type === 'videos';
        }).length > 0;
      } else if (a.__typename === 'CmsArticle') {
        a.label = categName;
        a.image = a.videoThumbnail || a.articleThumbnail;
        a.hasVideo = a.videoFile !== '';
      }
      a.detailLink = categName + '/' + a.id + '/' + a.title;
    });
    return articles;
  }

  return {
    parseArticles: parseArticles
  };
}
