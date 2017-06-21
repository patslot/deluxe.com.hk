'use strict';

module.exports = function(gQuery, categMapping, queryHandler, edm) {
  var eventCount = 7;
  var maxUpcomingEvents = 10;
  var categEvent = 'Event';

  function getNumOfPages(totalPostEvent) {
    totalPostEvent = totalPostEvent || 0;
    totalPostEvent = totalPostEvent - eventCount - 1;
    if (totalPostEvent < 0) {
      return 1;
    }
    return 1 + Math.ceil(totalPostEvent / eventCount);
  }

  function renderEvents(req, res, next) {
    var totalEvents = eventCount + 1;
    gQuery.eventsQuery(totalEvents, 1)
      .catch(function(err) {
        // use all available data
        if (typeof err.rawData !== "undefined") {
          console.error(JSON.stringify(err));
          return err.rawData;
        } else {
          throw err;
        }
      })
      .then(function(r) {
        var events = queryHandler.parsePostEvents(categEvent, r.listPostEvent);
        var upcomingEvents = (r.listUpcomingEvent || []).slice(0, maxUpcomingEvents);
        res.render('events', {
          pageviewLog: categMapping.categPageviewLog(categEvent),
          categName: categEvent,
          adTag: categMapping.nameToAdTag[categEvent].list,
          numOfPages: getNumOfPages(r.totalPostEvent),
          latestEvent: events.length > 0 ? events[0] : null,
          upcomingEvents: queryHandler.parseUpcomingEvents(upcomingEvents),
          events: events.slice(1, totalEvents),
          menu: queryHandler.parseMenu(r.listMenu, categEvent),
          campaigns: r.listCampaign || [],
          showEDM: edm.showEDM(req.cookies.addEDM, r.listCampaign),
          origin: req.protocol + "://" + req.get('host'),
          fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
        });
      }, function(err) {
        return next(err);
      });
  }

  return {
    renderEvents: renderEvents
  }
};
