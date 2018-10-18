'use strict';

var util = require('util');
var moment = require('moment');

module.exports = function(gQuery, categMapping, queryHandler, edm, articleUtil) {

  function renderArticles(req, res, next) {
    var hashTag = req.params.hashtag;
    var categ = 'Hashtag'; 
    var ename = 'add_fash';
    if (!hashTag ) {
      return next();
    }
    var regex1 = RegExp('^_mt_');
    if(regex1.test(hashTag)){
      var displayHashTag = hashTag.substring(4) ;
    }else{
      var displayHashTag = hashTag;
    }
    var query, handleFunc;
    var offset = 0;
    var count = 5;
    var adTagMapping = categMapping.nameToAdTag[categ];
    
    query = gQuery.keywordQuery(hashTag, offset,  count);
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
      articles.ky = hashTag ; 
      var categs = result['listMenu'] || [];
      var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
      // console.log(articles[0].categoryName);
      res.render('keyword', {
        pageviewLog: categMapping.categPageviewLog(categ),
        menu: queryHandler.parseMenu(categs, categ),
        metaKeyword: metaKeyword,
        articles: articles.length > 0 ? articles : null,
        ename: ename,
        adTag: adTagMapping.list,
        hashTag: hashTag,
        displayHashTag: displayHashTag,
        categ: categ,
        campaigns: result['listCampaign'] || [],
        showEDM: edm.showEDM(req.cookies.addEDM, result['listCampaign']),
        origin: "https://" + req.get('host'),
        fullURL: "https://" + req.get('host') + req.originalUrl
      });
    }, function(err) {
      return next(err);
    });
  }
 
  return {
    renderArticles: renderArticles,
  };
};
