# Платформа

Все методы платформы вызывается через SB.methodName
Название платформы хранится в SB.platformName

# Свойства и методы

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
* <a href="#_addplatform">`Добавление своей платформы`</a>



### <a id="_platformName"></a> `SB.platformName`

*String*: название платформы(browser/samsung/mag/philips/lg)


### <a id="_keys"></a> `SB.keys`

*Plain object*: хэш, содержащий названия и коды клавиш

#### Стандартные названия клавиш

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

*String* уникальная строка, которая проверяется на вхождение в userAgent запущенной среды

#### Пример

    SB.platformUserAgent === 'netcast'; // for philips
    SB.platformUserAgent === 'maple';   // for samsung



### <a id="_getDUID"></a> `SB.getDUID`

*Function* возвращает DUID устройства, в зависимости от параметра SB.config.DUID

#### Returns

*String* DUID



### <a id="_getNativeDUID"></a> `SB.getNativeDUID`

*Function* возвращает внутренний DUID устройства при наличии

#### Returns

*String* DUID устройства или пустая строка



### <a id="_getSDI"></a> `SB.getSDI`

*Function* возвращает SDI устройства при наличии

#### Returns

*String* SDI устройства или пустая строка



### <a id="_getRandomDUID"></a> `SB.getRandomDUID`

*Function* возвращает сгенерированный DUID устройства

#### Returns

*String* DUID, например: "1446dcfb2ca1091"



### <a id="_getMac"></a> `SB.getMac`

*Function* возвращает MAC устройства при наличии

#### Returns

*String* MAC или пустая строка



### <a id="_setPlugins"></a> `SB.setPlugins`

*Function* инициализация и запуск плагинов, специфичных для платформы
Функция вызывается автоматически при инициализации библиотеки



### <a id="_setData"></a> `SB.setData(name, value)`

*Function* сохранение информации в локальном хранилище платформы

#### Arguments

1. `name` *String* Название параметра
2. `value` *(&#42;)* Значение параметра



### <a id="_getData"></a> `SB.getData(name)`

*Function* возвращает значение из локального хранилища

#### Arguments

1. `name` *String* Название параметра

#### Returns

*(&#42;)* Значение параметра



### <a id="_removeData"></a> `SB.removeData(name)`

*Function* удаление параметра и значения из локального хранилища

#### Arguments

1. `name` *String* Название параметра для удаления



## <a id="_addplatform"></a> `Добавление своей платформы`

Для добавления своей платформы необходимо воспользоваться функцией SB.createPlatform

```
var platformName = 'myPlatform';
SB.createPlatform(platformName, {
    //функции платформы
});
```


