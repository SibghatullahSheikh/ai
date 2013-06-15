define([], function () {


  var coordinateBuffer = (function () {
    //make float buffer and init with floats.
    var b = new Array(2000);
    for (var i = 0; i < b.length; i += 1) {
      b[i] = Math.random();
    }
    return b;
  }());


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

  function PolygonPath(pathStream) {

    polygonVisitor.reset();
    pathStream.visit(polygonVisitor);

    this._paths = polygonVisitor.paths;
    this._coordinates = polygonVisitor.coordinates;

    if (coordinateBuffer.length < this._coordinates.length) {
      //resize the buffer.
      coordinateBuffer = this._coordinates.slice();
    }

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

      var coords = this._coordinates;
      var paths = this._paths;

      var ci = 0;
      var pi, pl, cl;
      for (pi = 0, pl = this._pl; pi < pl; pi += 1) {
        cl = ci + paths[pi];
        context.moveTo(coords[ci++], coords[ci++]);
        while (ci < cl) {
          context.lineTo(coords[ci++], coords[ci++]);
        }
        context.closePath();
      }

    }
  };

  return PolygonPath;
});

