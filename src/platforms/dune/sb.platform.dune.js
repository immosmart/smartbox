(function () {

  var stb;
  /**
   * Dune set top box platform description
   */
  SB.createPlatform('dune', {
    keys: {
      RIGHT: 39,
      LEFT: 37,
      DOWN: 40,
      UP: 38,
      RETURN: 8,
      EXIT: 27,
      TOOLS: 122,
      FF: 205,
      RW: 204,
      NEXT: 176,
      PREV: 177,
      ENTER: 13,
      RED: 193,
      GREEN: 194,
      YELLOW: 195,
      BLUE: 196,
      CH_UP: 33,
      CH_DOWN: 34,
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
      //PRECH: 116,
      //POWER: 85,
      //SMART: 36,
      PLAY: 218,
      STOP: 178,
      DUNE: 209,
      //PAUSE: 99,
      //SUBT: 76,
      INFO: 199
      //REC: 82
    },

    onDetect: function () {

      var isStandBy = false;

      // prohibition of keyboard showing on click keyboard button
      //stb.EnableVKButton(false);

      // window.moveTo(0, 0);
      // window.resizeTo(1280, 720);

      SB(function () {
        var $body = $(document.body);
        
        stb = this.createDunePlugin();

        if (stb) {
          stb.init();
        }else{
          $$log('unable to init stb');
        }

        $body.on('nav_key:dune', function () {
          if (stb) stb.launchNativeUi();
        });
      });
    
    },

    createDunePlugin: function () {
      try {
        var parentNode = document.getElementsByTagName("body")[0];
        console.log(parentNode);
        var obj = document.createElement("div");
        obj.innerHTML = '<object type="application/x-dune-stb-api" style="visibility: hidden; width: 0px; height: 0px;"></object>';
        parentNode.appendChild(obj);
        return obj.getElementsByTagName("object")[0];
      } catch (e) {
        return undefined;
      }
    },

    detect: function () {
      return !!stb;
    },

    exit: function () {
      $$log('try to location change');
      Player.stop(true);
      if (stb){
        stb.launchNativeUi();
      }
    },

    sendReturn: function () {
      this.exit();
    },

    getMac: function () {
      return stb.getMacAddress();
    },

    getNativeDUID: function () {
      return stb.getSerialNumber();
    }
  });

}());

