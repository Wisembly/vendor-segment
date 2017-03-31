(function ($) {

  window.WisemblySegment = {

    options: {
      identifier: '',
      script: 'https://cdn.segment.com/analytics.js/v1/%s/analytics.min.js',
      scriptTimeout: 5000,
      isEnabled: true,
      identity: null,
      onBoot: null,
      onStore: null,
      onFlush: null,
      onTrack: null,
      onTrackError: null,
      onScript: null,
      onScriptError: null
    },

    setOptions: function (options) {
      options = options || {};
      this.options = $.extend(this.options, options);
    },

    init: function () {
      var self = this;

      var analytics = window.segmentio = window.analytics || [];
      window.segmentio.SNIPPET_VERSION = '4.0.0';

      analytics.invoked = !0;
      analytics.methods = ["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];
      analytics.factory = function(t) {
        return function () {
          var e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);

          return analytics
        }
      };

      for (var t=0;t<analytics.methods.length;t++) {
        var e = analytics.methods[t];
        analytics[e] = analytics.factory(e)
      }

      if (!this.boot())
        return this._loadScript().done(function () { self.boot(); })
    },

    _get: function (property) {
      if (typeof this.options[property] === 'function')
        return this.options[property].call(this);
      return this.options[property];
    },

    _notify: function (eventName) {
      if (typeof this.options[eventName] === 'function')
        this.options[eventName].apply(this, [].slice.call(arguments, 1));
    },

    _loadScript: function () {
      var self = this;
      var url = this._get('script').replace('%s', this._get('identifier'));

      return $.ajax({ url: url, dataType: 'script', timeout: this._get('scriptTimeout') })
        .done(function () { self._notify('onScript'); })
        .fail(function () { self._notify('onScriptError'); });
    },

    boot: function () {
      if (!this.isLoaded() || !this.isEnabled())
        return false;

      this.initialized = true;

      this._notify('onBoot');

      return true;
    },

    isLoaded: function () {
      return window.segmentio && typeof window.segmentio.init === 'function';
    },

    isReady: function () {
      return this.initialized;
    },

    isEnabled: function () {
      return this._get('isEnabled');
    }
  };

})(jQuery);
