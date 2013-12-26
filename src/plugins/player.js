(function (window) {

    var updateInterval, curAudio = 0;

    //emulates events after `play` method called
    var stub_play = function (self) {
        self._state="play";
        updateInterval = setInterval(function () {
            self.trigger("update");
            self.videoInfo.currentTime += 0.5;
            if (self.videoInfo.currentTime >= self.videoInfo.duration) {
                self.stop();
                self.trigger("complete");
            }
        }, 500);
    }

    var Player = window.Player = {
        /**
         * inserts player object to DOM and do some init work
         */
        init: function () {
            //no need to do anything because just stub
        },
        /**
         * current player state ["play", "stop", "pause"]
         */
        _state: 'stop',
        /**
         * Runs some video
         * @param options object {
         *      url: "path to video file/stream"
         *      from: optional {Number} time in seconds where need start playback
         *      type: optional {String} should be set to "hls" if stream is hls
         * }
         */
        play: function (options) {
            this.stop();
            this._state = 'play';
            this._play(options);
        },
        _play: function () {
            var self = this;

            setTimeout(function () {
                self.trigger("ready");
                setTimeout(function () {
                    self.trigger("bufferingBegin");
                    setTimeout(function () {
                        self.videoInfo.currentTime = 0;
                        self.trigger("bufferingEnd");
                        stub_play(self);
                    }, 1000);
                }, 1000);
            }, 1000);

        },
        /**
         * Stop video playback
         * @param silent {Boolean} if flag is set, player will no trigger "stop" event
         */
        stop: function (silent) {
            if (this._state != 'stop') {
                this._stop();
                if (!silent) {
                    this.trigger('stop');
                }
            }
            this._state = 'stop';
        },
        /**
         * Pause playback
         */
        pause: function () {
            this._stop();
            this._state = "pause";
        },
        /**
         * Resume playback
         */
        resume: function () {
            stub_play(this);
        },
        _stop: function () {
            clearInterval(updateInterval);
        },
        /**
         * Converts time in seconds to readable string in format H:MM:SS
         * @param seconds {Number} time to convert
         * @returns {String} result string
         * Example:
         * $('#duration').html(Player.formatTime(PLayer.videoInfo.duration));
         * Result:
         * <div id="duration">1:30:27</div>
         */
        formatTime: function (seconds) {
            var hours = Math.floor(seconds / (60 * 60));
            var divisor_for_minutes = seconds % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);
            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return (hours ? hours + ':' : '') + minutes + ":" + seconds;
        },

        videoInfo: {
            /**
             * Total video duration in seconds
             */
            duration: 31,
            /**
             * Video stream width in pixels
             */
            width: 640,
            /**
             * Video stream height in pixels
             */
            height: 360,
            /**
             * Current playback time in seconds
             */
            currentTime: 0
        },
        /**
         * If set to true Player.init() calls after DOM ready
         */
        autoInit: false,
        /**
         * @param seconds time to seek
         */
        seek: function (seconds) {
            var self = this;
            self.videoInfo.currentTime = seconds;
            self.pause();
            self.trigger("bufferingBegin");
            setTimeout(function () {
                self.trigger("bufferingEnd");
                self.resume();
            }, 500);
        },
        /**
         * For multi audio tracks videos
         */
        audio: {
            /**
             * Set audio track index
             * @param index
             */
            set: function (index) {
                curAudio = index;
            },
            /**
             * Returns list of supported language codes
             * @returns {Array}
             */
            get: function () {
                var len = 2;
                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(0);
                }
                return result;
            },
            /**
             * @returns {Number} index of current playing audio track
             */
            cur: function () {
                return curAudio;
            }
        }
    };


    var extendFunction, eventProto;
    //use underscore, or jQuery extend function
    if (window._ && _.extend) {
        extendFunction = _.extend;
    } else if (window.$ && $.extend) {
        extendFunction = $.extend;
    }


    if (window.EventEmitter) {
        eventProto = EventEmitter.prototype;
    } else if (window.Backbone) {
        eventProto = Backbone.Events;
    } else if (window.Events) {
        eventProto = Events.prototype;
    }

    Player.extend = function (proto) {
        extendFunction(this, proto);
    };

    Player.extend(eventProto);


    $(function () {
        if (Player.autoInit) {
            $('body').on('load', function () {
                Player.init();
            });
        }
    });


}(this));