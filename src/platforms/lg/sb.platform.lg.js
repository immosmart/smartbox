/**
 * LG platform
 */

SB.createPlatform('lg', {
    platformUserAgent: 'netcast',

    keys: {
        ENTER: 13,
        PAUSE: 19,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
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
        RED: 403,
        GREEN: 404,
        YELLOW: 405,
        BLUE: 406,
        RW: 412,
        STOP: 413,
        PLAY: 415,
        FF: 417,
        RETURN: 461,
        CH_UP: 33,
        CH_DOWN: 34
    },

    getNativeDUID: function () {
        return this.device.serialNumber;
    },

    getMac: function () {
        return this.device.net_macAddress.replace(/:/g, '');
    },

    getSDI: $.noop,

    setPlugins: function () {
        //this._listenGestureEvent();

        $('body').append('<object type="application/x-netcast-info" id="device" width="0" height="0"></object>');
        this.device = $('#device')[0];

        this.modelCode = this.device.version;
        this.productCode = this.device.modelName;

        this.getDUID();


        //Log.show('default');
        setInterval(function () {
            //Log.show('default');
            var usedMemorySize;
            if (window.NetCastGetUsedMemorySize) {
                usedMemorySize = window.NetCastGetUsedMemorySize();
            }
            //Log.state(Math.floor(usedMemorySize * 100 / (1024 * 1024)) / 100, 'memory', 'profiler');
        }, 5000);


        if (Player && Player.setPlugin) {
            Player.setPlugin();
        }
    },

    sendReturn: function () {
        if (Player) {
            Player.stop(true);
        }
        window.NetCastBack();
    },

    exit: function () {
        Player && Player.stop(true);
        window.NetCastExit();
    },

    getUsedMemory: function () {
        return window.NetCastGetUsedMemorySize();
    },
    getChildlockPin: function () {
        return 1234;
    }
});