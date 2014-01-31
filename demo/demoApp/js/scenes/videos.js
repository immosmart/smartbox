(function () {
  "use strict";
  var _inited;

  var itemHtml = '<div data-url="{{url}}" class="video-item nav-item">{{title}}</div>';

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
        url: url
      });
    },

    // showing items from videos.js
    renderItems: function (items) {
      var html = '';

      for ( var i = 0, len = items.length; i < len; i++ ) {
        html += this.generateItemHtml(items[i]);
      }

      this.$el
        .empty()
        .html(html);
    },

    generateItemHtml: function (item) {
      return itemHtml.replace('{{url}}', item.url).replace('{{title}}', item.title);
    }
  }
})();