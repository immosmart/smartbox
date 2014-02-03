# Плеер


###Оглавление

<a href="#Публичные-события">`Публичные события`</a>
* <a href="#ready">`ready`</a>
* <a href="#bufferingbegin-bufferingend">`bufferingBegin, bufferingEnd`</a>
* <a href="#stop">`stop`</a>
* <a href="#complete">`complete`</a>

<a href="#Публичные-свойства">`Публичные свойства`</a>
* <a href="#playerstate">`Player.state`</a>
* <a href="#playervideoinfoduration">`Player.videoInfo.duration`</a>
* <a href="#playervideoinfocurrenttime">`Player.videoInfo.currentTime`</a>
* <a href="#playervideoinfowidth">`Player.videoInfo.width`</a>
* <a href="#playervideoinfoheight">`Player.videoInfo.height`</a>
* <a href="#useplayerobject">`Player.usePlayerObject`</a>

<a href="#публичные-методы">`Публичные методы`</a>
* <a href="#playerplayoptions">`Player.play(options)`</a>
* <a href="#playerstopsilent">`Player.stop([silent])`</a>
* <a href="#playerpause">`Player.pause()`</a>
* <a href="#playerresume">`Player.resume()`</a>
* <a href="#playertogglepause">`Player.togglePause()`</a>
* <a href="#playerformattimeseconds">`Player.formatTime(seconds)`</a>
* <a href="#playerseekseconds">`Player.seek(seconds)`</a>
* <a href="#playeraudioget">`Player.audio.get()`</a>
* <a href="#playeraudiosetindex">`Player.audio.set(index)`</a>
* <a href="#playeraudiocur">`Player.audio.cur()`</a>


##Публичные события

###`ready`

Отправляется когда плеер получает информацию о потоке(duration, resolution, etc) и начинает воспроизведение.

#### Пример

```js
Player.on('ready', function(){
  $('#duration').html(Player.formatTime(Player.videoInfo.duration));
});
```

* * *


###`bufferingBegin, bufferingEnd`

События отправляются когда начинается и заканчивается буферизация видео, при слабом коннекте или после перемотки.

#### Пример

```js
var $loadingIndicator=$('#loading_indicator');
Player.on('bufferingBegin', function(){
  $loadingIndicator.show();
});

Player.on('bufferingEnd', function(){
  $loadingIndicator.hide();
});
```

* * *


###`stop`

Отправляется когда было остановлено воспроизведение.

#### Пример

```js
Player.on('stop', function(){
  $videoScene.hide();
});
```

* * *

###`complete`

Отправляется когда видео файл доиграл до конца и остановился.

#### Пример

```js
Player.on('complete', function(){
  playNextVideo();
});
```

* * *


##Публичные свойства

###`Player.state`

*String*: Текущее состояние плеера:

1. `play`: видео воспроизводится
2. `pause`: видео приостановлено
3. `stop`: видео остановлено

* * *


###`Player.videoInfo.duration`

*Number*: продолжительность видео файла в секундах

* * *

###`Player.videoInfo.currentTime`

*Number*: текущее время воспроизведения в секундах

* * *

###`Player.videoInfo.width`

*Number*: ширина потока видео в пикселях

* * *

###`Player.videoInfo.height`

*Number*: высота потока видео в пикселях

* * *

### <a id="usePlayerObject"></a> `Player.usePlayerObject`

*Boolean*: определяет будет использоваться <object> или sef плагин.

*Доступно только для следующей платформы: Samsung*

* * *



## Публичные методы

### <a id="play"></a> `Player.play(options)`

Начинает воспроизведение видео.

#### Аргументы
`options` *Plain object*: хеш содержащий параметры для запуска
 
 Или 

`url` *String*: путь к видео

#### Примеры
```js
Player.play({
  url: "movie.mp4"
});
Player.play("movie.mp4"); 
//оба варианта одинаковы 

Player.play({
  url: "movie.mp4"
  from: 20
});// запускает видео с 20 секунды
```

* * *

### <a id="stop"></a> `Player.stop([silent])`

Останавливает воспроизведение видео.

#### Аргументы
1. `silent[optional]` *Boolean*: если передан флаг `silent`, то не будет вызвано событие `stop`


#### Примеры
```js
Player.stop();

App.onDestroy(function(){
   Player.stop(true);
});  // Останавливает воспроизведение и позволяет избежать побочных эффектов
```

* * *

### <a id="pause"></a> `Player.pause()`

Приостанавливает воспроизведение видео.



#### Примеры
```js
Player.pause();
```

* * *

### <a id="resume"></a> `Player.resume()`

Возобновляет воспроизведение видео после паузы.


#### Примеры
```js
Player.resume();
```

* * *

### <a id="togglePause"></a> `Player.togglePause()`

Переключает pause/resume в зависимости от текущего состояния.

#### Примеры
```js
Player.togglePause();
```

* * *

### <a id="formatTime"></a> `Player.formatTime(seconds)`

Конвертирует время в секундах в строку вида H:MM:SS

#### Аргументы
`seconds` *Number*: время в секундах

#### Возвращает
*String*: реультирующая строка
 

#### Примеры
```js
Player.formatTime(PLayer.videoInfo.duration); // => "1:30:27"
```

* * *


### <a id="seek"></a> `Player.seek(seconds)`

Переход на заданное время в секундах.

#### Аргументы
`seconds` *Number*: время в секундах
 

#### Примеры
```js
Player.seek(20);//перейти на 20 секунду

Player.seek(Player.videoInfo.currentTime + 10);//прыжок на 10 секунд вперед
```

* * *


### <a id="audio_get"></a> `Player.audio.get()`

Возвращает массив с кодами языков звуковых дорожек.   

Список всех кодов можно найти тут
<a href="http://forum.doom9.org/showthread.php?t=155762">http://forum.doom9.org/showthread.php?t=155762</a>

*Доступно только для следующей платформы: Samsung*

#### Возвращает
*Array*: массив с кодами
 

#### Примеры
```js
var tracksArray=Player.audio.get();//=> [7501171, 6448492]
var currentLang=array[Player.audio.cur()];//=> 7501171
var currentLangString=Strings[currentLang];//=> "Russian"
```

* * *


### <a id="audio_get"></a> `Player.audio.set(index)`

Задает звуковую дорожку согласно индексу. 

*Доступно только для следующей платформы: Samsung*

#### Аррргументы

`index` *Number*: индекс звуковой дорожки


#### Примеры
```js
Player.audio.set(0);
```

* * *

### <a id="audio_get"></a> `Player.audio.cur()`

Задает звуковую дорожку согласно индексу. 

*Доступно только для следующей платформы: Samsung*


#### Возвращает
*Number*: индекс текущей звуковой дорожки.

#### Примеры
```js
Player.audio.cur(); //=> 1
```

* * *



