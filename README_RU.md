* [English documentation](README.md)

# Демо
* <a href="http://immosmart.github.io/smartbox/demo/demoApp">Полное демо с плагинами</a>

# Обзор

Библиотека smartbox позволяет запускать одно приложение на нескольких платформах.
На данный момент поддерживаются платформы:
- Samsung SmartTv 2011+,
- Lg SmartTv,
- Philips 2012+,
- <a href="http://wiki.infomir.eu/">STB Infomir MAG200/250</a> ([MAG200/250 How-to](docs/ru_mag.md)).

Для добавления своей платформы смотрите [документацию по платформам](docs/ru_platform.md)

# Инициализация

Smartbox имеет три зависимости:
- <a href="https://github.com/jquery/jquery/tree/1.8-stable">jQuery(1.8.1+)</a>
- <a href="https://github.com/jashkenas/underscore">Underscore</a>(или <a href="https://github.com/lodash/lodash">lodash</a>)
- <a href="https://github.com/Wolfy87/EventEmitter">Event Emitter</a>( <a href="https://github.com/jashkenas/backbone">Backbone</a> или <a href="https://github.com/artempoletsky/Frontbone">Frontbone</a> ) для плагина плеера

Собранная версия библиотеки находится в директории [`/dist`](dist).

# Плагины библиотеки

* [Методы отдельных платформ](docs/ru_platform.md)
* [Консоль Лог](docs/ru_log.md)
* [Легенда](docs/ru_legend.md)
* Навигация
    * [Инициализация и методы](docs/ru_nav.md)
    * [Алгоритм](docs/ru_nav_alg.md)
    * [Продвинутое использование](docs/ru_nav_extended.md)
* [Поля ввода](docs/ru_input.md)
* [Клавиатура(виртуальная)](docs/ru_keyboard.md)
* [Голосовое управление](docs/ru_voice.md)
* Абстракция LocalStorage (хранение данных на клиентском устройстве) @todo_doc
* [Плеер](docs/ru_player.md)

# Как пользоваться библиотекой

Для использования всех плагинов и функций библиотеки необходимо оборачивать код как callback SB.ready
Также можно передавать коллбек в функцию SB()

        SB.ready(function(){
            // your code
        });

то же самое, что и

        SB(function(){
           // your code
        });

SB.ready будет выполнен после всех коллбеков jQuery.ready, $(function(){}), $.ready(function(){});

# Методы бибилиотеки

- isInited() проверка инициализации библиотеки. Возвращает true или false

        SB.isInited();

- ready(func) выполняет код функции func после инициализации библиотеки

        SB.ready(function(){
            // your code
        });

- readyForPlatform(platform, cb) выполняет код функции func после инициализации библиотеки,
если текущая платформа - platform

        SB.readyForPlatform('samsung', function(){
            // code for samsung
        });

также можно использовать функцию SB()

        SB('samsung', function(){
            // code for samsung
        })

# Конфигурирование библиотеки

Все конфигурации библиотеки находятся в объекте SB.config

            SB.config = {}

## `SB.config.DUID`

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

# Автотесты
<a href="http://immosmart.github.io/smartbox/">Запуск автотестов Jasmine</a>

# Посты о Smartbox
* <a href="http://habrahabr.ru/post/211236//">Habr: Библиотека SmartBox для Samsung, LG, Philips и других</a>
* <a href="http://habrahabr.ru/post/188294/">Habr: Создание кроссплатформенного Smart TV приложения на базе библиотеки SmartBox</a>
