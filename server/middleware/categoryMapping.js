'use strict';

function createNameToAdTag() {
  var nameToAdTag = {};
  ['Fashion', 'Beauty', 'Luxe', 'Wedding', 'Celebrity', 'Lifestyle', 'Event',
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
}

// Return [category name, channel name] for a category
function categChanelNameForLog(categ) {
  categ = categ.toUpperCase();
  if (categ === 'LUXE') {
    categ = 'LUXURY';
  }
  if (categ === 'LIFESTYLE') {
    return {ch: categ, cat: 'LIFE'};
  }
  if (categ === 'CELEBRITY') {
    return {ch: categ, cat: 'CELEB'};
  }
  return {ch: categ, cat: categ};
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
  EVENT: {channel: BEAUTY, category: FASHION, section: EVENT, subsect: HOME, menu: 'EVENTS'},
  COLUMNIST: {channel: BEAUTY, category: FASHION, section: COLUMNIST, subsect: HOME, menu: 'CONTRIBUTOR'},
  'EDITOR PICKS': {channel: BEAUTY, category: FASHION, section: 'EDITORPICK', content: ARTICLE, menu: 'EDITORPICK'}
};

var articleLogMapping = {
  'LUXE': {section: 'LUXURY'},
  EVENT: {channel: BEAUTY, category: FASHION, news: COMBINE, subsect: EVENT, menu: 'EVENTS'},
  COLUMNIST: {channel: BEAUTY, category: FASHION, section: COLUMNIST, news: COMBINE, menu: 'CONTRIBUTOR'}
}

function handleLogMapping(log, categ, mapping) {
  var logMapping = mapping[categ] || {};
  for (var k in logMapping) {
    log[k] = logMapping[k];
  }
  return log;
}

function categPageviewLog(categ, content, author) {
  var catCh = categChanelNameForLog(categ);
  categ = categ.toUpperCase();
  var log = {
    menu: categ,
    section: HOME,
    subsect: '',
    content: content ? content : HOME,
    news: COMBINE,
    cid: '',
    issueid: '',
    title: '',
    auth: '',
    channel: catCh.ch,
    category: catCh.cat
  };
  handleLogMapping(log, categ, categLogMapping);
  if (categ === COLUMNIST && content === 'INDEX') {
    log.subsect = author;
  }
  return log;
}

function articlePageviewLog(categ, newsType, articleID, issueDate, title, author) {
  var catCh = categChanelNameForLog(categ);
  categ = categ.toUpperCase();
  var log = {
    menu: categ,
    section: categ,
    subsect: categ === 'COLUMNIST' ? author : '',
    content: ARTICLE,
    news: newsType,
    cid: articleID,
    issueid: issueDate,
    title: title,
    auth: author,
    channel: catCh.ch,
    category: catCh.cat
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
    'Wedding': 'add_wedd',
    'Celebrity': 'add_cele',
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
    'add_cele': 'listCelebrityArticle',
    'add_life': 'listLifeStyleArticle',
    'editor_picks': 'listEditorPick',
  },
  getArticleType: getArticleType,
  categPageviewLog: categPageviewLog,
  articlePageviewLog: articlePageviewLog
};
