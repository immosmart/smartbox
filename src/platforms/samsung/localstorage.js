(function () {

	var localStorage = window.localStorage,
		fileSysObj,
		commonDir,
		fileName,
		fileObj;

	//if Samsung 11

	if (_.isFunction(window.FileSystem)) {

		fileSysObj = new FileSystem();
		commonDir = fileSysObj.isValidCommonPath(curWidget.id);

		if ( !commonDir ) {
			fileSysObj.createCommonDir(curWidget.id);
		}
		fileName = curWidget.id + "_localStorage.db";
		fileObj = fileSysObj.openCommonFile(fileName, "r+");

		if ( fileObj ) {
			try {
				JSON.parse(fileObj.readAll());
			} catch (e) {
				localStorage && localStorage.clear();
			}
		} else {
			fileObj = fileSysObj.openCommonFile(fileName, "w");
			fileObj.writeAll("{}");
		}
		fileSysObj.closeCommonFile(fileObj);

		if ( !localStorage) {
			var lStorage = {},
				changed = false;

			var saveStorage = _.debounce(function saveStorage() {
				if (changed) {
					fileObj = fileSysObj.openCommonFile(fileName, "w");
					fileObj.writeAll(JSON.stringify(window.localStorage));
					fileSysObj.closeCommonFile(fileObj);
					changed = false;
				}
			},100);


			lStorage.setItem = function ( key, value ) {
				changed = true;
				this[key] = value;
				saveStorage();
				return this[key];
			};
			lStorage.getItem = function ( key ) {
				return this[key];
			};
			lStorage.removeItem = function ( key ) {
				delete this[key];
				saveStorage();
			};
			lStorage.clear = function () {
				var self = this;
				for ( var key in self ) {
					if ( typeof self[key] != 'function' ) {
						delete self[key];
					}
				}
				saveStorage();
			};
			window.localStorage = lStorage;
		}
	}
}());