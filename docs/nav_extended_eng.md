The element searching algorithm can be changed if different behaviour is needed.



# Attribute "user defined"

```
<i class="fav-button nav-item" data-nav_ud="0,0,#pfl_film_watch,0"></i>
```

If the attribute is defined then the navigation stops to use the intelligent element search in some cases. In the above example when the key "DOWN" has been pressed the focus transits to the element #pfl_film_watch.
Edges are defined separated by commas in the CSS order - top, right, bottom, left


```
<i class="fav-button nav-item" data-nav_ud="0,0,none,0"></i>
```

В этом примере нажатие кнопки "DOWN" будет игнорироваться.





# Атрибут entry point

Атрибут который запрещает входить в элемент с определенного направления.

Точки входа задаются в атрибуте с помощью 0 и 1 через запятые

0 - входить нельзя

1 - входить можно

Стороны указываются в порядке CSS - top, right, bottom, left

```
<i class="fav-button nav-item" data-nav_ep="1,1,0,1"></i>
```
В этом примере в элемент нельзя войти снизу.





# Фантомы

Фантом это такой `nav-item`, который при попадании в фокус переводит фокус на другой элемент. Работает только для клавиатуры. При управлении жестами игнорируется.

```
<div class="nav-item" data-nav-phantom="#card_owner"></div>
```

В этом примере при оппадании фокуса на элемент фокус будет переведен на элемент #card_owner

<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide7.png" />
