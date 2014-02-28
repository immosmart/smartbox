(function () {

  var stb;
  /**
   * Mag set top box platform description
   */
  SB.createPlatform('mag', {
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
      POWER: 85,
      //SMART: 36,
      PLAY: 82,
      STOP: 83,
      //PAUSE: 99,
      //SUBT: 76,
      INFO: 89
      //REC: 82
    },

    onDetect: function () {

      var isStandBy = false;

      stb = window.gSTB;

      // prohibition of keyboard showing on click keyboard button
      stb.EnableVKButton(false);

      window.moveTo(0, 0);
      window.resizeTo(1280, 720);

      SB(function () {
        var $body = $(document.body);
        $body.on('nav_key:power', function () {
          var eventName = 'standby_';
          isStandBy = !isStandBy;

          eventName += isStandBy ? 'set' : 'unset';
          stb.StandBy(isStandBy);

          // TODO: trigger events on SB
          $$log('trigger standby event ' + eventName, 'standby');
          $body.trigger(eventName);
        });
      });

      window.localStorage = {
        setItem: function ( name, data ) {
          if (typeof data === 'object') {
            data = JSON.stringify(data);
          }
          stb.SaveUserData(name, data);
        },
        clear: function () {

        },
        getItem: function (name) {
          return stb.LoadUserData(name);
        },
        removeItem: function (name) {
          stb.SaveUserData(name, null);
        }
      }
    },

    detect: function () {
      return !!window.gSTB;
    },

    exit: function () {
      $$log('try to location change');
      Player.stop(true);
      gSTB.DeinitPlayer();
      window.location = 'file:///home/web/services.html';
    },

    sendReturn: function () {
      this.exit();
    },

    getMac: function () {
      return stb.GetDeviceMacAddress();
    },

    getNativeDUID: function () {
      return stb.GetDeviceSerialNumber();
    }
  });

}());

