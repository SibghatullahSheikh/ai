define([], function() {

  function SFVisitor() {
    this._open = false;
    this._type = null;
    this._isLine = null;
    this._
  }

  SFVisitor.prototype = {
    reset: function() {
      this._open = false;
      this._type = null;
      this._isLine = null;
    },
    beginPath: function(){
    },
    closePath: function(){
    }
  };

  function SimpleFeatureTracer() {
    this._sf = null;
  }

  SimpleFeatureTracer.prototype = {
    setSimpleFeature: function(sf) {
      this._sf = sf;
    },
    createTraces: function(simpleFeature) {
      simpleFeature.visit()
    },
    forEachTrace: function(callback) {
    }
  };

  return SimpleFeatureTracer;

});