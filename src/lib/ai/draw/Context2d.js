define([
  '../thirdparty/jQuery',
  '../input/Interaction'
], function (jQuery, Interaction) {

  function Context2d() {
    var canvas = document.createElement('canvas');
    this._context = canvas.getContext('2d');
    this._w = canvas.width;
    this._h = canvas.height;

    Interaction.call(this);
    this.enableInteraction(this._context.canvas);
  }

  Context2d.prototype = {

    retrieveSize: function (out_) {
      out_.w = this._w;
      out_.h = this._h;
    },
    getContext2d: function () {
      return this._context;
    },
    draw: function (context) {
      var cnv = this._context.canvas;
      var w = this._w;
      var h = this._h;
      context.drawImage(this._context.canvas, 0, 0, w, h, 0, 0, w, h);
      return this;
    },
    drawToDestination: function (context, sx, sy, sw, sh, dx, dy, dw, dh) {
      context.drawImage(this._context.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      return this;
    },
    copy: function () {
      var con = new Context2d();
      con.size(this._context.canvas.width, this._context.canvas.height);
      this.draw(con);
      return con;
    },
    fit: function () {
      var cp = this.copy();
      var p = jQuery(this._context.canvas).parent();
      if (p) {
        this.size(p.width(), p.height());
      }
      cp.draw(this);
      return this;
    },
    clear: function () {
      this._context.clearRect(0, 0, this._w, this._h);
      return this;
    },
    place: function (node) {
      var canvas = this._context.canvas;
      jQuery(canvas).appendTo('#' + node);
      return this;
    },
    beginPath: function () {
      this._context.beginPath();
      return this;
    },
    closePath: function () {
      this._context.closePath();
      return this;
    },
    fillRect: function (x, y, w, h) {
      this._context.fillRect(x | 0, y | 0, w | 0, h | 0);
      return this;
    },
    strokeRect: function (x, y, w, h) {
      this._context.strokeRect(x | 0, y | 0, w | 0, h | 0);
      return this;
    },
    drawText: function (text, x, y) {
      this._context.fillText(text, x | 0, y | 0);
      return this;
    },
    moveTo: function (x, y) {
      this._context.moveTo(x | 0, y | 0);
      return this;
    },
    lineTo: function (x, y) {
      this._context.lineTo(x | 0, y | 0);
      return this;
    },
    lineWidth: function (w) {
      this._context.lineWidth = w;
      return this;
    },
    strokeStyle: function (clr) {
      this._context.strokeStyle = clr.css();
      return this;
    },
    stroke: function () {
      this._context.stroke();
      return this;
    },
    rotate: function (angle, continuation, scope) {
      this._context.save();
      this._context.rotate(angle);
      continuation.call(scope, this);
      this._context.restore();
      return this;
    },
    fill: function () {
      this._context.fill();
      return this;
    },
    size: function (w, h) {
      var canvas = this._context.canvas;
      canvas.width = w;
      canvas.height = h;
      this._w = w;
      this._h = h;
      return this;
    },
    drawImage: function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
      this._context.drawImage(image, sx | 0, sy | 0, sw | 0, sh | 0, dx | 0, dy | 0, dw | 0, dh | 0);
      return this;
    },
    constrain: function (object) {
      var canvas = this._context.canvas;
      if (object.constrainToRectangle) {
        object.constrainToRectangle(0, 0, canvas.width, canvas.height);
      }
    }
  };

  Interaction.augment(Context2d.prototype);

  return Context2d;

});