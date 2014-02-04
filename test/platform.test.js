describe('Platform', function () {

    beforeEach(function () {
        runs(function () {
            SB.initialise();
        });

        waitsFor(function () {
            return SB.currentPlatform;
        }, 'Should initialise platform');
    });

    it('Should detect platform', function () {
        runs(function () {
            expect(SB.currentPlatform).toBeTruthy();
        });
    });

    it('Should detect native DUID', function () {
        runs(function () {
            expect(SB.currentPlatform.getNativeDUID()).not.toBe('');
        });
    });

    it('Should detect platform', function () {
        $('body').prepend('<div style="color: #ffffff; background: #000000">'+navigator.userAgent+'</div>')
        expect(SB.currentPlatform.name).toBe('philips');
    });

    describe('Local storage', function () {

        afterEach(function () {
            localStorage.clear();
        });

        it('Should have local Storage', function () {
            expect(window.localStorage).toBeDefined();
        });

        it('Shold save data', function () {
            localStorage.setItem('key', 'value');
            expect(localStorage.getItem('key')).toBe('value');
        });

        it('Should delete data', function () {
            localStorage.setItem('key', 'value');
            localStorage.removeItem('key');
            expect(localStorage.getItem('key')).toBeFalsy();
        });
    });


    xdescribe('external files methods', function () {

        it('addExternalJS load and execute script', function () {
            expect(window.nonExists).not.toBeDefined();
            var cb = jasmine.createSpy("external callback");
            SB.Platform.prototype.addExternalJS(['test/external.js'], cb);
            waitsFor(function () {
                return cb.calls.length > 0;
            });

            runs(function () {
                expect(window.nonExists).toBeDefined();
                delete window.nonExists;
            });
        });


        it('addExternalCSS apply styles', function () {

            var $check = $('<div class="apply_check"></div>');

            $('body').append($check);

            expect($check.css("position")).toBe("static");

            SB.Platform.prototype.addExternalCss(['test/external.css']);
            waits(1000);

            runs(function () {
                var offset = $check.offset();
                expect($check.css("position")).toBe("absolute");
                expect(offset.left).toBe(123);
                expect(offset.top).toBe(321);
                $check.remove();
            });
        });

    });
});