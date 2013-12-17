/**
 * Main smartbox file
 */
(function (window, undefined) {

	// save in case of overwrite
	var document = window.document;

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

		initialise: function (cb) {
			var self = this;
			$$log('initialising SB');
			SB.platforms.initialise(function (currentPlatform) {
				self.currentPlatform = currentPlatform;
				cb && cb.call();
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
		 */
		log: function (msg) {
			//console.log('!!! LOGGING: ' + msg);
		}
	};

	window.$$log = SB.utils.log;
	window.$$error = SB.utils.error;

	$(function () {
		SB.initialise();
	});
	window.SB = SB;
})(this);