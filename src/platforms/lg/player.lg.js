SB.readyForPlatform('lg', function () {
    var updateInterval;

    var isReady = false, from;

    Player.extend({
        updateDelay: 500,
        _init: function () {

        },
        onEvent: function () {
            if (this.plugin.playState == 5) {
                this.state = 'stop';
                this.trigger('complete');
            } else if (this.plugin.playState == 4) {
                this.trigger('error')
            }
        },
        _update: function () {
            var info = this.plugin.mediaPlayInfo();

            if (info && info.width && !isReady) {
                //$('#log').append('<div>'+info.duration+'</div>');

                //$$log(JSON.stringify(info));

                isReady = true;


                this.videoInfo = {
                    duration: info.duration / 1000
                };
                var self = this;
                if (from) {
                    var self = this;
                    var onBufEnd = function () {
                        self.off('bufferingEnd', onBufEnd);
                        self.seek(from);
                    };
                    self.on('bufferingEnd', onBufEnd);
                }

                this.trigger('ready');

            }

            if (!isReady) {
                return;
            }

            this.videoInfo.currentTime = info.currentPosition / 1000;
            this.trigger('update');
        },
        onBuffering: function (isStarted) {
            this.trigger(isStarted ? 'bufferingBegin' : 'bufferingEnd');
        },
        _play: function (options) {
            clearInterval(updateInterval);
            updateInterval = setInterval(function () {

                Player._update();
            }, this.updateDelay);
            isReady = false;

            $('#pluginPlayer').remove();

            var drm_string='';


            if (options.drm && options.drm.type == 'widevine') {
                drm_string=' drm_type="widevine" ';
            }


            $('body').append('<object mode3D="' + (options.is3d ? 'side_by_side' : 'off') + '" '+drm_string+' type="video/mp4" data="" width="1280" height="720" id="pluginPlayer" style="z-index: 0; position: absolute; left: 0; top: 0;"></object>');
            this.plugin = $('#pluginPlayer')[0];
            this.$plugin = $(this.plugin);

            var self = this;
            this.plugin.onPlayStateChange = function () {
                self.onEvent.apply(self, arguments);
            }
            this.plugin.onBuffering = function () {
                self.onBuffering.apply(self, arguments);
            }

            this.plugin.onError = function () {
                self.trigger('error')
            }


            if (options.drm && options.drm.type == 'widevine') {


                self.plugin.setWidevineDrmURL(options.drm.url);

                if (options.drm.streamID)
                    self.plugin.setWidevineStreamID(options.drm.streamID);
                if (options.drm.deviceType)
                    self.plugin.setWidevineDeviceType(options.drm.deviceType);
                if (options.drm.portalID)
                    self.plugin.setWidevinePortalID(options.drm.portalID);
                if (options.drm.storeFront)
                    self.plugin.setWidevineStoreFront(options.drm.storeFront);
            }


            this.plugin.data = options.url;
            this.plugin.play(1);

            from = options.from;
        },
        _setSize: function (size) {

            //size = this._fixAspectRatio(size);


            if (size.width) {
                this.plugin.width = size.width;
            }

            if (size.height) {
                this.plugin.height = size.height;
            }

            if (size.left) {
                this.plugin.style.left = size.left + 'px';
            }

            if (size.top) {
                this.plugin.style.top = size.top + 'px';
            }
        },
        _pause: function () {
            this.plugin.play(0);
        },
        _resume: function () {
            this.plugin.play(1);
        },
        _stop: function () {
            this.plugin.stop();
        },
        seek: function (time) {
            this.plugin.seek(time * 1000);
        },
        showOptionMedia: function () {
            var app = new lge();
            app.optionMedia();
        },
        audio: {
            set: function (index) {
            },
            get: function () {
                return [];
            },
            cur: function () {
                return 0;
            },
            toggle: function () {
            }
        }
    });
});