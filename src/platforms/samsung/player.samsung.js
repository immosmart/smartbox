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
    };

    Player.extend({
        usePlayerObject: true,
        fullscreenSize: {
          width: 1280,
          height: 720
        },
        _init: function () {
            var style,
              wrap;
            //document.body.onload=function(){
            if (this.usePlayerObject) {
                this.plugin = document.getElementById('pluginPlayer');
                style = this.plugin.style;
                style.position = 'absolute';
                style.left = '0px';
                style.top = '0px';
                wrap = document.createElement('div');
                wrap.className = 'player-wrap';
                wrap.appendChild(this.plugin);
                document.body.appendChild(wrap);
            } else {
                this.plugin = sf.core.sefplugin('Player');
            }

            if (!this.plugin) {
                throw new Error('failed to set plugin');
            }

            this.plugin.OnStreamInfoReady = 'Player.OnStreamInfoReady';
            this.plugin.OnRenderingComplete = 'Player.OnRenderingComplete';
            this.plugin.OnCurrentPlayTime = 'Player.OnCurrentPlayTime';
            this.plugin.OnCurrentPlaybackTime = 'Player.OnCurrentPlayTime';
            this.plugin.OnBufferingStart = 'Player.OnBufferingStart';
            //this.plugin.OnBufferingProgress = 'Player.OnBufferingProgress';
            this.plugin.OnBufferingComplete = 'Player.OnBufferingComplete';
            this.plugin.OnConnectionFailed = 'Player.onError';
            this.plugin.OnNetworkDisconnected = 'Player.onError';
            //this.plugin.OnAuthenticationFailed = 'Player.OnAuthenticationFailed';

            this.plugin.OnEvent = 'Player.onEvent';
            //}

        },
        _seek: function (time) {
            var jump = Math.floor(time - this.videoInfo.currentTime) + 1;

          alert('SEEK TIME ' + time);
          alert('jump time ' + jump);
            if (jump < 0) {
              this.doPlugin('JumpBackward', -jump);
            }
            else {
              this.doPlugin('JumpForward', jump);
            }
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
            var duration, width, height, resolution,
              playerSize = this.config.size,
              style;

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
                style = this.plugin.style;
                style.left = playerSize.left + 'px';
                style.top = playerSize.top + 'px';
                style.width = playerSize.width + 'px';
                style.height = playerSize.height + 'px';
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
            this._setSize(this.config.size);
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
        _pause: function () {
            this.doPlugin('Pause');
        },
        _resume: function () {
            this.doPlugin('Resume');
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
        _setSize: function (size) {
          var width = size.width,
            height = size.height,
            x = size.left,
            y = size.top,
            videoWidth = this.videoInfo.width,
            videoHeight = this.videoInfo.height,
            windowRate, clipRate, w, h;

          // check if no video sizes
          if (!videoWidth || !videoHeight) {
            return;
          }

          windowRate = width / height;
          clipRate = videoWidth / videoHeight;

          if (windowRate > clipRate) {
              w = height * clipRate;
              h = height;
              x += (width - w) / 2;
          }
          else {
              w = width;
              h = width / clipRate;
              y += (height - h) / 2;
          }

          //Player DPI is not the same as window DPI
          x = Math.floor(x * 0.75);
          y = Math.floor(y * 0.75);
          w = Math.floor(w * 0.75);
          h = Math.floor(h * 0.75);
          this.doPlugin('SetDisplayArea', x, y, w, h);

          // hack for pause
          // samsung player starts video after setDisplayArea
          if (this.state === 'PAUSE') {
            this.pause(true);
          }

          $$log('Player size: ' + Math.floor(w) + " * " + Math.floor(h) + " ### Position: top:" + y + " / left: " + x, 'player');
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