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
      ky:'',
    channel: catCh.ch,
    category: catCh.cat
  };
  handleLogMapping(log, categ, categLogMapping);
  if (categ === COLUMNIST && content === 'INDEX') {
    log.subsect = author;
  }
  return log;
}

function articlePageviewLog(categ, newsType, articleID, issueDate, title, author,ky) {
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
    category: catCh.cat,
      ky: ky
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
  enameToMPMCategAPI: {
    'add_fash': 'listFashionMPM',
    'add_beau': 'listBeautyMPM',
    'add_luxe': 'listLuxeMPM',
    'add_life': 'listLifeStyleMPM',
    'add_wedd': 'listMPM',
    'add_cele': 'listCelebMPM',
  },
  categPageviewLog: categPageviewLog,
  articlePageviewLog: articlePageviewLog,
  categoryKeywordMapping: {
        'Fashion': 'Deluxe,穿搭,鞋履,手袋,裙子,皮革,上衣,褲子,配飾,復古,歐美風,日系,韓風,波鞋,內衣,運動裝,高跟鞋,太陽眼鏡,帽子,明星穿搭,時裝週,絲巾,泳衣,紅地氈造型',
        'Beauty': 'Deluxe,減肥,美白,防曬,底妝,面膜,潔面,補濕,控油,彩妝,美甲,髮型,面部療程,香水,身體護理,運動,瑜伽,歐美風,日系,韓風,唇膏,眉妝,暗瘡,紅地氈妝髮',
        'Luxe': 'Deluxe,首飾,珠寶,水晶,戒指,耳環,手錶,頸鏈,鑽石,手鏈,寶石,金飾,珍珠,髮飾',
        'Wedding': 'Deluxe,婚嫁首飾,婚紗,晚裝,金器,籌備婚禮,婚宴,婚攝,渡月蜜,過大禮,姊妹裙,婚戒,婚鞋,新娘妝髮,新娘美容,花球,婚禮布置,明星結婚',
        'Celebrity':'Deluxe,電影,動畫,電視劇,影展,Marvel,Netflix,英國王室,專訪,韓星,荷里活,音樂,金像奬,奧斯卡', 
        'Lifestyle': 'Deluxe,好去處,下午茶,家品,旅行,早午餐,咖啡,Cafe,打卡,日本,韓國,泰國,台灣,澳門,手信,甜品,自助餐,素食,郊遊,藝術,職場,情性,愛情,閨蜜,廚師發辦,Fine dine,火鍋,中式,西式,泰國菜,曲奇',
        'Event': 'Deluxe, Fashion, Celebrity, Accessories, style, beauty, watch, lifestyle, travel, apple daily, blogger, Wedding, gift list, dining,  health, fitness, event, keep fit, diet, baselworld, SIHH,  trend, luxury, photography, women’s fashion, fashion designers, street style, tv channel, shopping, must have item , Fashion trend, fashion week, styling tips, gift idea, shoes & bags, gourmet, Fine jewelry, 蘋果, 時尚, 潮流, 名人, 美容, 鐘錶, 珠寶, 生活, 品味, 博客, 化妝, 護膚, 流行, 時裝, 扮靚, 結婚, 婚紗, 女性, 唇膏, 餐廳, 健康, 設計師, 活動, 身體護理, 頭髮護理, 減肥, 健身, 瘦身, 瘦面, 運動, 品牌, 名牌, 潮人, 飲食, 旅遊, 荷里活女星, 名媛, 購物, 好去處, 模特兒, 藝術',
        'Contributor': 'Deluxe, Fashion, Celebrity, Accessories, style, beauty, watch, lifestyle, travel, apple daily, blogger, Wedding, gift list, dining,  health, fitness, event, keep fit, diet, baselworld, SIHH,  trend, luxury, photography, women’s fashion, fashion designers, street style, tv channel, shopping, must have item , Fashion trend, fashion week, styling tips, gift idea, shoes & bags, gourmet, Fine jewelry, 蘋果, 時尚, 潮流, 名人, 美容, 鐘錶, 珠寶, 生活, 品味, 博客, 化妝, 護膚, 流行, 時裝, 扮靚, 結婚, 婚紗, 女性, 唇膏, 餐廳, 健康, 設計師, 活動, 身體護理, 頭髮護理, 減肥, 健身, 瘦身, 瘦面, 運動, 品牌, 名牌, 潮人, 飲食, 旅遊, 荷里活女星, 名媛, 購物, 好去處, 模特兒, 藝術'
  }
};
