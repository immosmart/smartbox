/**
 * Samsung platform
 */
!(function ( window, undefined  ) {

	var platform = new window.SB.Platform('samsung'),
		platformObj;

	platformObj = {
		keys: {

		},

		detect: function () {
			return (navigator.appCodeName.search(/Maple/) > -1);
		}
	};

	_(platform).extend(platformObj);
})(this);
