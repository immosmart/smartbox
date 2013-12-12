describe('Platform', function () {

	it('Should detect platform', function () {
		SB.platforms.initialise();
		expect(SB.platforms.getPlatform()).not.toBe(null);
	});

});