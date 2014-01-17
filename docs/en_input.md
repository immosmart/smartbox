# Overview

A plugin creates input aimed for working with a TV remote control and a virtual keyboard. 

# Initialisation

SBInput - jQuery plugin called on the input element.
The first plugin initialisation can be done as written below:

        $(el).SBInput(options);

        options = {
            // virtual keyboard options
            keyboard: {
                type: 'fulltext_ru',
                firstLayout: 'ru'
            },

            /**
             * Format function(if needed)
             * @param text
             */
            formatText: function(text) {
                return text;
            },

            // element of existing keyboard for input
            bindKeyboard: null,

            // input template options
            input: {
                template: '<div class="smart_input-container">' +
                                        '<div class="smart_input-wrap">' +
                                            '<span class="smart_input-text"></span>' +
                                            '<span class="smart_input-cursor"></span>' +
                                        '</div>' +
                                    '</div>',

                // main container class
                elClass: 'smart_input-container',
                wrapperClass: 'smart_input-wrap',
                cursorClass: 'smart_input-cursor',
                textClass: 'smart_input-text'
            },

            // using native keyboard without virtual
            directKeyboardInput: true,

            // max symbols in input (0 if unlimited)
            max: 0,

            // next input element
            next: null
        }

# Plugin's methods

Method can be called after plugin initialisation


- startBlink  the start of a cursor blinking 

        $(el).SBInput('startBlink');

- stopBlink  to stop a cursor blinking

        $(el).SBInput('stopBlink');

- showKeyboard to display a keyboard

        $(el).SBInput('showKeyboard');

# Cursor blinking

The cursor blinking implies the class adding up/deletion to the element cursor   

Имя класса определяется следующим образом cursorClass + '_hidden'

# Форматирование текста в инпуте

Если в опциях передана функция formatText, она будет вызываться после каждого ввода символа.
Функция должна возвращать текст для инпута

# События инпута

 - 'keyboard_show'
 - 'keyboard_hide'
 - 'keyboard_cancel'
 - 'keyboard_complete'

# Как узнать значение инпута?

После инициализаци инпута на элементе

        $(el).SBInput(options);

Значение можно узнать из элемента

        el.value;
        $(el).val();

