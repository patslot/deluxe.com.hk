'use strict';

var express = require("express");


module.exports = function(gQuery, categMapping, queryHandler, edm) {
        var categ = 'Search';
        var ename = 'add_fash';
        var adTagMapping = categMapping.nameToAdTag['Hashtag'];
        var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
     

      function renderSearch(req, res, next) {
             function getquery() {
                var query = require('url').parse(req.url,true).query;
                  return query.q 
              }
              var query = req.params.query;
              var offset = 1;
              var excludeterms = "keyword"; 
           gQuery.searchQuery(query,offset,excludeterms)
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
                //  console.log(result.getGoogleSearchResult[0]);
                 var reformedResult = result.getGoogleSearchResult.map(function(x){
                  var rResult = x; 
                  var link = x.link ; 
                  var temp = link.split('/');
                  rResult['displayCategory'] = temp[3];
                  return rResult ;
                 });

                res.render('search', {
                    query: query,
                    metaKeyword: metaKeyword,
                    ename: ename,
                    adTag: adTagMapping.list,
                    categ: categ,
                    results: reformedResult,
                    menu: queryHandler.parseMenu(result.listMenu),
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
