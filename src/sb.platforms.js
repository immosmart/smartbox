// global SB
!(function ( window, undefined ) {

	var platforms,
		Platform,
		PlatformPrototype,
		_supportedPlatforms = {},
		_platform = null,
		_defaultPlatform = null;

	// Object for all platforms
	platforms = {

		// add supported platform
		addPlatform: function ( platform ) {
			if ( platform.name === SB.config.defaultPlatform ) {
				_defaultPlatform = platform;
			} else {
				_supportedPlatforms[platform.name] = platform;
			}
		},

		// return currentPlatform
		getCurrentPlatform: function () {
			return _platform;
		},

		// Detect & initialise platform
		initialise: function (cb) {
			var prevTime = new Date().getTime();

			// get first platform, where detect() return true
			var currentPlatform = _.find(_supportedPlatforms, function ( platform ) {
				return platform.detect();
			});

			currentPlatform = currentPlatform || _defaultPlatform;
			if ( !currentPlatform ) {
				$$error('No Platform detected!');
			} else {
				//$$log('detect platform: ' + currentPlatform.name);
				currentPlatform.addExternalFiles(function () {
					//$$log('adding files callback');

					currentPlatform.setPlugins();
					currentPlatform.refreshKeys();
					currentPlatform.initialise();

					_platform = currentPlatform;
					cb && cb.call(this, currentPlatform);
				});
			}
		}
	};

	/**
	 * Master class for platform
	 * @param name
	 * @constructor
	 */
	Platform = function ( name ) {
		this.name = name;
		var _keys = {};


		this.refreshKeys = function refreshKeys() {
			_keys = {};
			for(var keyName in this.keys) {
				_keys[this.keys[keyName]] = keyName.toLowerCase();
			}
		};

		/**
		 * Returns key name by key code.js
		 * @param keyCode
		 * @returns {string} key name
		 */
		this.getKeyByKeyCode = function ( keyCode) {
			return _keys[keyCode];
		};

		SB.platforms.addPlatform(this);
	};

	PlatformPrototype = {
		externalCss: [],
		externalJs: [],
		keys: {},

		DUID: '',
        DUIDSettings: 'real',

        platformUserAgent: 'not found',

		/**
		 * Detecting current platform
		 * @returns {boolean} true if running on current platform
		 */
		detect: function () {
            var userAgent = navigator.userAgent.toLowerCase();
            return (userAgent.indexOf(this.platformUserAgent) !== -1);
		},

		/**
		 * Function called if running on current platform
		 */
		initialise: function () {},

		/**
		 * Get DUID in case of Config
		 * @return {string} DUID
		 */
		getDUID: function () {
            switch (this.DUIDSettings) {
                case 'real':
                    this.DUID = this.getNativeDUID();
                    break;
                case 'mac':
                    this.DUID = this.getMac();
                    break;
                case 'random':
                    this.DUID = this.getRandomDUID();
                    break;
                /*case 'local_random':
                    this.DUID = this.getLocalRandomDUID();
                    break;*/
                default:
                    this.DUID = Config.DUIDSettings;
                    break;
            }
            this.formattedDUID = _.formatText(this.DUID, 4, '-');
            this.formattedDUID = this.formattedDUID.split('').reverse().join('').replace('-', '').split('').reverse().join('');


            return this.DUID;
		},

		/**
		 * Returns random DUID for platform
		 * @returns {string}
		 */
		getRandomDUID: function () {
			return (new Date()).getTime().toString(16) + Math.floor(Math.random() * parseInt("10000", 16)).toString(16);
		},

        /**
         * Returns native DUID for platform if exist
         * @returns {string}
         */
        getMac: function () {
            return '';
        },

		/**
		 * Returns native DUID for platform if exist
		 * @returns {string}
		 */
		getNativeDUID: function () {
			return '';
		},

		/**
		 * Set custom plugins
		 */
		setPlugins: function () {},

		// TODO: volume for all platforms
		volumeUp: function() {},
		volumeDown: function () {},
		getVolume: function () {},

		setData: function () {},

		getData: function () {},

		removeData: function () {},

		addExternalFiles: function (cb) {
			this.addExternalJS(this.externalJs, cb);
			this.addExternalCss(this.externalCss);
		},

		/**
		 * Asynchroniosly adding platform files
     * @param filesArray {Array} array of sources of javascript files
		 * @param cb {Function} callback on load javascript files
		 */
    addExternalJS: function ( filesArray, cb ) {
      var $externalJsContainer,
        loadedScripts = 0,
        len = filesArray.length,
        el,
        scriptEl;

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

        function onloadScript () {
          loadedScripts++;

          if ( loadedScripts === len ) {
            cb && cb.call();
          }
        }

        document.body.appendChild($externalJsContainer);
      } else {

        // if no external js simple call cb
        cb && cb.call(this);
      }
    },

		addExternalCss: function (filesArray) {
			var $externalCssContainer;

			if (filesArray.length) {
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

		exit: function () {}
	};

	_(Platform.prototype).extend(PlatformPrototype);

	SB.platforms = platforms;
	SB.Platform = Platform;
})(this);