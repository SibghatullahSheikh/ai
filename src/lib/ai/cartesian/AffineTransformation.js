define([], function (Travis) {

  "use strict";

  function AffineTransformation() {
    this._sxa = 1;
    this._sya = 1;
    this._txa = 0;
    this._tya = 0;
  }

  AffineTransformation.prototype = {
    retrieveParameters: function (out_) {
      out_.sx = this._sxa;
      out_.sy = this._sya;
      out_.tx = this._txa;
      out_.ty = this._tya;
    },
    updateParameters: function (params) {
      this._sxa = params.sx;
      this._sya = params.sy;
      this._txa = params.tx;
      this._tya = params.ty;
      return this;
    },
    scaleAndTranslate: function (sx, sy, tx, ty) {
      this._sxa = sx;
      this._sya = sy;
      this._txa = tx;
      this._tya = ty;
      return this;
    },
    translate: function(tx,ty){
      this._txa += tx;
      this._tya += ty;
      return this;
    },
    translation: function (tx, ty) {
      this._txa = tx;
      this._tya = ty;
      return this;
    },
    scaleForward: function (w, h, out) {
      out.w = w * this._sxa;
      out.h = h * this._sya;
      return this;
    },
    projectAndTruncateForwardCoordinates: function (coordinates, length, out_) {
      var i = -1;
      var sx = this._sxa;
      var sy = this._sya;
      var tx = this._txa;
      var ty = this._tya;
      while (i < length) {
        out_[++i] = (coordinates[i] * sx + tx) | 0;
        out_[++i] = (coordinates[i] * sy + ty) | 0;
      }
    },
    projectForwardCoordinates: function (coordinates, length, out_) {
      var i = -1;
      var sx = this._sxa;
      var sy = this._sya;
      var tx = this._txa;
      var ty = this._tya;
      while (i < length) {
        out_[++i] = coordinates[i] * sx + tx;
        out_[++i] = coordinates[i] * sy + ty;
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

  return AffineTransformation;

});