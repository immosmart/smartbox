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
		}

	};

	SB.utils = {
		/**
		 * Show error message
		 * @param msg
		 */
		error: function ( msg ) {

		},

		/**
		 * Show messages in log
		 */
		log: function () {

		}
	};


	window.SB = SB;
})(this);