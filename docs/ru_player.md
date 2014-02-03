# Плеер

## Публичные методы

### <a id="init"></a> `Player.play(options)`

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

### <a id="init"></a> `Player.formatTime(seconds)`

Конвертирует время в секундах в строку вида H:MM:SS

#### Аргументы
`seconds` *Number*: время в секундах

#### Возвращает
*String*: реультирующая строка
 

#### Примеры
```js
Player.formatTime(PLayer.videoInfo.duration); // => "1:30:27"
```



