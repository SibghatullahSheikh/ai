define([
  '../struct/RTree'
], function (RTree) {

  var mapToEnvelope = (function () {
    var envelope = {l: 0, b: 0, r: 0, t: 0};
    return function (tracer) {
      tracer.lbrt(envelope);
      return new RTree.LBRTEnvelope(envelope);
    };
  }());


  function PathCollection(transformation) {
    this._strokeStyle = 'rgb(255,125,1)';
    this._fillStyle = 'rgb(255,12,1)';
    this._lineWidth = 2;
    this._index = new RTree({
      bf: 16,
      mapToEnvelope: mapToEnvelope
    });

    this._rect = new RTree.LBRTEnvelope({l: -Infinity, b: -Infinity, r: Infinity, t: Infinity});

    this._trans = transformation;

  }

  PathCollection.prototype = {


    draw: (function () {

      var implementations = {
        standard: function (context2d) {
          var objects = this._index.search(this._rect);
          var trans = this._trans;
          context2d.beginPath();
          for (var i = 0, l = objects.length; i < l; i += 1) {
            objects[i].trace(context2d, trans);
          }
          context2d.strokeStyle = this._strokeStyle;
          context2d.lineWidth = this._lineWidth;
          context2d.fillStyle = this._fillStyle;
          context2d.fill();
          context2d.stroke();
        }
      };

      return implementations.standard;

    }()),
    addTrace: function (trace) {
      this._index.add(trace);
    }
  };


  return PathCollection;

});