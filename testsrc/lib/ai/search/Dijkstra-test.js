define([
  'ai/search/Dijkstra',
  'ai/graph/GraphExample'
], function (Dijkstra, GraphExample) {

  module("Dijkstra");

  test('module return', function () {
    equal(typeof Dijkstra.dijkstra, 'function', 'should have function');
  });

  test('dijkstra - distances ', function () {

    var ge = new GraphExample();

    var fromNode = ge.getNode('s');
    var result = Dijkstra.dijkstra.call(ge, fromNode);

    var dists = {
      a: 3,
      b: 7,
      c: 11,
      d: 4,
      e: 6,
      f: 10,
      g: 13,
      s: 0
    };

    for (var i in dists) {
      equal(result.distanceTo(i), dists[i], 'distance to' + i + " is not correct");
    }

  });

  test('dijkstra - paths', function () {

    var ge = new GraphExample();

    var fromNode = ge.getNode('s');

    var result = Dijkstra.dijkstra.call(ge, fromNode);

    var hops = {
      s: [],
      a: ['s'],
      b: ['a', 's'],
      c: ['b', 'a', 's'],
      d: ['s'],
      e: ['d', 's'],
      f: ['e', 'd', 's'],
      g: ['f', 'e', 'd', 's']
    };


    function makePath(acc, node) {
      acc.push(node);
      return acc;
    }

    var refPath,retPath;
    for (var i in hops) {
      refPath = hops[i];
      retPath = result.reduceHopsToStart(i, makePath, []);
      equal(retPath.length, refPath.length, 'path for ' + i + ' should have same length');
      refPath.forEach(function (el, ind) {
        equal(el, retPath[ind], 'hop ' + ind + ' should be same for path to ' + el);
      });
    }


  });

});