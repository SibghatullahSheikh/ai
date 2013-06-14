define([], function() {

  var a;

  function addXY(x, y) {
    var l = a.length;
    a[l] = x;
    a[l + 1] = y;
  }

  function spoolPath(path) {
    a = [];
    path.forEachXY(addXY);
    return a;
  }

  function PathTrace(coordinates) {
    if (coordinates.count() <= 4){
      throw 'Error';
    }
    this._l = coordinates.length;
  }

  PathTrace.prototype = {
    lbrt: function(out_) {
    },
    trace: function(context) {
      var i = 2, l = this._l;
      context.beginPath();

      while(i < l){

      }
    }
  };

});