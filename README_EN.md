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

The compiled version of the library is located in the folder <a href="https://github.com/immosmart/smartbox/tree/master/dist">`/dist`</a>

# Library plugins

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

* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_platform.md">Platforms' methods</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_log.md">Log console</a>
* Navigation
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_nav.md">Initialisation and methods</a>
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_nav_alg.md">Algorithm</a>
    * <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_nav_extended.md">Extended usage</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_input.md">Input fields</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_keyboard.md">Keyboard(virtual)</a>
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_voice.md">Voice management</a>
* Legend @todo_doc
* <a href="https://github.com/immosmart/smartbox/blob/master/docs/en_player.md">Player</a>

# How to use the library

To use all plugins and functions of the library it's necessary to wrap a code as callback SB.ready
        SB.ready(function(){
            // your code
        });

SB.ready will be executed after all callbacks jQuery.ready, $(function(){}), $.ready(function(){});

# Library's methods

- isInited() - checking the library initialisation. Returns true or false

        SB.isInited();

- ready(func) executes the code of the funtion func after the library has been initialisated

        SB.ready(function(){
            // your code
        });

- readyForPlatform(platform, cb) executes the code of the funtion func after the library has been initialisated,
if the current plaform - platform

        SB.readyForPlatform('samsung', function(){
            // code for samsung
        });

# Library configuration

All configurations of the library are located in the object SB.platform

            SB.config = {
              /**
               * Platform which will be used in case detectPlatform returns false
               * ex: browser, samsung, lg
               * @type: {String}
               */
              defaultPlatform: 'browser'
            }

# Autotests
<a href="http://immosmart.github.io/smartbox/">Jasmine autotest start</a>



