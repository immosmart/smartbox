SB.readyForPlatform('mag', function () {


    var updateInterval;


    var startUpdate = function () {
        var lastTime = 0;
        updateInterval = setInterval(function () {
            var position = stb.GetPosTime();
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


    window.stbEvent =
    {

        onEvent: function (data) {

            data += '';
            if (data == '1') {
                Player.trigger('complete');
            } else if (data == '2') {
                Player.videoInfo.duration = stb.GetMediaLen() + 1;
                Player.videoInfo.currentTime = 0;
                Player.trigger('ready');
            }
            else if (data == '4') {
                Player.trigger('bufferingEnd');
            }
            else if (data == '7') {
                var vi = eval(stb.GetVideoInfo());
                Player.videoInfo.width = vi.pictureWidth;
                Player.videoInfo.height = vi.pictureHeight;
            }
        },
        event: 0
    };


    var stb = window.gSTB;
    Player.extend({
        _init: function () {
            stb.InitPlayer();
            stb.SetViewport(1280, 720, 0, 0);
            stb.SetTopWin(0);

        },
        _play: function (options) {
            stb.Play(options.url);
            startUpdate();
            stb.SetSpeed(2);
            Player.trigger('bufferingBegin');
        },
        _stop: function () {
            stb.Stop();
            stopUpdate();
        },
        pause: function () {
            stb.Pause();
            this.state = "pause";
            stopUpdate();
        },
        resume: function () {
            stb.Continue();
            this.state = "play";
            startUpdate();
        },
        seek: function (time) {
            stb.SetPosTime(time)
        },
        audio: {

            set: function (index) {
                stb.SetAudioPID(index);
            },
            get: function () {
                return stb.GetAudioPIDs();
            },
            cur: function () {
                return stb.GetAudioPID();
            }
        }
    });
});
