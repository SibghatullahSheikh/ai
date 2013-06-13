define([], function () {

  /**
   * revised from
   * c: Martijn Haverbeke, 2007
   * http://eloquentjavascript.net/appendix2.html
   *
   * modified to use comparator instead of score function + decreasable + good parts code-style
   */

  function BinaryHeap(comparator) {
    this._elements = [];
    this._comparator = comparator;
  }

  BinaryHeap.prototype = {

    decreaseKey: function (object) {

    },

    push: function (element) {
      this._elements.push(element);
      this._bubbleUp(this._elements.length - 1);
      return this;
    },

    peek: function () {
      return this._elements[0];
    },

    pop: function () {
      var result = this._elements[0];
      var end = this._elements.pop();
      if (this._elements.length > 0) {
        this._elements[0] = end;
        this._sinkDown(0);
      }
      return result;
    },

    remove: function (node) {

      var i, length, end;
      for (i = 0, length = this._elements.length; i < length; i++) {

        if (this._elements[i] !== node) {
          //not found, continue search.
          continue;
        }

        end = this._elements.pop();
        if (i === length - 1) {
          break;
        }

        this._elements[i] = end;
        this._bubbleUp(i);
        this._sinkDown(i);

        break;
      }
      return this;
    },

    size: function () {
      return this._elements.length;
    },

    _bubbleUp: function (n) {

      var element = this._elements[n];
      var parentN, parent;

      while (n > 0) {

        parentN = Math.floor((n + 1) / 2) - 1;
        parent = this._elements[parentN];

        if (this._comparator(parent, element) <= 0) {
          break;
        }

        this._elements[parentN] = element;
        this._elements[n] = parent;

        n = parentN;

      }
    },

    _sinkDown: function (n) {

      var length = this._elements.length;
      var element = this._elements[n];

      var child2N, child1N, swap, child1, child2, comp;
      while (true) {

        child2N = (n + 1) * 2;
        child1N = child2N - 1;

        swap = null;
        if (child1N < length) {
          child1 = this._elements[child1N];
          if (this._comparator(child1, element) <= 0) {
            swap = child1N;
          }
        }

        if (child2N < length) {
          child2 = this._elements[child2N];
          if (swap === null) {
            comp = this._comparator(child2, element);
          } else {
            comp = this._comparator(child2, child1);
          }
          if (comp <= 0) {
            swap = child2N;
          }
        }


        if (swap === null) {
          break;
        }

        this._elements[n] = this._elements[swap];
        this._elements[swap] = element;
        n = swap;

      }
    }
  };

  return BinaryHeap;
});