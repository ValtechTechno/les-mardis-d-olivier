(function () {
  'use strict';

  angular
  .module('mardisDolivier')
  .factory('cssInjector', function ($q) {
    var cssInjector = {};

    var createLink = function (id, url) {
      var link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      return link;
    };

    var checkLoaded = function (url, deferred, tries) {
      for (var css in document.styleSheets) {
        var href = document.styleSheets[css].href || '';
        if (href.split('/').slice(-1).join() === url) {
          deferred.resolve();
          return;
        }
      }
      tries++;
      setTimeout(function () {
        checkLoaded(url, deferred, tries);
      }, 50);
    };

    cssInjector.set = function (id, url) {
      var tries = 0,
        deferred = $q.defer(),
        link;

      if (!angular.element('link#' + id).length) {
        link = createLink(id, url);
        link.onload = deferred.resolve;
        angular.element('head').append(link);
      }
      checkLoaded(url, deferred, tries);

      return deferred.promise;
    };

    return cssInjector;
  });
})();
