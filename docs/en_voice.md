# Voicelink

jQuery plugin for working with Smart TV voice management.

The principle of operation: A phrase which the user should say is set on the elements with the defined class `voicelink` in the attribute `data-voice`. The plugin generates voice management native helpbar and adds a bar with remain commands in the body, it can be called with the phrase "More". (The phrase can be changed with the plugin adjustment)
The voice management is emulated in a browser by the plugin generating an additional block with buttons and available phrases.

## Example


A user says "Back" - the element `#backVoiceLink` sends the event `voice`


html:
```
<div id="backVoiceLink" class="voicelink" data-voice="Назад" data-voice-group="Навигация"></div>
```

js:
```
SB.ready(function(){
    $('#scene').voiceLink();
    $('#backVoiceLink').bind('voice', function(){
       //юзер сказал "Назад"
    });
});
```

## Attributes

### data-voice="[word]"

The mandatory attribute is a hint in the Samsung's helpbar or in the "bubble"
Note: "Bubble" is a block with grouped hints

### data-voice-group="[group_name]"

The optional attribute is a group for the hint. If the group exists then the element is shown in the bubble, if not - in the Samsung's helpbar.


### data-voice-hidden="[true]"

опциональный атрибут - показывает что слово произнести можно, но подсказка не будет нигде отображаться.
Поведение зависит только от того пустое значение или нет, т.к. в 11 тв нет возможности сохранять $().data().
Пример

```
data-voice-hidden="true" = data-voice-hidden="abc" = data-voice-hidden="1" = data-voice-hidden="false" = true
data-voice-hidden="" = false
```


### data-voice-force-visible="[true]"

Показывает элемент в хелпбаре, даже если он скрыт и useHidden=false



### Настройки

В хэше options можно задавать класс селектор для голосовых ссылок.
```
options={
  selector: '.voicelink',//селектор для поиска
  moreText: 'More',//текст для показа "пузыря"
  eventName: 'voice',//событие которое отправляет элемент
  useHidden: false//фильтровать невидимые ссылки
}

$('#scene').voiceLink(options);
```

`options` можно не задавать тогда настройки встанут по умолчанию, какие описаны выше

```
$('#scene').voiceLink();
```

```
$$voice.setup(newDefaults);//задает новые умолчания
```

## Методы

### $$voice.say(phrase);

Эмулирует произнесение фразы.

### $$voice.enabled();

Определяет поддерживается ли голосове управление устройством. Возвращает boolean

### $$voice.setup(options);

Задает умолчания, в options - хэш настроек

### $$voice.save();

Сохраняет текущее состояние (контейнер и options) в стек.

### $$voice.restore();

Восстанавливает последнее сохраненное состояние в стеке и удаляет его из стека

### $$voice.fromServer(title,callback);

Распознавание голоса с помощью сервера самсунга, title - текст который видит пользователь, callback - функция которая вызывается после успешного распознавания текста, принимает в себя результат.
В браузере выводится prompt сообщение.

Пример:

```
$$voice.fromServer("скажите слово для поиска",function(result){
   //если юзер сказал "привет мир" result = "привет мир"
});
```

### $$voice.pause();

Приостанавливает работу плагина.

### $$voice.resume();

Возобновляет работу плагина.

### $$voice.refresh();

Перезапускает voiceLink() с текущими параметрами. Используется часто для того чтобы поддерживать актуальное состояние голосвых подсказок.
Если кнопка на которую был перестала быть видимой, то фраза исчезает из хелпбара и не работает, если не задан атрибут `data-voice-force-visible` или флаг $$voice.useHidden


## Важно

Событие voice распространяется вверх по DOM дереву, таким образом если вложить одну голосовую ссылку в другую и не вызвать e.preventDefault() при срабатывании дочерней ссылки родительская тоже получит событие.




