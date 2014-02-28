* [Документация на русском](README_RU.md)

# Demo
* <a href="http://immosmart.github.io/smartbox/demo/demoApp">Full demo with plugins</a>

# Overview

A smartbox library allows to start one application on a few smartTV platforms. 

Currently supported platforms: 
- Samsung SmartTv 2011+
- Lg SmartTv
- Philips 2012+
- <a href="http://wiki.infomir.eu/">STB Infomir MAG200/250</a> ([MAG200/250 How-to](docs/ru_mag.md)).

To add your own platform please see the platform [documentation](docs/en_platform.md).

# Initialization

Smartbox has three dependencies:
- <a href="https://github.com/jquery/jquery/tree/1.8-stable">jQuery(1.8.1+)</a>
- <a href="https://github.com/jashkenas/underscore">Underscore</a>(или <a href="https://github.com/lodash/lodash">lodash</a>)
- <a href="https://github.com/Wolfy87/EventEmitter">Event Emitter</a>( <a href="https://github.com/jashkenas/backbone">Backbone</a> или <a href="https://github.com/artempoletsky/Frontbone">Frontbone</a> ) for the player plugin

The compiled version of the library is located in the directory [`/dist`](dist).

# Library plugins

* [Platforms' methods](docs/en_platform.md)
* [Log console](docs/en_log.md)
* [Legend](docs/ru_legend.md)
* Navigation
    * [Initialization and methods](docs/en_nav.md)
    * [Algorithm](docs/en_nav_alg.md)
    * [Extended usage](docs/en_nav_extended.md)
* [Input fields](docs/en_input.md)
* [Keyboard(virtual)](docs/en_keyboard.md)
* [Voice management](docs/en_voice.md)
* Legend @todo_doc
* [Player](docs/en_player.md)

# How to use the library

To use all plugins and functions of the library it's necessary to wrap a code as callback SB.ready
        SB.ready(function(){
            // your code
        });

SB.ready will be executed after all callbacks jQuery.ready, $(function(){}), $.ready(function(){});

# Library's methods

- isInited() - checking the library initialization. Returns true or false

        SB.isInited();

- ready(func) executes the code of the funtion func after the library has been initializated

        SB.ready(function(){
            // your code
        });

- readyForPlatform(platform, cb) executes the code of the funtion func after the library has been initializated,
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



