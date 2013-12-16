describe('Platform', function () {

	beforeEach(function () {
		runs(function() {
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

	it('Should detect samsung', function () {
		expect(SB.platforms.getCurrentPlatform().name).toBe('samsung');
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