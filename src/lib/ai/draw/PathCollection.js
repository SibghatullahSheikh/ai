define([
  '../struct/RTree',
  '../environment'
], function (RTree, environment) {


  var mapToEnvelope = (function () {
    var envelope = {l: 0, b: 0, r: 0, t: 0};
    return function (tracer) {
      tracer.lbrt(envelope);
      return new RTree.LBRTEnvelope(envelope);
    };
  }());


  function PathCollection() {
    this._strokeStyle = 'rgb(255,125,1)';
    this._fillStyle = 'rgb(255,12,1)';
    this._lineWidth = 2;
    this._index = new RTree({
      bf: 16,
      mapToEnvelope: mapToEnvelope
    });

    this._screenRect = [0, 600, 1024, 0];
    this._searchEnvelope = new RTree.LBRTEnvelope({l: 0, b: 0, r: 640, t: 90});


    this._se = this._index.searchEngine();

  }

  PathCollection.prototype = {

    constrain: function (l, b, r, t) {
      this._screenRect[0] = l;
      this._screenRect[1] = b;
      this._screenRect[2] = r;
      this._screenRect[3] = t;
    },

    setTransformation: function (t) {
      this._trans = t;
    },

    _updateSearchEnvelope: (function () {
      var buffer = [0, 0, 0, 0];
      return function () {
        this._trans.projectInverseCoordinates(this._screenRect, 4, buffer);
        this._searchEnvelope.update(buffer[0], buffer[1], buffer[2], buffer[3]);
      };
    }()),
    _traceAndStrokeFill: (function () {
      var implementations = {
        standard: function (context2d, objects, l) {
          var trans = this._trans;
          context2d.beginPath();
          for (var i = 0; i < l; i += 1) {
            objects[i].trace(context2d, trans);
          }
          context2d.strokeStyle = this._strokeStyle;
          context2d.lineWidth = this._lineWidth;
          context2d.fillStyle = this._fillStyle;
          context2d.fill();
          context2d.stroke();
        },
        chrome: function (context2d, objects, l) {
          var trans = this._trans;
          context2d.strokeStyle = this._strokeStyle;
          context2d.lineWidth = this._lineWidth;
          context2d.fillStyle = this._fillStyle;
          for (var i = 0; i < l; i += 1) {
            context2d.beginPath();
            objects[i].trace(context2d, trans);
            context2d.fill();
            context2d.stroke();
          }
        }
      };

      if (environment.browser.webkit) {
        console.log('chrome exception');
        return implementations.chrome;
      } else {
        return implementations.standard;
      }

    }()),

    draw: (function () {

      var objects = [];
      var count = 0;

      function collect(object) {
        objects[count] = object;
        count += 1;
      }

      return function (context2d) {
        this._updateSearchEnvelope();
        this._se.setSearchEnvelope(this._searchEnvelope);
        count = 0;
        this._se.forEach(collect);
        this._traceAndStrokeFill(context2d, objects, count);
        return true;
      };
    }()),
    addTrace: function (trace) {
      this._index.add(trace);
    }
  };


  return PathCollection;

});