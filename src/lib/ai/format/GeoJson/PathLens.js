define(['../../simplefeature/Type'], function (type) {

  function PathLens() {
    this._geom = null;
    this._type = null;
  }

  PathLens.prototype = {
    setGeometry: function (geojsonGeometry) {
      this._geom = geojsonGeometry;
    },

    simpleFeatureType: function () {
      return type[this._geom.type];
    },

    visit: function (visitor) {
      var t = this._geom.type;
      var coords = this._geom.coordinates;
      if (t === 'Polygon') {
        coords.forEach(function (path) {
          var point = path[0];
          visitor.moveTo(point[0], point[1]);
          for (var i = 1; i < path.length; i += 1) {
            point = path[i];
            visitor.lineTo(point[0], point[1]);
          }
          visitor.closePath();
        });
      } else if (t === 'MultiPolygon') {
        coords.forEach(function (polygon) {
          polygon.forEach(function (path) {
            var point = path[0];
            visitor.moveTo(point[0], point[1]);
            for (var i = 1; i < path.length; i += 1) {
              point = path[i];
              visitor.lineTo(point[0], point[1]);
            }
            visitor.closePath();
          });
        });
      } else {
        throw 'Not Implemented';
      }
    }
  };

  return PathLens;

});