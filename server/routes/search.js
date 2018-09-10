'use strict';

var express = require("express");


module.exports = function(gQuery, categMapping, queryHandler, edm) {
        var categ = 'Search';
        var ename = 'add_fash';
        var adTagMapping = categMapping.nameToAdTag['Hashtag'];
        var metaKeyword = categMapping.categoryKeywordMapping;
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
             
                res.render('search', {
                    query: getquery(),
                    menu: queryHandler.parseMenu(result.listMenu),
                    metaKeyword: metaKeyword,
                    ename: ename,
                    adTag: adTagMapping.list,
                    campaigns: result.listCampaign || [],
                    showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
                    origin: req.protocol + "://" + req.get('host'),
                    fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
                });
               }, function(err) {
              return next(err);
            });
      }

  return {
    renderSearch: renderSearch
  }
};
