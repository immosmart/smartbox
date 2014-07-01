SB.readyForPlatform('dune', function () {

    var updateInterval;
    var startUpdate = function () {
        var lastTime = 0;
        updateInterval = setInterval(function () {
            var position = stb.getPositionInSeconds();
            //if (position != lastTime) {
            Player.videoInfo.currentTime = position;
            Player.trigger('update');
            SB.utils.log.state(position, 'position', 'player');
            //}
            //lastTime = position;
        }, 500);
    }
    var stopUpdate = function () {
        clearInterval(updateInterval);
    }

    function handle_event(pstate, cstate, lastEvent){
        data = cstate;
        data += '';
        if (data == '4') {
            Player.trigger('complete');
        } else if (data == '3') {
            if (!stb) return;
            if (stb.hasLength()){
                Player.videoInfo.duration = stb.getLengthInSeconds() + 1;
                Player.videoInfo.currentTime = 0;
                Player.trigger('ready');
            }
        }
    }

    function getStb(){
        return $('body > div > object');
    }

    var stb = getStb();

    Player.extend({
        _init: function () {
            //stb.SetViewport(1280, 720, 0, 0);
            //stb.SetTopWin(0);
        },
        _play: function (options) {
            stb.play(options.url);
            startUpdate();
            Player.trigger('bufferingBegin');
        },
        _stop: function () {
            stb.stop();
            stopUpdate();
        },
        pause: function () {
            stb.pause();
            this.state = "pause";
            stopUpdate();
        },
        resume: function () {
            stb.resume();
            this.state = "play";
            startUpdate();
        },
        seek: function (time) {
            stb.setPositionInSeconds(time)
        },
        audio: {
            set: function (index) {
                stb.setAudioTrack(index);
            },
            get: function () {
                return stb.getAudioTracksDescription();
            },
            cur: function () {
                return stb.getAudioTrack();
            }
        },
        subtitle: {
            set: function (index) {
                stb.setSubtitleTrack(index);
            },
            get: function () {
                var subtitles = [];
                _.each(stb.getSubtitleTracksDescription(), function (self) {
                    subtitles.push({index: self.index, language: self.lang[1]});
                });
                return subtitles;
            },
            cur: function () {
                return stb.getSubtitleTrack();
            }
        }
    });
});
