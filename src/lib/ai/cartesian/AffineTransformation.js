define([], function (Travis) {

  "use strict";

  function AffineTransformation() {
    this._sxa = 1;
    this._sya = 1;
    this._txa = 0;
    this._tya = 0;
  }

  AffineTransformation.prototype = {
    scaleAndTranslation: function (sx, sy, tx, ty) {
      this._sxa = sx;
      this._sya = sy;
      this._txa = tx;
      this._tya = ty;
      return this;
    },
    translation: function (tx, ty) {
      this._txa = tx;
      this._tya = ty;
      return this;
    },
    scale: function (sx, sy) {
      this._sxa = sx;
      this._sya = sy;
      return this;
    },
    scaleForward: function (w, h, out) {
      out.w = w * this._sxa;
      out.h = h * this._sya;
      return this;
    },
    projectForwardCoordinates: function (coordinates, l, out_) {
      var i = 0;
      var sx = this._sxa;
      var sy = this._sya;
      var tx = this._txa;
      var ty = this._tya;
      while (i < l) {
        out_[i++] = coordinates[i] * sx + tx;
        out_[i++] = coordinates[i] * sy + ty;
      }
    },
    projectInverseCoordinates: function (coordinates, l, out_) {
      var i = 0;
      var sx = this._sxa;
      var sy = this._sya;
      var tx = this._txa;
      var ty = this._tya;
      while (i < l) {
        out_[i] = (coordinates[i++] - tx) / sx;
        out_[i] = (coordinates[i++] - ty) / sy;
      }
    },
    projectForward: function (x, y, out_) {
      out_.x = x * this._sxa + this._txa;
      out_.y = y * this._sya + this._tya;
      return out_;
    },
    projectInverse: function (x, y, out_) {
      out_.x = (x - this._txa) / this._sxa;
      out_.y = (y - this._tya) / this._sya;
      return out_;
    }
  };

  AffineTransformation.augment = function (object) {
    for (var i in AffineTransformation.prototype) {
      object[i] = AffineTransformation.prototype[i];
    }
    AffineTransformation.call(object);
  };

  return AffineTransformation;

});