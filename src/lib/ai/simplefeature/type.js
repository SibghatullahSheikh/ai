define([], function () {

  var types = {
    POINT: 1,
    LINESTRING: 2,
    POLYGON: 3,
    MULTIPOINT: 4,
    MULTIPOLYGON: 5,
    MULTILINESTRING: 6,
    GEOMETRYCOLLECTION: 7
  };

  if (Object.freeze) {
    Object.freeze(types);
  }
  return types;

});