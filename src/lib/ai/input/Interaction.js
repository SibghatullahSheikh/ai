define([
  '../thirdparty/Hammer',
  '../thirdparty/jQuery',
  'chopchop/Evented'
], function (Hammer, jQuery, Evented) {


  //append meta tag
  jQuery('head').append('<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">');


  function Interaction() {
    Evented.call(this);
  }

  Interaction.prototype = {
    enableInteraction: function (el) {
      var self = this;

      (function () {

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
        function onWheel(e) {

          var dir;
          if (e.wheelDelta) {
            dir = (e.wheelDelta > 0) ? 1 : -1;
          } else if (e.detail) {
            dir = (e.detail > 0) ? -1 : 1;
          }

          var d = jQuery(el);
          var pos = d.position();
          var x = pos.top;
          var y = pos.left;
          var w = d.width();
          var h = d.height();
          if (x <= e.clientX && e.clientX <= x + w &&
            y <= e.clientY && e.clientY <= y + h) {
            self.emit('wheel', {
              x: e.clientX - x,
              y: e.clientY - y,
              dir: dir
            })
          }
        }

        if (document.attachEvent) { //if IE (and Opera depending on user setting)
          document.attachEvent("on" + mousewheelevt, onWheel);

        } else if (document.addEventListener) {
          document.addEventListener(mousewheelevt, onWheel);
        }
      }());


      var previousX, previousY;

//          Hammer(el).on("swipeleft", function (e) {
////            console.log('swipe left', e)
//          });
//          Hammer(el).on("swiperight", function (e) {
////            console.log('swipe right', e)
//          });
      Hammer(el).on("drag", function (ev) {

        ev.preventDefault();
        ev.stopPropagation();
        ev.gesture.stopPropagation();
        ev.gesture.preventDefault();
        var dx = ev.gesture.center.pageX - previousX;
        var dy = ev.gesture.center.pageY - previousY;
        self.emit('drag', {
          dx: dx,
          dy: dy
        });
        previousX = ev.gesture.center.pageX;
        previousY = ev.gesture.center.pageY;
      });

      Hammer(el).on("dragstart", function (e) {
        previousX = e.gesture.center.pageX;
        previousY = e.gesture.center.pageY;
      });
//          Hammer(el).on("dragend", function (e) {
////            console.log('dragend', e)
//          });
//          Hammer(el).on("touch", function (e) {
////            console.log('touch', e)
//          });

      Hammer(el).on("release", function (e) {
//            console.log('release', e)
      });

//          Hammer(el).on("hold", function (e) {
////            console.log('hold', e)
//          });
//          Hammer(el).on("tap", function (e) {
////            console.log('tap', e)
//          });
//          Hammer(el).on("doubletap", function (e) {
////            console.log('doubletap', e)
//          });
//          Hammer(el).on("swipe", function (e) {
////            console.log('swipe', e)
//          });
//          Hammer(el).on("transformstart", function (e) {
//            console.log('transformstart', e)
//          });
//          Hammer(el).on("transform", function (e) {
//            console.log('transform', e)
//            console.log(e.gesture);
//          });
//          Hammer(el).on("transformend", function (e) {
////            console.log('transformend', e)
//          });
//          Hammer(el).on("rotate", function (e) {
////            console.log('rotate', e)
//          });


      Hammer(el).on("pinch", function (e) {
//            console.log('pinch', e);

        glob = e;
        var g = e.gesture;
//            console.log('touches', g.touches[0], g.touches[1]);
        var cx = g.center.x;
        var cy = g.center.y;
        var scale = g.scale;
        self.emit('pinch', {
          scale: scale,
          x: cx,
          y: cy
        })
      });

      return this;
    }
  };

  Evented.augment(Interaction.prototype);

  Interaction.augment = function (ob) {
    for (var i in Interaction.prototype) {
      ob[i] = Interaction.prototype[i];
    }
    return ob;
  };

  return Interaction;

});