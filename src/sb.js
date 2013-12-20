/**
 * Main smartbox file
 */
(function (window, undefined) {

	// save in case of overwrite
	var document = window.document,
		readyCallbacks = [];

	var SB = {

		config: {
			/**
			 * Платформа, которая будет использоваться в случае, когда detectPlatform вернул false
			 * @type: {String} ex: browser, samsung, lg
			 */
			defaultPlatform: 'browser',

			/**
			 * Платформа, используемая по умолчанию, метод detectPlatform не вызывается
			 * @type: {String} ex: browser, samsung, lg
			 */
			currentPlatform: ''
		},

		/**
		 * Main function
		 */
		ready: function (cb) {
			readyCallbacks.push(cb);
		},

		initialise: function (cb) {
			var self = this,
				utils = this.utils;

			window.$$log = utils.log.log;
			window.$$error = utils.error;

			$$log('!!!!!!!!!LOG: initialising SB');

			SB.platforms.initialise(function (currentPlatform) {
				self.currentPlatform = currentPlatform;
				cb && cb.call(self);
			});
		}
	};

	SB.utils = {
		/**
		 * Show error message
		 * @param msg
		 */
		error: function ( msg ) {
			alert('!!! ERROR: ' + msg);
		},

		/**
		 * Show messages in log
		 * all functionality in main.js
		 */
		log: {
			log: function () {},
			state: function () {},
			show: function () {},
			hide: function () {},
			startProfile: function () {},
			stopProfile: function () {}
		}
	};

	$(function () {
		SB.initialise(function () {
			$$nav.on('#nav');
		});
	});
	window.SB = SB;
})(this);