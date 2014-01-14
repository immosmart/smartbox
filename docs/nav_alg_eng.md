# Element seaching alghorithm

The alghorithm is reasonable for any direction. "Upper edge" means an edge coincident with the movement direction. For the movement up - upper edge, down - bottom edge, right - right edge, left - left edge.   

Example: There are navigation elements, focused element is marked in red. 

<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide1.png" />

User presses the button "Up". The first occuring thing is eliminating of elements that have upper edge lower then upper edge of the focused element. 

<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide2.png" />

The elements that have edges that intersect along the axis perpendicular to the direction are found. If there is any of such element exists then their priority become higher and other elements are eliminated. 

<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide3.png" />

The element that has upper edge closer to the upper edge of the focused element is searched for from the last elements.  
<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide4.png" />


Если на втором шаге пересекающихся элементов не было найдено с оставшимися элементами происходит тоже самое. Находится самый ближайший.

<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide5.png" />

# Это не баг, это фича.


<img src="http://immosmart.github.io/smartbox/docs/nav_slides/slide6.png" />

В этом примере двигаясь по вертикали из элемента **B** в элемент **A** перейти можно, но не наоборот.
Это происходит потому что нижняя грань элемента **A**, ниже нижней грани элемента **B**.
Таким образом **A** одновременно и выше и ниже **B**
