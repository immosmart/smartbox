# Обзор

Плагин позволяет отобразить виртуальную клавиатуру на экране.

# Инициализация

SBKeyboard - jQuery плагин, который может быть вызван на любом jQuery элементе.
Первичная инициализация плагина произодится следующим образом:

        $(el).SBKeyboard(options);

        options = {
          // keyboard preset
          type: 'en',

          // enable num keyboard
          haveNumKeyboard: false,

          // first layout to show
          firstLayout: 'en'
        }

# Методы плагина

Метод может быть вызван после инициализации плагина

- Добавление другой клавиатуры к текущему элементу

        $(el).SBKeyboard('addKeyboard', options);
        options = {
          type: 'en',
          haveNumKeyboard: false,
          firstLayout: 'en'
        }

- Переключение активной клавиатуры(при наличии нескольких) на элементе

        $(el).SBKeyboard('changeKeyboard', type); // type из опций

# Раскладки плагина

В плагине имеются несколько определенных по умолчанию раскладок:

- en - английская раскладка
- ru - русская раскладка
- email - раскладка для набора email - адреса
- num - раскладка для цифр от 0 до 9
- fulltext_ru - раскладка английской и русской клавиатуры

# Добавление своей раскладки

Для добавление мультиязычной раскладки необходимо определить массив в объекте window.SB.keyboardPresets

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
- nums{{}}     - клавиша для переключению на цифровую клавиатуру
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
.kb-havenums  - имеется цифровая кливиатура

