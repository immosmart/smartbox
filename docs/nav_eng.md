# Review

The plugin implements the navigation on elements with using Remote or keyboard. It allows to create interfaces with changing content. 

The main features:

1) Autodefining of the element which will be focused for a given direction, no need to write the difficult movement logic for transition from one element to another or set them manually;

2) No need to care how to handle the case when an interface element is hidden, hidden elements are ignored;  

3) Creates the layer for keydown event - `nav_key` in such a way that `nav_key` become the unque for every button;

```
$('.button').on('nav_key:red', function(){
   //As soon as the red button has been pressed the function is executed
});
```

4) Also for the new event `nav_key` works "event bubbling" which allows to catch events on the necessary level, cancel  and listen to pressing only where it is necessary in this moment.

# How to use


В HTML надо элементы которые будут помечены классом `nav_target`. Это задает элементы по которым может осуществляться навигация и эти элементы могут получать фокус.
```
<body>
    <div class="nav-item">hello</div>
    <div class="nav-item">world</div>
</body>
```

After `$$nav.on()` has been called the class `focus` will be added to the first element and navigation will be activated. 
Pressing arrows keys on a keyboard or remote control will move the focus, key "Enter" will emulate the click on the element, the mouse over the element will set the focus on the element. So gestures recognition support on a TV doesn't require extra work and an application code isn't different too much from the regular website.

```
// catch up pressing enter and click at one time
$('.nav-item').click(function(){
    alert(this.innerHTML);
});
```

http://immosmart.github.io/smartbox/examples/navigation/hello_world/


# on, off, save, restore

Handy methods bundle to direct the plugin in necessary field 
Удобная связка методов для того чтобы направить плагин в нужную область и вернуться обратно.

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
