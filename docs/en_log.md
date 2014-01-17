# Overview

A log allows to display messages from the code on a screen.

# Initialisation

The log is initialisated after the log plugin is on.
The element is created <div id='log'></div> in the DOM

# Message displaying

The key tools is a button by default to display messages.
When you press the button the next events happen:
- log displaying
- boards changing
- log hiding

# Plugin's methods

The log's object is situated in the object SB.utils.log

1) SB.utils.log.log(msg, logName)
   window.$$log(msg, logName)

Вывод сообщения msg в панели лога logName.
msg message displaying in the log's board logName 
2) show(logName)

The displaying of the log's board logName
3) hide()

Log hiding.

4) state( msg, state, logName )

The displaying of the message in the state log's board logName
State is displayed belowe the log's board by default

Example of the usage: The displaying of the current playing time 
5) startProfile( profileName );
   stopProfile: function ( profileName )

Profiling functions. Display a result on the profiler board. 

