/**
 * Main smartbox file
 */
(function ( window, undefined ) {

  // save in case of overwrite
  var document = window.document,
    _inited = false,
    _ready = false,
    readyCallbacks = [];

  var SB = {

    config: {
      /**
       * Платформа, которая будет использоваться в случае, когда detectPlatform вернул false
       * ex: browser, samsung, lg
       * @type: {String}
       */
      defaultPlatform: 'browser'
    },

    isInited: function () {
      return _inited;
    },

    /**
     * Main function
     * @param cb {Function} callback after initialization
     */
    ready: function ( cb ) {
      if ( _ready ) {
        cb.call(this);
      } else {
        readyCallbacks.push(cb);
      }
    },

    readyForPlatform: function ( platform, cb ) {
      var self = this;
      this.ready(function () {
        if ( platform == self.currentPlatform.name ) {
          cb.call(self);
        }
      });
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

    initialise: function () {
      var self = this,
        utils = this.utils;

      if ( _inited ) {
        return;
      }

      window.$$log = utils.log.log;
      window.$$error = utils.error;

      //$$log('!!!!!!!!!LOG: initialising SB');

      SB.platforms.initialise(function ( currentPlatform ) {
        self.currentPlatform = currentPlatform;
        _inited = true;

        //prevent calling before other dom ready callbacks
        setTimeout(function () {
          self._onReady();
        });
      });
    }
  };

  SB.utils = {
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

    legend: {}
  };

  $(function () {
    SB.initialise();
  });
  window.SB = SB;
})(this);