/**
 * Browser platform description
 */
!(function ( window, undefined  ) {

	var platform = new window.SB.Platform('browser'),
		platformObj;

	platformObj = {

		detect: function () {
			// always true for browser platform
			return true;
		},

		initialise: function () {},

		getNativeDUID: function () {
			if (navigator.userAgent.indexOf('Chrome') != -1) {
				this.DUID = 'CHROMEISFINETOO';
			} else {
				this.DUID = 'FIREFOXISBEST';
			}
			return this.DUID;
		},

		volumeUp: function() {},

		volumeDown: function () {},

		getVolume: function () {},

		setData: function (name, val) {
			// save data in string format
			localStorage.setItem(name, JSON.stringify(val));
		},

		getData: function (name) {
			var result;
			try {
				result = JSON.parse(localStorage.getItem(name));
			} catch (e) {}

			return result;
		},

		removeData: function (name) {
			localStorage.removeItem(name);
		}
	};

	_(platform).extend(platformObj);

})(this);