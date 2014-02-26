/**
 * Player plugin for smartbox
 */

(function (window) {

    var updateInterval, curAudio = 0;


    /**
     * emulates events after `play` method called
     * @private
     * @param self Player
     */
    var stub_play = function (self) {
        self.state = "play";
        updateInterval = setInterval(function () {
            self.trigger("update");
            self.videoInfo.currentTime += 0.5;
            if (self.videoInfo.currentTime >= self.videoInfo.duration) {
                self.stop();
                self.trigger("complete");
            }
        }, 500);
    }

    var inited = false;

    var Player = window.Player = {

        /**
         * Inserts player object to DOM and do some init work
         * @examples
         * Player._init(); // run it after SB.ready
         */
        _init: function () {

            //no need to do anything because just stub
        },
        /**
         * current player state ["play", "stop", "pause"]
         */
        state: 'stop',
        /**
         * Runs some video
         * @param {Object} options {url: "path", type: "hls", from: 0
         * }
         * @examples
         *
         * Player.play({
         * url: "movie.mp4"
         * }); // => runs video
         *
         * Player.play({
         * url: "movie.mp4"
         * from: 20
         * }); // => runs video from 20 second
         *
         * Player.play({
         * url: "stream.m3u8",
         * type: "hls"
         * }); // => runs stream
         */
        play: function (options) {
            if (!inited) {
                this._init();
                inited = true;
            }

            if (typeof options == "string") {
                options = {
                    url: options
                }
            }
            if (options !== undefined) {
                this.stop();
                this.state = 'play';
                this._play(options);
            } else if (options === undefined && this.state === 'pause') {
                this.resume();
            }
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
         * @param {Boolean} silent   if flag is set, player will no trigger "stop" event
         * @examples
         *
         * Player.stop(); // stop video
         *
         * App.onDestroy(function(){
         *      Player.stop(true);
         * });  // stop player and avoid possible side effects
         */
        stop: function (silent) {
            if (this.state != 'stop') {
                this._stop();
                if (!silent) {
                    this.trigger('stop');
                }
            }
            this.state = 'stop';
        },
        /**
         * Pause playback
         * @examples
         * Player.pause(); //paused
         */
        pause: function () {
            this._stop();
            this.state = "pause";
        },
        /**
         * Resume playback
         * @examples
         * Player.pause(); //resumed
         */
        resume: function () {
            stub_play(this);
        },
        /**
         * Toggles pause/resume
         * @examples
         *
         * Player.togglePause(); // paused or resumed
         */
        togglePause: function () {
            if (this.state == "play") {
                this.pause();
            } else {
                this.resume();
            }
        },
        _stop: function () {
            clearInterval(updateInterval);
        },
        /**
         * Converts time in seconds to readable string in format H:MM:SS
         * @param {Number} seconds time to convert
         * @returns {String} result string
         * @examples
         * Player.formatTime(PLayer.videoInfo.duration); // => "1:30:27"
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
        /**
         * Hash contains info about current video
         */
        videoInfo: {
            /**
             * Total video duration in seconds
             */
            duration: 0,
            /**
             * Video stream width in pixels
             */
            width: 0,
            /**
             * Video stream height in pixels
             */
            height: 0,
            /**
             * Current playback time in seconds
             */
            currentTime: 0
        },

        /**
         *
         * @param {Number} seconds time to seek
         * @examples
         * Player.seek(20); // seek to 20 seconds
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
            },
            toggle: function () {
                var l = this.get().length;
                var cur = this.cur();
                if (l > 1) {
                    cur++;
                    if (cur >= l) {
                        cur = 0;
                    }
                    this.set(cur);
                }
            }
        },
        subtitle: {
            /**
             * Set subtitle index
             * @param index
             */
            set: function (index) {
                curSubtitle = index;
            },
            /**
             * Returns list of available subtitles
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
             * @returns {Number} index of current subtitles
             */
            cur: function () {
                return curSubtitle;
            },
            toggle: function () {
                var l = Player.subtitle.get().length;
                var cur = Player.subtitle.cur();
                if (l > 1) {
                    cur++;
                    if (cur >= l) {
                        cur = 0;
                    }
                    Player.subtitle.set(cur);
                }
            },
            text: function (time) {
                var data = Player.subtitle.data,
                    index = _.sortedIndex(data, {
                        time: time
                    }, function (value) {
                        return value.time;
                    });
                if (data[index - 1]) {
                    return data[index - 1].text;
                }
                return '';
            },
            data: [
                {
                    time: 0,
                    text: ''
                }
            ],
            /**
             * Load subtitles from remote file
             * @param url
             */
            url: function (url) {
                var extension = /\.([^\.]+)$/.exec(url)[1];
                // TODO Сделать универсальное выключение вшитых субтитров
                Player.subtitle.set(undefined);
                $.ajax({
                    url: url,
                    dataType: 'text',
                    success: function (data) {
                        var $subtitiles = $('#subtitles_view');
                        $(Player).off('.subtitles');
                        Player.subtitle.init = true;
                        Player.subtitle.remote = true;
                        Player.subtitle.parse[extension].call(Player, data);
                        $subtitiles.show();
                        var setSubtitlesText = function () {
                            $('#subtitles_text').html(Player.subtitle.text(parseInt(Player.videoInfo.currentTime) * 1000));
                        }
                        Player.on('update', setSubtitlesText);

                        if (!$subtitiles.length) {
                            $('body').append('<div id="subtitles_view" style="position: absolute; z-index: 1;"><div id="subtitles_text"></div></div>');
                            $subtitiles = $('#subtitles_view');
                            $subtitiles.css({
                                width: '1280px',
                                height: '720px',
                                left: '0px',
                                top: '0px'
                            });
                            $('#subtitles_text').css({
                                'position': 'absolute',
                                'text-align': 'center',
                                'width': '100%',
                                'left': '0',
                                'bottom': '50px',
                                'font-size': '24px',
                                'color': '#fff',
                                'text-shadow': '0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000',
                                'line-height': '26px'
                            });
                        }

                        var stopSubtitlesUpdate = function () {
                            $(Player).off('update', setSubtitlesText);
                            $(Player).off('stop', stopSubtitlesUpdate);
                            $subtitiles.hide();
                        }

                        Player.on('stop', stopSubtitlesUpdate);
                    }
                });
            },
            parse: {
                smi: function (data) {
                    data = data.split(/\s*<sync/i);
                    data.shift();
                    Player.subtitle.data = _.map(data, function (value) {
                        var match = /[\s\S]*start=(\d+)[\s\S]*<p[^>]*>([\s\S]*)<spanid/i.exec(value);
                        if (match) {
                            return {
                                time: parseInt(match[1], 10),
                                text: match[2]
                            };
                        }
                    });
                },
                srt: function (data) {
                    data = data.split('\r\n\r\n');
                    var self = Player.subtitle;

                    self.data = [];
                    var parseTime = function (time) {
                        var matches = time.match(/(\d{2}):(\d{2}):(\d{2}),(\d+)/);
                        return parseInt(matches[1], 10) * 3600000 +
                            parseInt(matches[2], 10) * 60000 +
                            parseInt(matches[3], 10) * 1000 +
                            parseInt(matches[4], 10);
                    };

                    _.each(data, function (value) {
                        if (!value) {
                            return;
                        }
                        var rows = value.split('\n');

                        var timeRow = rows[1].split(' --> '),
                            timeStart, timeEnd, text;
                        rows.splice(0, 2);
                        timeStart = parseTime(timeRow[0]);
                        timeEnd = parseTime(timeRow[1]);

                        self.data.push({
                            time: timeStart,
                            text: rows.join('<br/>')
                        });
                        self.data.push({
                            time: timeEnd,
                            text: ''
                        });
                    });
                    self.data.unshift({
                        time: 0,
                        text: ''
                    });
                }
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


}(this));