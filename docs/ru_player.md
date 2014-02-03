# Плеер


### <a id="_init"></a> `Player.play(options);`

Начинает воспроизведение видео.

#### Аргументы
1. `options` *Plain object*: хеш содержащий параметры для запуска
 
 Или 

1. `url` *String*: путь к видео


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
