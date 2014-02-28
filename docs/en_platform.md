# Platform

Device native methods are called through the base `SB` object. You can extend it and add your own new platform.
After `SB.ready` a current platform has been already defined and is  kept in `SB`.

# Properties and methods

* <a href="#_platformName">`SB.platformName`</a>
* <a href="#_keys">`SB.keys`</a>
* <a href="#_platformUserAgent">`SB.platformUserAgent`</a>
* <a href="#_getDUID">`SB.getDUID`</a>
* <a href="#_getNativeDUID">`SB.getNativeDUID`</a>
* <a href="#_getSDI">`SB.getSDI`</a>
* <a href="#_getRandomDUID">`SB.getRandomDUID`</a>
* <a href="#_getMac">`SB.getMac`</a>
* <a href="#_setPlugins">`SB.setPlugins`</a>
* <a href="#_setData">`SB.setData(name, value)`</a>
* <a href="#_getData">`SB.getData(name)`</a>
* <a href="#_removeData">`SB.removeData(name)`</a>
* <a href="#_addplatform">`New platform adding`</a>



### <a id="_platformName"></a> `SB.platformName`

*String*: platform name (samsung, lg, philips, etc...)


### <a id="_keys"></a> `SB.keys`

*Plain object*: hash containing keys codes and them names.

#### Default key names

        BLUE
        CH_DOWN
        CH_UP
        DOWN
        ENTER
        EXIT
        FF
        GREEN
        INFO
        LEFT
        N0
        N1
        N2
        N3
        N4
        N5
        N6
        N7
        N8
        N9
        NEXT
        PAUSE
        PLAY
        PRECH
        PREV
        REC
        RED
        RETURN
        RIGHT
        RW
        SMART
        STOP
        SUBT
        TOOLS
        UP
        YELLOW



### <a id="_platformUserAgent"></a> `SB.platformUserAgent`

*String* unique string for platform. It's compare with environment userAgent in `SB.detect` method

#### Example

    SB.platformUserAgent === 'netcast'; // for philips
    SB.platformUserAgent === 'maple';   // for samsung



### <a id="_getDUID"></a> `SB.getDUID`

*Function* return platform DUID in case of SB.config.DUID

#### Returns

*String* DUID



### <a id="_getNativeDUID"></a> `SB.getNativeDUID`

*Function* return native DUID if exist

#### Returns

*String* DUID or empty string



### <a id="_getSDI"></a> `SB.getSDI`

*Function* return platform SDI if exist

#### Returns

*String* SDI or empty string



### <a id="_getRandomDUID"></a> `SB.getRandomDUID`

*Function* return random DUID

#### Returns

*String* generated DUID, for example: "1446dcfb2ca1091"



### <a id="_getMac"></a> `SB.getMac`

*Function* return platform MAC if exist

#### Returns

*String* MAC or empty string



### <a id="_setPlugins"></a> `SB.setPlugins`

*Function* initialize & start plugins specific for platform
function calls automatically with smartbox initialization



### <a id="_setData"></a> `SB.setData(name, value)`

*Function* save data in platform storage

#### Arguments

1. `name` *String* data name
2. `value` *(&#42;)* data value



### <a id="_getData"></a> `SB.getData(name)`

*Function* return value from platform storage

#### Arguments

1. `name` *String* data name

#### Returns

*(&#42;)* data value



### <a id="_removeData"></a> `SB.removeData(name)`

*Function* remove data from platform storage

#### Arguments

1. `name` *String* data name



## <a id="_addplatform"></a> `New platform adding`

You can add a new plaform using function  SB.createPlatform(platformName, cb)

```
var platformName = 'myPlatform';
SB.createPlatform(platformName, {
    //platform methods
});
```


