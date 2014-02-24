/**
 * Keyboard Plugin
 */
;
(function ( $, window, document, undefined ) {

  var pluginName = 'SBKeyboard',
    keyRegExp = /([^{]+){{([^}]*)}}/,
    defaults = {
      type: 'en',
      firstLayout: null
    },
    pluginPrototype = {},
    keyboardPrototype = {},
    generatedKeyboards = {};

  /**
   * Keyboard constructor
   * @param options
   * @param $el parent element
   * @constructor
   */
  function Keyboard ( options, $el ) {

    this.type = options.type;
    this.currentLayout = '';
    this.previousLayout = '';
    this.$el = $el;

    // jquery layout els
    this.$layouts = {};

    // all available layouts(for changeKeyboardLang)
    this.presets = [];

    this.initialize(options);
  }

  keyboardPrototype = {
    isShiftActive: false,
    isNumsShown: false,
    currentPresetType: '',
      initialize: function ( options ) {

      var _type = _.result(this, 'type'),
        board = '',
        preset,
        haveNums = false,
        type;

      preset = SB.keyboardPresets[_type];

      if (!preset) {
        throw new Error('Preset ' + _type + ' doesn\'t exist');
      }

      this.currentPresetType = _type;

      this.$wrap = $(document.createElement('div')).addClass('kb-wrap');

      if ( typeof preset === 'function' ) {
        this.presets.push(_type);
        board = this.generateBoard(_type);
      } else if ( preset.length ) {
        this.presets = preset;
        haveNums = (preset.indexOf('fullnum') !== -1);
        if ( haveNums ) {
          this.presets = _.without(this.presets, 'fullnum');
        }
        board = this.generateFull(this.presets, haveNums);
      }

      this.$wrap
        .append(board)
        .addClass('kekekey_' + _type);

      this.$el.append(this.$wrap);
      this.setEvents();

      // save jquery els of current layouts
      for ( var i = 0; i < this.presets.length; i++ ) {
        type = this.presets[i];
        this.$layouts[type] = this.$wrap.find('.keyboard_generated_' + type);
      }

      if (haveNums) {
        this.$layouts['fullnum'] = this.$wrap.find('.keyboard_generated_fullnum');
      }

      if ( this.presets.indexOf(options.firstLayout) !== -1 ) {
        this.changeLayout(options.firstLayout);
      } else {
        this.changeLayout(this.presets[0]);
      }
    },

    /**
     * Generate multilayout keyboards
     * @param types {Array} array of layout types (['ru', 'en'])
     * @param haveNums {Boolean} add fullnum keyboard
     * @returns {string} generated html
     */
    generateFull: function ( types, haveNums ) {
      var wrapHtml = '',
        preset = '',
        type = '';

      if ( types.length > 1 ) {
        this.$wrap.addClass('kb-multilang');
      }

      for ( var i = 0; i < types.length; i++ ) {
        type = types[i];
        wrapHtml += this.generateBoard(type);
      }

      if ( haveNums ) {
        this.$wrap.addClass('kb-havenums');
        wrapHtml += this.generateBoard('fullnum');
      }

      return wrapHtml;
    },

    /**
     * Generate keyboard layout
     * @param type {String}  'ru', 'en'
     * @returns {String} generated html
     */
    generateBoard: function ( type ) {

      var preset = SB.keyboardPresets[type],
        boardHtml = '',
        rowHtml = '',
        keyAttrs = {},
        row, letter;

      if ( generatedKeyboards[type] ) {
        return generatedKeyboards[type].board;
      }

      preset = preset();
      boardHtml = '<div class="kb-c keyboard_generated_' + type + '">';

      for ( var i = 0; i < preset.length; i++ ) {
        row = preset[i];
        rowHtml = '<div class="kb-row" data-nav_type="hbox">';

        for ( var j = 0; j < row.length; j++ ) {
          letter = row[j];
          if ( letter.length == 1 || letter === '&amp;' ) {
            keyAttrs = {
              text: letter,
              type: '',
              letter: letter
            };
          }
          else {
            var matches = keyRegExp.exec(letter);

            keyAttrs.text = matches[2] || '';
            keyAttrs.type = matches[1];
            keyAttrs.letter = '';
          }
          rowHtml += '<div class="kbtn nav-item ' +
                     keyAttrs.type +
                     '" data-letter="' + _.escape(keyAttrs.letter) + '"';

          if ( keyAttrs.type ) {
            rowHtml += ' data-keytype="' + keyAttrs.type + '"';
          }

          rowHtml += '>' + keyAttrs.text + '</div>';
        }

        boardHtml += rowHtml + '</div>';
      }

      boardHtml += '</div>';

      generatedKeyboards[type] = {
        board: boardHtml
      };
      return boardHtml;
    },

    /**
     * Num keys event handler
     * @param e
     */
    onKeyNum: function ( e ) {
      switch ( e.keyName ) {
        case 'red':
          this.$el.trigger('backspace');
          break;
        default:
          var ev = $.Event({
            'type': 'type'
          });
          ev.letter = '' + e.num;

          this.$el.trigger(ev);
          break;
      }
      e.stopPropagation();
    },
    defaultOnKey: function ( e ) {
      e.stopPropagation();
    },
    onKeyDown: function ( e ) {
      var $el = $(e.currentTarget),
        keyType = $el.attr('data-keytype'),
        letter = $el.attr('data-letter'),
        ev;

      // create custom event for triggering keyboard event
      ev = $.Event({
        'type': 'type'
      });

      if ( keyType ) {
        switch ( keyType ) {
          case 'backspace':
            ev = 'backspace';
            break;
          case 'delall':
            ev = 'delall';
            break;
          case 'complete':
            ev = 'complete';
            break;
          case 'space':
            ev.letter = ' ';
            break;
          case 'shift':
            this.triggerShiftLetters();
            return;
          case 'lang':
            this.changeKeyboardLang();
            return;
          case 'nums':
            this.triggerNumKeyboard();
            return;
          default:
            break;
        }
      } else {
        ev.letter = this.isShiftActive ? letter.toUpperCase() : letter;
      }

      ev && this.$el.trigger(ev);

      e.stopPropagation();
    },

    triggerShiftLetters: function () {
      var self = this;

      if ( this.isShiftActive ) {
        this.isShiftActive = false;
        this.$el.removeClass('shift_active');
      } else {
        this.isShiftActive = true;
        this.$el.addClass('shift_active');
      }

      // TODO: only for samsung 11
//      this.$el.find('.kbtn').not('.delall,.complete,.space,.nums,.lang,.shift,.backspace').each(function () {
//        this.innerHTML = self.isShiftActive ? this.innerHTML.toUpperCase() : this.innerHTML.toLowerCase();
//      });
    },

    /**
     * show/hide fullnum layout
     */
    triggerNumKeyboard: function () {

      if ( this.isNumsShown ) {
        this.isNumsShown = false;
        this.changeLayout(this.previousLayout);
        this.$el.trigger('hide_num');
      } else {
        this.isNumsShown = true;
        this.changeLayout('fullnum');
        this.$el.trigger('show_num');
      }

      $$nav.current(this.$layouts[this.currentLayout].find('.nums'));
    },

    changeKeyboardLang: function () {
      var curIndex = this.presets.indexOf(this.currentLayout),
        index;

      index = (curIndex + 1) % this.presets.length;
      this.changeLayout(this.presets[index]);
      $$nav.current(this.$layouts[this.currentLayout].find('.lang'));
    },

    /**
     * Change layout function
     * @param layout {String} 'fullnum', 'en'
     */
    changeLayout: function ( layout ) {
      var prevLayout,
        curLayout = this.$layouts[layout];

      if ( this.currentLayout ) {
        prevLayout = this.$layouts[this.currentLayout];
        prevLayout && prevLayout.hide();
        this.$el.removeClass('keyboard_' + this.currentLayout);
        this.previousLayout = this.currentLayout;
      }

      if ( curLayout ) {
        this.currentLayout = layout;
        this.$el.addClass('keyboard_' + layout);
        curLayout.show();
      }
    },
    setEvents: function () {
      var self = this;
      // block yellow & blue buttons
      this.$wrap.on('nav_key:yellow nav_key:blue', this.defaultOnKey);
      this.$wrap.on('nav_key:num nav_key:red', _.bind(this.onKeyNum, this));
      this.$wrap.on('click', '.kbtn', _.bind(this.onKeyDown, this));
      this.$wrap
        .on('nav_key:green', function ( e ) {
          self.$el.trigger('complete');
          e.stopPropagation();
        })
        .on('nav_key:return', function ( e ) {
          self.$el.trigger('cancel');
          e.stopPropagation();
        });
    },
    show: function () {
      this.$wrap.show();
      this.$el.addClass(_.result(this, 'type') + '_wrap').addClass('keyboard_' + this.currentLayout);
      return this;
    },
    hide: function () {
      this.$wrap.hide();
      this.$el.removeClass(_.result(this, 'type') + '_wrap').removeClass('keyboard_' + this.currentLayout);
    }
  };

  $.extend(Keyboard.prototype, keyboardPrototype);
  keyboardPrototype = null;

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.$el = $(element);
    this.keyboards = {};

    options = $.extend({}, defaults, options);
    this.addKeyboard(options);
    this.$el.addClass('keyboard_popup_wrapper');
  }

  pluginPrototype = {
    /**
     * Add keyboard to current element
     * @param opt {Object}
     */
    addKeyboard: function ( opt ) {
      var options = $.extend({}, defaults, opt),
        type = _.isFunction(opt.type) ? _.result(opt, 'type') : opt.type;

      if ( !this.keyboards[type] ) {
        this.keyboards[type] = new Keyboard(options, this.$el);
      }
      this.changeKeyboard(type);
    },
    /**
     * Change current active keyboard
     * @param type {String|Function} 'en', 'ru'
     */
    changeKeyboard: function ( type ) {
      var curKeyboard = this.currentKeyboard,
        preset,
        isCurrent;

      type = _.isFunction(type) ? type() : type;
      preset = this.keyboards[type];
      isCurrent = curKeyboard && (curKeyboard.currentPresetType === type);

      if ( preset && !isCurrent ) {
        curKeyboard && curKeyboard.hide();
        this.currentKeyboard = preset.show();
      } else if (!preset){
        this.addKeyboard({
          type: type
        });
      }
    }
  };

  $.extend(Plugin.prototype, pluginPrototype);
  pluginPrototype = null;

  // A lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn.SBKeyboard = function () {
    var args = Array.prototype.slice.call(arguments),
      method = (typeof args[0] == 'string') && args[0],
      options = (typeof args[0] == 'object') && args[0],
      params = args.slice(1);

    return this.each(function () {
      var instance = $.data(this, 'plugin_' + pluginName);
      if ( !instance ) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      } else {
        if ( method ) {
          instance[method] && instance[method].apply(instance, params)
        } else if ( options ) {
          instance.addKeyboard(options);
        }
      }
    });
  }
})(jQuery, window, document);

