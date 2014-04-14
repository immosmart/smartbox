;(function (_global) {
  var _ready = false,
    readyCallbacks = [],
    userAgent = navigator.userAgent.toLowerCase(),
    Smartbox;

  //private func for applying all ready callbacks
  function onReady() {
    var cb, scope;
    _ready = true;

    for ( var i = 0, len = readyCallbacks.length; i < len; i++ ) {
      cb = readyCallbacks[i][0];
      scope = readyCallbacks[1];
      if (typeof cb === 'function') {
        cb.call(scope);
      }
    }

    // no need anymore
    readyCallbacks = null;
  }

  /**
   * Detecting current platform
   * @returns {boolean} true if running on current platform
   */
  function detect ( slug ) {
    return userAgent.indexOf(slug) !== -1;
  }

  function initialize() {
    Smartbox.setPlugins();
    Smartbox.getDUID();

    // wait for calling others $()
    setTimeout(function () {
      onReady();
      onReady = null;
    }, 10);
  }

  var extend = (function(){
    if (_global._) {
      return _global._.extend
    } else {
      return _global.$.extend
    }
  })();

  Smartbox = function ( platform, cb, scope ) {
    if ( typeof platform === 'string' ) {
      Smartbox.readyForPlatform(platform, cb, scope);
    } else if ( typeof platform === 'function' ) {
      scope = cb;
      cb = platform;
      Smartbox.ready(cb, scope);
    }
  };

  /**
   * Version of smartbox
   * @type {number}
   */
  Smartbox.version = 0.2;

  /**
   * Current platform name
   * @type {string} default, samsung, lg, etc
   */
  Smartbox.platformName = '';

  /**
   * User agent of current platform
   * @type {string}
   */
  Smartbox.userAgent = userAgent;

  /**
   * Calling cb after Smartbox ready
   * @param cb {function} callback
   * @param scope {object} scope for callback calling
   */
  Smartbox.ready = function ( cb, scope ) {
    scope = scope || _global;

    if ( _ready ) {
      cb.call(scope);
    } else {
      readyCallbacks.push([cb, scope]);
    }
  };

  /**
   * Calling cb after library initialise if platform is current
   * @param platform {string} platform name
   * @param cb {function} callback
   * @param scope {object} scope for callback calling
   */
  Smartbox.readyForPlatform = function ( platform, cb, scope ) {
    var self = this;
    this.ready(function () {
      if ( platform == self.platformName ) {
        cb.call(this);
      }
    }, scope);
  };

  /**
   * TODO: description
   * @param platformName
   * @param platformApi
   */
  Smartbox.createPlatform = function ( platformName, platformApi ) {
    var isCurrent = platformApi.detect && platformApi.detect();

    if ( isCurrent || detect(platformApi.platformUserAgent) ) {
      this.platformName = platformName;
      _.extend(this, platformApi);

      if (typeof platformApi.onDetect === 'function') {
        this.onDetect();
      }
    }
  };

  /**
   * Asynchroniosly adding javascript files
   * @param filesArray {Array} array of sources of javascript files
   * @param cb {Function} callback on load javascript files
   */
  Smartbox.addExternalJS = function ( filesArray, cb ) {
    var loadedScripts = 0,
      len = filesArray.length,
      el;

    function onloadScript () {
      loadedScripts++;

      if ( loadedScripts === len ) {
        cb && cb.call();
      }
    }

    if ( filesArray.length ) {
      for ( var i = 0; i < len; i++ ) {
        el = document.createElement('script');
        el.type = 'text/javascript';
        el.onload = onloadScript;
        el.src = filesArray[i];
        document.head.appendChild(el);
      }
    } else {
      // if no external js simple call cb
      cb && cb.call(this);
    }
  };

  /**
   * Add external css filess
   * @param filesArray {array} array of css sources
   */
  Smartbox.addExternalCSS = function ( filesArray ) {
    var $externalCssContainer,
      len = filesArray.length,
      i = 0,
      el, src;

    if ( len ) {
      $externalCssContainer = document.createDocumentFragment();

      while (i < len) {
        src = filesArray[i];
        if (src) {
          el = document.createElement('link');
          el.rel = 'stylesheet';
          el.href = src;

          $externalCssContainer.appendChild(el);
        }
      }

      document.body.appendChild($externalCssContainer);
    }
  };

  Smartbox.extend = extend;

  Smartbox.utils = {
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

    // for backward compatibility
    addExternalJS: Smartbox.addExternalJS,
    addExternalCSS: Smartbox.addExternalCSS
  };

  /**
   * Main config for library
   * @type {object}
   */
  Smartbox.config = {
    DUID: 'real',
    customVolumeEnable: false
  };

  document.head = document.head || document.getElementsByTagName('head')[0];

  extend(Smartbox, SBEvents.prototype);

  // exporting library to global
  _global.SB = Smartbox;

  // initialize library
  if (typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
      initialize();
    }, false);
  } else {
    document.onload = function() {
      initialize();
    };
  }
})(this);