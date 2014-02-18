/**
 * Main smartbox file
 */
(function ( window, undefined ) {

  var _ready = false,
    readyCallbacks = [],
    SB,
    _running = false;

  var userAgent = navigator.userAgent.toLowerCase();

  /**
   * Detecting current platform
   * @returns {boolean} true if running on current platform
   */
  function detect ( slug ) {
    return userAgent.indexOf(slug) !== -1;
  }

  SB = {

    platformName: '',

    // TODO: refactor platform creating
    // because platform can be overrided
    createPlatform: function ( platformName, platformApi ) {

      var isCurrent = platformApi.detect && platformApi.detect(),
        platform;

      if ( isCurrent || detect(platformApi.platformUserAgent) ) {
        this.platformName = platformName;
        _.extend(this, platformApi);
      }
    },

    config: {
      DUID: 'real'
    },

    /**
     * Main function
     * @param cb {Function} callback after initialization
     * @param notRun {Boolean}
     */
    ready: function ( cb, notRun ) {

      // initializing on first calling ready func
      if ( !notRun && !_running ) {
        this.initialize();
      }

      if ( _ready ) {
        cb.call(this);
      } else {
        readyCallbacks.push(cb);
      }
    },

    initialize: function () {
      var self = this;

      _running = true;

      window.$$log = SB.utils.log.log;
      window.$$error = SB.utils.error;

      $(function () {
        self.setPlugins();
        self.getDUID();

        // wait for calling others $()
        setTimeout(function () {
          self._onReady();
        });
      });
    },

    readyForPlatform: function ( platform, cb ) {
      var self = this;
      this.ready(function () {
        if ( platform == self.platformName ) {
          cb.call(self);
        }
      }, true);
    },

    /**
     * Applying all ready callbacks
     * @private
     */
    _onReady: function () {
      _ready = true;

      for ( var i = 0, len = readyCallbacks.length; i < len; i++ ) {
        readyCallbacks[i].call(this);
      }
    },

    utils: {
      /**
       * Show error message
       * @param msg
       */
      error: function ( msg ) {
        $$log(msg, 'error');
      },

      /**
       * Show messages in log
       * all functionality in main.js
       */
      log: {
        log: $.noop,
        state: $.noop,
        show: $.noop,
        hide: $.noop,
        startProfile: $.noop,
        stopProfile: $.noop
      },

      /**
       * Asynchroniosly adding javascript files
       * @param filesArray {Array} array of sources of javascript files
       * @param cb {Function} callback on load javascript files
       */
      addExternalJS: function ( filesArray, cb ) {
        var $externalJsContainer,
          loadedScripts = 0,
          len = filesArray.length,
          el,
          scriptEl;

        function onloadScript () {
          loadedScripts++;

          if ( loadedScripts === len ) {
            cb && cb.call();
          }
        }

        if ( filesArray.length ) {

          $externalJsContainer = document.createDocumentFragment();
          el = document.createElement('script');
          el.type = 'text/javascript';
          el.onload = onloadScript;

          for ( var i = 0; i < len; i++ ) {
            scriptEl = el.cloneNode();
            scriptEl.src = filesArray[i];
            $externalJsContainer.appendChild(scriptEl);
          }

          document.body.appendChild($externalJsContainer);
        } else {

          // if no external js simple call cb
          cb && cb.call(this);
        }
      },

      addExternalCss: function ( filesArray ) {
        var $externalCssContainer;

        if ( filesArray.length ) {
          $externalCssContainer = document.createDocumentFragment();
          _.each(filesArray, function ( src ) {

            var el = document.createElement('link');

            el.rel = 'stylesheet';
            el.href = src;

            $externalCssContainer.appendChild(el);
          });

          document.body.appendChild($externalCssContainer);
        }
      },

      addExternalFiles: function ( cb ) {
        if ( this.externalJs.length ) {
          this.addExternalJS(this.externalJs, cb);
        }
        if ( this.externalCss.length ) {
          this.addExternalCss(this.externalCss);
        }
      },

      legend: {}
    }
  };

    //TODO: For backward capability. Remove this.
  SB.currentPlatform = SB;

  window.SB = SB;
})(this);