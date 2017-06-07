module.exports = function() {
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
    getArticleType: getArticleType,
    isNewsArticle: isNewsArticle,
    isCMSArticle: isCMSArticle
  }
};
