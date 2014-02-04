# Voicelink

jQuery plugin for working with Smart TV voice management.

The principle of operation: A phrase which the user should say is set on the elements with the defined class `voicelink` in the attribute `data-voice`. The plugin generates voice management native helpbar and adds a bar with remain commands in the body, it can be called with the phrase "More". (The phrase can be changed with the plugin adjustment)
The voice management is emulated in a browser by the plugin generating an additional block with buttons and available phrases.

## Example


A user says "Back" - the element `#backVoiceLink` sends the event `voice`


html:
```
<div id="backVoiceLink" class="voicelink" data-voice="Back" data-voice-group="Navigation"></div>
```

js:
```
SB.ready(function(){
    $('#scene').voiceLink();
    $('#backVoiceLink').bind('voice', function(){
       //user said "Back"
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

The optional attribute show that the word can be pronauced, but the hint won't be shown. 
The behavior depends on the value is empty or not, because TV11 haven't got the ability to save $().data().

Example

```
data-voice-hidden="true" = data-voice-hidden="abc" = data-voice-hidden="1" = data-voice-hidden="false" = true
data-voice-hidden="" = false
```


### data-voice-force-visible="[true]"

Shows the element in the helpbar, even if it's hidden and useHidden=false



### Options

In the hash options it's possible to set the selector class for voice links.

```
options={
  selector: '.voicelink',// the selector for the searching 
  moreText: 'More',//Text for the "bubble" showing
  eventName: 'voice',//The event is sent by element событие которое отправляет элемент
  useHidden: false//Filtering hidden links
}

$('#scene').voiceLink(options);
```

It's not necessary to set `options`: then options will be set by default (as written above)

```
$('#scene').voiceLink();
```

```
$$voice.setup(newDefaults);//sets new values for values by default
```

## Methods

### $$voice.say(phrase);

Emulates the phrase pronouncing

### $$voice.enabled();

Defines if a device supports the voice recognition function. Returns boolean

### $$voice.setup(options);

Defines default option, in options - options hash 

### $$voice.save();

Saves the current condition (container and options) in the stack.

### $$voice.restore();

Restores the last saved condition from the stack and then deletes it from the stack

### $$voice.fromServer(title,callback);

The voice recognition with help of Samsung's server, title - a text which the user sees, callback - the function calling after successful text recognition, receives the result inside. 
The prompt message is displayed in the browser.

Example:

```
$$voice.fromServer("Say the word to search",function(result){
   //If user say "hello world" the result = "hello world"
});
```

### $$voice.pause();

Suspends the plugin working

### $$voice.resume();

Resumes the plugin working

### $$voice.refresh();

Restarts voiceLink() with the current parametrs. It is used often to support the actual condition of the voice hints.
If the active button with the voice hint stops to be visible then this button disappears from the helpbar and doesn't work if the attribute data-voice-force-visible isn't set or a flag $$voice.useHidden.


## Important

The event voice spreads out up on the DOM tree, in such a way if one link put into another voice link and doesn't call e.preventDefault() then when subsidiary links is triggered the parent also receives the event.

