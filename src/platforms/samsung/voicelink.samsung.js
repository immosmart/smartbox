(function ($) {
    "use strict";



    SB.readyForPlatform('samsung', function(){
        var voiceServer;

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
                    /*if (paused) {
                        break;
                    }
                    $('body').trigger('voiceStart');
                    if (helperWasShowed < defaults.showHelperTimes) {
                        helperWasShowed++;
                        $helpBubble.html(defaults.helpText).show();
                    }*/


                    $$voice.refresh();

                    $$voice._resetVisibilityTimeout();

                    /*
                    if ($curTarget) {
                        doAll.call($curTarget, curOptions);
                    }*/
                    break;
                case "EVENT_VOICE_RECOG_RESULT":

                    var result = evt.result.toLowerCase();
                    //если не голосовой поиск
                    if (typeof voiceServer != 'function') {
                        $$voice.say(result);
                    }
                    else {
                        voiceServer(result);
                        voiceServer = false;
                        $$voice.restore();
                    }
                    break;
            }
        };
        _.extend($$voice, {
            _init: function(){
                deviceapis.recognition.SubscribeExEvent(deviceapis.recognition.PL_RECOGNITION_TYPE_VOICE, "Smartbox", function (evt) {
                    handleRecognitionEvent(evt);
                });
                deviceapis.recognition.SetVoiceTimeout(this.voiceTimeout);
                $('body').append('<div id="voice_buble"></div><div id="help_voice_bubble"></div>');
            },
            _nativeCheckSupport: function(){
                var enabled=false;
                try {
                    enabled = deviceapis.recognition.IsRecognitionSupported();
                } catch (e) {
                }
                return enabled;
            },
            _nativeFromServer: function(title, callback){
                voiceServer = callback;
                var describeHelpbar = {
                    helpbarType: "HELPBAR_TYPE_VOICE_SERVER_GUIDE_RETURN",
                    guideText: title
                };

                deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(describeHelpbar));
            },
            _setVoiceHelp: function(voicehelp){
                deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(voicehelp));
            },
            _nativeTurnOff: function(){
                deviceapis.recognition.SetVoiceHelpbarInfo(JSON.stringify({
                    helpbarType: "HELPBAR_TYPE_VOICE_CUSTOMIZE",
                    bKeepCurrentInfo: "false",
                    helpbarItemsList: []
                }));
            }
        });
    });
})(jQuery);