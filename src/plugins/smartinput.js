(function ($) {
    var optionsHash = {

    };


    var typeNum = function (e, input, options) {
        switch (e.keyName) {
            case 'red':
                privateMethods.type(input, 'backspace', options);
                break;
            default:
                privateMethods.type(input, e.num, options);
                break;
        }
        e.stopPropagation();
    };

    var blink_interval;
    var privateMethods = {
        format: function ($inp, text) {
            var id = $inp.attr('id');
            var options = optionsHash[id] || {};
            var formatText = text;
            if (options.formatText)
                formatText = options.formatText(text);
            return formatText;
        },
        startBlink: function ($input) {
            if (blink_interval) {
                clearInterval(blink_interval);
            }
            var $cursor = $input.parent().find('.smart_input-cursor');
            blink_interval = setInterval(function () {
                $cursor.toggleClass('smart_input-cursor_hidden');
            }, 500);
        },
        stopBlink: function ($input) {
            if (blink_interval) {
                clearInterval(blink_interval);
                $input.parent().find('.smart_input-cursor').addClass('smart_input-cursor_hidden');
            }
        },
        setText: function ($inp, text) {

            var id = $inp.attr('id');
            var options = optionsHash[id] || {};
            var max = $inp.attr('data-max');

            if (text.length > max && max != 0) {
                text = text.substr(0, max);
            }

            var formatText = text;
            if (options.formatText)
                formatText = options.formatText(text);


            var $wrap = $inp.parent().find('.smart_input-wrap');
            var $text = $wrap.find('.smart_input-text');

            $inp.val(text).change();


            //условие - костыль для 11 телевизора
            if (formatText.length > 1)
                $wrap[(($text.width() > $wrap.width()) ? 'add' : 'remove') + 'Class']('smart_input-wrap_right');
            else
                $wrap.removeClass('smart_input-wrap_right');


        },
        type: function ($input, letter, options) {
            var text = $input.val();
            if (!text)
                text = '';

            if (letter == 'backspace') {
                text = text.substr(0, text.length - 1)
            }
            else if (letter == 'delall') {
                text = '';
            }
            else {
                text += letter;
            }
            privateMethods.setText($input, text);

            //jump to next input if is set
            if (text.length == options.max && options.max != 0 && options.next !== undefined) {
                privateMethods.hideKeyboard($input);
                $$nav.current(options.next);
                $$nav.current().click();
            }
        },
        hideKeyboard: function ($this, isComplete) {
            var $wrapper=$this.parent();
            $wrapper.removeClass('smart-input-active');
            $this.trigger('keyboard_hide');
            $('#keyboard_overlay').hide();
            $$nav.restore();
            $$voice.restore();
            $this.data('keyboard_active', false);
            if (isComplete) {
                $this.trigger('keyboard_complete');
            }
            else {
                $this.trigger('keyboard_cancel');
            }
            $('#keyboard_popup').trigger('keyboard_hide');
        },
        showKeyboard: function ($this, options) {
            $this.data('keyboard_active', true);
            var $wrapper=$this.parent();
            $wrapper.addClass('smart-input-active');
            var h = $this.height();
            var o = $this.offset();
            var top = o.top + h;
            var $pop = $('#keyboard_popup');


            $pop.SBKeyboard(options.keyboard).css({
                'left': o.left,
                'top': top
            }).off('type backspace delall complete cancel').on('type',function (e) {
                    privateMethods.type($this, e.letter, options);
                }).on('backspace',function (e) {
                    privateMethods.type($this, 'backspace', options);
                }).on('delall',function (e) {
                    privateMethods.type($this, 'delall', options);
                }).on('complete cancel', function (e) {
                    var isComplete = false;
                    if (e.type === 'complete') {
                        isComplete = true;
                    }
                    privateMethods.hideKeyboard($this, isComplete);
                    privateMethods.stopBlink($this);
                });
            $('#keyboard_overlay').show();
            var kh = $pop.height();
            var kw = $pop.width();
            if (top + kh > 680) {
                $pop.css({
                    'top': top - kh - h
                })
            }
            if (o.left + kw > 1280) {
                $pop.css({
                    'left': 1280 - kw - 20
                })
            }
            $$voice.save();
            $$nav.save();
            $$nav.on('#keyboard_popup');
            $('#keyboard_popup').SBKeyboard('refreshVoice').voiceLink();
            $this.addClass($$nav.higlight_class);
            $('#keyboard_popup').trigger('keyboard_show');

            privateMethods.startBlink($this);
        },
        bindEvents: function ($input) {

            var $wrapper=$input.parent();

            $wrapper.off('nav_focus nav_blur click');
            var options = optionsHash[$input.attr('id')];


            var $cursor = $wrapper.find('.sig-cursor');

            options.bindKeyboard && (options.keyboard = false);
            if (options.keyboard) {
                $wrapper.on('click', function () {
                    privateMethods.startBlink($cursor);
                    privateMethods.showKeyboard($input, options);
                })
            }

            $input.on({
                'startBlink': function () {
                    privateMethods.startBlink($cursor);
                },
                'stopBlink': function () {
                    privateMethods.stopBlink($input);
                },
                'hideKeyboard': function () {
                    if ($wrapper.hasClass('smart-input-active')) {
                        privateMethods.hideKeyboard($input);
                    }
                },
                'showKeyboard': function () {
                    privateMethods.showKeyboard($input, options);
                }
            });

            if (options.bindKeyboard) {
                options.bindKeyboard.off('type backspace delall').on('type',function (e) {
                    privateMethods.type($input, e.letter, options);
                }).on('backspace',function (e) {
                        privateMethods.type($input, 'backspace', options);
                    }).on('delall', function (e) {
                        privateMethods.type($input, 'delall', options);
                    });
            }

            $wrapper.on('nav_focus', function (e) {
                if ((options && (options.noKeyboard || options.bindNums))) {
                    $self.unbind('nav_key:num nav_key:red').bind('nav_key:num nav_key:red', function (e) {
                        typeNum(e, $input, options)
                    });
                }
            });
            /*
            $self.on('nav_focus', function (e) {
                if (!options.keyboard) {
                    $self.bind('nav_key:num nav_key:red', function (e) {
                        typeNum(e, $self, options)
                    });
                }
                else {
                    if (!$self.data('keyboard_active') && options.keyboard.autoshow !== false) {
                        e.stopPropagation();
                        showKeyboard($self, options);
                    }
                }
            })
            //*/
            $wrapper.on('nav_blur', function () {
                var $this = $(this);
                if (!options.keyboard) {
                    $this.unbind('nav_key:num nav_key:red');
                }
            })
        },
        extend: function ($input, name, fn) {
            privateMethods[name] = fn;
        },
        defaults: function ($input, options) {
            _.extend(defaultInputOptions, options);
        }
    };

    //document.write();

    var defaultInputOptions = {
        keyboard: {
            type: 'fulltext_ru',
            firstLang: 'ru',
            //firstClass: 'keyboard_en shift_active keyboard_num',
            haveNumKeyboard: true
        },
        directKeyboardInput: true,

        max: 0,

        next: null,

        decorate: function ($input, options) {
            var className = $input[0].className;
            var $wrapper = $('\
            <div class="smart_input-container ' + className + '">\n\
                <div class="smart_input-wrap">\n\
                    <span class="smart_input-text"></span>\n\
                    <span class="smart_input-cursor smart_input-cursor_hidden"></span>\n\
                </div>\n\
                <b class="smart_input-decor-l"></b>\n\
                <b class="smart_input-decor-r"></b>\n\
                <b class="smart_input-decor-c"></b>\n\
            </div>');
            $input.hide().after($wrapper);
            $wrapper.append($input);

            var $text = $wrapper.find(".smart_input-text");


            $input.on({
                change: function () {
                    $text.html(this.value);
                }
            });



            if (options.directKeyboardInput) {
                $input.parent().on({
                    nav_focus: function () {

                        privateMethods.startBlink($input);
                        $('body').on('keypress.smartinput', function (e) {
                            if (e.charCode) {
                                e.preventDefault();
                                var letter = String.fromCharCode(e.charCode);
                                privateMethods.type($input, letter, options);
                            } else {
                                switch (e.keyCode) {
                                    case 8:
                                        e.preventDefault();
                                        privateMethods.type($input, 'backspace', options);
                                        break;
                                }
                            }

                        });
                    },
                    nav_blur: function () {
                        privateMethods.stopBlink($input);
                        $('body').off('keypress.smartinput');
                    }
                });
            }

            privateMethods.bindEvents($input);

            privateMethods.setText($input, $input.val(), options);
        }
    };


    $.fn.smartInput = function (options) {

        //call some private method
        if (typeof options == 'string') {
            var fn = privateMethods[options];
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);
            return fn.apply(null, args);
        }


        this.each(function () {
            var _opts = _.clone(options);
            if (!_opts)
                _opts = {};
            _opts = $.extend({}, defaultInputOptions, _opts);


            var $self = $(this);

            if (!this.id)
                this.id = _.uniqueId('smartInput');

            _opts.next = $self.attr('data-next') || _opts.next;
            _opts.max = $self.attr('data-max') || _opts.max || 0;

            optionsHash[this.id] = _opts;

            _opts.decorate($self, _opts);

            $self.attr({
                'data-value': '',
                'data-max': _opts.max
            });
            privateMethods.bindEvents($self);
        });
        return this;
    };

    $(function(){
        $('body').append('<div id="keyboard_overlay"><div class="keyboard_popup_wrapper" id="keyboard_popup"></div></div>');
    });
})(jQuery);