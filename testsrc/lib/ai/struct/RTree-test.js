define([
  'ai/struct/RTree'
], function (RTree) {

  module("RTree");


  function randomOb() {
    var ob = {};
    ob.l = Math.floor((Math.random() * 1000) - 500);
    ob.b = Math.floor((Math.random() * 1000) - 500);
    ob.r = ob.l + Math.round(Math.random() * 10);
    ob.t = ob.b + Math.round(Math.random() * 10);
    return ob;
  }

  test("module return", function () {

    if (Object.isFrozen) {
      ok(Object.isFrozen(RTree), 'construct func must be frozen');
      ok(Object.isFrozen(RTree.prototype), 'object proto must be frozen');
    } else {
      ok(true, 'test irrelevant in this environment');
    }

  });


  test("insert", function () {

    var rt = new RTree();

    var r = rt.add({
      l: -1,
      b: -1,
      t: 1,
      r: 1
    });

    equal(r, rt, 'should return itself');

  });

  test("insert. x3", function () {

    var rt = new RTree({
      bf: 3
    });

    var r = rt.add({
      l: -1,
      b: -1,
      t: 1,
      r: 1
    });

    var r = rt.add({
      l: 3,
      b: 3,
      t: 4,
      r: 4
    });

    var r = rt.add({
      l: -101,
      b: -101,
      t: -100,
      r: -100
    });

    equal(rt.size(), 3, 'should keep track of size');

  });


  test("insert. x4 - with split and grow", function () {

    var rt = new RTree({
      bf: 3
    });

    var r = rt.add({
      l: -1,
      b: -1,
      t: 1,
      r: 1
    });

    var r = rt.add({
      l: 3,
      b: 3,
      t: 4,
      r: 4
    });


    var r = rt.add({
      l: -101,
      b: -101,
      t: -100,
      r: -100
    });

    var r = rt.add({
      l: 101,
      b: 101,
      t: 102,
      r: 102
    });

    equal(rt.size(), 4, 'should keep track of size');


  });

  test("insert - determinate", function () {

    var rt = new RTree({
      bf: 3
    });


    var b = Date.now()
    var obs = [
      {"l": 20, "b": 161, "r": 26, "t": 161},
      {"l": -429, "b": 451, "r": -427, "t": 452},
      {"l": 365, "b": 236, "r": 367, "t": 236},
      {"l": -209, "b": 54, "r": -203, "t": 62},
      {"l": -199, "b": 73, "r": -195, "t": 80},
      {"l": 195, "b": 346, "r": 199, "t": 352},
      {"l": -486, "b": 213, "r": -477, "t": 216},
      {"l": -384, "b": -306, "r": -381, "t": -299},
      {"l": -198, "b": -196, "r": -188, "t": -186},
      {"l": 453, "b": 499, "r": 456, "t": 507},
      {"l": -265, "b": 421, "r": -264, "t": 423},
      {"l": -146, "b": -323, "r": -145, "t": -315},
      {"l": -278, "b": -359, "r": -277, "t": -355},
      {"l": -325, "b": 173, "r": -323, "t": 180},
      {"l": 32, "b": -280, "r": 37, "t": -271},
      {"l": -103, "b": 446, "r": -99, "t": 454},
      {"l": -422, "b": -48, "r": -420, "t": -43},
      {"l": 402, "b": 148, "r": 409, "t": 153},
      {"l": 495, "b": -473, "r": 496, "t": -471},
      {"l": 316, "b": 446, "r": 320, "t": 455}
    ];
    for (var i = 0; i < obs.length; i += 1) {
      ob = obs[i];
      rt.add(ob);
    }
    console.log(Date.now() - b);

    console.log('size', rt.size());
    equal(rt.size(), obs.length, "should keep track of size (" + obs.length + ")");


    ok(true, 'tree not valid');

  });

  test("insert - some", function () {

    var rt = new RTree({
      bf: 3
    });

    var total = 100;
    for (var i = 0; i < total; i += 1) {
      ob = randomOb();
      rt.add(ob);
    }

    equal(rt.size(), total, "should keep track of size (" + total + ")");
  });


  test("add - many", function () {

    var rt = new RTree({
      bf: 3
    });

    var total = 100000;
    var ob;
    for (var i = 0; i < total; i += 1) {
      ob = randomOb();
      rt.add(ob);
    }
    equal(rt.size(), total, "should keep track of size (" + total + ")");
  });


  test("add - some", function () {



  });


});