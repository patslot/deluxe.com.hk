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
      a.linkURL = '/' + categName + '/' + a.id + '/' + a.title;
      a.catName = categName;
    });
    return articles;
  }

  return {
    parseMenu: parseMenu,
    parseArticles: parseArticles
  };
}
