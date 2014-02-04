# Demo
* <a href="http://immosmart.github.io/smartbox/demo/demoApp">Full demo with plugins</a>

# Overview

A smartbox library allows to start one application on a few smartTV platforms. 

Currently supported platforms: 
- Samsung SmartTv 2011+
- Lg SmartTv
- Philips 2012+

To add your own platform please see the platform <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_platform.md">documentation</a>

# Initialisation

Smartbox has three dependencies:
- <a href="https://github.com/jquery/jquery/tree/1.8-stable">jQuery(1.8.1+)</a>
- <a href="https://github.com/jashkenas/underscore">Underscore</a>(или <a href="https://github.com/lodash/lodash">lodash</a>)
- <a href="https://github.com/Wolfy87/EventEmitter">Event Emitter</a>( <a href="https://github.com/jashkenas/backbone">Backbone</a> или <a href="https://github.com/artempoletsky/Frontbone">Frontbone</a> ) for the player plugin

Собранная версия библиотеки находится в папке <a href="https://github.com/immosmart/smartbox/tree/master/dist">`/dist`</a>

# Плагины библиотеки


* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_platform.md">Методы отдельных платформ</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_log.md">Консоль Лог</a>
* Навигация
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_nav.md">Инициализация и методы</a>
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_nav_alg.md">Алгоритм</a>
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_nav_extended.md">Продвинутое использование</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_input.md">Поля ввода</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_keyboard.md">Клавиатура(виртуальная)</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_voice.md">Голосовое управление</a>
* Легенда @todo_doc
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/ru_player.md">Плеер</a>

# Как пользоваться библиотекой

Для использования всех плагинов и функций библиотеки необходимо оборачивать код как callback SB.ready

        SB.ready(function(){
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

# Конфигурирование библиотеки

Все конфигурации библиотеки находятся в объекте SB.platform

            SB.config = {
              /**
               * Платформа, которая будет использоваться в случае, когда detectPlatform вернул false
               * ex: browser, samsung, lg
               * @type: {String}
               */
              defaultPlatform: 'browser'
            }

# Автотесты
<a href="http://immosmart.github.io/smartbox/">Запуск автотестов Jasmine</a>



