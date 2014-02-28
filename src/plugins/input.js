/**
 * Keyboard Plugin
 */
;
(function ( $, window, document, undefined ) {

  var pluginName = 'SBInput',
    defaultOptions = {
      keyboard: {
        type: 'fulltext_ru',
        firstLayout: 'ru'
      },

      /**
       * Format function
       * @param text
       */
      formatText: null,
      bindKeyboard: null,

      input: {
        template: '<div class="smart_input-container">' +
                  '<div class="smart_input-wrap">' +
                  '<span class="smart_input-text"></span>' +
                  '<span class="smart_input-cursor"></span>' +
                  '</div>' +
                  '</div>',
        elClass: 'smart_input-container',
        wrapperClass: 'smart_input-wrap',
        cursorClass: 'smart_input-cursor',
        textClass: 'smart_input-text'
      },

      directKeyboardInput: false,
      directNumInput: false,

      max: 0,

      next: null
    },
    pluginPrototype,
    $keyboardOverlay,
    $keyboardPopup,
  // in app can be only one blink cursor
    blinkInterval;

  /**
   * Generate input element
   * @param opt  input options
   * @returns {*}  jQuery el
   */
  function generateInput ( opt ) {
    var div = $(document.createElement('div'));
    div.html(opt.template);
    return div.find('.' + opt.elClass);
  }

  /**
   * generate popup for input keyboards
   */
  function generateKeyboardPopup () {
    $keyboardOverlay = $(document.createElement('div')).attr('id', 'keyboard_overlay');
    $keyboardPopup = $(document.createElement('div')).attr({
      'id': 'keyboard_popup',
      'class': 'keyboard_popup_wrapper'
    });
    $keyboardOverlay.append($keyboardPopup);
    $(document.body).append($keyboardOverlay);
  }

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.$input = $(element);
    this.initialise(options);
    this.stopBlink();
    this.setText(element.value);
  }

  pluginPrototype = {
    isInited: false,
    _generatedKeyboard: false,
    isKeyboardActive: false,
    text: '',
    initialise: function ( options ) {
      var $el;
      if ( this.isInited ) {
        return this;
      }

      options = $.extend({}, defaultOptions, options);
      options.next = this.$input.attr('data-next') || options.next;
      options.max = this.$input.attr('data-max') || options.max || 0;

      this.options = options;

      this.$input.attr({
        'data-value': '',
        'data-max': options.max
      });

      $el = generateInput(options.input);
      $el.addClass(this.$input[0].className);

      this.$input.hide().after($el);

      this.$el = $el;
      this.$text = $el.find('.' + options.input.textClass);
      this.$cursor = $el.find('.' + options.input.cursorClass);
      this.$wrapper = $el.find('.' + options.input.wrapperClass);

      if ( options.directKeyboardInput ) {
        this.addDirectKeyboardEvents();
      }

      this.addEvents();
      this.isInited = true;
      return this;
    },

    startBlink: function () {
      var self = this,
        hiddenClass = this.options.input.cursorClass + '_hidden';

      if ( blinkInterval ) {
        clearInterval(blinkInterval);
      }
      blinkInterval = setInterval(function () {
        self.$cursor.toggleClass(hiddenClass);
      }, 500);
    },

    stopBlink: function () {
      var hiddenClass = this.options.input.cursorClass + '_hidden';
      if ( blinkInterval ) {
        clearInterval(blinkInterval);
      }
      this.$cursor.addClass(hiddenClass);
    },

    addEvents: function () {
      var $wrap = this.$wrapper,
        opt = this.options,
        self = this;

      this.$input.on({
        'nav_focus': function () {
          $$nav.current(self.$el);
        },
        'startBlink': function () {
          self.startBlink();
        },
        'stopBlink': function () {
          self.stopBlink();
        },
        'hideKeyboard': function () {
          if ( $wrap.hasClass('smart-input-active') ) {
            self.hideKeyboard();
          }
        },
        'showKeyboard': function () {
          self.showKeyboard();
        }
      });

      this.$el.on({
        'nav_focus': function () {
          self.$input.addClass('focus');
        },
        'nav_blur': function () {
          self.$input.removeClass('focus');
        }
      });

      if (opt.directNumInput && !opt.directKeyboardInput) {
        this.$el.off('nav_key:num nav_key:red').on('nav_key:num nav_key:red', function ( e ) {
          self.typeNum(e);
        });
      }

      $wrap.off('nav_focus nav_blur click');

      if ( opt.bindKeyboard ) {
        opt.keyboard = false;
        opt.bindKeyboard
          .off('type backspace delall')
          .on('type', function ( e ) {
            self.type(e.letter);
          })
          .on('backspace', function () {
            self.type('backspace');
          })
          .on('delall', function () {
            self.type('delall');
          });
      }

      if ( opt.keyboard ) {
        this.$el.on('click', function () {
          self.startBlink();
          self.showKeyboard();
        })
      }
    },

    addDirectKeyboardEvents: function () {
      var self = this;

      this.$el.on({
        nav_focus: function () {
          self.startBlink();
          $(document.body).on('keypress.SBInput', function ( e ) {
            if ( e.charCode ) {
              e.preventDefault();
              self.type(String.fromCharCode(e.charCode));
            } else {
              switch ( e.keyCode ) {
                case 8:
                  e.preventDefault();
                  self.type('backspace');
                  break;
              }
            }
          });
        },
        nav_blur: function () {
          self.stopBlink();
          $(document.body).off('keypress.SBInput');
        }
      });
    },

    setText: function ( text ) {
      var opt = this.options,
        formatText,
        max = opt.max,
        method;

      text = text || '';

      if ( text.length > max && max != 0 ) {
        text = text.substr(0, max);
      }

      formatText = opt.formatText ? opt.formatText(text) : text;

      this.$input.val(text).attr('data-value', text);
      this.text = text;
      this.$text.html(formatText);

      // TODO: fix for Samsung 11
      if ( text.length > 1 ) {
        method = (this.$text.width() > this.$wrapper.width()) ? 'add' : 'remove';
        this.$wrapper[ method + 'Class']('.' + opt.input.wrapperClass + '_right');
      } else {
        this.$wrapper.removeClass('.' + opt.input.wrapperClass + '_right');
      }

      this.$input.trigger('text_change');
    },

    type: function ( letter ) {
      var text = this.text || '',
        opt = this.options;

      switch ( letter ) {
        case 'backspace':
          text = text.substr(0, text.length - 1);
          break;
        case 'delall':
          text = '';
          break;
        default:
          text += letter;
          break;
      }

      this.setText(text);

      //jump to next input if is set
      if ( text.length === opt.max &&
           opt.next &&
           opt.max != 0 ) {
        this.hideKeyboard();
        $$nav.current(opt.next);
        $$nav.current().click();
      }
    },

    typeNum: function(e){
      switch (e.keyName) {
        case 'red':
          this.type('backspace');
          break;
        default:
          this.type(e.num);
          break;
      }
      e.stopPropagation();
    },

    changeKeyboard: function ( keyboardOpt ) {
      var curOpt = this.options.keyboard;
      this.options.keyboard = _.extend({}, curOpt, keyboardOpt);
      $keyboardPopup && $keyboardPopup.SBKeyboard(this.options.keyboard);
    },

    hideKeyboard: function ( isComplete ) {
      var $wrapper = this.$wrapper;
      $wrapper.removeClass('smart-input-active');
      this.$input.trigger('keyboard_hide');

      $keyboardOverlay && $keyboardOverlay.hide();

      $$nav.restore();
      $$voice.restore();

      this.isKeyboardActive = false;
      if ( isComplete ) {
        this.$input.trigger('keyboard_complete');
      }
      else {
        this.$input.trigger('keyboard_cancel');
      }
      $keyboardPopup && $keyboardPopup.trigger('keyboard_hide');
    },

    showKeyboard: function () {
      var $wrapper = this.$wrapper,
        keyboardOpt = this.options.keyboard,
        self = this;

      this.isKeyboardActive = true;
      $wrapper.addClass('smart-input-active');

      var h = this.$el.outerHeight();
      var o = this.$el.offset();
      var top = o.top + h;

      if ( !$keyboardOverlay ) {
        generateKeyboardPopup();
      }

      if ( !this._generatedKeyboard ) {
        $keyboardPopup.SBKeyboard(keyboardOpt);
        this._generatedKeyboard = true;
      }

      $keyboardPopup.SBKeyboard('changeKeyboard', keyboardOpt.type)
        .css({
          'left': o.left,
          'top': top
        })
        .off('type backspace delall complete cancel')
        .on('type', function ( e ) {
          self.type(e.letter);
        })
        .on('backspace', function () {
          self.type('backspace');
        })
        .on('delall', function () {
          self.type('delall');
        })
        .on('complete cancel', function ( e ) {
          var isComplete = false;
          if ( e.type === 'complete' ) {
            isComplete = true;
          }
          self.stopBlink();
          self.hideKeyboard(isComplete);
        });

      $keyboardOverlay.show();

      var kh = $keyboardPopup.height();
      var kw = $keyboardPopup.width();

      if ( top + kh > 680 ) {
        $keyboardPopup.css({
          'top': top - kh - h
        })
      }
      if ( o.left + kw > 1280 ) {
        $keyboardPopup.css({
          'left': 1280 - kw - 20
        })
      }
      $$voice.save();
      $$nav.save();
      $$nav.on('#keyboard_popup');
      $keyboardPopup.SBKeyboard('refreshVoice').voiceLink();
      this.$el.addClass($$nav.higlight_class);
      this.$input.trigger('keyboard_show');
      this.startBlink();
    }
  };

  $.extend(Plugin.prototype, pluginPrototype);
  pluginPrototype = null;

  $.fn.SBInput = function () {
    var args = Array.prototype.slice.call(arguments),
      method = (typeof args[0] == 'string') && args[0],
      options = (typeof args[0] == 'object') && args[0],
      params = args.slice(1);

    return this.each(function () {
      var instance = $.data(this, 'plugin_' + pluginName);
      if ( !instance ) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      } else if ( typeof instance[method] === 'function' ) {
        instance[method].apply(instance, params);
    }
    });
  }

})(jQuery, window, document);