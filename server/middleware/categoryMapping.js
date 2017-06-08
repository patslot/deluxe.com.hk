function createNameToAdTag() {
  var nameToAdTag = {};
  ['Fashion', 'Beauty', 'Luxe', 'Celebrity', 'Lifestyle', 'Event',
    'Contributor', 'Editorpicks'].forEach(function(categ) {
    nameToAdTag[categ] = {
      list: categ + '_list',
      detail: categ + (categ === 'Contributor'? '_art' : '_detail')
    };
  });
  // Category URL 'Editor picks' is used by ad tag is 'Editorpicks'
  nameToAdTag['Editor picks'] = nameToAdTag.Editorpicks;
  return nameToAdTag;
}

var nameToAdTag = createNameToAdTag();

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

function categNameForLog(categ) {
  categ = categ.toUpperCase();
  if (categ === 'LUXE') {
    categ = 'LUXURY';
  }
  return categ;
}

const BEAUTY = 'BEAUTY';
const FASHION = 'FASHION';
const EVENT = 'EVENT';
const HOME = 'HOME';
const COLUMNIST = 'COLUMNIST';
const ARTICLE = 'ARTICLE';
const COMBINE = 'COMBINE';

var categLogMapping = {
  HOME: {channel: BEAUTY, category: FASHION},
  EVENT: {channel: BEAUTY, category: FASHION, section: EVENT, subsect: HOME},
  COLUMNIST: {channel: BEAUTY, category: FASHION, section: COLUMNIST, subsect: HOME},
  'EDITOR PICKS': {channel: BEAUTY, category: FASHION, section: 'EDITORPICK', content: ARTICLE}
};

var articleLogMapping = {
  EVENT: {channel: BEAUTY, category: FASHION, news: COMBINE, subsect: EVENT},
  COLUMNIST: {channel: BEAUTY, category: FASHION, section: COLUMNIST, news: COMBINE}
}

function handleLogMapping(log, categ, mapping) {
  var logMapping = mapping[categ] || {};
  for (var k in logMapping) {
    log[k] = logMapping[k];
  }
  return log;
}

function categPageviewLog(categ, content, author) {
  categ = categNameForLog(categ);
  var log = {
    section: HOME,
    subsect: '',
    content: content ? content : HOME,
    news: COMBINE,
    cid: '',
    issueid: '',
    title: '',
    auth: '',
    channel: categ,
    category: categ
  };
  handleLogMapping(log, categ, categLogMapping);
  if (categ === COLUMNIST && content === 'INDEX') {
    log.subsect = author;
  }
  return log;
}

function articlePageviewLog(categ, newsType, articleID, issueDate, title, author) {
  categ = categNameForLog(categ);
  var log = {
    section: categ,
    subsect: categ === 'COLUMNIST' ? author : '',
    content: ARTICLE,
    news: newsType,
    cid: articleID,
    issueid: issueDate,
    title: title,
    auth: author,
    channel: categ,
    category: categ
  };
  return handleLogMapping(log, categ, articleLogMapping);
}

module.exports = {
  // TODO(wkchan): Query menu API to get Name to Ename mapping?
  // If no, combine nameToEname and nameToAdTag to one dict.
  nameToEname: {
    'Fashion': 'add_fash',
    'Beauty': 'add_beau',
    'Luxe': 'add_luxe',
    'Celebrity': 'add_wedd',
    'Lifestyle': 'add_life',
    // Different content API for editor picks and events: not using Ename
    'Editor picks': 'editor_picks',
    'Contributor': 'contributor',
    'Event': 'event'
  },
  nameToAdTag: nameToAdTag,
  enameToListCategAPI: {
    'add_fash': 'listFashionArticle',
    'add_beau': 'listBeautyArticle',
    'add_luxe': 'listLuxeArticle',
    'add_wedd': 'listWeddingArticle',
    'add_life': 'listLifeStyleArticle',
    'editor_picks': 'listEditorPick',
  },
  getArticleType: getArticleType,
  categPageviewLog: categPageviewLog,
  articlePageviewLog: articlePageviewLog
};
