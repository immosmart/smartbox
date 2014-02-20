/**
 * Philips platform
 */
SB.createPlatform('philips', {
    platformUserAgent: 'nettv',
    setPlugins: function () {
        this.keys = {
            ENTER: VK_ENTER,
            PAUSE: VK_PAUSE,
            LEFT: VK_LEFT,
            UP: VK_UP,
            RIGHT: VK_RIGHT,
            DOWN: VK_DOWN,
            N0: VK_0,
            N1: VK_1,
            N2: VK_2,
            N3: VK_3,
            N4: VK_4,
            N5: VK_5,
            N6: VK_6,
            N7: VK_7,
            N8: VK_8,
            N9: VK_9,
            RED: VK_RED,
            GREEN: VK_GREEN,
            YELLOW: VK_YELLOW,
            BLUE: VK_BLUE,
            RW: VK_REWIND,
            STOP: VK_STOP,
            PLAY: VK_PLAY,
            FF: VK_FAST_FWD,
            RETURN: VK_BACK,
            CH_UP: VK_PAGE_UP,
            CH_DOWN: VK_PAGE_DOWN
        };
    }
});