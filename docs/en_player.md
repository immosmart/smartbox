# Player

###Contents

<a href="#Public-events">`Public events`</a>
* <a href="#ready">`ready`</a>
* <a href="#bufferingbegin-bufferingend">`bufferingBegin, bufferingEnd`</a>
* <a href="#stop">`stop`</a>
* <a href="#complete">`complete`</a>

<a href="#Public-properties">`Public properties`</a>
* <a href="#playerstate">`Player.state`</a>
* <a href="#playervideoinfoduration">`Player.videoInfo.duration`</a>
* <a href="#playervideoinfocurrenttime">`Player.videoInfo.currentTime`</a>
* <a href="#playervideoinfowidth">`Player.videoInfo.width`</a>
* <a href="#playervideoinfoheight">`Player.videoInfo.height`</a>
* <a href="#useplayerobject">`Player.usePlayerObject`</a>

<a href="#Public-methods">`Public methods`</a>
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


##Public events

###`ready`

'ready' is sent when player has recieved a steam info (duration, resolution, etc) and playing starts.

#### Examples

```js
Player.on('ready', function(){
  $('#duration').html(Player.formatTime(Player.videoInfo.duration));
});
```

* * *


###`bufferingBegin, bufferingEnd`

Events are sent when a video buffering starts and ends, weak Internet connection or after rewinding.

#### Examples

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

Sends when the playback has been stopped.

#### Examples

```js
Player.on('stop', function(){
  $videoScene.hide();
});
```

* * *

###`complete`

is sent when the end of video file is reached and playing is stopped.

#### Examples

```js
Player.on('complete', function(){
  playNextVideo();
});
```

* * *


##Public properties

###`Player.state`

*String*: Current player condition:

1. `play`: video is playing
2. `pause`: video is paused
3. `stop`: video is stopped

* * *


###`Player.videoInfo.duration`

*Number*: video file duration in seconds

* * *

###`Player.videoInfo.currentTime`

*Number*: current playing time in seconds

* * *

###`Player.videoInfo.width`

*Number*: video stream width in pixels

* * *

###`Player.videoInfo.height`

*Number*: video stream height in pixels

* * *

###`Player.usePlayerObject`

*Boolean*: defines: will or won't the <object> or sef plugin be used.

*Available only for the next platform: Samsung*

* * *



## Public methods

###`Player.play(options)`

The video starts playing.

#### Arguments
`options` *Plain object*: hash containing parametrs for the starting
 
 Or

`url` *String*: the path to a video

#### Examples
```js
Player.play({
  url: "movie.mp4"
});
Player.play("movie.mp4"); 
//Both variants are the same 

Player.play({
  url: "movie.mp4"
  from: 20
});// starts video from the 20 sec point
```

* * *

###`Player.stop([silent])`

Stops video playing.

#### Arguments
1. `silent[optional]` *Boolean*: if flag `silent` is sent, then the event `stop` isn't called 


#### Examples
```js
Player.stop();

App.onDestroy(function(){
   Player.stop(true);
});  // Stops playing and allows to avoid side effects
```

* * *

###`Player.pause()`

Pauses video playing.


#### Examples
```js
Player.pause();
```

* * *

###`Player.resume()`

Resumes video playing after pause.

#### Examples
```js
Player.resume();
```

* * *

###`Player.togglePause()`

Switches pause/resume according to the current condition.

#### Examples
```js
Player.togglePause();
```

* * *

###`Player.formatTime(seconds)`

Converts time in seconds in the srting with a type H:MM:SS

#### Arguments
`seconds` *Number*: the time in seconds
 
#### Returns
*String*: result string
 

#### Examples
```js
Player.formatTime(PLayer.videoInfo.duration); // => "1:30:27"
```

* * *


###`Player.seek(seconds)`

The transit on the set time in seconds.

#### Arguments
`seconds` *Number*: the time in seconds
 

#### Examples
```js
Player.seek(20);//перейти на 20 секунду

Player.seek(Player.videoInfo.currentTime + 10);//прыжок на 10 секунд вперед
```

* * *


###`Player.audio.get()`

Returns an array with codes of sound tracks languages.   

A list with all codes you can find here
<a href="http://forum.doom9.org/showthread.php?t=155762">http://forum.doom9.org/showthread.php?t=155762</a>

*Available only for the next platform: Samsung*

#### Returns
*Array*: the array with codes
 

#### Examples
```js
var tracksArray=Player.audio.get();//=> [7501171, 6448492]
var currentLang=array[Player.audio.cur()];//=> 7501171
var currentLangString=Strings[currentLang];//=> "Russian"
```

* * *


###`Player.audio.set(index)`

Defines the sound track in copliance with the index. 

*Available only for the next platform: Samsung*

#### Arguments

`index` *Number*: sound track index


#### Examples
```js
Player.audio.set(0);
```

* * *

###`Player.audio.cur()`

Defines the sound track in copliance with the index. 

*Available only for the next platform: Samsung*


#### Returns
*Number*: Index of the current sound track

#### Examples
```js
Player.audio.cur(); //=> 1
```

* * *







