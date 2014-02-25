# Обзор

Плагин создает input, предназначенный для работы с пультом дистанционного управления
и виртуальной клавиатурой

# Инициализация

SBInput - jQuery плагин, вызываемый на элементе input.
Первичная инициализация плагина произодится следующим образом:

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

# Методы плагина

Метод может быть вызван после инициализации плагина

- startBlink  старт мигания курсора

        $(el).SBInput('startBlink');

- stopBlink  остановить мигания курсора

        $(el).SBInput('stopBlink');

- showKeyboard отобразить клавиатуру

        $(el).SBInput('showKeyboard');

- hideKeyboard скрытие клавиатуры

        $(el).SBInput('hideKeyboard');

- changeKeyboard смена клавиатуры на элементе

        var keyboardOpt =  {
             type: 'fulltext_ru',
             firstLayout: 'ru'
         },
        $(el).SBInput('changeKeyboard', keyboardOpt);

- setText установка текста в инпут

        $(el).SBInput('setText', 'text in input');

# Мигание курсора

Мигание курсора подразумевает добавление/удаление класса к элементу cursor

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

