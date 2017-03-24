var moment = require('moment/moment.js');

module.exports = function() {
  var articleReg = new RegExp('^(\\d+_)*\\d+$');

  function parseLinkURL(article) {
    if (articleReg.test(article.linkURL)) {
      article.linkURL = '/' + article.catName + '/' + article.linkURL + '/' +
        article.content;
      article.linkTarget = '_self';
    } else {
      article.linkTarget = '_blank';
    }
  }

  function parseHomeArticles(origArticles) {
    var articles = origArticles || [];
    articles.forEach(function (a) {
      parseLinkURL(a);
    });
    return articles;
  }

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
    a.content = (a.firstContentBlock || {}).content;
    parseArticleCommon(categName, a);
  }

  function parseCmsArticle(categName, a) {
    a.label = categName;
    a.image = a.videoThumbnail || a.articleThumbnail;
    a.hasVideo = a.videoFile !== '';
    a.content = a.intro;
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

  function parseCmsArticles(categName, origArticles) {
    var articles = origArticles || [];
    articles.forEach(function(a) {
      parseCmsArticle(categName, a)
    });
    return articles;
  }

  function parseUpcomingEvents(origEvents) {
    var events = origEvents || [];
    events.forEach(function(e) {
      e.content = e.content.replace(/\n/g, '<br />');
      e.endDateTime = parseEventDate(e.endDateTime);
    });
    return events;
  }

  function parseEventDate(iso8601Time) {
    return moment(iso8601Time, moment.ISO_8601).utc().format('DD MMM, YYYY');
  }

  function parsePostEvents(categName, events) {
    var events = parseCmsArticles(categName, events);
    events.forEach(function(e) {
      e.lastUpdate = parseEventDate(e.lastUpdate);
    });
    return events;
  }

  return {
    parseLinkURL: parseLinkURL,
    parseHomeArticles: parseHomeArticles,
    parseMenu: parseMenu,
    parseCmsArticle: parseCmsArticle,
    parseCmsArticles: parseCmsArticles,
    parseNewsArticle: parseNewsArticle,
    parseArticles: parseArticles,
    parseEventDate: parseEventDate,
    parsePostEvents: parsePostEvents,
    parseUpcomingEvents: parseUpcomingEvents
  }
};
