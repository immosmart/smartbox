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

			$$log('Get platform time: ' + (new Date().getTime() - prevTime));

			currentPlatform = currentPlatform || _defaultPlatform;
			if ( !currentPlatform ) {
				$$error('No Platform detected!');
			} else {
				$$log('detect platform: ' + currentPlatform.name);
				currentPlatform.addExternalFiles(function () {
					$$log('adding files callback');
					currentPlatform.setPlugins();
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
		SB.platforms.addPlatform(this);
	};

	PlatformPrototype = {
		externalCss: [],
		externalJs: [],

		DUID: '',

		/**
		 * Detecting current platform
		 * @returns {boolean} true if running on current platform
		 */
		detect: function () {
			// should be override
			return false;
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
			return '';
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
		 * @param cb {Function} callback on load javascript files
		 */
		addExternalJS: function (filesArray ,cb) {
			var defferedArray = [],
				$externalJsContainer;

			if ( filesArray.length ) {

				$externalJsContainer = document.createDocumentFragment();

				_.each(filesArray, function ( src ) {

					var d = $.Deferred(),
						el = document.createElement('script');

					el.onload = function() {
						d.resolve();
						el.onload = null;
					};

					el.type = 'text/javascript';
					el.src = src;

					defferedArray.push(d);
					$externalJsContainer.appendChild(el);
				});

				document.body.appendChild($externalJsContainer);
				$.when.apply($, defferedArray).done(function () {
					cb && cb.call();
				});
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

				document.head.appendChild($externalCssContainer);
			}
		},

		exit: function () {}
	};

	_(Platform.prototype).extend(PlatformPrototype);

	SB.platforms = platforms;
	SB.Platform = Platform;
})(this);