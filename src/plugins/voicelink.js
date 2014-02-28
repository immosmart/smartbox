(function ($) {
    "use strict";

    var inited = false,
        enabled = false,
        currentVoiceState,
        curOptions,
        $curTarget,
        $buble,
        stack = [],
        $moreDiv = $('<div/>'),

        paused = false;



    var init= function(){
        if (!inited) {

            enabled = $$voice._nativeCheckSupport();
            if (!enabled) {
                return;
            }

            $$voice._init();
            $buble = $('#voice_buble');
            inited = true;
        }
    }


    var defaults = {
        selector: '.voicelink',
        moreText: 'More',
        eventName: 'voice',
        useHidden: false,
        helpText: '',
        // количество показов баббла помощи
        showHelperTimes: 3,
        // количество самсунговских всплывашек с командами
        helpbarMaxItems: 6,
        // включение сортировки по весу
        sortByWeight: true,
        //Вес голосовых ссылок по умолчанию
        helpbarItemWeight: 200,
        candidateWeight: 0
    };


    var helpbarVisibityTimeoutLink;


    window.$$voice = {
        voiceTimeout: 10000,
        _resetVisibilityTimeout: function () {
            $$voice.helpbarVisible = true;

            clearTimeout(helpbarVisibityTimeoutLink);
            helpbarVisibityTimeoutLink = setTimeout(function () {

                //чтобы обновлял подсказки если был вызван голосовой поиск смотри баг #966
                if (typeof voiceServer == 'function') {
                    voiceServer = false;
                    $$voice.restore();
                }


                $buble.hide();
                $$voice.helpbarVisible = false;
            }, this.voiceTimeout);
        },
        _init: function () {

        },
        _nativeCheckSupport: function () {

        },
        helpbarVisible: false,
        enabled: function () {
            init();
            return enabled;
        },
        _setVoiceHelp: function (voicehelp) {

        },
        pause: function () {
            paused = true;
        },
        resume: function () {
            paused = false;
        },
        say: function (text) {
            if (paused)
                return;
            var result = text.toLowerCase();
            var opts = $.extend({}, defaults, curOptions);
            if (elements[result]) {
                elements[result].trigger(opts.eventName);
            }
            if ($curTarget) {
                generateHelpBar.call($curTarget, curOptions);
            }
        },
        _nativeTurnOff: function () {

        },
        hide: function () {
            if(!this.enabled()){
                return;
            }
            this._nativeTurnOff();
            $buble.hide();
            return this;
        },

        setup: function (options) {
            $.extend(defaults, options);
            return this;
        },
        save: function () {
            if (currentVoiceState)
                stack.push(currentVoiceState);
            return this;
        },
        restore: function () {
            var last = stack.pop();
            if (last)
                $.fn.voiceLink.apply(last.self, last.args);
            return this;
        },
        _nativeFromServer: function (title, callback) {

        },
        fromServer: function (title, callback) {
            if (!inited)
                return this;
            this.save();
            this._nativeFromServer(title, callback);
            return this;
        },
        refresh: function () {
            return this.save().restore();
        }
    }


    var generated = false, elements;


    /**
     * Преобразование jQuery коллекции в массив
     * и добавление команд в объект elements
     * @param elems
     * @returns {Array}
     */
    function voiceElementsToArray(elems) {


        var items = [];

        elems.each(function () {
            var $el = $(this);
            var commands = $el.attr('data-voice');
            var group = $el.attr('data-voice-group');
            var hidden = $el.attr('data-voice-hidden') === 'true' ? true : false;
            var weight = $el.attr('data-voice-weight') || 0;
            var main = false;

            if (!commands) {
                console.error('command in ', this, ' is not defined');
                return;
            }


            if ($el.attr('data-voice-disabled')) {
                return;
            }

            if (!weight) {
                if (!group && !hidden) {
                    weight = defaults.helpbarItemWeight
                    main = true;
                }
                else {
                    weight = defaults.candidateWeight
                }
            }

            items.push({
                itemText: commands,
                weight: weight,
                group: group,
                hidden: hidden,
                main: main
            });

            elements[commands.toLowerCase()] = $el;
        });

        return items;
    }

    var groupNames = {},
        gnCount = 0;

    var generateHelpBar = function (options) {

        if (generated) {
            return;
        }
        generated = true;

        $buble.hide().empty();

        var voiceItems,
            helpbarVoiceItems,
            candidateVoiceItems,
            activeItems,
            hiddenItems,
            items = [],
            candidates = [],
            opts = $.extend({}, defaults, options),
            helpbarMaxItems = opts.helpbarMaxItems,
            elems = this.find(opts.selector);


        var voicehelp = {
            helpbarType: "HELPBAR_TYPE_VOICE_CUSTOMIZE",
            bKeepCurrentInfo: "false",
            helpbarItemsList: {}
        };

        elements = {};

        if (!options.useHidden) {
            var force = elems.filter('[data-voice-force-visible]');
            elems = elems.filter(':visible').add(force);
        }


        // сортировка элементов по весу (от большего к меньшему)
        if (opts.sortByWeight) {
            voiceItems = _.sortBy(voiceElementsToArray(elems), function (el) {
                return -el.weight;
            });
        } else {
            voiceItems = voiceElementsToArray(elems);
        }


        // количество скрытых голосовых подсказок
        hiddenItems = $.grep(voiceItems, function (el) {
            return el.hidden === true;
        });


        // количество отображаемых подсказок
        activeItems = _.difference(voiceItems, hiddenItems);


        // добавление кнопки "Еще"
        if (activeItems.length > helpbarMaxItems) {
            activeItems.splice(helpbarMaxItems - 1, 0, {
                itemText: opts.moreText,
                commandList: [
                    {command: opts.moreText}
                ]
            });
            $moreDiv.unbind().bind(opts.eventName, function () {
                $('body').trigger('showVoiceHelpbar');
                $$voice._resetVisibilityTimeout();
                $buble.show();
            });
            elements[opts.moreText.toLowerCase()] = $moreDiv;
        }

        // выбираем элементы для подсказок самсунга
        helpbarVoiceItems = activeItems.splice(0, helpbarMaxItems);

        // остальные голосовые команды
        candidateVoiceItems = _.union(hiddenItems, activeItems);

        // массив для хелпбара самсунга
        _.each(helpbarVoiceItems, function (val) {
            var commands = val.itemText;

            items.push({
                itemText: commands,
                commandList: [
                    {command: commands}
                ]
            });
        });

        // массив команд, не отображаемых в хелпбаре самсунга
        _.each(candidateVoiceItems, function (val) {

            var group = val.group,
                commands = val.itemText,
                hidden = val.hidden,
                main = val.main;

            if (main && !group) {
                group = '';
            }


            if (!hidden) {
                if (!groupNames[group]) {
                    gnCount++;
                    groupNames[group] = gnCount;
                }
                var $groupWrap = $buble.find('#voice_group_body_' + groupNames[group]);
                if ($groupWrap.length) {
                    $groupWrap.append('<div class="voice_help_item">' + commands + '</div>');
                }
                else {
                    $buble.append('<div class="voice_group_head">' + group + '</div>' +
                        '<div class="voice_group_body" id="voice_group_body_' + groupNames[group] + '">' +
                        '<div class="voice_help_item">' + commands + '</div>' +
                        '</div>');
                }
            }

            candidates.push({
                candidate: val.itemText
            });
        });

        voicehelp.helpbarItemsList = items;

        if (candidates.length) {
            voicehelp.candidateList = candidates;
        }


        $$voice._setVoiceHelp(voicehelp);

    };

    $.fn.voiceLink = function (options) {
        // выходим, если нет реализации голоса
        if (inited && !enabled) {
            return;
        }

        init()


        currentVoiceState = {
            self: this,
            args: arguments
        };

        generated = false;
        options || (options = {});
        curOptions = options;
        $curTarget = this;

        if ($$voice.helpbarVisible) {
            generateHelpBar.call(this, curOptions);
        }
    }

})(jQuery);