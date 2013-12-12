describe('Player', function () {
    var urlMP4 = 'http://ua-cnt.smart-kino.com/trailers/karmen/tri_metra_nad_urovnem_neba_ya_tebya_hochu.mp4',
        urlHLS = 'http://liveips.nasa.gov.edgesuite.net/msfc/Wifi.m3u8',
        spyMethod;

    beforeEach(function () {
        spyMethod = jasmine.createSpy('spyMethod');
    });

    afterEach(function () {
        Player.stop();
    });

    describe('init() events', function () {
        var spy;

        beforeEach(function () {
            spy = jasmine.createSpy('spyMethod');
        });

        afterEach(function () {
            Player.stop();
        });

        it('should change state && trigger "change_state"', function () {
            Player.on('change_state', spy);

            expect(Player._state).toEqual('STOP');
            Player.init({
                url: urlMP4
            });

            expect(Player._state).toEqual('PLAY');

            waitsFor(function () {
                return spy.calls.length;
            }, '"change_state" event was not triggered', 500);
        });

        it('should trigger "play" ', function () {
            Player.on('play', spy);
            Player.init({
                url: urlMP4
            });
            waitsFor(function () {
                return spy.calls.length;
            }, '"play" event was not triggered', 500);
        });

        it('should trigger "ready"', function () {
            Player.on('ready', spy);
            Player.init({
                url: urlMP4
            });
            waitsFor(function () {
                return spy.calls.length;
            }, '"ready" event was not triggered in 10s', 10000);
        });
    });

    describe('after ready() events & method\'s', function () {
        var spy;
        beforeEach(function () {
            spy = jasmine.createSpy('spyMethod');

            Player.on('ready', spy);
            runs(function () {
                Player.init({
                    url: urlMP4
                });
            });
            waitsFor(function () {
                return spy.calls.length;
            }, '"ready" event was not triggered in 10s', 10000);
        });

        afterEach(function () {
            Player.stop();
        });

        it('should get duration', function () {
            runs(function () {
                expect(Player.duration).toBeGreaterThan(0);
            });
        });

        it('should get video width & height', function () {
            runs(function () {
                expect(Player.filmWidth).toBeGreaterThan(0);
                expect(Player.filmHeight).toBeGreaterThan(0);
            });
        });
    });

    describe('buffering methods', function () {
        var spy;
        beforeEach(function () {
            spy = jasmine.createSpy('spyMethod');
            runs(function () {
                Player.init({
                    url: urlMP4
                });
            });
        });

        afterEach(function () {
            Player.stop();
        });
        it('should trigger bufferingBegin', function () {
            Player.on('bufferingBegin', spy);
            waitsFor(function () {
                return spy.calls.length;
            }, 'bufferingBegin was not triggered', 10000);
        });
        it('should trigger bufferingProgress', function () {
            Player.on('bufferingProgress', spy);

            waitsFor(function () {
                return spy.calls.length;
            }, 'bufferingProgress was not triggered', 10000);
        });
        it('should trigger bufferingEnd', function () {
            Player.on('bufferingEnd', spy);
            waitsFor(function () {
                return spy.calls.length;
            }, 'bufferingEnd was not triggered', 10000);
        });
    });

    it('should trigger Error on stream timeout', function () {
        Player.on('error', spyMethod);
        Player.init({
            url: ''
        });
        waitsFor(function () {
            return spyMethod.calls.length;
        }, 'error was not triggered', Player.STREAM_TIMEOUT + 5);
    });

    it('should trigger update & change currentTime', function () {
        runs(function () {
           Player.on('update', spyMethod);
            Player.init({
                url: urlMP4
            });
        });

        waitsFor(function () {
            return spyMethod.calls.length > 10;
        }, '"update" was not triggered', 20000);

        runs(function () {
           expect(Player.currentTime).toBeGreaterThan(0);
        });
    });

    it('should pause & resume video', function () {
        var currentTime,
            updateIntrvl;
        runs(function () {
            Player.init({
                url: urlMP4
            });
        });

        waitsFor(function () {
            return Player.currentTime >= 2;
        }, '"update" was not triggered', 10000);

        runs(function () {
            Player.pause();
            currentTime = Player.currentTime;
            setTimeout(function () {
                updateIntrvl = true;
            }, 3000);
        });

        waitsFor(function () {
            return updateIntrvl;
        },'', 3500);

        runs(function () {
            expect(Player.currentTime).toEqual(currentTime);
            Player.resume();

            setTimeout(function () {
                updateIntrvl = true;
            }, 3000);
        });

        waitsFor(function () {
            return Player.currentTime > currentTime + 2;
        });
    });

    it('should seek video', function () {
        var updateSpy = jasmine.createSpy('updateSpy'),
            seekTime = 40;
        runs(function () {
            Player.init({
                url: urlMP4
            });
        });
        waitsFor(function () {
            return Player.currentTime >= 5;
        }, 'Video was not started', 15000);
        runs(function () {
            Player.seek(seekTime);
            Player.on('update', updateSpy);
        });
        waitsFor(function () {
            return updateSpy.calls.length;
        }, 'update after seek was not triggered', 5000);
        runs(function () {
           expect(Player.currentTime).toBeGreaterThan(seekTime);
        });
    });
});