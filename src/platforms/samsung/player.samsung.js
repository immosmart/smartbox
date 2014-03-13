SB.readyForPlatform('samsung', function () {
    var curAudio = 0,
        curSubtitle = 0;


    var safeApply = function (self, method, args) {
        try {
            switch (args.length) {
                case 0:
                    return self[method]();
                case 1:
                    return self[method](args[0]);
                case 2:
                    return self[method](args[0], args[1]);
                case 3:
                    return self[method](args[0], args[1], args[2]);
                case 4:
                    return self[method](args[0], args[1], args[2], args[3]);
                case 5:
                    return self[method](args[0], args[1], args[2], args[3], args[4]);
                case 6:
                    return self[method](args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:
                    return self[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                case 8:
                    return self[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);

            }
        } catch (e) {
            throw e;
        }
    }
    Player.extend({
        usePlayerObject: true,
        _init: function () {
            var self = this;
            //document.body.onload=function(){
            if (self.usePlayerObject) {
                //self.$plugin = $('<object id="pluginPlayer" border=0 classid="clsid:SAMSUNG-INFOLINK-PLAYER" style="position: absolute; left: 0; top: 0; width: 1280px; height: 720px;"></object>');
                self.plugin = document.getElementById('pluginPlayer');
                $('body').append(self.$plugin);


            } else {
                self.plugin = sf.core.sefplugin('Player');
            }


            if (!self.plugin) {
                throw new Error('failed to set plugin');
            }

            self.plugin.OnStreamInfoReady = 'Player.OnStreamInfoReady';
            self.plugin.OnRenderingComplete = 'Player.OnRenderingComplete';
            self.plugin.OnCurrentPlayTime = 'Player.OnCurrentPlayTime';
            self.plugin.OnCurrentPlaybackTime = 'Player.OnCurrentPlayTime';
            self.plugin.OnBufferingStart = 'Player.OnBufferingStart';
            //self.plugin.OnBufferingProgress = 'Player.OnBufferingProgress';
            self.plugin.OnBufferingComplete = 'Player.OnBufferingComplete';
            self.plugin.OnConnectionFailed = 'Player.onError';
            self.plugin.OnNetworkDisconnected = 'Player.onError';
            //self.plugin.OnAuthenticationFailed = 'Player.OnAuthenticationFailed';

            self.plugin.OnEvent = 'Player.onEvent';
            //}

        },
        seek: function (time) {
            if (time <= 0) {
                time = 0;
            }
            /*if ( this.duration <= time + 1 ) {
             this.videoInfo.currentTime = this.videoInfo.duration;
             }
             else {*/
            var jump = Math.floor(time - this.videoInfo.currentTime - 1);
            this.videoInfo.currentTime = time;
            alert('jump: ' + jump);
            if (jump < 0) {
                this.doPlugin('JumpBackward', -jump);
            }
            else {
                this.doPlugin('JumpForward', jump);
            }
            //  this.currentTime = time;
            //}
        },

        onError: function(){
            this.trigger('error');
        },
        onEvent: function (event, arg1, arg2) {

            // alert('playerEvent: ' + event);
            switch (event) {
                case 9:
                    this.OnStreamInfoReady();
                    break;

                case 4:
                    this.onError();
                    break;

                case 8:
                    this.OnRenderingComplete();
                    break;
                case 14:
                    this.OnCurrentPlayTime(arg1);
                    break;
                case 13:
                    //this.OnBufferingProgress(arg1);
                    break;
                case 12:
                    this.OnBufferingComplete();
                    break;
                case 11:
                    this.OnBufferingStart();
                    break;
            }
        },
        OnRenderingComplete: function () {
            alert('PLAYER COMPLETE');
            Player.trigger('complete');
        },
        OnStreamInfoReady: function () {
            var duration, width, height, resolution;

            try {
                duration = this.doPlugin('GetDuration');
            } catch (e) {
                alert('######## ' + e.message);
            }

            duration = Math.ceil(duration / 1000);
            //this.jumpLength = Math.floor(this.duration / 30);

            if (this.usePlayerObject) {
                width = this.doPlugin('GetVideoWidth');
                height = this.doPlugin('GetVideoHeight');
            } else {
                resolution = this.doPlugin('GetVideoResolution');
                if (resolution == -1) {
                    width = 0;
                    height = 0;
                } else {
                    var arrResolution = resolution.split('|');
                    width = arrResolution[0];
                    height = arrResolution[1];
                }
            }

            this.videoInfo.duration = duration;
            this.videoInfo.width = width * 1;
            this.videoInfo.height = height * 1;
            this.trigger('ready');
        },
        OnBufferingStart: function () {
            this.trigger('bufferingBegin');
        },
        OnBufferingComplete: function () {
            this.trigger('bufferingEnd');
        },
        OnCurrentPlayTime: function (millisec) {
            if (this.state == 'play') {
                alert(millisec / 1000);
                this.videoInfo.currentTime = millisec / 1000;
                this.trigger('update');
            }
        },
        _play: function (options) {
            var url = options.url;
            switch (options.type) {
                case 'hls':
                    url += '|COMPONENT=HLS'
            }
            this.doPlugin('InitPlayer', url);
            this.doPlugin('StartPlayback', options.from || 0);
        },
        _stop: function () {
            this.doPlugin('Stop');
        },
        pause: function () {
            this.doPlugin('Pause');
            this.state = "pause";
        },
        resume: function () {
            this.doPlugin('Resume');
            this.state = "play";
        },
        doPlugin: function () {
            var result,
                plugin = this.plugin,
                methodName = arguments[0],
                args = Array.prototype.slice.call(arguments, 1, arguments.length) || [];

            if (this.usePlayerObject) {


                result = safeApply(plugin, methodName, args);

            }
            else {
                if (methodName.indexOf('Buffer') != -1) {
                    methodName += 'Size';
                }
                args.unshift(methodName);
                result = safeApply(plugin, 'Execute', args);
            }

            return result;
        },
        audio: {
            set: function (index) {
                /*one is for audio*/
                //http://www.samsungdforum.com/SamsungDForum/ForumView/f0cd8ea6961d50c3?forumID=63d211aa024c66c9
                Player.doPlugin('SetStreamID', 1, index);
                curAudio = index;
            },
            get: function () {
                /*one is for audio*/
                var len = Player.doPlugin('GetTotalNumOfStreamID', 1);

                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(Player.doPlugin('GetStreamLanguageInfo', 1, i));
                }
                return result;
            },
            cur: function () {
                return curAudio;
            }
        },
        subtitle: {
            set: function (index) {
                Player.doPlugin('SetStreamID', 5, index);
                curSubtitle = index;
            },
            get: function () {
                var len = Player.doPlugin('GetTotalNumOfStreamID', 5);

                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(Player.doPlugin('GetStreamLanguageInfo', 5, i));
                }
                return result;
            },
            cur: function () {
                return curSubtitle;
            }
        }
    });
});