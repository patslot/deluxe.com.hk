module.exports = function(gQuery, categoryMapping, queryHandler) {
  var eventCount = 8;
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
    gQuery.eventsQuery(totalEvents, 1).then(function(r) {
      var events = queryHandler.parseCmsArticles(categEvent, r.listPostEvent);
      res.render('events', {
        adTag: categoryMapping.nameToAdTag[categEvent].list,
        numOfPages: getNumOfPages(r.totalPostEvent),
        latestEvent: events.length > 0 ? events[0] : null,
        upcomingEvents: r.listUpcomingEvent || [],
        events: events.slice(1, totalEvents),
        menu: queryHandler.parseMenu(r.listMenu)});
    }, function(err) {
      return next(err);
    });
  }

  return {
    renderEvents: renderEvents
  }
};
