$(function () {
  "use strict";


  var $body = $(document.body),
    keys = window.$$legend.keys;

  $('.menu-item').on({
    'nav_focus': function () {
      keys.enter('Show content')
    },
    'nav_blur': function () {
      keys.enter('')
    }
  });

  $body.on('nav_focus', '.input-item', function() {
    keys.enter('Show keyboard');
    keys.number('Num input');
  });

  $body.on('nav_blur', '.input-item', function() {
    keys.enter('');
    keys.number('');
  });

  $body.on('nav_focus', '#keyboard_popup', function () {

      keys.enter('Input');
      keys.number('Num input');
      keys.red('Remove symbol');
      keys.green('Complete');
      keys.ret('Hide keyboard');
  });

  $body.on('nav_blur', '#keyboard_popup', function () {

    keys.enter('');
    keys.number('');
    keys.red('');
    keys.green('');
    keys.ret('');
  });

  $body.on('nav_focus', '.navigation-item', function() {
    keys.move('Navigate');
  });

  $body.on('nav_blur', '.navigation-item', function() {
    keys.move('');
  });

  $body.on('nav_focus', '.video-item', function () {
    keys.enter('Play video');
  });

  $body.on('nav_blur', '.video-item', function () {
    keys.enter('');
  });
});