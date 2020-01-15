'use strict';

var express = require("express");

var MobileDetect = require('mobile-detect');

module.exports = function(gQuery, categMapping, queryHandler, edm) {
        var categ = 'Search';
        var ename = 'add_fash';
        var adTagMapping = categMapping.nameToAdTag['Hashtag'];
        var metaKeyword = categMapping.categoryKeywordMapping;
        var md = new MobileDetect(req.headers['user-agent']);
        if (md.mobile()) {
          var platform = 'MOBWEB' ;
        } else {
          var platform = 'WEB' ;
        };  
       
      function renderSearch(req, res, next) {
             function getquery() {
                var query = require('url').parse(req.url,true).query;
                  return query.q 
              }
           
           gQuery.homeQuery()
            .catch(function(err) {
                  // use all available data
                  if (typeof err.rawData !== "undefined") {
                    console.error(JSON.stringify(err));
                    return err.rawData;
                  } else {
                    throw err;
              }
            })
           .then(function(result) {
            var cdvalues = {
              'c1': '',
              'c21': 'INDEX',
              'c16': categ,
              'c17': '',
              'c18': '',
              'c29': platform
            } ;    
            // console.log(result);
            res.render('search', {
                    query: getquery(),
                    menu: queryHandler.parseMenu(result.listMenu),
                    metaKeyword: metaKeyword,
                    ename: ename,
                    cdValue: cdvalues,
                    adTag: adTagMapping.list,
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
    renderSearch: renderSearch
  }
};
