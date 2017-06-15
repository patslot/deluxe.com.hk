module.exports = function() {
  var categMapping = require('./categoryMapping.js');

  function getArticleType(articleID) {
    if (/^\d_(\d+)$/.test(articleID)) {
      // Format for type news of article is like 1_8234.
      return 'news';
    } else if (/^(\d+)$/.test(articleID)) {
      return 'cms';
    } else {
      return null;
    }
  };

  function isNewsArticle(type) {
    return type === 'news';
  }

  function isCMSArticle(type) {
    return type === 'cms';
  }

  return {
    articlePageviewLog: categMapping.articlePageviewLog,
    getArticleType: getArticleType,
    isNewsArticle: isNewsArticle,
    isCMSArticle: isCMSArticle
  }
};
