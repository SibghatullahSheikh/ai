define([
  'ai/struct/BinaryHeap'
], function (BinaryHeap) {

  module("BinaryHeap ");

  function makeMinHeap() {
    return new BinaryHeap(function (a, b) {
      return a - b;
    });
  }

  test('module return', function () {
    equal(typeof BinaryHeap, 'function', 'should be a function');
  });

  test('push/pop/size', function () {

    var minHeap = makeMinHeap();

    equal(minHeap.push(0), minHeap, 'should return itself after push');

    equal(minHeap.pop(), 0, 'expected first elem');

    minHeap.push(3);
    minHeap.push(1);
    minHeap.push(10);

    equal(minHeap.size(), 3, 'should be filled');

    equal(minHeap.pop(), 1, 'expected smallest');
    equal(minHeap.pop(), 3, 'expected smallest');
    equal(minHeap.pop(), 10, 'expected smallest');

    equal(minHeap.size(), 0, 'should be empty');

    equal(undefined, minHeap.pop());

  });

  test('peek', function () {

    var minHeap = makeMinHeap();
    minHeap.push(5);
    minHeap.push(-1);
    minHeap.push(100);

    var sizebef = minHeap.size();
    equal(minHeap.peek(), -1, 'should get smallest');
    equal(minHeap.size(), sizebef, 'size should remain same when peeking');
    equal(minHeap.pop(), -1, 'should get peeked');


  });

  test('remove', function () {

    var minHeap = makeMinHeap();

    minHeap.push(3);
    minHeap.push(1);
    minHeap.push(10);

    equal(minHeap.size(), 3, 'should be filled');

    minHeap.remove(3);
    equal(minHeap.pop(), 1, 'should be smallest');
    equal(minHeap.pop(), 10, 'should be smallest');


  });


  test('push/pop random', function () {

    var maxHeap = new BinaryHeap(function (a, b) {
      return b - a;
    });

    var i = 1000;
    while (i--) {
      maxHeap.push(Math.random());
    }

    var previous = maxHeap.pop();
    var elem;

    while (elem = maxHeap.pop()) {
      try {
        ok(elem <= previous, 'elements should decrease in max-heap previous: ' + previous + ' cur ' + elem);
      } catch (e) {

      } finally {
        previous = elem;
      }
    }


  });

});