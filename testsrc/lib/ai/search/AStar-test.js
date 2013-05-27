define([
  'ai/search/AStar',
  'ai/graph/GraphExample'
], function (AStar, GraphExample) {

  module("AStar");

  test('module return', function () {
    equal(typeof AStar.AStar, 'function', 'should have function');
  });

  test('astar', function () {

    var ge = new GraphExample();

    var start = ge.getNode('s');
    var goal = ge.getNode('g');

    var r = AStar.AStar.call(ge, start, goal);

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
      equal(r.distanceTo(i), dists[i]);
    }

    goal = ge.getNode('d');
    r = AStar.AStar.call(ge, start, goal);
    dists = {
      a: 3,
      d: 4
    };

    for (i in dists) {
      equal(r.distanceTo(i), dists[i]);
    }

  });

  test('all nodes', function () {

    var ge = new GraphExample();
    var start = ge.getNode('s');
    var goal = ge.getNode('b');
    var r = AStar.AStar.call(ge, start, goal);

    var acc = [];
    r.reduceFoundNodes(function (acc, node) {
      acc.push(node);
      return acc;
    }, acc);

    equal(acc.length, 4, 'should have found 3 paths');

    var ref = ['s', 'a', 'b', 'd'];

    ref.forEach(function (e) {
      ok(acc.indexOf(e) >= -1, 'should have closed node ' + e);
    });


  });

  test('reduce path', function () {
    var ge = new GraphExample();

    var fromNode = ge.getNode('s');
    var goalnode = ge.getNode('g');
    var result = AStar.AStar.call(ge, fromNode, goalnode);

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

    var refPath, retPath;
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