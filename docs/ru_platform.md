# Platform


Device native methods are called through the base class. You can extend it and add your own new platform. After `SB.ready` a current platform has been defined already and is kept in `SB.currentPlatform`.

###Contents

<a href="#public-properies">`Public properies`</a>
* <a href="#sbcurrentplatformkeys">`SB.keys`</a>
* <a href="#sbcurrentplatformduid">`SB.DUID`</a>
* <a href="#sbconfigduid">`SB.config.DUID`</a>
* <a href="#sbcurrentplatformname">`SB.platformName`</a>

<a href="#new-platform-adding">`New platform adding`</a>

##Public properies

###`SB.currentPlatform.keys`

*Plain object*: hash containing keys codes and them names.

```js
SB.currentPlatform.keys.TOOLS; //=> 32
```


###`SB.currentPlatform.DUID`

*String*: contains a unique device ID

###`SB.config.DUID`

*String*: shows which method is used to get DUID for application. By default: `real`.

`real`: the method SB.Platform.getNativeDUID() is used

`mac`: the method device MAC-address is used, available for LG and Samsung,

`random`: a new DUID is generated each application starting

`[other value]`: will be used as DUID. For example:

```js
SB.config.DUID="fgsfds";
SB.ready(function(){
  SB.currentPlatform.DUID;//=> "fgsfds"
});
```


###`SB.currentPlatform.name`

*String*: platform name (samsung, lg, philips, etc...)


##New platform adding

You can add a new plaform creating the object `SB.Platform`.

```js
  var platform = new SB.Platform('philips'),
    platformObj;

  platformObj = {
    //TODO: override some methods
  };

  _.extend(platform, platformObj);
```
