function createNameToAdTag() {
  var nameToAdTag = {};
  ['Fashion', 'Beauty', 'Luxe', 'Wedding', 'Lifestyle', 'Event',
    'Contributor', 'Editorpicks'].forEach(function(categ) {
    nameToAdTag[categ] = {list: categ + '_list', detail: categ + '_detail'}
  });
  return nameToAdTag;
}

var nameToAdTag = createNameToAdTag();

var getArticleType = function (articleID) {
  if (/^\d_(\d+)$/.test(articleID)) {
    // Format for type news of article is like 1_8234.
    return 'news';
  } else if (/^(\d+)$/.test(articleID)) {
    return 'cms';
  } else {
    return null;
  }
};

module.exports = {
  // TODO(wkchan): Query menu API to get Name to Ename mapping?
  // If no, combine nameToEname and nameToAdTag to one dict.
  nameToEname: {
    'Fashion': 'add_fash',
    'Beauty': 'add_beau',
    'Luxe': 'add_luxe',
    'Wedding': 'add_wedd',
    'Lifestyle': 'add_life',
    // Different content API for editor picks and events: not using Ename
    'Editorpicks': 'editor_picks',
    'Contributor': 'contributor',
    'Event': 'Event'
  },
  nameToAdTag: nameToAdTag,
  enameToListCategAPI: {
    'add_fash': 'listFashionArticle',
    'add_beau': 'listBeautyArticle',
    'add_luxe': 'listLuxeArticle',
    'add_wedd': 'listWeddingArticle',
    'add_life': 'listLifeStyleArticle'
  },
  getArticleType: getArticleType
};
