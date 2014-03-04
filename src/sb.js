;(function () {
  var Smartbox,
    _ready = false,
    readyCallbacks = [],
    userAgent = navigator.userAgent.toLowerCase(),
    SmartboxAPI;

  //private func for applying all ready callbacks
  var onReady = function () {
    _ready = true;

    for ( var i = 0, len = readyCallbacks.length; i < len; i++ ) {
      if (typeof readyCallbacks[i] === 'function') {
        readyCallbacks[i].call(this);
      }
    }
    // no need anymore
    readyCallbacks = null;
  };

  /**
   * Detecting current platform
   * @returns {boolean} true if running on current platform
   */
  function detect ( slug ) {
    return userAgent.indexOf(slug) !== -1;
  }

  var initialise = function() {
    Smartbox.setPlugins();
    Smartbox.getDUID();

    // wait for calling others $()
    setTimeout(function () {
      onReady();
      onReady = null;
    }, 10);
  };

  Smartbox = function ( platform, cb ) {
    if ( typeof platform === 'string' ) {
      Smartbox.readyForPlatform(platform, cb);
    } else if ( typeof platform === 'function' ) {
      // first arg - function
      Smartbox.ready(platform);
    }
  };

  //public smartbox API
  SmartboxAPI = {
    version: 0.1,
    platformName: '',

    userAgent: userAgent,

    createPlatform: function ( platformName, platformApi ) {
      var isCurrent = platformApi.detect && platformApi.detect();

      if ( isCurrent || detect(platformApi.platformUserAgent) ) {
        this.platformName = platformName;
        _.extend(this, platformApi);

        if (typeof platformApi.onDetect === 'function') {
          this.onDetect();
        }
      }
    },

    // calling cb after library initialise
    ready: function ( cb ) {
      if ( _ready ) {
        cb.call(this);
      } else {
        readyCallbacks.push(cb);
      }
    },

    // calling cb after library initialise if platform is current
    readyForPlatform: function ( platform, cb ) {
      var self = this;
      this.ready(function () {
        if ( platform == self.platformName ) {
          cb.call(self);
        }
      });
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
      }
    },
    extendFromEvents: function(object){
          var extendFunction, eventProto;
          //use underscore, or jQuery extend function
          if (window._ && _.extend) {
              extendFunction = _.extend;
          } else if (window.$ && $.extend) {
              extendFunction = $.extend;
          }


          if (window.EventEmitter) {
              eventProto = EventEmitter.prototype;
          } else if (window.Backbone) {
              eventProto = Backbone.Events;
          } else if (window.Events) {
              eventProto = Events.prototype;
          }

          object.extend = function (proto) {
              extendFunction(this, proto);
          };

          object.extend(eventProto);
      }
  };

  Smartbox.config = {
    DUID: 'real'
  };


    SmartboxAPI.extendFromEvents(SmartboxAPI);

  _.extend(Smartbox, SmartboxAPI);

  // exporting library to global
  window.SB = Smartbox;



  // initialize library
  window.onload = function () {
    initialise();

    // we don't need initialise func anymore
    initialise = null;
  };
})();