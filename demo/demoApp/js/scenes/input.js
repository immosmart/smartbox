(function () {
  "use strict";
  var _inited;

  window.App.scenes.input = {
    init: function () {
      this.$el = $('.js-scene-input');

      var $valueText = this.$el.find('.js-input-1-val');

      this.$el.find('.js-input-1')
        .on('text_change',function () {
          $valueText.html(this.value);
        })
        .SBInput({
          keyboard: {
            type: 'fulltext_ru_nums'
          }
        });

      this.$el.find('.js-input-2').SBInput({
        keyboard: {
          type: 'email'
        }
      });

      this.$el.find('.js-input-3').SBInput({
        keyboard: {
          type: 'num'
        },
        max: 4
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