window.SB = window.SB || {};

// Default layouts, can be extended
window.SB.keyboardPresets = {

  en: function () {
    return [
      'qwertyuiop'.split(''),
      'asdfghjkl'.split('').concat(['backspace{{<i class="backspace_icon"></i>}}']),
      ['shift{{<i class="shift_icon"></i>Shift}}'].concat('zxcvbnm'.split('')).concat(
        ['delall{{<span>Del<br/>all</span>}}']),
      ['lang{{en}}', 'nums{{123}}', 'space{{}}', 'complete{{Complete}}']
    ];
  },

  ru: function () {
    return [
      'йцукенгшщзхъ'.split(''),
      'фывапролджэ'.split('').concat(['backspace{{<i class="backspace_icon"></i>}}']),
      ['shift{{<i class="shift_icon"></i>Shift}}'].concat('ячсмитьбю'.split('')).concat(['delall{{<span>Del<br/>all</span>}}']),
      ['lang{{ru}}', 'nums{{123}}', 'space{{}}', 'complete{{Готово}}']
    ]
  },

  email: function () {
    return [
      '1234567890@'.split(''),
      'qwertyuiop'.split('').concat(['backspace{{<i class="backspace_icon"></i>}}']),
      'asdfghjkl_'.split('').concat(['delall{{<span>Del<br/>all</span>}}']),
      'zxcvbnm-.'.split('').concat('complete{{OK}}')
    ];
  },

  num: function () {
    return [
      '123'.split(''),
      '456'.split(''),
      '789'.split(''),
      ['backspace{{<i class="backspace_icon"></i>}}', '0', 'complete{{OK}}']
    ]
  },

  fullnum: function () {
    return [
      '1234567890'.split(''),
      '-/:;()$"'.split('').concat(['&amp;', 'backspace{{<i class="backspace_icon"></i>}}']),
      ['nums{{ABC}}'].concat("@.,?!'+".split('')),
      ['space{{}}', 'complete{{OK}}']
    ]
  },

  fulltext_ru: ['ru','en'],
  fulltext_en: ['en'],
  fulltext_ru_nums: ['ru', 'en', 'fullnum'],
  fulltext_en_nums: ['en', 'fullnum']
};