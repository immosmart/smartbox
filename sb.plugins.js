(function () {
  /**
   * Plugin constructor
   * @param name plugin name
   * @param api plugin public functions
   * @returns {Plugin}
   * @constructor
   */
  var Plugin = function ( name, api ) {
    this.name = name;

    _.extend(this, api);
    return this;
  };

  Plugin.prototype.config = {};
  Plugin.prototype.initialize = $.noop;
  Plugin.prototype.isManuallyInited = false;

  SB.addPlugin = function ( pluginName, pluginApi ) {
    var plugin;
    pluginName = '$$' + pluginName;
    plugin = this.plugins[pluginName] = new Plugin(pluginName, pluginApi);

    if ( !window[pluginName] ) {
      window[pluginName] = plugin;
    }
  }
})();