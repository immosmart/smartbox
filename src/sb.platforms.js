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
		initialise: function () {

			// get first platform, where detect() return true
			var currentPlatform = _.find(_supportedPlatforms, function ( platform ) {
				return platform.detect();
			});

			currentPlatform = currentPlatform || _defaultPlatform;
			if ( !currentPlatform ) {
				SB.error('No Platform detected!');
			} else {
				_platform = currentPlatform;
				currentPlatform.initialise();
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
		externalCss: {},
		externalJs: {},

		detect: function () {
			// should be override
		},
		// main initialization of platform
		initialise: function () {},
		// load external files for platform
		addPlatformFiles: function () {},
		exit: function () {}
	};

	_(Platform.prototype).extend(PlatformPrototype);

	SB.platforms = platforms;
	SB.Platform = Platform;
})(this);