(function () {
  "use strict";
  var _inited;
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;

  var itemHtml = _.template('<div data-url="{{url}}" data-type="{{type}}" class="video-item nav-item">{{title}}</div>');

  window.App.scenes.video = {

    init: function () {
      this.$el = $('.js-scene-video');

      this.$el.on('click', '.video-item', this.onItemClick);

      this.renderItems(App.videos);

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
    },

    // handler for click event
    onItemClick: function (e) {
      var url = e.currentTarget.getAttribute('data-url');
      Player.play({
        url: url,
        type: e.currentTarget.getAttribute('data-type')
      });
    },

    // showing items from videos.js
    renderItems: function (items) {
      var html = '';

       // console.log(items, itemHtml.toString())
      for ( var i = 0, len = items.length; i < len; i++ ) {
        html += itemHtml(items[i]);
      }

      this.$el
        .empty()
        .html(html);
    }

  }
})();