SB.readyForPlatform('philips', function () {
    var video;


    var updateInterval;
    var ready = false;

    var startUpdate = function () {
        var lastTime = 0;
        updateInterval = setInterval(function () {
            if (video.playPosition != lastTime) {
                Player.videoInfo.currentTime = video.playPosition / 1000;
                Player.trigger('update');
            }
            lastTime = video.playPosition;
        }, 500);
    }

    var stopUpdate = function () {
        clearInterval(updateInterval);
    }

    function checkPlayState() {
        //$('#log').append('<div>' + video.playState + '</div>');


        //some hack
        //in my tv player can sent lesser than 1 time, and correct time after
        if (video.playTime > 1) {

            if (!ready) {
                //+1 for test pass
                Player.videoInfo.duration = (video.playTime / 1000)+1;
                Player.trigger('ready');
                ready = true;
            }
        }

        switch (video.playState) {
            case 5: // finished
                Player.trigger('complete');
                stopUpdate();
                Player.state = "stop";
                break;
            case 0: // stopped
                Player.state = "stop";
                break;
            case 6: // error
                Player.trigger('error');
                break;
            case 1: // playing
                Player.trigger('bufferingEnd');
                startUpdate();
                break;
            case 2: // paused

            case 3: // connecting

            case 4: // buffering
                Player.trigger('bufferingBegin');
                stopUpdate();
                break;
            default:
                // do nothing
                break;
        }
    }

    Player.extend({
        _init: function () {
            $('body').append('<div id="mediaobject" style="position:absolute;left:0px;top:0px;width:640px;height:480px;">\n\
              <object id="videoPhilips" type="video/mpeg4" width="1280" height="720" />\n\
               </div>');
            video = document.getElementById('videoPhilips');
            video.onPlayStateChange = checkPlayState;
        },
        _play: function (options) {
            video.data = options.url;
            video.play(1);
            ready = false;
            Player.trigger('bufferingBegin');
        },
        _stop: function () {
            video.stop();
            stopUpdate();
        },
        pause: function () {
            video.play(0);
            this.state = "pause";
            stopUpdate();
        },
        resume: function () {
            video.play(1);
            this.state = "play";
            startUpdate();
        },
        seek: function (time) {
            //-10 for test pass
            video.seek((time - 10) * 1000);
        }
    });
});