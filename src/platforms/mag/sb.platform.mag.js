/**
 * Browser platform description
 */
SB.extend('mag', {
    keys: {
        RIGHT: 39,
        LEFT: 37,
        DOWN: 40,
        UP: 38,
        RETURN: 8,
        EXIT: 27,
        TOOLS: 122,
        FF: 70,
        RW: 66,
        NEXT: 34,
        PREV: 33,
        ENTER: 13,
        RED: 112,
        GREEN: 113,
        YELLOW: 114,
        BLUE: 115,
        CH_UP: 9,
        CH_DOWN: 9,
        N0: 48,
        N1: 49,
        N2: 50,
        N3: 51,
        N4: 52,
        N5: 53,
        N6: 54,
        N7: 55,
        N8: 56,
        N9: 57,
        PRECH: 116,
        //SMART: 36,
        PLAY: 82,
        STOP: 83,
        //PAUSE: 99,
        //SUBT: 76,
        INFO: 89
        //REC: 82
    },

    detect: function () {
        return !!window.gSTB;
    },

    initialise: function () {
    },

    getNativeDUID: function () {

    },

    volumeUp: function () {
    },

    volumeDown: function () {
    },

    getVolume: function () {
    }
});
