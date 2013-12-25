describe('Player', function () {

    var currentURL = Config.trailer;
    var currentType = '';




    describe('basic support', function () {

        it('init shall not fail', function(){
            expect(function(){
                Player.init();
            }).not.toThrow()
        });

        it('supports ready', function () {
            var spy = jasmine.createSpy('ready handler');
            Player.on('ready', spy);

            runs(function () {
                Player.play({
                    url: Config.trailer
                });
            });
            waitsFor(function () {
                return spy.calls.length == 1
            }, 'ready have been triggered', 2000);
        });

        it('has video duration', function () {
            runs(function () {
                var info = Player.videoInfo;
                expect(Player.formatTime(info.duration)).toBe(Config.trailerDuration);
            });
        });

        it('has video resolution', function () {
            runs(function () {
                var info = Player.videoInfo;
                expect(info.width).toBe(Config.trailerWidth);
                expect(info.height).toBe(Config.trailerHeight);
            });
        });


        var spyStop = jasmine.createSpy('stop handler');


        it('supports stop method', function () {
            runs(function () {
                Player.on('stop', spyStop);
                Player.stop();
                expect(spyStop).toHaveBeenCalled();
            });

            waitsFor(function () {
                return spyStop.calls.length == 1
            }, 'stop have been triggered', 1000);

        });
    });


    describe('extended support', function () {

        var begin = jasmine.createSpy('bufferingEnd handler');
        var end = jasmine.createSpy('end handler');

        it('supports bufferingBegin', function () {


            runs(function () {

                Player.play({
                    url: Config.movie
                });

                Player.on('bufferingBegin', begin);
            });


            waitsFor(function () {
                return begin.calls.length == 1
            }, 'bufferingBegin have been triggered', 15000);
        });


        it('supports bufferingEnd', function () {
            runs(function () {
                Player.on('bufferingEnd', end);
            });

            waitsFor(function () {
                return end.calls.length == 1
            }, 'bufferingEnd have been triggered', 15000);
        });


        it('supports update', function () {
            var update = jasmine.createSpy('update handler');
            var date;

            runs(function () {
                Player.on('update', update)
            });


            waitsFor(function () {
                return update.calls.length == 1;
            }, 'update have been triggered', 5000);


            runs(function () {
                expect(Math.floor(Player.videoInfo.currentTime)).toBe(0);
                date = (new Date().getTime());
            });

            waitsFor(function () {
                return Player.videoInfo.currentTime >= 2;
            }, '2 seconds playing', 5000);

        });


        if (Config.movieAudioTracksLength > 1) {
            it('gets audio tracks array', function () {
                runs(function () {
                    expect(Player.audio.get().length).toBe(Config.movieAudioTracksLength);
                    expect(Player.audio.cur()).toBe(0);
                });
            });


            it('supports audio track switch', function () {
                runs(function () {
                    Player.audio.set(1);
                    expect(Player.audio.cur()).toBe(1);
                });
            });
        }


        it('supports seek method', function () {
            var update = jasmine.createSpy('update spy');

            runs(function () {
                Player.on('update', update);
                Player.seek(120);
            });

            waitsFor(function () {
                return update.calls.length == 1
            }, 'update handler was called', 25000);

            runs(function () {
                expect(Player.videoInfo.currentTime).toBeGreaterThan(118);
                expect(Player.videoInfo.currentTime).toBeLessThan(122);
            }, 'seeking success', 15000);
        });


        it('supports complete event', function () {
            var onComplete = jasmine.createSpy('complete spy');
            Player.on('complete', onComplete);

            var timeToWait = 10;

            runs(function () {
                Player.seek(Player.videoInfo.duration - timeToWait);
            });


            waitsFor(function () {
                return onComplete.calls.length == 1;
            }, 'onComplete was called', 15000 + timeToWait * 1000);

            runs(function () {
                Player.stop();
            });
        });


    });

    xdescribe('hls', function () {
        it('support hls', function () {

            runs(function () {
                Player.play({
                    url: Config.hls,
                    type: 'hls'
                });
            });


            var spy = jasmine.createSpy('ready handler');
            Player.on('ready', spy);
            waitsFor(function () {
                return spy.calls.length == 1
            }, 'ready have been triggered', 20000);

            runs(function () {
                Player.stop();
            });
        });
    });

});