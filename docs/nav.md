# Обзор

Плагин реализующий навигацию по элементам с помощью ПДУ или клавиатуры. Позволяет создавать интерфейсы с изменяющимся содержимым.

Основные фичи:

1) автоматическое определение элемента, на который перемещается фокус для заданного направления, не нужно писать сложную логику для перехода от одного элемента к другому или задавать их вручную;

2) не нужно заботится как обработать случай когда какой-то элемент интерфейса окажется скрытым, невидимые элементы просто игнорируются;

3) создает прослойку для события keydown - `nav_key`. Таким образом, что `nav_key` становится уникальным для каждой кнопки:

```
$('.button').on('nav_key:red', function(){
   //при нажатии на красную кнопку на пульте выполнится эта функция
});
```

4) так же для нового события `nav_key` работает event bubbling что позволяет ловить события на нужном уровне, отменять и слушать нажатия только там где это нужно в данный момент.

# Как использовать

В HTML нужно задать элеметны с классом `nav-item`. Эти элементы могут получать фокус и с помощью клавиатуры по ним фокус переходит. Элементы в фокусе получают класс `focus`. 

```
<body>
    <div class="nav-item">hello</div>
    <div class="nav-item">world</div>
</body>
```

После вызова `$$nav.on()` к первому элементу будет добавлен класс `focus` и навигация будет активирована. Нажатие стрелок на клавиатуре или ПДУ будет перемещать фокус, клавиша enter будет эмулировать клик по элементу, а наведение мыши будет переводить элементы в фокус. Таким образом поддержка жестов в телевизоре не требует дополнительной работы, а код приложения не сильно будет отличаться от обычного сайта.

```
//отлавливаем одновременно нажатие enter и простой клик
$('.nav-item').click(function(){
    alert(this.innerHTML);
});
```

http://immosmart.github.io/smartbox/examples/navigation/hello_world/


# on, off, save, restore
Удобная связка методов для того чтобы сменить, сохранить и восстановить область в которой работает плагин.

Распространенный случай: попап с сообщением.

В исходном положении фокус находится на кнопке.
После нажатия на кнопку должен показаться попап, фокус переходит туда и фокус не должен выходить за пределы попапа.
Но видимых `nav-item` элементов уже несколько и чтобы они не конфликтовали плагину можно задать текущую рабочую область.
Делается это с помощью метода `$$nav.on(jQuery_selector)`, где `jQuery_selector` это все что может принять в себя функция `$`
и означает новую активную область, где будет производится поиск элементов `nav-item`.  `$$nav.on()` содержит в себе `$$nav.off()` и автоматически делает неактивной предыдущую область.

```
<div class="page">
     <div class="open_popup_button btn nav-item">Open</div>
</div>
<div class="overlay" style="display: none;"> <!-- Изначально попап скрыт -->
    <div class="popup">
         <div class="close_popup_button btn nav-item">Close</div>
    </div>
</div>
```

```
$(function(){
    var $overlay=$(".overlay");

    $$nav.on(".page"); //первоначальная инициализация
    //теперь фокус на .open_popup_button

    $(".open_popup_button").click(function(){
        $overlay.show();
        $$nav.save(); //сохраняет текущую область и фокус
        $$nav.on($overlay);//переносит навигацию в новую область(попап) и выставляет новый фокус
        //теперь фокус на .close_popup_button
    });

    $(".close_popup_button").click(function(){
        $overlay.hide();
        $$nav.restore(); //восстанавливает предыдущее сохраненное состояние
        //теперь фокус на .open_popup_button
    });
});
```

Функции `save` и `restore` работают как `push` и `pop` для стека. Таким образом можно иметь бесконечную историю состояний.

http://immosmart.github.io/smartbox/examples/navigation/popup/

# data-nav_type

Этот атрибут используется для лучшей производительности и совместно с атрибутом `data-nav_loop` для создания зацикленных меню. 

```
<div class="btn-group" data-nav_type="hbox" data-nav_loop="true">
   <div class="btn nav-item">Menu item 1</div>
   <div class="btn nav-item">Menu item 2</div>
   <div class="btn nav-item">Menu item 3</div>
   <div class="btn nav-item">Menu item 4</div>
</div>
```
Когда задается атрибут `data-nav_type` плагин перестает использовать поиск направления согласно положению элементов на странице, и фокус начинает перемещаться от одного sibling элемента к другому, что гораздо быстрее. Если тип задан как `vbox` перемещение осуществляется кнопками `up` и `down`, если `hbox` то `left` и `right`. Если задать дополнительно атрибут `data-nav_loop` фокус будет перемещаться зацикленно по кругу с последнего на первый и наоборот.

Атрибут должен быть задан над первым родительским элементом для `.nav-item`, то есть такие варианты не работают:

```
<ul class="btn-group" data-nav_type="hbox" data-nav_loop="true">
   <li class="btn"><a class="nav-item">Menu item 1</a></div>
   <li class="btn"><a class="nav-item">Menu item 2</a></div>
   <li class="btn"><a class="nav-item">Menu item 3</a></div>
   <li class="btn"><a class="nav-item">Menu item 4</a></div>
</ul>
```

```
<div class="btn-group" data-nav_type="hbox" data-nav_loop="true">
   <div class="some_wrapper">
      <div class="btn nav-item">Menu item 1</div>
      <div class="btn nav-item">Menu item 2</div>
      <div class="btn nav-item">Menu item 3</div>
      <div class="btn nav-item">Menu item 4</div>
   </div>
</div>
```

http://immosmart.github.io/smartbox/examples/navigation/complex/

## События `nav_focus`, `nav_blur`.

После того как элемент получает фокус на элементе срабатывает событие `nav_focus`, а когда теряет фокус - `nav_blur`. 

```
$('.button1').on('nav_blur', function(event, originEvent, $nextElement){
});

$('.button2').on('nav_focus', function(event, originEvent, $prevElement){
});
```

`event` - jQuery событие,

`originEvent` - строка которая определяет каким именно способом элемент получил фокус, может быть отправелено через метод `$$nav.current(target, originEvent)`. Значение по умолчанию: `nav_key`, это означает что фокус был получен с помощью клавиатуры. Так же может быть `mouseenter`, если фокус был получен с помощью мыши. Остальные значения пользовательские.

`$nextElement` - jQuery объект. Для события `nav_blur` - элемент на который перешел фокус.

`$prevElement` - jQuery объект. Для события `nav_focus` - элемент на котором был фокус ранее. 


## Отмена перехода.

Переход с элемента на элемент можно отменить, отменяя распространение события `nav_key:{direction}`. Событие можно отменить на любом элементе выше `.nav-item` и ниже `body`.
Пример:

```
$('.middle_button').on('nav_key:left', function(e){
   if(some_cond){
      e.stopPropagation();
      $$nav.current('.right_button');
   }
});
```

## Если нужно отличить `click` и `enter`

Нужно отменть событие `nav_key:enter` аналогично предыдущему примеру. Тогда `click` будет выполняться только по настоящему клику мышью. 

```
$('.button').click(function(){

});

$('.button').on('nav_key:enter',function(e){
      e.stopPropageion();
});

```
