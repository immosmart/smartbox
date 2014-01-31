(function () {
  "use strict";
  var _inited;

  window.App.scenes.navigation = {
    init: function () {
      var $info;

      this.$el = $('.js-scene-navigation');

      $info = this.$el.find('.navigation-info');

      this.$el
        .find('.navigation-item')
          .on(
          {
            'nav_focus': function () {
              $info.html('Item with text "' + this.innerHTML + '" focused');
            },
            'nav_blur': function () {
              $info.html('');
            }
          });

      _inited = true;
    },
    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },
    hide: function () {
      this.$el.hide();
    }
  }
})();