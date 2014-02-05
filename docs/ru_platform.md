# Platform

Базовый класс через который вызываются нативные методы устройства. Вы можете расширить его и добавить свою новую платформу.

###Оглавление

<a href="#Публичные-свойства">`Публичные свойства`</a>
* <a href="#sbcurrentplatformkeys">`SB.currentPlatform.keys`</a>
* <a href="#sbcurrentplatformduid">`SB.currentPlatform.DUID`</a>
* <a href="#sbconfigduid">`SB.config.DUID`</a>
* <a href="#sbcurrentplatformname">`SB.currentPlatform.name`</a>

 
##Публичные свойства

###`SB.currentPlatform.keys`

*Plain object*: хеш, содержащий коды клавиш и их названия. 

```js
SB.currentPlatform.keys.TOOLS; //=> 32
```


###`SB.currentPlatform.DUID`

*String*: содержит уникальный ID устройства

###`SB.config.DUID` 

*String*: настройка которая показывает каким способом приложение будет получать DUID. Значение по умолчанию: `real`.

`real`: используется метод SB.Platform.getNativeDUID()

`mac`: используется метод MAC адрес устройства, доступно для LG и Samsung,

`random`: при каждом запуске приложения будет сгенерирован новый DUID

`[Другое значение]`: будет использовано в качестве DUID. Например: 

```js
SB.config.DUID="fgsfds";
SB.ready(function(){
  SB.currentPlatform.DUID;//=> "fgsfds"
});
```


###`SB.currentPlatform.name`

*String*: название платформы (samsung, lg, philips, etc...)
