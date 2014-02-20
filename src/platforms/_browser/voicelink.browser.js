(function ($) {
    "use strict";

    SB.readyForPlatform('browser', function () {
        _.extend($$voice, {
            _init: function () {
                this.helpbarVisible = true;
                $('body').append('<div id="voice_buble"></div><div id="help_voice_bubble"></div><div class="emul_voice_helpbar_wrap"><div id="emul_voice_helpbar"></div></div>');
                // клики по кнопкам эмулятора голоса
                $('#emul_voice_helpbar').on('click', '.emul_voice_trigger', function () {
                    $$voice.say(this.innerHTML);
                });
            },
            _nativeTurnOff: function () {
                $('#emul_voice_helpbar').empty();
            },
            _nativeFromServer: function (title, callback) {
                var text = prompt(title);
                callback(text || '');
            },
            _nativeCheckSupport: function () {
                return true;
            },
            _setVoiceHelp: function (voicehelp) {
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
        });
    });
})(jQuery);