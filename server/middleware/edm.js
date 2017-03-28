module.exports = {
  showEDM: function(edmCookie, campaigns) {
    var edmSubscribed = false;
    if (edmCookie && edmCookie === "subscribed") {
      edmSubscribed = true;
    }
    return (!edmSubscribed && (campaigns || []).length === 0);
  }
};
