# Overview

The plugin allows to show a virtual keyboard on the screen.

# Initialisation

SBKeyboard - jQuery plugin which can be called on any jQuery element.
The first plugin initialisation occurs in the following way:

        $(el).SBKeyboard(options);

        options = {
          // keyboard preset
          type: 'en',

          // first layout to show
          firstLayout: 'en'
        }

# Plugin's methods

The method can be called after plugin has been initialisated. 

- Adding another keyboard to the current element

        $(el).SBKeyboard('addKeyboard', options);
        options = {
          type: 'en',
          firstLayout: 'en'
        }

- Switching active keyboard (if some exists) on the element 

        $(el).SBKeyboard('changeKeyboard', type); // type from the options

# Plugin layouts

The plugin contains some layouts by default:

- en - english layout
- ru - russian layout
- email - layout to enter email-address
- num - numeric (0-9) layout
- fulltext_ru - english and russian keyboard layout

# Custom layout adding

To add multilang layout the array should be defined in the object window.SB.keyboardPresets

        window.SB.keyboardPresets[multiKeyboardLayout] = ['en', 'ru'];

To add a common layout the function returning the array should be defined in the object window.SB.keyboardPresets

        window.SB.keyboardPresets[keyboardLayout] = function(){
            return [
                  // first keyboard row
                  ['q','w','e','r','t','y','u','i','o','p'],
                  // second keyboard row
                  ['a','s','d','f','g','h','j','k','l'],
            ]
        };

Next keys should be defined in the layout: 

- lang{{}}     - the key of layout changing
- nums{{}}     - the key for swithing to the numeric keyboard (if fullnun exists in the layout list)
- space{{}}    - the space key
- complete{{}} - entering finish

Keys that can be defined by request 

- shift{{}}     - Capitalise letters 
- backspace{{}} - event generating 'backspace'(ex. for one symbol deleting)
- delall{{}}    - event generating 'delall'(ex. for a string erase)

All keys are defined in the following way:

keyName{{keyText}}, keyText - html or a text inside the key's container 

Usage example:

        backspace{{<i class="backspace_icon"></i>}}
        lang{{ru}}
        nums{{123}}

Full layout example

        window.SB.keyboardPresets.en = function () {
            return [
              'qwertyuiop'.split(''),
              'asdfghjkl'.split('').concat(['backspace{{<i class="backspace_icon"></i>}}']),
              ['shift{{<i class="shift_icon"></i>Shift}}'].concat('zxcvbnm'.split('')).concat(
                ['delall{{<span>Del<br/>all</span>}}']),
              ['lang{{en}}', 'nums{{123}}', 'space{{}}', 'complete{{Complete}}']
            ];
        };

# Keyboard events

 - 'type' key entering event, the key is defined in the attribute: letter event

        var typeLetter = function(event) {
            console.log(event.letter);
        }

 - 'backspace'
 - 'delall'
 - 'complete'

# CSS classes

.kb-multilang  - Some language layouts exist
.kb-havenums   - Numeric keyboard exists

