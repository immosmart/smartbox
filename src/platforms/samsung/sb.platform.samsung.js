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
            //pluginPlayer: 'SAMSUNG-INFOLINK-PLAYER'
        },
        samsungFiles = [
            '$MANAGER_WIDGET/Common/af/../webapi/1.0/deviceapis.js',
            '$MANAGER_WIDGET/Common/af/../webapi/1.0/serviceapis.js',
            '$MANAGER_WIDGET/Common/af/2.0.0/extlib/jquery.tmpl.js',
            '$MANAGER_WIDGET/Common/Define.js',
            '$MANAGER_WIDGET/Common/af/2.0.0/sf.min.js',
            '$MANAGER_WIDGET/Common/API/Plugin.js',
            '$MANAGER_WIDGET/Common/API/Widget.js',
            '$MANAGER_WIDGET/Common/API/TVKeyValue.js'
        ];

    SB.createPlatform('samsung', {

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
            this.SDI = this.$plugins.SDIPlugin.Execute('GetSDI_ID');
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
            PL_NNAVI_STATE_BANNER_NONE = 0,
            PL_NNAVI_STATE_BANNER_VOL = 1,
            PL_NNAVI_STATE_BANNER_VOL_CH = 2,
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

            tvKey = new Common.API.TVKeyValue();
            this.productType = TVPlugin.GetProductType();

            this.setKeys();

            if(this.pluginAPI.SetBannerState){
              NNAVIPlugin.SetBannerState(PL_NNAVI_STATE_BANNER_VOL_CH);
            }

            function unregisterKey(key){
              try{
                self.pluginAPI.unregistKey(tvKey['KEY_'+key]);
              }catch(e){
                $$error(e);
              }
            }

            if (!this.config.customVolumeEnable) {
              unregisterKey('VOL_UP');
              unregisterKey('VOL_DOWN');
              unregisterKey('MUTE');
            }

            this.widgetAPI.sendReadyEvent();
        },

        /**
         * Set keys for samsung platform
         */
        setKeys: function () {

          this.keys = sf.key;

          this.keys['RW'] = 69;

          document.body.onkeydown = function ( event ) {
            var keyCode = event.keyCode;
            $$log('keyDown ' + keyCode);

            switch ( keyCode ) {
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
            sf.core.exit(true);
        },

        sendReturn: function () {
            sf.core.exit(false);
        },

        blockNavigation: function () {
            sf.key.preventDefault();
        },
      volumeAddStep: 5,
      volumeAdd: function (num) {
        var $audio = this.$plugins.audio,
          outputDevice = $audio.GetOutputDevice(),
          volume, i;

        if (outputDevice == 3 || this.productType == 2) {
          return;
        }

        var key = num < 0 ? 1 : 0;//если меньше 0 убавляем громкость
        num = Math.abs(num);
        for (i = 0; i < num; i++) {
          $audio.SetVolumeWithKey(key);
        }
        volume = this.getVolume();
        $(document.body).trigger('volume_change', {
          volume: volume
        });
      },
      toggleMute: function () {
        var $audio = this.$plugins.audio,
          volume, $body = $(document.body);
        if (this.isMute) {
          $audio.SetUserMute(0);
          volume = this.getVolume();

          if (volume === 0) {
            this.volumeUp(5);
          } else {
            $body.trigger('volume_change', {
              volume: volume
            });
          }
          this.isMute = false;
        } else {
          if (!this.isMute) {
            $audio.SetUserMute(1);

            this.getVolume({
              mute: true
            });

            $body.trigger('volume_change', {
              volume: 0
            });
            this.isMute = true;
          }
        }
      },
      volumeDown: function (step) {
        step = step || -this.volumeAddStep;
        this.volumeAdd(-step);
      },
      volumeUp: function (step) {
        step = step || this.volumeAddStep;
        this.volumeAdd(step);
      },
      getVolume: function (options) {
        options = options || {};
        var $audio = this.$plugins.audio,
          volume = $audio.GetVolume(),
          $body = $(document.body);

        if (volume == 0 || options.mute) {
          if (!this.isMute) {
            $body.addClass('mute').trigger('volume_mute');
            this.isMute = true;
          }
        } else if (this.isMute) {
          $body.removeClass('mute').trigger('volume_unmute');
          this.isMute = false;
        }
        return volume;
      }
    });

})(this);