define([], function () {


  //cf. http://www.antonsetiawan.com/post/2013/01/18/Browser-detection-In-jQuery-190.aspx
  var userAgent = navigator.userAgent.toLowerCase();
  var browser = {};
  browser.msie = /msie/.test(userAgent);
  browser.mozilla = /mozilla/.test(userAgent) && !/webkit/.test(userAgent);
  browser.webkit = /webkit/.test(userAgent);
  browser.opera = /opera/.test(userAgent);


  return {
    browser: browser
  };

});