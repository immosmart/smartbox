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

Для добавления простой раскладки необходимо определить функцию в объекте window.SB.keyboardPresets, которая
будет возвращать массив

        window.SB.keyboardPresets[keyboardLayout] = function(){
            return [
                  // first keyboard row
                  ['q','w','e','r','t','y','u','i','o','p'],
                  // second keyboard row
                  ['a','s','d','f','g','h','j','k','l'],
            ]
        };

В раскладке необходимо определить следующие клавиши

- lang{{}}     - клавиша смены раскладки
- nums{{}}     - клавиша для переключению на цифровую клавиатуру(если в списке раскладок присутствует fullnum)
- space{{}}    - клавиша пробела
- complete{{}} - окончание ввода

Клавиши, которые могут быть определены по желанию

- shift{{}}     - делает буквы прописными
- backspace{{}} - генерация события 'backspace'(пр. для удаления одного символа)
- delall{{}}    - генерация события 'delall'(пр. для очистки строки)

Все клавиши определяются следующим образом

keyName{{keyText}}, keyText - html или текст внутри контейнера клавиши

Примеры использования:

        backspace{{<i class="backspace_icon"></i>}}
        lang{{ru}}
        nums{{123}}

Пример полной раскладки

        window.SB.keyboardPresets.en = function () {
            return [
              'qwertyuiop'.split(''),
              'asdfghjkl'.split('').concat(['backspace{{<i class="backspace_icon"></i>}}']),
              ['shift{{<i class="shift_icon"></i>Shift}}'].concat('zxcvbnm'.split('')).concat(
                ['delall{{<span>Del<br/>all</span>}}']),
              ['lang{{en}}', 'nums{{123}}', 'space{{}}', 'complete{{Complete}}']
            ];
        };

# События клавиатуры

 - 'type' событие ввода клавиши, клавиша определена в свойстве letter события

        var typeLetter = function(event) {
            console.log(event.letter);
        }

 - 'backspace'
 - 'delall'
 - 'complete'

# CSS классы

.kb-multilang  - имеются несколько языковых раскладок
.kb-havenums   - имеется цифровая кливиатура

