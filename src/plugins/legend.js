(function (window) {
  "use strict";
  /*globals _, ViewModel,$,Events,document, Observable, Computed, Lang, nav*/
  var icons = ['info','red', 'green', 'yellow', 'blue', 'rew', 'play', 'pause', 'stop', 'ff', 'tools', 'left',
               'right', 'up', 'down', 'leftright', 'updown', 'move', 'number', 'enter', 'ret'],

    notClickableKeys= ['leftright', 'left', 'right', 'up', 'down', 'updown', 'move', 'number'],
    _isInited,
    LegendKey,
    savedLegend = [],
    Legend;

  function isClickable( key ) {
    return (notClickableKeys.indexOf(key) === -1)
  }

  function renderKey( key ) {
    var clickableClass = isClickable(key) ? ' legend-clickable' : '';
    return '<div class="legend-item legend-item-' + key + clickableClass + '" data-key="' + key + '">' +
             '<i class="leg-icon leg-icon-' + key + '"></i>' +
             '<span class="legend-item-title"></span>' +
           '</div>';
  }

  function _renderLegend() {
    var legendEl,
      wrap,
      allKeysHtml = '';

    for (var i = 0, len = icons.length; i<len; i++) {
      allKeysHtml += renderKey(icons[i]);
    }

    legendEl = document.createElement('div');
    wrap = document.createElement('div');

    legendEl.className = 'legend';
    legendEl.id = 'legend';
    wrap.className = 'legend-wrap';
    wrap.innerHTML = allKeysHtml;
    legendEl.appendChild(wrap);

    return legendEl;
  }

  Legend = {
    keys: {},
    init: function () {
      var el;
      if (!_isInited) {
        el = _renderLegend();
        this.$el = $(el);

        for (var i = 0; i < icons.length; i++) {
          this.initKey(icons[i]);
        }

        _isInited = true;
      }
      return this;
    },
    initKey: function ( key ) {
      var $keyEl;
      if(!this.keys[key]) {
        $keyEl = this.$el.find('.legend-item-' + key);
        this.keys[key] = new LegendKey($keyEl);
      }
    },
    show: function () {
      this.$el.show();
    },
    hide: function () {
      this.$el.hide();
    },
    clear: function () {
      for (var key in this.keys) {
        this.keys[key]('');
      }
    },
    save: function () {
      for (var key in this.keys) {
        savedLegend[key] = this.keys[key]();
      }
    },
    restore: function () {
      _.each(icons, function (key) {
        Legend[key](savedLegend[key]);
      });

      for (var key in savedLegend) {
        this.keys[key](savedLegend[key]);
      }

      savedLegend = [];
    }
  };

  LegendKey = function ($el) {
    this.$el = $el;
    this.$text = $el.find('.legend-item-title');
    return _.bind(this.setText, this);
  };

  LegendKey.prototype.text = '';
  LegendKey.prototype.isShown = false;
  LegendKey.prototype.setText = function (text) {
    if (typeof text === 'undefined') {
      return this.text;
    } else if (text !== this.text) {
      text = text || '';

      if (!text && this.isShown) {
        this.$el.hide();
        this.isShown = false;
      } else if (text && !this.isShown) {
        this.$el.show();
        this.isShown = true;
      }

      this.text = text;
      this.$text.html(text);
    }
  };


  window.$$legend = Legend.init();

  $(function () {
    Legend.$el.appendTo(document.body);
    Legend.$el.on('click', '.legend-clickable', function () {
      var key = $(this).attr('data-key'),
        ev, commonEvent;

      if (key === 'ret') {
        key = 'return';
      } else if (key === 'rew') {
        key = 'rw';
      }

      ev = $.Event("nav_key:" + key);
      commonEvent = $.Event("nav_key");
      commonEvent.keyName = ev.keyName = key;

      $$nav.current().trigger(ev).trigger(commonEvent);
    });
  });
})(this);