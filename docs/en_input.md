# Overview

A plugin creates input aimed for a working with a TV remote control and a virtual keyboard. 

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

- hideKeyboard to hide a keyboard

        $(el).SBInput('hideKeyboard');

- changeKeyboard change current keyboard on input

        var keyboardOpt =  {
             type: 'fulltext_ru',
             firstLayout: 'ru'
         },
        $(el).SBInput('changeKeyboard', keyboardOpt);

- setText set text in input

        $(el).SBInput('setText', 'text in input');

# Cursor blinking

The cursor blinking implies the class adding up/deletion to the element cursor   

The class name is defined as: cursorClass + '_hidden'

# Text formatting in an input

If the function formatText is assigned in the options then it will be called after every printed symbol.
The function should return a text for the input. 


# Input events

 - 'keyboard_show'
 - 'keyboard_hide'
 - 'keyboard_cancel'
 - 'keyboard_complete'

# How to get to know the input's value?

After the input's initialisation on the element

        $(el).SBInput(options);

The value can be got to know for the element

        el.value;
        $(el).val();

