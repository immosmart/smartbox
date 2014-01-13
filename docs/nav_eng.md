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

It's necessary to define elements with the class `nav-item` in HTML. These elements can receive the focus and you can focus any of them with using keyboard. The focused element receives the class `focus`. 

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
The handy connective of methods for container canging, saving and restoring (container in which the plugin is working)

Frequent case: A Pop up with a message

In the starting position the focus is on the button. 
After the button has been pressed the pop up appears and the focus is transited to pop up and can't go ouside this pop up.  
There are some visible `nav-item` elements already and it's possible to set for the plugin a currect workspace to prevent conflicts. It can be done by using `$$nav.on(jQuery_selector)`, where `jQuery_selector` is all what function `$` can to possess inside and means the new active area where the searching of elements `nav-item` will be performed. `$$nav.on()` contains `$$nav.off()` and automatically makes inactive the previous area. 

```
<div class="page">
     <div class="open_popup_button btn nav-item">Open</div>
</div>
<div class="overlay" style="display: none;"> <!-- The pop up isn't displayed initially -->
    <div class="popup">
         <div class="close_popup_button btn nav-item">Close</div>
    </div>
</div>
```

```
$(function(){
    var $overlay=$(".overlay");

    $$nav.on(".page"); //First initialisation 
    //The focus is on the .open_popup_button

    $(".open_popup_button").click(function(){
        $overlay.show();
        $$nav.save(); //save the current area and the focus
        $$nav.on($overlay);//transits the navigation in the new area (pop up) and sets the new focus
        //Focus is on the .close_popup_button now
    });

    $(".close_popup_button").click(function(){
        $overlay.hide();
        $$nav.restore(); //Restores the previous saved condition
        //Now the is focus is on the .open_popup_button
    });
});
```

Functions `save` and `restore` works as `push` and `pop` for a stack. So it's possible to have endless conditions history.  

http://immosmart.github.io/smartbox/examples/navigation/popup/

# data-nav_type

This attribute is used for better perfomance and jointly with the attribute `data-nav_loop` for looped menus creating. 

```
<div class="btn-group" data-nav_type="hbox" data-nav_loop="true">
   <div class="btn nav-item">Menu item 1</div>
   <div class="btn nav-item">Menu item 2</div>
   <div class="btn nav-item">Menu item 3</div>
   <div class="btn nav-item">Menu item 4</div>
</div>
```
When the attribute `data-nav_type` is defined the plugin stops the direction searching according to elements position on the page and focus starts to move from one sibling element to another, it's more quickly. If the type is defined as `vbox` the transition is realized by pressing buttons `up` and `down`, if `hbox` : then `left` and `right`. If the extra attribute `data-nav_loop` is set the focus transits as looped: from the last to the first and vice versa.


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
