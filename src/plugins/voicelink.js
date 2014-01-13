(function ($) {
    "use strict";

    var inited = false,
        voiceEnabled = false,
    // время для произношения команды и скрытия хелпбара в браузере
        voiceTimeout = 10000,
        $buble,
        $helpBubble,
        elements,
        groupNames = {},
        gnCount = 0,
        helpbarVisible = false,
        helpbarVisibityTimeoutLink,
        helperWasShowed = 0,
        enabled = false,
        paused = true,
        generated = false,
        curOptions = {},
        stack = [],
        currentVoiceState,
        voiceServer = false,
        $curTarget,
        $moreDiv = $('<div/>');

    var defaults = {
        selector: '.voicelink',
        moreText: 'Еще',
        eventName: 'voice',
        useHidden: false,
        helpText: '',
        // количество показов баббла помощи
        showHelperTimes: 3,
        // количество самсунговских всплывашек с командами
        helpbarMaxItems: 6,
        // включение сортировки по весу
        sortByWeight: true
    };

    /**
     * Вес голосовых ссылок по умолчанию
     *
     * #VOICEWEIGHT
     * @type {{candidate: number, helpbarItem: number}}
     */
    var defaultWeights = {
        candidate: 0,
        helpbarItem: 200
    };

    /**
     * Показ хелпбара и установка таймаута на скрытие
     */
    var resetVisibilityTimeout = function () {
        helpbarVisible = true;

        clearTimeout(helpbarVisibityTimeoutLink);
        helpbarVisibityTimeoutLink = setTimeout(function () {

            //чтобы обновлял подсказки если был вызван голосовой поиск смотри баг #966
            if (typeof voiceServer == 'function') {
                voiceServer = false;
                $$voice.restore();
            }

            //скрытие пузыря вместе с хелпбаром самсунга
            $helpBubble.hide();
            $buble.hide();
            helpbarVisible = false;
        }, voiceTimeout);
    };

    /**
     * Обработка нативных событий распознавания голоса
     * @param evt событие от самсунга
     */
    var handleRecognitionEvent = function (evt) {

        switch (evt.eventtype) {
            case "EVENT_VOICE_END_MONITOR":
                //не работает в телевизоре
                break;
            case "EVENT_VOICE_BEGIN_MONITOR":
            case "EVENT_VOICE_BTSOUND_START":
                //this.updateVoiceKeyHelp();
                if (paused) {
                    break;
                }
                $('body').trigger('voiceStart');
                if (helperWasShowed < defaults.showHelperTimes) {
                    helperWasShowed++;
                    $helpBubble.html(defaults.helpText).show();
                }
                resetVisibilityTimeout();


                if ($curTarget) {
                    doAll.call($curTarget, curOptions);
                }
                break;
            case "EVENT_VOICE_RECOG_RESULT":
                if (paused) {
                    break;
                }
                resetVisibilityTimeout();
                $buble.hide();
                var result = evt.result.toLowerCase();
                var opts = $.extend({}, defaults, curOptions);
                $helpBubble.hide();
                //если не голосовой поиск
                if (typeof voiceServer != 'function') {
                    if (elements[result]) {
                        elements[result].trigger(opts.eventName);
                    }
                    if ($curTarget) {
                        doAll.call($curTarget, curOptions);
                    }
                }
                else {
                    voiceServer(result);
                    voiceServer = false;
                    $$voice.restore();
                }
                break;
        }
    };

    /**
     * Инициализация голосового управления
     * @returns {boolean}
     */
    var init = function () {

        paused = false;


        // нативное управление в самсунге
        if ($$voice.enabled() && !$$voice.emulate) {
            deviceapis.recognition.SubscribeExEvent(deviceapis.recognition.PL_RECOGNITION_TYPE_VOICE, "SmartKino", function (evt) {
                handleRecognitionEvent(evt);
            });
            deviceapis.recognition.SetVoiceTimeout(voiceTimeout);
            $('body').append('<div id="voice_buble"></div><div id="help_voice_bubble"></div>');
            $buble = $('#voice_buble');
            $helpBubble = $("#help_voice_bubble");
            return true;
        }
        else {
            // эмулятор в браузере
            if ($$voice.emulate) {
                helpbarVisible = true;
                $('body').append('<div id="voice_buble"></div><div id="help_voice_bubble"></div><div class="emul_voice_helpbar_wrap"><div id="emul_voice_helpbar"></div></div>');
                $buble = $('#voice_buble');
                $helpBubble = $("#help_voice_bubble");

                // клики по кнопкам эмулятора голоса
                $('#emul_voice_helpbar').on('click', '.emul_voice_trigger', function () {
                    var result = $(this).html().toLowerCase();
                    var opts = $.extend({}, defaults, curOptions);
                    if (elements[result]) {
                        elements[result].trigger(opts.eventName);
                    }
                    if ($curTarget) {
                        doAll.call($curTarget, curOptions);
                    }
                });
                return true;
            }
            return false;
        }
    };

    /**
     * Сделать все =)
     * @param options
     */
    var doAll = function (options) {

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
            voiceItems = _.sortBy(voiceElementsToArray(elems),function (el) {
                return el.weight;
            }).reverse();
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
                resetVisibilityTimeout();
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

        // отправляем данные в эмулятор или телевизор
        if (!$$voice.emulate) {
            deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(voicehelp));
        }
        else {
            var $bar = $('#emul_voice_helpbar');
            $bar.empty();
            if (voicehelp.helpbarItemsList) {
                $.each(voicehelp.helpbarItemsList, function (key, val) {
                    $('<div>', {
                        'attr': {
                            'class': "emul_voice_trigger main"
                        },
                        html: val.itemText,
                        appendTo: $bar
                    });
                });
            }
            if (voicehelp.candidateList) {
                $.each(voicehelp.candidateList, function (key, val) {
                    $('<div>', {
                        'attr': {
                            'class': "emul_voice_trigger"
                        },
                        html: val.candidate,
                        appendTo: $bar
                    });
                });
            }
        }
    };

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
                    weight = defaultWeights.helpbarItem
                    main = true;
                }
                else {
                    weight = defaultWeights.candidate
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

    window.$$voice = {
        pause: function () {
            paused = true;
        },
        resume: function () {
            paused = false;
        },
        hide: function () {
            if (!$$voice.emulate) {
                if ($$voice.enabled()) {

                    deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify({
                        helpbarType: "HELPBAR_TYPE_VOICE_CUSTOMIZE",
                        bKeepCurrentInfo: "false",
                        helpbarItemsList: []
                    }));
                    $buble.hide();
                }
            }
            else {
                $('#emul_voice_helpbar').empty();
                $buble.hide();
            }

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
        toText: function (title, callback) {
            if (!inited)
                return this;
            $$voice.save();
            voiceServer = callback;
            var describeHelpbar = {
                helpbarType: "HELPBAR_TYPE_VOICE_SERVER_GUIDE_RETURN",
                guideText: title
            };
            if (!this.emulate)
                deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(describeHelpbar));
            else {
                var text = prompt(title);
                callback(text || '');
            }

            return this;
        },
        enabled: function () {
            if (enabled || this.emulate) {
                enabled = true;
                return enabled;
            }
            try {
                enabled = deviceapis.recognition.IsRecognitionSupported()
            } catch (e) {
            }
            return enabled;
        },
        refresh: function () {
            return this.save().restore();
        },
        emulate: false
    };

    SB.ready(function () {
        if (SB.currentPlatform == "browser") {
            $$voice.emulate = true;
        }
    });

    $.fn.voiceLink = function (options) {

        // выходим, если нет реализации голоса
        if (inited && !voiceEnabled) {
            return;
        }

        if (!inited) {
            if (init()) {
                inited = true;
                voiceEnabled = true;
            }
            else {
                inited = true;
                return;
            }
        }

        currentVoiceState = {
            self: this,
            args: arguments
        };

        generated = false;
        options || (options = {});
        curOptions = options;
        $curTarget = this;
        if (helpbarVisible) {
            doAll.call(this, curOptions);
        }
    };
})(jQuery);