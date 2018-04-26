'use strict';

var util = require('util');
var moment = require('moment');

module.exports = function(gQuery, categMapping, queryHandler, edm, articleUtil) {

  function renderArticles(req, res, next) {
    var hashTag = req.params.hashtag;
    var categ = 'Fashion'; 
    var ename = 'add_fash';
    if (!hashTag ) {
      return next();
    }
    var query, handleFunc;
    var offset = 0;
    var count = 5;
    var adTagMapping = categMapping.nameToAdTag[categ];
    
    query = gQuery.keywordQuery(hashTag);
    handleFunc = queryHandler.parseKeywordArticle;
  
    query.catch(function(err) {
      // use all available data
      if (typeof err.rawData !== "undefined") {
        console.error(JSON.stringify(err));
        return err.rawData;
      } else {
        throw err;
      }
    })
    .then(function(result) {
      var articles = handleFunc(hashTag, (result['listByKeyword'] || []));
      var categs = result['listMenu'] || [];
      // console.log(queryHandler.parseMenu(categs, categ));
      res.render('keyword', {
        pageviewLog: categMapping.categPageviewLog(categ),
        menu: queryHandler.parseMenu(categs, categ),
        articles: articles.length > 0 ? articles : null,
        ename: ename,
        adTag: adTagMapping.list,
        hashTag: hashTag, 
        categ: categ,
        campaigns: result['listCampaign'] || [],
        showEDM: edm.showEDM(req.cookies.addEDM, result['listCampaign']),
        origin: req.protocol + "://" + req.get('host'),
        fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
      });
    }, function(err) {
      return next(err);
    });
  }
 
  return {
    renderArticles: renderArticles,
  };
};
