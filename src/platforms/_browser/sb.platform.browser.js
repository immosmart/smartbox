/**
 * Browser platform description
 */
SB.createPlatform('browser', {
    keys: {
        RIGHT: 39,
        LEFT: 37,
        DOWN: 40,
        UP: 38,
        RETURN: 27,//esc
        EXIT: 46,//delete
        TOOLS: 32,//space
        FF: 33,//page up
        RW: 34,//page down
        NEXT: 107,//num+
        PREV: 109,//num-
        ENTER: 13,
        RED: 65,//A
        GREEN: 66,//B
        YELLOW: 67,//C
        BLUE: 68,//D
        CH_UP: 221, // ]
        CH_DOWN: 219, // [
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
        PRECH: 45,//ins
        SMART: 36,//home
        PLAY: 97,//numpad 1
        STOP: 98,//numpad 2
        PAUSE: 99,//numpad 3
        SUBT: 76,//l,
        INFO: 73,//i
        REC: 82//r
    },

    detect: function () {
        // always true for browser platform
        return true;
    },

    getNativeDUID: function () {
        if (navigator.userAgent.indexOf('Chrome') != -1) {
            this.DUID = 'CHROMEISFINETOO';
        } else {
            this.DUID = 'FIREFOXISBEST';
        }
        return this.DUID;
    },

    setData: function (name, val) {
        // save data in string format
        localStorage.setItem(name, JSON.stringify(val));
    },

    getData: function (name) {
        var result;
        try {
            result = JSON.parse(localStorage.getItem(name));
        } catch (e) {}

        return result;
    },

    removeData: function (name) {
        localStorage.removeItem(name);
    }
});
