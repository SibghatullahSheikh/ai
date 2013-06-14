define([
  '../../struct/RTree'
], function(RTree) {

  function PathNode(tracer) {
    this.tracer = tracer;
    this._next = null;
  }

  function PathCollection() {
    this._strokeStyle = 'rgb(255,125,1)';
    this._fillStyle = 'rgb(255,12,1)';
    this._lineWidth = 2;
    this._index = new RTree({
      bf: 16,
      mapToEnvelope: function(tracer) {
        var ob = {};
        tracer.lbrt(ob);
        return ob;
      }
    });

    var self = this;
    this._searchEngine = self._index._searchEngine();
  }

  PathCollection.prototype = {
    constrainWithinRectangle: function(l, b, r, t) {

    },
    draw2d: function(context2d) {
      context2d.strokeStyle = this._strokeStyle;
      context2d.lineWidth = this._lineWidth;
      context2d.fillStyle = this._fillStyle;
      this
    },
    addTrace: function(tracer) {
      var e = new PathNode(tracer);

    }
  };



  return PathCollection;

});