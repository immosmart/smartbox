describe('Voicelink', function () {

    var findItemWithText = function (jq, text) {
        return _.find(jq, function (elem) {
            return elem.innerHTML == text;
        })
    };


    describe('simple', function () {
        var $firstButton, spy;


        it('not fails', function () {
            $('<div id="voice_test"><a class="voicelink"  data-voice="Hello"></a><a class="voicelink" data-voice="World"></a></div>').appendTo('body').voiceLink();
            $firstButton = $('#emul_voice_helpbar').children().eq(0);
            spy = jasmine.createSpy('voice listener');
            $('#voice_test').children().eq(0).on('voice', spy);
        });


        it('supports enabled', function () {
            expect($$voice.enabled()).toBe(true);
        });

        it('generates buttons', function () {
            expect($firstButton.html()).toBe('Hello');
        });

        it('triggers `voice` event', function () {
            expect(spy.calls.length).toBe(0);
            $firstButton.click();
            expect(spy.calls.length).toBe(1);
        });

        it('supports pause', function () {
            $$voice.pause();
            $firstButton.click();
            expect(spy.calls.length).toBe(1);
        });

        it('supports resume', function () {
            $$voice.resume();
            $firstButton.click();
            expect(spy.calls.length).toBe(2);
        });

        it('supports say method', function () {
            $$voice.say('Hello');
            expect(spy.calls.length).toBe(3);
        });

        it('supports refresh', function(){
            $('#voice_test').children().eq(0).hide();

            expect(findItemWithText($('#emul_voice_helpbar').children(),'Hello')).toBeDefined();
            $$voice.refresh();
            expect(findItemWithText($('#emul_voice_helpbar').children(),'Hello')).toBeUndefined();
        });


    });


    describe('candidates', function () {
        var $firstButton, $secondButton, $thirdButton, spy, $helpItems, $bubble;




        it('not fails', function () {
            $('<div id="voice_test2">' +
                '<a class="voicelink"  data-voice="a"></a>' +
                '<a class="voicelink" data-voice="b"></a>' +
                '<a class="voicelink" data-voice="c"></a>' +
                '<a class="voicelink" data-voice-group="1" data-voice="d"></a>' +
                '<a class="voicelink" data-voice-group="1" data-voice="e"></a>' +
                '<a class="voicelink" data-voice="f"></a>' +
                '<a class="voicelink" data-voice-weight="600" data-voice="g"></a>' +
                '<a class="voicelink" data-voice-weight="500" data-voice="h"></a>' +
                '<a class="voicelink" data-voice-hidden="true" data-voice="i"></a>' +
                '<a class="voicelink" data-voice="j" style="display: none;"></a>' +
                '</div>').appendTo('body').voiceLink();

            $bubble = $('#voice_buble');
            $helpItems = $bubble.find('.voice_help_item');

            var $children = $('#emul_voice_helpbar').children();

            $$voice.setup({

            });

            $firstButton = $children.eq(0);
            $secondButton = $children.eq(1);
            $thirdButton = $children.eq(2);
            spy = jasmine.createSpy('voice listener');
            $('#voice_test').children().eq(0).on('voice', spy);
        });

        it('weight attribute sets the order of items', function () {
            expect($firstButton.html()).toEqual('g');
            expect($secondButton.html()).toEqual('h');
            expect($thirdButton.html()).toEqual('a');
        });

        it('has more button that shows help bar', function () {
            $('#emul_voice_helpbar').children().eq(5).click();
            expect($bubble.is(':visible')).toEqual(true);
            expect($helpItems.length).toBe(3);
        });

        it('supports grouping', function () {
            expect($bubble.find('.voice_group_head').eq(1).html()).toBe('1');
        });

        it('supports hidden attribute', function () {
            expect(findItemWithText($helpItems, 'i')).toBeUndefined();
            expect(findItemWithText($('.emul_voice_trigger'), 'i')).toBeDefined();
        });

        it('ignores invisible items', function () {
            expect(findItemWithText($helpItems, 'j')).toBe(undefined);
        });
    });


    it('supports server recognition', function () {
        var spy = jasmine.createSpy('server callback');
        $$voice.fromServer('Say some', spy);
        expect(spy).toHaveBeenCalled();
    });


});