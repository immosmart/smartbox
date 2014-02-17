/**
 * Samsung platform
 */
!(function (window, undefined) {


    var
        document=window.document,
        /**
         * Native plugins
         * id: clsid (DOM element id : CLSID)
         * @type {{object}}
         */
            plugins = {
            audio: 'SAMSUNG-INFOLINK-AUDIO',
            pluginObjectTV: 'SAMSUNG-INFOLINK-TV',
            pluginObjectTVMW: 'SAMSUNG-INFOLINK-TVMW',
            pluginObjectNetwork: 'SAMSUNG-INFOLINK-NETWORK',
            pluginObjectNNavi: 'SAMSUNG-INFOLINK-NNAVI',
            pluginPlayer: 'SAMSUNG-INFOLINK-PLAYER'
        },
        samsungFiles = [
            '$MANAGER_WIDGET/Common/af/../webapi/1.0/deviceapis.js',
            '$MANAGER_WIDGET/Common/af/../webapi/1.0/serviceapis.js',
            '$MANAGER_WIDGET/Common/af/2.0.0/extlib/jquery.tmpl.js',
            '$MANAGER_WIDGET/Common/Define.js',
            '$MANAGER_WIDGET/Common/af/2.0.0/sf.min.js',
            '$MANAGER_WIDGET/Common/API/Widget.js',
            '$MANAGER_WIDGET/Common/API/TVKeyValue.js',
            '$MANAGER_WIDGET/Common/API/Plugin.js',
            'src/platforms/samsung/localstorage.js'
        ];


    SB.extend('samsung', {

        $plugins: {},
        platformUserAgent: 'maple',

        onDetect: function () {
            // non-standart inserting objects in DOM (i'm looking at you 2011 version)
            // in 2011 samsung smart tv's we can't add objects if document is ready

            var htmlString = '';
            for (var i = 0; i < samsungFiles.length; i++) {
                htmlString += '<script type="text/javascript" src="' + samsungFiles[i] + '"></script>';
            }
            for (var id in plugins) {
                htmlString += '<object id=' + id + ' border=0 classid="clsid:' + plugins[id] + '" style="opacity:0.0;background-color:#000000;width:0px;height:0px;"></object>';
            }
            document.write(htmlString);
        },


        getNativeDUID: function () {
            return this.$plugins.pluginObjectNNavi.GetDUID(this.getMac());
        },

        getMac: function () {
            return this.$plugins.pluginObjectNetwork.GetMAC();
        },

        getSDI: function () {
            this.SDI = this.SDIPlugin.Execute('GetSDI_ID');
            return this.SDI;
        },

        /**
         * Return hardware version for 2013 samsung only
         * @returns {*}
         */
        getHardwareVersion: function () {
            var version = this.firmware.match(/\d{4}/) || [];
            if (version[0] === '2013') {
                this.hardwareVersion = sf.core.sefplugin('Device').Execute('Firmware');
            } else {
                this.hardwareVersion = null;
            }
            return this.hardwareVersion;
        },

        setPlugins: function () {
            var self = this,
                tvKey;

            _.each(plugins, function (clsid, id) {
                self.$plugins[id] = document.getElementById(id);
            });

            this.$plugins.SDIPlugin = sf.core.sefplugin('ExternalWidgetInterface');
            this.$plugins.tvKey = new Common.API.TVKeyValue();

            var NNAVIPlugin = this.$plugins.pluginObjectNNavi,
                TVPlugin = this.$plugins.pluginObjectTV;

            this.modelCode = NNAVIPlugin.GetModelCode();
            this.firmware = NNAVIPlugin.GetFirmware();
            this.systemVersion = NNAVIPlugin.GetSystemVersion(0);
            this.productCode = TVPlugin.GetProductCode(1);

            this.pluginAPI = new Common.API.Plugin();
            this.widgetAPI = new Common.API.Widget();

            this.productType = TVPlugin.GetProductType();

            tvKey = new Common.API.TVKeyValue();

            this.setKeys();

            // enable standart volume indicator
            this.pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
            this.pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
            this.pluginAPI.unregistKey(tvKey.KEY_MUTE);
            this.widgetAPI.sendReadyEvent();

            this.volumeEnable();

            NNAVIPlugin.SetBannerState(2);
        },

        volumeEnable: function () {
            sf.service.setVolumeControl(true);
        },

        /**
         * Set keys for samsung platform
         */
        setKeys: function () {
            this.keys = _.foldl(sf.key, function (sum, val, key) {
                return sum[key.toLowerCase()] = val;
            }, {});

            document.body.onkeydown = function (event) {
                var keyCode = event.keyCode;

                switch (keyCode) {
                    case sf.key.RETURN:
                    case sf.key.EXIT:
                    case 147:
                    case 261:
                        sf.key.preventDefault();
                        break;
                    default:
                        break;
                }
            }

        },

        /**
         * Start screensaver
         * @param time
         */
        enableScreenSaver: function (time) {
            time = time || false;
            sf.service.setScreenSaver(true, time);
        },

        /**
         * Disable screensaver
         */
        disableScreenSaver: function () {
            sf.service.setScreenSaver(false);
        },

        exit: function () {
            sf.core.exit(false);
        },

        sendReturn: function () {
            sf.core.exit(true);
        },

        blockNavigation: function () {
            sf.key.preventDefault();
        }
    });

})(this);