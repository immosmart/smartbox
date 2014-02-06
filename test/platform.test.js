describe('Platform', function () {


    it('Should supports ready', function () {
        var spy1=jasmine.createSpy(), spy2=jasmine.createSpy();
        runs(function(){
            SB.ready(spy1);
            SB.run();
        });

        waitsFor(function(){
            return spy1.calls.length!=0;
        }, 2000);


        runs(function(){
            SB.ready(spy2);
            expect(spy2).toHaveBeenCalled();
        });

    });

    it('Should detect native DUID', function () {
        expect(SB.getNativeDUID()).not.toBe('');
    });

    it('Should detect platform', function () {
        $('body').prepend('<div style="color: #ffffff; background: #000000">' + navigator.userAgent + '</div>')
        expect(SB.platform).toBe('lg');
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

});