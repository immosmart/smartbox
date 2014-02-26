# Платформа

Все методы платформы вызывается через SB.methodName
Название платформы хранится в SB.platformName

# Свойства и методы

<a href="#public-properies">`Public properies`</a>
* <a href="#sbcurrentplatformkeys">`SB.keys`</a>
* <a href="#sbcurrentplatformduid">`SB.DUID`</a>
* <a href="#sbconfigduid">`SB.config.DUID`</a>
* <a href="#sbcurrentplatformname">`SB.platformName`</a>

<a href="#new-platform-adding">`New platform adding`</a>



### SB.platformName

*String*: название платформы(browser/samsung/mag/philips/lg)


### SB.keys

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



### SB.platformUserAgent

*String* уникальная строка, которая проверяется на вхождение в userAgent запущенной среды

#### Пример

    SB.platformUserAgent === 'netcast'; // for philips
    SB.platformUserAgent === 'maple';   // for samsung



### SB.getDUID

*Function* возвращает DUID устройства, в зависимости от параметра SB.config.DUID

#### Returns

*String* DUID



### SB.getNativeDUID

*Function* возвращает внутренний DUID устройства при наличии

#### Returns

*String* DUID устройства или пустая строка



### SB.getSDI

*Function* возвращает SDI устройства при наличии

#### Returns

*String* SDI устройства или пустая строка



### SB.getRandomDUID

*Function* возвращает сгенерированный DUID устройства

#### Returns

*String* DUID, например: "1446dcfb2ca1091"



### SB.getMac

*Function* возвращает MAC устройства при наличии

#### Returns

*String* MAC или пустая строка



### SB.setPlugins

*Function* инициализация и запуск плагинов, специфичных для платформы
Функция вызывается автоматически при инициализации библиотеки



### SB.setData(name, value)

*Function* сохранение информации в локальном хранилище платформы

#### Arguments

1. `name` *String* Название параметра
2. `value` *(&#42;)* Значение параметра



### SB.getData(name)

*Function* возвращает значение из локального хранилища

#### Arguments

1. `name` *String* Название параметра

#### Returns

*(&#42;)* Значение параметра



### SB.removeData(name)

*Function* удаление параметра и значения из локального хранилища

#### Arguments

1. `name` *String* Название параметра для удаления



## Добавление своей платформы

Для добавления своей платформы необходимо воспользоваться функцией SB.createPlatform

```
var platformName = 'myPlatform';
SB.createPlatform(platformName, {
    //функции платформы
});
```


