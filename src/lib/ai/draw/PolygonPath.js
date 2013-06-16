define([], function () {


  function makeIntBufferArray(length) {
    var a;
    if (Int32Array) {
      a = new Int32Array(length);
    } else {
      a = new Array(length);
    }
    return a;
  }

  function makeDoubleRawArray(coords) {
    var a;
    if (Float64Array) {
      a = new Float64Array(coords.length);
    } else {
      a = new Array(coords.length);
    }
    for (var i = 0, l = coords.length; i < l; i += 1) {
      a[i] = coords[i];
    }
    return a;
  }

  var polygonVisitor = {
    minx: 0,
    maxx: 0,
    miny: 0,
    maxy: 0,
    coordinates: null,
    paths: null,
    _pi: 0,
    _add: function (x, y) {
      var l = this.coordinates.length;
      this.coordinates[l] = x;
      this.coordinates[l + 1] = y;

      this.minx = Math.min(this.minx, x);
      this.miny = Math.min(this.miny, y);
      this.maxx = Math.max(this.maxx, x);
      this.maxy = Math.max(this.maxy, y);
    },
    moveTo: function (x, y) {
      this.paths[this._pi] = 2;
      this._add(x, y);
    },
    lineTo: function (x, y) {
      this.paths[this._pi] += 2;
      this._add(x, y);
    },
    closePath: function () {
      this._pi += 1;
    },
    reset: function () {
      this.minx = Infinity;
      this.miny = Infinity;
      this.maxy = -Infinity;
      this.maxy = -Infinity;
      this._pi = 0;
      this.paths = [0];
      this.coordinates = [];
    }
  };

  function truncate(x) {
    return x | 0;
  }

  function PolygonPath(pathStream) {

    polygonVisitor.reset();
    pathStream.visit(polygonVisitor);

    this._paths = polygonVisitor.paths;
    this._coordinates = makeDoubleRawArray(polygonVisitor.coordinates);
    this._coordbuffer = makeIntBufferArray(this._coordinates.length);

    this._pl = this._paths.length;
    if (this._l < 6) {
      throw new Error('Polygon requires at least 3 points');
    }

    this._l = polygonVisitor.minx;
    this._r = polygonVisitor.maxx;
    this._b = polygonVisitor.miny;
    this._t = polygonVisitor.maxy;

  }

  PolygonPath.prototype = {
    lbrt: function (out_) {
      out_.l = this._l;
      out_.r = this._r;
      out_.b = this._b;
      out_.t = this._t;
    },
    trace: function (context, trans) {

      var coBuffer = this._coordbuffer;
//      var coBuffer = buffer;
      var paths = this._paths;
      trans.projectAndTruncateForwardCoordinates(this._coordinates, this._coordinates.length, coBuffer);

      var ci = 0;
      var pi, pl, cl;
      for (pi = 0, pl = this._pl; pi < pl; pi++) {
        cl = ci + paths[pi];
        context.moveTo(coBuffer[ci], coBuffer[ci + 1]);
        ci += 2;
        while (ci < cl) {
          context.lineTo(coBuffer[ci], coBuffer[ci + 1]);
          ci += 2;
        }
        context.closePath();
      }

    }



  };

  return PolygonPath;
});
var a = {};

