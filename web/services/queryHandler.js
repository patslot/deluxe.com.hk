export default function() {
  // Parse menu to create 'MORE' sub-menu
  function parseMenu(origMenu) {
    var mainMenu = [];
    var subMenu = [];
    var menu = origMenu || [];
    menu.forEach(function(m, idx) {
      if (m.sort < 1000) {
        mainMenu.push(menu[idx]);
      } else {
        subMenu.push(menu[idx]);
      }
    });
    return {main: mainMenu, sub: subMenu};
  }

  function parseArticleCommon(categName, a) {
    a.linkURL = '/' + categName + '/' + a.id + '/' + a.title;
    a.linkTarget = '_self';
    a.catName = categName;
  }

  function parseNewsArticle(categName, a) {
    a.image = a.mediaGroup[0].largePath;
    a.hasVideo = a.mediaGroup.filter(function(item) {
      return item.type === 'videos';
    }).length > 0;
    parseArticleCommon(categName, a);
  }

  function parseCmsArticle(categName, a) {
    a.label = categName;
    a.image = a.videoThumbnail || a.articleThumbnail;
    a.hasVideo = a.videoFile !== '';
    parseArticleCommon(categName, a);
  }

  function parseArticles(categName, origArticles) {
    var articles = origArticles || [];
    articles.forEach(function(a) {
      if (a.__typename === 'NewsArticle') {
        parseNewsArticle(categName, a);
      } else if (a.__typename === 'CmsArticle') {
        parseCmsArticle(categName, a)
      }
    });
    return articles;
  }

  return {
    parseMenu: parseMenu,
    parseCmsArticle: parseCmsArticle,
    parseNewsArticle: parseNewsArticle,
    parseArticles: parseArticles
  };
}
