define([], function() {

  function SimpleFeatureLens() {
    this._geom = null;
  }



  SimpleFeatureLens.prototype = {
    setGeometry: function(geojsonGeometry) {
      this._geom = geojsonGeometry;
    },

    /**
     * the visitor must i
     * @param visitor
     */
    visit: function(visitor) {
      var g = this._geom;
      var t = g.type;
      if (t === 'Point'){

      }else if (t === 'LineString'){

      }else if (t === ''){

      }
    }
  };

  return SimpleFeatureLens;

});