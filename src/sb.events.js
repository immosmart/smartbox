(function (window) {
  "use strict";

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }

  var eventSplitter = /\s+/,
    namespaceSplitter = '.',
    Events;

  function makeBind(event, fn, context, isSignal) {
      var arr = event.split(namespaceSplitter);
      return {
        c: context,
        s: isSignal,
        fn: fn,
        n: arr[0],
        ns: arr.slice(1)
      };
    }

  function compare(request, target) {
      var compared = (!request.fn || request.fn === target.fn)
                       && (!request.n || request.n === target.n)
        && (!request.c || request.c === target.c),
        requestNs = request.ns,
        ns2;

      //compare namespaces
      if (compared) {
        if (requestNs.length) {
          compared = false;
          ns2 = target.ns;
          for (var i= 0; i < requestNs.length; i++) {
            if (ns2.indexOf(requestNs[i]) !== -1) {
              compared = true;
              break;
            }
          }
        }
    }
      return compared;
    }

  function remove(me, event, fn, context) {
      var bind;
      if (!me._listeners) {
        return;
      }
      if (!event && !fn && !context) {
        delete me._listeners;
        return;
      }

      bind = makeBind(event, fn, context);

      if (!bind.ns.length && !fn && !context) {
        delete me._listeners[bind.n];
        return;
      }

      if (bind.n && !me._listeners[bind.n]) {
        return;
      }

      var listeners = {},
        binds;
      if (bind.n) {
        listeners[bind.n] = me._listeners[bind.n];
      } else {
        listeners = me._listeners;
      }

      for (var bindName in listeners) {
        binds = listeners[bindName];
        for (var i = 0; i < binds.length; i++) {
          if (compare(bind, binds[i])) {
            binds.splice(i, 1);
            i--;
          }
        }
      }

    }

  Events = function() {
    this._listeners = {};
  };

  var proto = Events.prototype;

  proto.on = function (events, fn, context, callOnce) {
    var eventNames;

    if (typeof events === 'object') {
      context = fn || this;
      for (var eventName in events) {
        this.on(eventName, events[eventName], context, callOnce);
      }
      return this;
    }

    if (typeof fn !== 'function') {
      throw new TypeError('function expected');
    }

    context = context || this;

    eventNames = events.split(eventSplitter);

    eventNames.forEach(function (eventName) {
      var bind = makeBind(eventName, fn, context, callOnce),
        binds = this._listeners || {},
        curBind = binds[bind.n] || [];

      curBind.push(bind);
      binds[bind.n] = curBind;

      this._listeners = binds;
    }, this);

    return this;
  };

  proto.one = function (events, fn, context) {
    return this.on(events, fn, context, true);
  };

  proto.off = function ( events, fn, context ) {
    var eventNames;

    if (!events) {
      remove(this, '', fn, context);
    } else {
      eventNames = events.split(eventSplitter);
      for (var i = 0, l = eventNames.length; i < l; i++) {
        remove(this, eventNames[i], fn, context);
      }
    }

    return this;
  };

  proto.fire = function (events) {
    if (!this._listeners) {
      return this;
    }

    var args = Array.prototype.slice.call(arguments,1),
      me = this,
      eventNames,
      bind,
      bindsArray,
      bindObject;

    eventNames = events.split(eventSplitter);
    for (var i = 0, l = eventNames.length; i < l; i++) {

      bind = makeBind(eventNames[i], false, false);

      if (bind.n) {
        bindsArray = me._listeners[bind.n];
        if (!bindsArray) {
          return this;
        }

        for (var j = 0; j < bindsArray.length; j++) {
          bindObject = bindsArray[j];

          if (!bind.ns.length || compare(bind, bindObject)) {
            bindObject.fn.apply(bindObject.c, args);

            // delete handler, if it was 'one'
            if (bindObject.s) {
              bindsArray.splice(j, 1);
              j--;
            }
          }
        }
      } else {
        throw 'not implemented';
      }
    }
    return me;
  };

  Events.prototype.trigger = Events.prototype.fire;

  window.SBEvents = Events;
}(this));