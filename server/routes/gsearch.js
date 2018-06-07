'use strict';

var express = require("express");


module.exports = function(gQuery, categMapping, queryHandler, edm) {
        var categ = 'Search';
        var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
     

      function renderSearch(req, res, next) {
             function getquery() {
                var query = require('url').parse(req.url,true).query;
                  return query.q 
              }
              var query = req.params.query;
              
           gQuery.searchQuery(query)
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
                console.log(result.getGoogleSearchResult);
                res.render('search', {
                    query: query,
                    metaKeyword: metaKeyword,
                    results: result.getGoogleSearchResult,
                    menu: queryHandler.parseMenu(result.listMenu),
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
