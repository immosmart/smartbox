SB.readyForPlatform('browser', function(){

    Player.extend({
        _init: function () {
            var self = this;
            var ww = 1280;
            var wh = 720;


            this.$video_container = $('<video id="smart_player" style="position: absolute; left: 0; top: 0;width: ' + ww + 'px; height: ' + wh + 'px;"></video>');
            var video = this.$video_container[0];
            $('body').append(this.$video_container);

            this.$video_container.on('loadedmetadata', function () {
                self.videoInfo.width = video.videoWidth;
                self.videoInfo.height = video.videoHeight;
                self.videoInfo.duration = video.duration;
                self.trigger('ready');
            });


            this.$video_container.on('loadstart',function (e) {
                self.trigger('bufferingBegin');
            }).on('playing',function () {
                    self.trigger('bufferingEnd');
                }).on('timeupdate',function () {
                    self.videoInfo.currentTime = video.currentTime;
                    self.trigger('update');
                }).on('ended', function () {
                    self._state = "stop";
                    self.trigger('complete');
                });


            this.$video_container.on('abort canplay canplaythrough canplaythrough durationchange emptied ended error loadeddata loadedmetadata loadstart mozaudioavailable pause play playing ratechange seeked seeking suspend volumechange waiting', function (e) {
                //console.log(e.type);
            });


            /*
             abort 	Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.
             canplay 	Sent when enough data is available that the media can be played, at least for a couple of frames.  This corresponds to the CAN_PLAY readyState.
             canplaythrough 	Sent when the ready state changes to CAN_PLAY_THROUGH, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.
             durationchange 	The metadata has loaded or changed, indicating a change in duration of the media.  This is sent, for example, when the media has loaded enough that the duration is known.
             emptied 	The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it.
             ended 	Sent when playback completes.
             error 	Sent when an error occurs.  The element's error attribute contains more information. See Error handling for details.
             loadeddata 	The first frame of the media has finished loading.
             loadedmetadata 	The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.
             loadstart 	Sent when loading of the media begins.
             mozaudioavailable 	Sent when an audio buffer is provided to the audio layer for processing; the buffer contains raw audio samples that may or may not already have been played by the time you receive the event.
             pause 	Sent when playback is paused.
             play 	Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior pause event.
             playing 	Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).
             progress 	Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's buffered attribute.
             ratechange 	Sent when the playback speed changes.
             seeked 	Sent when a seek operation completes.
             seeking 	Sent when a seek operation begins.
             suspend 	Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
             timeupdate 	The time indicated by the element's currentTime attribute has changed.
             volumechange 	Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
             waiting 	Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
             */
        },
        _play: function (options) {
            this.$video_container.attr('src', options.url);
            this.$video_container[0].play();
        },
        _stop: function () {
            this.$video_container[0].pause();
            this.$video_container[0].src = '';
        },
        pause: function () {
            this.$video_container[0].pause();
            this._state = "pause";
        },
        resume: function () {
            this.$video_container[0].play();
            this._state = "play";
        },
        seek: function (time) {
            this.$video_container[0].currentTime = time;
        },
        audio: {
            //https://bugzilla.mozilla.org/show_bug.cgi?id=744896
            set: function (index) {

            },
            get: function () {

            },
            cur: function () {

            }
        }
    });
});
