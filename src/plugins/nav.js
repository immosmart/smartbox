!(function ( window, undefined ) {

  var $body = null,
    nav, invertedKeys = {};

  SB.ready(function () {
    var keys = SB.keys;
    for (var key in keys) {
      invertedKeys[keys[key]] = key.toLowerCase();
    }
  }, true);

  function Navigation () {


    // for methods save и restore
    var savedNavs = [],

    // object for store throttled color keys  methods
      throttledMethods = {},

    // current el in focus
      navCur = null,

    // arrays
      numsKeys = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9'],
      colorKeys = ['green', 'red', 'yellow', 'blue'],

    // pause counter
      paused = 0;

    function onKeyDown ( e ) {
      var key,
        data = {},
        keyCode = e.keyCode;

      if ( paused || !navCur ) {
        return;
      }

      key = invertedKeys[keyCode];
      if ( key ) {
        if ( colorKeys.indexOf(key) > -1 ) {
          throttleEvent(key);
        } else {
          if ( numsKeys.indexOf(key) > -1 ) {
            data.num = key[1];
            key = 'num';
          }

          triggerKeyEvent(key, data);
        }
      }
    }

    /**
     * 'nav_key:' event trigger
     * @param key key name
     * @param data event data
     */
    function triggerKeyEvent ( key, data ) {
      var ev,
        commonEvent;
      if ( navCur ) {
        ev = $.Event("nav_key:" + key, data || {});
        commonEvent = $.Event("nav_key");

        ev.keyName = key;
        commonEvent.keyName = key;
        navCur.trigger(ev);
        //первый trigger мог уже сменить текщий элемент
        navCur && navCur.trigger(commonEvent);
      }
    }

    function throttleEvent ( key ) {
      var keyMethod = throttledMethods[key];

      // lazy init
      if ( !keyMethod ) {
        keyMethod = throttledMethods[key] = _.throttle(function () {
          triggerKeyEvent(key);
        }, 800, {
          leading: true
        });
      }

      keyMethod(key);
    }

    /**
     * trigger click on current element
     */
    function onClick () {
      navCur && navCur.click();
    }

    return {

      // nav els selector
      area_selector: '.nav-item',

      /**
       * Current el class
       * @type {string}
       */
      higlight_class: 'focus',

      /**
       * navigation container
       * @type {jQuery}
       */
      $container: null,

      /**
       * Current looping type
       * false/hbox/vbox
       * @type {boolean|string}
       */
      loopType: null,

      /**
       * Phantom els selector
       * @type {string}
       */
      phantom_selector: '[data-nav-phantom]',

      /**
       * Returns current navigation state
       * @returns {boolean}
       */
      isPaused: function () {
        return !!paused;
      },

      /**
       * Stop navigation. Increase pause counter
       * @returns {Navigation}
       */
      pause: function () {
        paused++;
        return this;
      },

      /**
       * Resume navigation if force or pause counter is zero
       * @param force {Boolean} force navigation resume
       * @returns {Navigation}
       */
      resume: function ( force ) {
        paused--;
        if ( paused < 0 || force ) {
          paused = 0;
        }
        return this;
      },

      /**
       * Save current navigation state
       * @returns {Navigation}
       */
      save: function () {

        savedNavs.push({
          navCur: navCur,
          area_selector: this.area_selector,
          higlight_class: this.higlight_class,
          $container: this.$container
        });
        return this;
      },

      /**
       * Restore navigation state
       * @returns {Navigation}
       */
      restore: function () {
        if ( savedNavs.length ) {
          this.off();
          var foo = savedNavs.pop();
          this.area_selector = foo.area_selector;
          this.higlight_class = foo.higlight_class;
          this.on(foo.$container, foo.navCur);
        }

        return this;
      },

      /**
       * Setting focus on element
       * @param element {*} - HTMLElement, selector or Jquery object
       * @param originEvent {string} - event source(nav_key, mousemove, voice etc.)
       * @return {Navigation}
       */
      current: function ( element, originEvent ) {
        if ( !element ) {
          return navCur;
        }

        originEvent = originEvent || 'nav_key';

        var $el = $(element);
        if ( $el.is(this.phantom_selector) ) {
          $el = $($($el.attr('data-nav-phantom'))[0]);
        }
        if ( $el.length > 1 ) {
          throw new Error('Focused element must be only one!');
        }
        if ( !$el.length ) {
          return this;
        }
        var old = navCur;
        if ( navCur ) {
          navCur.removeClass(this.higlight_class).trigger('nav_blur', [originEvent, $el]);
        }

        navCur = $el;

        $el.addClass(this.higlight_class).trigger('nav_focus', [originEvent, old]);
        return this;
      },

      /**
       * Turn on navigation in container, turn off previous navigation
       * @param container - HTMLElement, selector or Jquery object (body by default)
       * @param cur - HTMLElement, selector or Jquery object(first nav el by default)
       * @return {Navigation}
       */
      on: function ( container, cur ) {

        var self = this,
          $navTypeEls;

        $body = $body || $(document.body);

        this.off();

        this.$container = container ? $(container) : $body;

        if ( SB.platform != 'philips' ) {
          this.$container.on('mouseenter.nav', this.area_selector, function ( e ) {
            if ( !$(this).is(self.phantom_selector) ) {
              self.current(this, 'mouseenter');
            }
          });
        }

        $navTypeEls = this.$container.find('[data-nav_type]');

        if ( this.$container.attr('data-nav_type') ) {
          $navTypeEls = $navTypeEls.add(this.$container);
        }

        $navTypeEls.each(function () {
          var $el = $(this);
          var navType = $el.attr("data-nav_type");
          $el.removeAttr('data-nav_type');
          //self.setLoop($el);
          var loop = $el.attr("data-nav_loop");

          self.siblingsTypeNav($el, navType, loop);
        });

        $body
          .bind('keydown.navigation', onKeyDown)
          .bind('nav_key:enter.navigation', onClick);

        if ( !cur ) {
          cur = this.$container.find(this.area_selector).filter(':visible')[0];
        }
        this.current(cur);
        return this;
      },

      siblingsTypeNav: function ( $container, type, loop ) {
        var self = this;
        $container.on('nav_key:left nav_key:right nav_key:up nav_key:down', this.area_selector,
          function ( e ) {
            var last = 'last',
              cur = self.current(),
              next,
              fn;

            //check if direction concur with declared
            if ( (type == 'hbox' && e.keyName == 'left') ||
                 (type == 'vbox' && e.keyName == 'up') ) {
              fn = 'prev';
            } else if ( (type == 'hbox' && e.keyName == 'right') ||
                        (type == 'vbox' && e.keyName == 'down') ) {
              fn = 'next';
            }

            if ( fn == 'next' ) {
              last = 'first';
            }

            if ( fn ) {
              next = cur[fn](self.area_selector);

              while ( next.length && !next.is(':visible') ) {
                next = next[fn](self.area_selector);
              }

              if ( !next.length && loop ) {
                next = $container.find(self.area_selector).filter(':visible')[last]();
              }

              if ( next.length ) {
                nav.current(next);
                return false;
              }
            }
          });
      },

      /**
       * Turn off navigation from container, disable navigation from current element
       * @return {Navigation}
       */
      off: function () {
        if ( navCur ) {
          navCur.removeClass(this.higlight_class).trigger('nav_blur');
        }
        this.$container && this.$container.off('mouseenter.nav').off('.loop');
        $body.unbind('.navigation');
        navCur = null;
        return this;
      },

      /**
       * Find first nav el & set navigation on them
       */
      findSome: function () {
        var cur;

        if ( !(navCur && navCur.is(':visible')) ) {
          cur = this.$container.find(this.area_selector).filter(':visible').eq(0);
          this.current(cur);
        }

        return this;
      },

      /**
       * Find closest to $el element by dir direction
       * @param $el {jQuery} - source element
       * @param dir {string} - direction up, right, down, left
       * @param navs {jQuery} - object, contains elements to search
       * @returns {*}
       */
      findNav: function ( $el, dir, navs ) {
        var user_defined = this.checkUserDefined($el, dir);

        if ( user_defined ) {
          return user_defined;
        }

        var objBounds = $el[0].getBoundingClientRect(),
          arr = [],
          curBounds = null,
          cond1, cond2, i , l;

        for ( i = 0, l = navs.length; i < l; i++ ) {
          curBounds = navs[i].getBoundingClientRect();

          if ( curBounds.left == objBounds.left &&
               curBounds.top == objBounds.top ) {
            continue;
          }

          switch ( dir ) {
            case 'left':
              cond1 = objBounds.left > curBounds.left;
              break;
            case 'right':
              cond1 = objBounds.right < curBounds.right;
              break;
            case 'up':
              cond1 = objBounds.top > curBounds.top;
              break;
            case 'down':
              cond1 = objBounds.bottom < curBounds.bottom;
              break;
            default:
              break;
          }

          if ( cond1 ) {
            arr.push({
              'obj': navs[i],
              'bounds': curBounds
            });
          }
        }

        var min_dy = 9999999, min_dx = 9999999, min_d = 9999999, max_intersection = 0;
        var dy = 0, dx = 0, d = 0;

        function isIntersects ( b1, b2, dir ) {
          var temp = null;
          switch ( dir ) {
            case 'left':
            case 'right':
              if ( b1.top > b2.top ) {
                temp = b2;
                b2 = b1;
                b1 = temp;
              }
              if ( b1.bottom > b2.top ) {
                if ( b1.top > b2.right ) {
                  return b2.top - b1.right;
                }
                else {
                  return b2.height;
                }
              }
              break;
            case 'up':
            case 'down':
              if ( b1.left > b2.left ) {
                temp = b2;
                b2 = b1;
                b1 = temp;
              }
              if ( b1.right > b2.left ) {
                if ( b1.left > b2.right ) {
                  return b2.left - b1.right;
                }
                else {
                  return b2.width;
                }
              }
              break;
            default:
              break;
          }
          return false;
        }

        var intersects_any = false;
        var found = false;

        for ( i = 0, l = arr.length; i < l; i++ ) {
          if ( !this.checkEntryPoint(arr[i].obj, dir) ) {
            continue;
          }

          var b = arr[i].bounds;
          var intersects = isIntersects(objBounds, b, dir);
          dy = Math.abs(b.top - objBounds.top);
          dx = Math.abs(b.left - objBounds.left);
          d = Math.sqrt(dy * dy + dx * dx);
          if ( intersects_any && !intersects ) {
            continue;
          }
          if ( intersects && !intersects_any ) {
            min_dy = dy;
            min_dx = dx;
            max_intersection = intersects;
            found = arr[i].obj;
            intersects_any = true;
            continue;
          }

          switch ( dir ) {
            case 'left':
            case 'right':
              if ( intersects_any ) {
                cond2 = dx < min_dx || (dx == min_dx && dy < min_dy);
              }
              else {
                cond2 = dy < min_dy || (dy == min_dy && dx < min_dx);
              }
              break;
            case 'up':
            case 'down':
              if ( intersects_any ) {
                cond2 = dy < min_dy || (dy == min_dy && dx < min_dx);
              }
              else {
                cond2 = dx < min_dx || (dx == min_dx && dy < min_dy);
              }
              break;
            default:
              break;
          }
          if ( cond2 ) {
            min_dy = dy;
            min_dx = dx;
            min_d = d;
            found = arr[i].obj;
          }
        }

        return found;
      },

      /**
       * Return element defied by user
       * Если юзером ничего не определено или направление равно 0, то возвращает false
       * Если направление определено как none, то переход по этому направлению запрещен
       *
       * @param $el - current element
       * @param dir - direction
       * @returns {*}
       */
      checkUserDefined: function ( $el, dir ) {
          var ep = $el.data('nav_ud'),
              result = false,
              res = $el.data('nav_ud_' + dir);
          if (!ep && !res) {
              return false;
          }

          if ( !res ) {
              var sides = ep.split(','),
                  dirs = ['up', 'right', 'down', 'left'];
              if(sides.length !== 4) {
                  return false;
              }

              $el.data({
                  'nav_ud_up': sides[0],
                  'nav_ud_right': sides[1],
                  'nav_ud_down': sides[2],
                  'nav_ud_left': sides[3]
              });

              res = sides[dirs.indexOf(dir)];
          }

          if ( res == 'none' ) {
              result = 'none';
          } else if ( res ) {
              result = $(res).first();
          }
          return result;
      },

      /**
       * Проверяет можно ли войти в элемент с определенной стороны.
       * Работает если у элемента задан атрибут data-nav_ep. Точки входа задаются в атрибуте с помощью 0 и 1 через запятые
       * 0 - входить нельзя
       * 1 - входить можно
       * Стороны указываются в порядке CSS - top, right, bottom, left
       *
       * data-nav_ep="0,0,0,0" - в элемент зайти нельзя, поведение такое же как у элемента не являющегося элементом навигации
       * data-nav_ep="1,1,1,1" - поведение по умолчанию, как без задания этого атрибута
       * data-nav_ep="0,1,0,0" - в элемент можно зайти справа
       * data-nav_ep="1,1,0,1" - в элемент нельзя зайти снизу
       * data-nav_ep="0,1,0,1" - можно зайти слева и справа, но нельзя сверху и снизу
       *
       * @param elem -  проверяемый элемент
       * @param dir - направление
       * @returns {boolean}
       */
      checkEntryPoint: function ( elem, dir ) {
        var $el = $(elem),
          ep = $el.attr('data-nav_ep'),
          res = null;

        if ( !ep ) {
          return true;
        }

        res = $el.attr('data-nav_ep_' + dir);

        if ( res === undefined ) {
          var sides = ep.split(',');
          $el.attr('data-nav_ep_top', sides[0]);
          $el.attr('data-nav_ep_right', sides[1]);
          $el.attr('data-nav_ep_bottom', sides[2]);
          $el.attr('data-nav_ep_left', sides[3]);
          res = $el.attr('data-nav_ep_' + dir);
        }

        return !!parseInt(res);
      }
    };
  }

  nav = window.$$nav = new Navigation();

  $(function () {
    // Navigation events handler
    $(document.body).bind('nav_key:left nav_key:right nav_key:up nav_key:down', function ( e ) {
      var cur = nav.current(),
        $navs,
        n;

      $navs = nav.$container.find(nav.area_selector).filter(':visible');
      n = nav.findNav(cur, e.keyName, $navs);
      n && nav.current(n);
    });
  });

})(this);