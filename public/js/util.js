var renderVideo = function (video, elemId) {
  var anvp1 = new AnvatoPlayer('anvp1'); // Unique player id
  anvp1.setVideoUrl(video.url);
  anvp1.setPlayerSize(video.width, video.height);
  anvp1.setTitle(video.title);
  anvp1.setDescription();
  anvp1.setVolume(0.5); // Value between 0 - 1
  anvp1.setShareEnable(false);
  var videopAdTagURL = anvp1.generateDFPvideoTag("dev.action_fun_marticle_preroll",
    video.width + 'x' + video.height);
  anvp1.setVideoAdTagURL(videopAdTagURL);
  anvp1.createInstance(elemId || 'video_player'); // Div Id match

  function liveStateChanged(stateMessage, anvatoData) {
    switch(stateMessage) {
      case 'USER_RESUME':
      break;
      case 'USER_PAUSE':
      break;
      case 'VIDEO_STARTED':
      //anvatoData including video duration(anvatoData.duration) and time(anvatoData.currentTime)
      //Logging function
      break;
      case 'VIDEO_FIRST_QUARTILE':
      break;
      case 'VIDEO_MID_POINT':
      break;
      case 'VIDEO_THIRD_QUARTILE':
      break;
      case 'VIDEO_COMPLETED':
      break;
    }
  }
}
