define([
  './RenderLoop',
  './Context2d',
  '../cartesian/AffineTransformation'
], function (RenderLoop, Context2d, AffineTransformation) {


  function Map(node) {

    var self = this;

    this._context = new Context2d();
    this._context.place(node);
    this._context.fit();

    window.onresize = function () {
      self._context.fit();
    };

    this._dH = this._context.on('drag', function (d) {
      self.translate(d.dx, d.dy);
    });

    this._wH = this._context.on('wheel', function (w) {
      var scale = (w.dir > 0) ? 1.3 : 1 / 1.3;
      self.scaleOn(w.x, w.y, scale, scale);
    });

    this._trans = new AffineTransformation();
    this._drawables = [];

    var size = {w: 0, h: 0};


    this._renderLoop = new RenderLoop(function () {
      var d;

      var rawContext = self._context.getContext2d();
      var complete = true;
      var drawcom;
      self._context.clear();
      for (var i = 0; i < self._drawables.length; i += 1) {
        d = self._drawables[i];
        if (d.setTransformation) {
          d.setTransformation(self._trans);
        }
        if (d.constrain) {
          self._context.retrieveSize(size);
          d.constrain(0, size.h, size.w, 0);
        }
        drawcom = d.draw(rawContext);

        complete =  (drawcom && complete);
      }
      return complete;
    });

  }

  Map.prototype = {
    _flagInvalid: function () {
      this._renderLoop.nudge();
      return this;
    },
    add: function (drawable) {
      this._drawables.push(drawable);
      this._flagInvalid();
      return this;
    },
    translate: function (tx, ty) {
      this._trans.translate(tx, ty);
      this._flagInvalid();
    },
    scaleAndTranslate: function (sx, sy, tx, ty) {
      this._trans.scaleAndTranslate(sx, sy, tx, ty);
      this._flagInvalid();
    },
    scaleOn: (function () {
      var out = {x: 0, y: 0};
      var parameters = {sx: 0, sy: 0, tx: 0, ty: 0};
      return function (fx, fy, sxDelta, syDelta) {
        this._trans.projectInverse(fx, fy, out);
        this._trans.retrieveParameters(parameters);
        parameters.sx *= sxDelta;
        parameters.sy *= syDelta;
        parameters.tx = (fx - out.x * parameters.sx);
        parameters.ty = (fy - out.y * parameters.sy);
        this._trans.updateParameters(parameters);
        this._flagInvalid();
        return this;
      }
    }())
  };

  return Map;

});