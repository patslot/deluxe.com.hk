'use strict';

var moment = require('moment');

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
      a.catName = a.catName.toLowerCase();
      handleArticleCateg(a);
    });
    return articles;
  }

  var categDisplayName = {
    'event': 'events',
    'celebrity': 'celebrities',
    'contributor': 'contributors'
  };

  function handleMenuCateg(menu) {
    menu.disName = categDisplayName[menu.name.toLowerCase()] || menu.name;
  }

  function handleArticleDetailCateg(article) {
    article.disCategoryName = categDisplayName[article.categoryName.toLowerCase()] ||
      article.categoryName;
  }

  function handleArticleCateg(article) {
    article.disCatName = categDisplayName[article.catName] || article.catName;
  }

  // Parse menu to create 'MORE' sub-menu
  function parseMenu(origMenu, categName) {
    var mainMenu = [];
    var subMenu = [];
    var menu = origMenu || [];
    categName = categName || '';
    for (var i = 0; i < menu.length; i++) {
      var m = menu[i];
      handleMenuCateg(m);
      m.activeClass = m.name === categName ? 'active' : '';
      if (m.sort < 100) {
        mainMenu.push(m);
      } else {
        subMenu.push(m);
      }
    }
    return {main: mainMenu, sub: subMenu};
  }

  function parseArticleCommon(categName, a) {
    a.linkURL = '/' + categName + '/' + a.id + '/' + a.title;
    a.linkTarget = '_self';
    a.catName = categName.toLowerCase();
    handleArticleCateg(a);
    a.label = a.disCatName;
  }

  function parseNewsArticle(categName, a) {
    a.image = a.mediaGroup[0].largePath;
    a.hasVideo = a.mediaGroup.filter(function(item) {
      return item.type === 'videos';
    }).length > 0;
    a.content = (a.firstContentBlock || {}).content;
    parseArticleCommon(categName, a);
  }

  function parsePubDate(pubDate) {
    return moment(pubDate, moment.ISO_8601).utcOffset(8).format('MMM DD, YYYY h:mm A');
  }

  function parseNewsArticleDetail(article) {
    article.image = (article.mediaGroup && article.mediaGroup.length > 0) ? article.mediaGroup[0].largePath : "";
    article.video = null;
    var videos = article.mediaGroup.filter(function (item) {
      return item.type === 'videos';
    });
    var numReg = /\d+/;
    if (videos && videos.length > 0) {
      videos.sort(function (v1, v2) {
        return v1.quality.match(numReg) < v2.quality.match(numReg);
      });
      article.video = videos[0];
      article.videoImage = videos[0].largePath;
    }
    article.pubDate = parsePubDate(article.pubDate);
  }

  function parseCmsArticleDetail(article) {
    var image = (article.artBlock || []).length > 0 ? article.artBlock[0].imgFile : "";
    article.image = article.videoThumbnail || image;
    article.video = {
      url: article.videoFile,
      title: article.title,
      videoId: article.id
    };
    article.videoImage = article.image;
    article.publish = parsePubDate(article.publish);
  }

  function parseCmsArticle(categName, a) {
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
      parseCmsArticle(categName, a);
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
    return moment(iso8601Time, moment.ISO_8601).utcOffset(8).format('DD MMM, YYYY');
  }

  function parsePostEvents(categName, events) {
    var events = parseCmsArticles(categName, events);
    events.forEach(function(e) {
      e.lastUpdate = parseEventDate(e.lastUpdate);
    });
    return events;
  }

  function parseContributor(c) {
    var splitPos = c.content.indexOf('|');
    if (splitPos > 0) {
      c.post = c.content.slice(0, splitPos);
      c.desc = c.content.slice(splitPos+1).trim();
    }
    return c;
  }

  function parseContributors(origContributors) {
    var contributors = origContributors || [];
    contributors.forEach(function(c) {
      parseContributor(c);
    });
    return contributors;
  }

  function parseInstagram(origIgs) {
    var igs = origIgs || [];
    igs.forEach(function(ig) {
      ig.videoUrl = ((ig.videos || {}).standard_resolution || {}).url;
      ig.imageUrl = ((ig.images || {}).thumbnail || {}).url;
    });
    return igs;
  }

  return {
    parseInstagram: parseInstagram,
    parseLinkURL: parseLinkURL,
    parseHomeArticles: parseHomeArticles,
    parseMenu: parseMenu,
    parseCmsArticle: parseCmsArticle,
    parseCmsArticles: parseCmsArticles,
    parseCmsArticleDetail: parseCmsArticleDetail,
    parseNewsArticle: parseNewsArticle,
    parseNewsArticleDetail: parseNewsArticleDetail,
    parsePubDate: parsePubDate,
    parseArticles: parseArticles,
    parseEventDate: parseEventDate,
    parsePostEvents: parsePostEvents,
    parseUpcomingEvents: parseUpcomingEvents,
    parseContributor: parseContributor,
    parseContributors: parseContributors,
    handleArticleCateg: handleArticleCateg,
    handleArticleDetailCateg: handleArticleDetailCateg
  }
};
