'use strict';

var util = require('util');
var moment = require('moment');
var url = require('url');
var MobileDetect = require('mobile-detect');
module.exports = function(gQuery, categMapping, queryHandler, edm, articleUtil) {
  function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }

function parseMpms(origMpms) {
    var mpms = origMpms || [];
    mpms.forEach(function(m) {
      var linkType = articleUtil.getArticleType(m.linkURL);
      if (linkType) {
        m.linkURL = '/' + m.catName + '/' + m.linkURL + '/' + encodeURIComponent(m.content);
        m.linkTarget = '_self';
      } else {
        m.linkTarget = '_blank';
      }
      m.catName = m.catName.toLowerCase();
      queryHandler.handleArticleCateg(m);
    });
    return mpms;
}
function webOrMobile(){
  var ua = request.headers['user-agent'];
    if (/mobile/i.test(ua)){
      return 'MOBWEB';
    }
    else{
      return 'WEB';
    }
}

  var maxUpcomingEvent = 10;
  var cmsNewsType = 'OTHER';
  var columnist = 'COLUMNIST';

  function renderArticle(req, res, next) {
    var md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
      var platform = 'MOBWEB' ;
    } else {
      var platform = 'WEB' ;
    }; 
    var urlparams = getAllUrlParams(req.originalUrl);
    var articleID = req.params.articleID;
    var article = {};
    article.id = articleID;
    article.type = articleUtil.getArticleType(articleID);
    article.year = moment().year();
    article.ogDescription = null;
    // article.origin = req.protocol + "://" + req.get('host');
    // article.fullURL = req.protocol + "://" + req.get('host') + "/article/" + articleID;
    article.origin = "https://" + req.get('host');
    article.fullURL = "https://" + req.get('host') + "/article/" + articleID;
    article.isSharedUrl = !req.params.title;

    if (articleID && articleUtil.isNewsArticle(article.type)) {
      gQuery.newsArticleQuery(articleID)
        .catch(function(err) {
          // use all available data if article detail is not null
          if (typeof err.rawData !== "undefined" && err.rawData.getNewsArticleDetail !== null) {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function(result) {
          article = util._extend(article, result.getNewsArticleDetail);
          article.ename = categMapping.nameToEname[article.categoryName];
          article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
          article.contributorName = '';
          queryHandler.parseNewsArticleDetail(article);
          article.menu = queryHandler.parseMenu(result.listMenu);
          article.ky ='';
          queryHandler.handleArticleDetailCateg(article);
          article.campaigns = result.listCampaign || [];
          article.showEDM = edm.showEDM(req.cookies.addEDM, result.listCampaign);
          article.pageviewLog = categMapping.articlePageviewLog(article.categoryName,
            (article.logging || {}).pixelNews, article.id, article.issueId, article.title, '');
          if (article.contentBlocks && article.contentBlocks.length > 0) {
            article.ogDescription = article.contentBlocks[0].content;
          }
          res.render('articleDetail', article);
        }, function(err) {
          return next(err);
        });
    } else if (articleUtil.isCMSArticle(article.type)) {
        
      gQuery.cmsArticleQuery(articleID)
        .catch(function(err) {
          // use all available data if article detail is not null
          if (typeof err.rawData !== "undefined" && err.rawData.getCMSArticleDetail !== null) {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function (result) {
          article = util._extend(article, result.getCMSArticleDetail);
          article.contributorName = article.contributorName ?
          article.contributorName.replace(/\,/,'') : '';
          article.ename = categMapping.nameToEname[article.categoryName];
          article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
          article.metaKeyword = categMapping.categoryKeywordMapping[article.categoryName] ;
          article.keywords = [] ; 
          if (article.keyword){
            var regex1 = RegExp('^_mt_');
            article.keywords = article.keyword.split(",");
            article.keywords = article.keywords.map(x =>{
              var resultKeywords = {}; 
              var temp = x.trim() ;
              if(regex1.test(temp)){
                resultKeywords["display"] = temp.substring(4) ;
                resultKeywords["link"] = temp ;
                return resultKeywords; 
              }
              else{
                resultKeywords["display"] = temp ;
                resultKeywords["link"] = temp ;
                return resultKeywords;  
              }
            });
            // console.log(article.keywords);
          }
         
          queryHandler.parseCmsArticleDetail(article);
          article.menu = queryHandler.parseMenu(result.listMenu);
          article.contributor = result.listContributor.find(function(x){
              return x.catName == article.subCategory
          })
          article.cdValue = {
            'c1': article.id,
            'c10': article.title,
            'c16': article.categoryName,
            'c17': '',
            'c18': '',
            'c19': article.categoryName,
            'c20': article.categoryName,
            'c21': 'SCROLL',
            'c22': '',
            'c23': 'AD',
            'c24': article.masterTag,
            'c25': article.keywords,
            'c26': article.issueId,
            'c27': '',
            'c28': '',
            'c29': platform ,
            'c30': urlparams.itm_campaign ,
            'c31': urlparams.itm_medium ,
            'c32': urlparams.itm_source ,
            'c33': urlparams.itm_content ,
            'c34': urlparams.itm_term 
          }
          if (article.categoryName==='Contributor'){
              if (article.contributor !=undefined){
                    article.contributor = queryHandler.parseContributor(article.contributor);
              }
              else{
                  article.contributor = {
                                            catName : "",
                                            imgName: "",
                                            post: "",
                                            desc: "",
                                        } ;
                  
              }
              
          }
          
          queryHandler.handleArticleDetailCateg(article);
          article.campaigns = result.listCampaign || [];
          article.showEDM = edm.showEDM(req.cookies.addEDM, result.listCampaign);
          var categoryName = article.categoryName === 'Contributor' ? columnist : article.categoryName
          article.pageviewLog = categMapping.articlePageviewLog(categoryName,
            cmsNewsType, article.id, article.issueId, article.title, article.contributorName, article.masterTag);
          if (article.artBlock && article.artBlock.length > 0) {
            article.ogDescription = article.artBlock[0].content;
          }
          if (article.categoryName === 'Event') {
            gQuery.upcomingEventQuery()
              .catch(function(err) {
                // use all available data
                if (typeof err.rawData !== "undefined") {
                  console.error(JSON.stringify(err));
                  return err.rawData;
                } else {
                  throw err;
                }
              })
              .then(function (result) {
                var upcomingEvents = (result.listUpcomingEvent || []).slice(0, maxUpcomingEvent);
                article.upcomingEvents = queryHandler.parseUpcomingEvents(upcomingEvents);
                res.render('articleDetail', article);
              }, function(err) {
                return next(err);
              });
          } else {
            res.render('articleDetail', article);
          }
        }, function (err) {
          return next(err);
        });
    } else {
      return next();
    }
  }

  function getCurrentCateg(categs, categName) {
    for (var i = 0; i < categs.length; i++) {
      if (categs[i].name === categName) {
        return categs[i];
      }
    }
    return null;
  }

  function renderArticles(req, res, next) {
    var categ = req.params.categ;
    // TODO(wkchan): This code block also repeats in routes/article.js
    var ename = categMapping.nameToEname[categ];
    var adTagMapping = categMapping.nameToAdTag[categ];
    var listCategAPI = categMapping.enameToListCategAPI[ename || ''];
    var listCategMPMAPI = categMapping.enameToMPMCategAPI[ename || ''];
    var metaKeyword = categMapping.categoryKeywordMapping[categ] ;
    if (!ename || !adTagMapping || !listCategAPI) {
      return next();
    }
    var query, handleFunc;
    var offset = 0;
    var count = 5;
    if (categ === 'Editor picks') {
      query = gQuery.queryEditorPicks(offset, count);
      handleFunc = queryHandler.parseCmsArticles;
    } else {
      query = gQuery.newCategQuery(listCategAPI,listCategMPMAPI, offset, count);
      handleFunc = queryHandler.parseArticles;
    }
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
      var articles = handleFunc(categ, (result[listCategAPI] || []));
      var categs = result.listMenu || [];
      var currentCateg = getCurrentCateg(categs, categ);
      var mpm = result[listCategMPMAPI];
      var md = new MobileDetect(req.headers['user-agent']);
      if (md.mobile()) {
        var platform = 'MOBWEB' ;
      } else {
        var platform = 'WEB' ;
      };
      var cdvalues = {
        'c1': '',
        'c21': 'INDEX',
        'c16': categ,
        'c17': '',
        'c18': '',
        'c29': platform
      }
      res.render('categ', {
        pageviewLog: categMapping.categPageviewLog(categ),
        metaKeyword: metaKeyword,
        menu: queryHandler.parseMenu(categs, categ),
        mpms: parseMpms(mpm),
        categImg: currentCateg ? currentCateg.img : '',
        article1to2: articles.length > 0 ? articles.slice(0,2) : [],
        articles3to4: articles.length > 1 ? articles.slice(2,4) : [],
        ename: ename,
        adTag: adTagMapping.list,
        cdValue: cdvalues,
        categ: categ,
        year: moment().year(),
        campaigns: result.listCampaign || [],
        showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
        origin: "https://" + req.get('host'),
        fullURL: "https://" + req.get('host') + req.originalUrl
        // fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
      });
    }, function(err) {
      return next(err);
    });
  }
    function renderSubcatArticles(req, res, next){
        var categ = req.params.categ;
        var subCateg = req.params.subCateg;
        var ename = categMapping.nameToEname[categ];
        var adTagMapping = categMapping.nameToAdTag[categ];
        var listCategAPI = categMapping.enameToListCategAPI[ename || ''] + "ByTag";
        
        var query, handleFunc;
        var offset = 0;
        var count = 5;
         query = gQuery.subCategQuery(listCategAPI, subCateg, offset, count);
        handleFunc = queryHandler.parseArticles;
        
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
            
              var articles = handleFunc(categ, (result[listCategAPI] || []));
              var categs = result.listMenu || [];
              var currentCateg = getCurrentCateg(categs, categ);
              
                res.render('subcateg', {
                    pageviewLog: categMapping.categPageviewLog(categ),
                    menu: queryHandler.parseMenu(categs, categ),
                    subcateg: subCateg,
                    categImg: currentCateg ? currentCateg.img : '',
                    article1: articles.length > 0 ? articles[0] : null,
                    articles: articles.length > 1 ? articles.slice(1) : [],
                    ename: ename,
                    adTag: adTagMapping.list,
                    categ: categ,
                    campaigns: result.listCampaign || [],
                    showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
                    origin: "https://" + req.get('host'),
                    fullURL: "https://" + req.get('host') + req.originalUrl
                  });
            }, function(err) {
              return next(err);
            });
    }
  return {
    renderArticle: renderArticle,
    renderArticles: renderArticles,
    renderSubcatArticles: renderSubcatArticles
  };
};
