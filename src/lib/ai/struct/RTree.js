define([], function () {
//  "use strict";

  var ob = {};
  var mapToBbox = function (x) {
    return new LBRTEnvelope(x);
  };

  window.drawDebug = function (node, probe, probe2) {

    window.context.canvas.width = window.context.canvas.width;
    window.rt.draw(window.context);
    var c = window.context;

    if (node) {
      node = node.envelope;
      c.strokeStyle = 'rgba(0,144,255,1)';
      c.lineWidth = 3;
      c.strokeRect(node.l, node.b, node.r - node.l, node.t - node.b);
    }

    if (probe) {
      node = probe;
      c.fillStyle = 'rgba(0,255,255,0.1)';
      c.fillRect(node.l, node.b, node.r - node.l, node.t - node.b);
    }

    if (probe2) {
      node = probe2;
      c.fillStyle = 'rgba(255,0,255,0.1)';
      c.fillRect(node.l, node.b, node.r - node.l, node.t - node.b);
    }
  };

  var pickSeedsAngTan = (function () {

    //ang tan linear split.
    var accumulator = {
      reset: function () {
        this.leftmost = null;
        this.rightmost = null;
        this.topmost = null;
        this.bottommost = null;
        this.lo = null;
        this.bo = null;
        this.ro = null;
        this.to = null;
        this.count = 0;
        this.first = null;
        this.second = null;
      }
    };

    function selectExtremes(ac, object) {

      var box = object.envelope;
      if (ac.count === 0) {
        ac.leftmost = ac.rightmost = ac.topmost = ac.bottommost = box;
        ac.lo = ac.ro = ac.to = ac.bo = object;
        ac.first = object;
      } else {
        if (box.r < ac.leftmost.r) {
          ac.leftmost = box;
          ac.lo = object;
        }
        if (box.l > ac.rightmost.l) {
          ac.rightmost = box;
          ac.ro = object;
        }
        if (box.t < ac.bottommost.t) {
          ac.bottommost = box;
          ac.bo = object;
        }
        if (box.b > ac.topmost.b) {
          ac.topmost = box;
          ac.to = object;
        }

        if (ac.count === 1) {
          ac.second = object;
        }
      }
      ac.count += 1;
      return ac;
    }

    return function (parent, nodeCollection, out_) {

      //find the 4 extremes.
      accumulator.reset();
      accumulator = nodeCollection.reduce(selectExtremes, accumulator);

      var w = parent.envelope._w;
      var h = parent.envelope._h;

      var heightNormalizationFactor = w / h;
      var wdiff = Math.abs(accumulator.rightmost.l - accumulator.leftmost.r);
      var hdiff = Math.abs((accumulator.topmost.b - accumulator.bottommost.t) * heightNormalizationFactor);

      if (wdiff > hdiff) {
        if (accumulator.lo !== accumulator.ro) {
          out_.seed1 = accumulator.lo;
          out_.seed2 = accumulator.ro;
        } else if (accumulator.bo !== accumulator.to) {
          out_.seed1 = accumulator.bo;
          out_.seed2 = accumulator.to;
        } else {
          //fallback. one node is furthest from all sides (how it this possible (??))
          out_.seed1 = accumulator.first;
          out_.seed2 = accumulator.second;
        }
      } else {
        if (accumulator.bo !== accumulator.to) {
          out_.seed1 = accumulator.bo;
          out_.seed2 = accumulator.to;
        } else if (accumulator.lo !== accumulator.ro) {
          out_.seed1 = accumulator.lo;
          out_.seed2 = accumulator.ro;
        } else {
          //fallback. one node is furthest to all sides.
          out_.seed1 = accumulator.first;
          out_.seed2 = accumulator.second;
        }

      }

    };
  }());

  function LBRTEnvelope(ob) {
    this.l = ob.l;
    this.r = ob.r;
    this.b = ob.b;
    this.t = ob.t;
    this._w = this.r - this.l;
    this._h = this.t - this.b;
  }

  LBRTEnvelope.prototype = {
    toString: function () {
      return '[' + [this.l, this.b, this.r, this.t].join(',') + ']';
    },
    copy: function () {
      return new LBRTEnvelope(this);
    },
    width: function () {
      return this._w;
    },
    height: function () {
      return this._h;
    },
    empty: function () {
      this.l = Infinity;
      this.r = -Infinity;
      this.b = Infinity;
      this.t = -Infinity;
      this._w = 0;
      this._h = 0;
    },

    expansionCost: function (bo) {

      var current = (this._w) * ( this._h);

      var l = (this.l < bo.l) ? this.l : bo.l;
      var b = (this.b < bo.b) ? this.b : bo.b;
      var r = (this.r > bo.r) ? this.r : bo.r;
      var t = (this.t > bo.t) ? this.t : bo.t;

      var enlarged = (r - l) * (t - b);
      return enlarged - current;

    },
    interacts: function (b) {
      return !(this.l > b.r || this.r < b.l || this.b > b.t || this.t < b.b);
    },
    include: function (b) {
      this.l = (this.l < b.l) ? this.l : b.l;
      this.b = (this.b < b.b) ? this.b : b.b;
      this.r = (this.r > b.r) ? this.r : b.r;
      this.t = (this.t > b.t) ? this.t : b.t;
      this._w = this.r - this.l;
      this._h = this.t - this.b;
      return this;
    },
    contains: function (b) {
      return (b.r <= this.r && b.t <= this.t && b.l >= this.l && b.b >= this.b);
    },
    equals: function (b) {
      return (b.r === this.r && b.t === this.t && b.l === this.l && b.b === this.b);
    }
  };

  function Entry(envelope, object) {
    this.__nextSibling = null;
    this.envelope = envelope;
    this.object = object;
  }

  function SubTree(envelope, bf, pickseeds) {

    //the children are stored as a linked list, with the head attached to the parent itself.
    this.__firstChild = null;
    this.__nextSibling = null;

    //trees are searched depth first.
    //in _search(), we use .__nextSearch to string together a linked list of nodes we still need to explore.
    this.__nextSearch = null;

    this.leaf = false;
    this.envelope = envelope;
    this.size = 0;
    this.bf = bf;
    this.parent = null;
    this._ps = pickseeds;
    this.depth = 0;
  }

  SubTree.prototype = {

    draw: function (context) {

      var env = this.envelope;

      context.lineWidth = this.depth + 1;
      context.strokeStyle = 'rgba(0,0,0,1)';
      context.strokeRect(env.l, env.b, env.r - env.l, env.t - env.b);

      var child = this.__firstChild;

      while (child) {
        if (child.draw) {
          child.draw(context);
        } else {
          context.fillStyle = 'rgba(255,0,0,0.4)';
          context.strokeStyle = 'rgba(255,0,0,1)';
          context.lineWidth = 1;
          env = child.envelope;
          context.fillRect(env.l, env.b, env.r - env.l, env.t - env.b);
          context.strokeRect(env.l, env.b, env.r - env.l, env.t - env.b);
        }
        child = child.__nextSibling;
      }

    },

    __validate: function () {
      if (!DEBUG) {
        return;
      }
      var child = this.__firstChild;
      var nwbb = this.envelope.copy();
      nwbb.empty();

      var counter = 0;
      while (child) {

        if (this.leaf) {
          if (!(child instanceof Entry)) {
            console.log(' child should be an entry.');
            throw 'Child is not an enrtr';
          }
        } else {
          child.__validate();
        }

        counter += 1;
        if (!this.envelope.contains(child.envelope)) {
          console.log('envelope doesnt contain child envelope', 'this', this.envelope, 'child', child.envelope);
          throw 'Does not contain!';
        }
        nwbb.include(child.envelope);
        child = child.__nextSibling;

      }

      if (counter !== this.size) {
        console.log('count is not correct');
        throw 'Incorrect count';
      }

      if (counter > this.bf) {
        console.log('too many childs..');
        console.log('OFFENDING NODE');
        this.__dump();
        throw 'too many!';
      }

      if (!nwbb.equals(this.envelope)) {
        console.log('OFFENDING NODE');
        this.__dump();
        console.log('childrend do not snugly fit envelope', nwbb, this.envelope);

        if (window.context && window.rt) {
          window.context.canvas.width = window.context.canvas.width;
          window.rt.draw(window.context);

          var c = window.context;
          c.fillStyle = 'rgba(0,0,255,0.2)';
          c.fillRect(this.envelope.l, this.envelope.b, this.envelope.r - this.envelope.l, this.envelope.t - this.envelope.b);

          c.strokeStyle = 'rgba(0,255,0,1)';
          c.strokeRect(nwbb.l, nwbb.b, nwbb.r - nwbb.l, nwbb.t - nwbb.b);
        }

        throw 'No snug fit!';
      }

    },

    __dump: function () {
      console.log('   DUMP NODE');
      console.log('   node: leaf', this.leaf);
      console.log('   node: parent', this.parent);
      console.log('   bbox: ', this.envelope.toString());
      console.log('   size', this.size);
      console.log('   depth', this.depth);
      var chlid = this.__firstChild;
      var nwbb = this.envelope.copy();
      nwbb.empty();
      while (chlid) {
        console.log('    ', chlid.envelope.toString(), this.envelope.contains(chlid.envelope));
        nwbb.include(chlid.envelope);
        chlid = chlid.__nextSibling;
      }
      console.log('  ', nwbb.toString(), nwbb.equals(this.envelope));
    },

    _search: function (envelope, callback) {

      //check for interaction
      var nodeToExplore = this;
      var child, nw;

      //do depth first exploration.
      //link nodes in LinkedList-fashion to simulate a stack, using the .__nextSearch property
      //better than array
      //- we can keep memory usage constant.
      //- updating stack is in constant time
      //- ---> search is FAST.
      //careful
      //- _search is obviously not reentrant. But this is not a problem, since we do not probide access to _search in public api.

      while (nodeToExplore) {
        if (nodeToExplore.leaf) {
          //if leaf, explore kids and callback.
          child = (nodeToExplore.__firstChild);
          while (child) {
            if (child.envelope.interacts(envelope)) {
              callback(child.object);
            }
            child = child.__nextSibling;
          }
        } else {
          child = (nodeToExplore.__firstChild);
          while (child) {
            if (child.envelope.interacts(envelope)) {
              //add it to the stack, and explore it later.
              child.__nextSearch = nodeToExplore.__nextSearch;
              nodeToExplore.__nextSearch = child;
            }
            child = child.__nextSibling;
          }
        }

        //shove the new branch on to the stack.
        nw = nodeToExplore.__nextSearch;
        nodeToExplore.__nextSearch = null;//kill the useless pointer.
        nodeToExplore = nw;
      }

    },

    _insert: (function () {
      var splits = {n1: null, n2: null};
      return  function _insert(object, envelope, treeBase) {

        var bestNode = this;
        var entry = new Entry(envelope, object);
        var child, bestCost, tentativeCost;

        //insert the node
        while (bestNode) {

          //expand envelopes on the way down
          //(this way, we do not need to propagate adjustments back up the tree after insertion)
          bestNode.envelope.include(envelope);

          if (bestNode.leaf) {
            //found the best leaf node
            entry.__nextSibling = bestNode.__firstChild;
            bestNode.__firstChild = entry;
            bestNode.size += 1;
            entry.parent = bestNode;
            break;
          } else {
            bestCost = Infinity;
            child = bestNode.__firstChild;

            //find child with least cost.
            while (child) {
              tentativeCost = child.envelope.expansionCost(envelope);
              if (tentativeCost < bestCost) {
                bestCost = tentativeCost;
                bestNode = child;
              }
              child = child.__nextSibling;
            }
          }
        }

        //split & propagate.
        var nextNode = bestNode;
        var node1, node2, parent, newRoot, rootenvelope;

        while (nextNode) {

          if (nextNode.size > nextNode.bf) {

            nextNode._split(splits);

            //must propagate the bounding box change..
            node1 = splits.n1;
            node2 = splits.n2;
            parent = node1.parent;
            if (parent) {
              //add to the parent.
              node2.__nextSibling = parent.__firstChild;
              parent.__firstChild = node2;
              parent.size += 1;

              //propagate up
              nextNode = parent;
            } else {

              //grow new root.
              rootenvelope = node1.envelope.copy();
              rootenvelope.include(node2.envelope);
              newRoot = new SubTree(rootenvelope, nextNode.bf, nextNode._ps);
              newRoot.leaf = false;

              //add the 2 children to the new root.
              node1.__nextSibling = null;
              node2.__nextSibling = node1;
              newRoot.__firstChild = node2;

              node1.parent = newRoot;
              node2.parent = newRoot;
              newRoot.size = 2;
              newRoot.depth = node1.depth + 1;//keep track of depth (debugging purposes only)

              //attach new root to base.
              treeBase._root = newRoot;
              nextNode = null;
            }
          } else {
            nextNode = null;
          }
        }

      };

    }()),

    _split: (function () {

      var seeds_ = {seed1: null, seed2: null};
      if (Object.seal) {
        Object.seal(seeds_);
      }

      var child;
      //childcollection. 2nd parameter of public pickSeeds API.
      //only provide access to children with array-comprehension methods and not the actual underlying LinkedList data structure
      //for convenience, provide both forEach and reduce.
      var counter = 0;
      var childCollection = {
        forEach: function (callback) {
          while (child) {
            callback(child);
            child = child.__nextSibling;
            counter += 1;
          }
        },
        reduce: function (fold, accumulator) {
          while (child) {
            accumulator = fold(accumulator, child);
            child = child.__nextSibling;
            counter += 1;
          }
          return accumulator;
        }
      };

      return function (out_) {

        //keep track of the first child.
        var childHead = this.__firstChild;

        //pick seeds. just reuse same childcollection to
        child = childHead;
        counter = 0;
        seeds_.seed1 = null;
        seeds_.seed2 = null;
        this._ps(this, childCollection, seeds_);
        var seed1 = seeds_.seed1;
        var seed2 = seeds_.seed2;
        if (seed1 === seed2) {
          //since pick seeds (this._ps) is public interaction point, do rough check on the results.
          //tree will degenerate completely if split fails.
          console.log('count', counter);
          console.log(seed1);
          console.log(seed2);
          window.glob = childCollection;
          throw new Error('Seeds should be different');
        } else if (seed1 === null) {
          window.glob = childCollection;
          throw new Error('Seed1 is null');
        } else if (seed2 === null) {
          window.glob = childCollection;
          throw new Error('Seed2 is null');
        }

        //reuse 'this'
        var node1 = this;
        node1.__firstChild = seed1;
        node1.size = 1;
        node1.envelope.empty();
        node1.envelope.include(seed1.envelope);

        //create 1 new node
        var node2 = new SubTree(seed2.envelope.copy(), this.bf, this._ps);
        node2.__firstChild = seed2;
        node2.parent = node1.parent;
        node2.size = 1;
        node2.depth = node1.depth;
        node2.leaf = node1.leaf;

        //reassign remaining nodes;
        var cost1, cost2, oldNext;
        while (childHead) {
          oldNext = childHead.__nextSibling;
          if (childHead === seed1) {
            seed1.__nextSibling = null;
            seed1.parent = node1;
          } else if (childHead === seed2) {
            seed2.__nextSibling = null;
            seed2.parent = node2;
          } else {

            cost1 = node1.envelope.expansionCost(childHead.envelope);
            cost2 = node2.envelope.expansionCost(childHead.envelope);

            if (cost1 < cost2) {
              //assign to first
              childHead.__nextSibling = node1.__firstChild;
              node1.__firstChild = childHead;
              node1.size += 1;
              node1.envelope.include(childHead.envelope);
              childHead.parent = node1;
            } else {
              //assign to second node
              childHead.__nextSibling = node2.__firstChild;
              node2.__firstChild = childHead;
              node2.size += 1;
              node2.envelope.include(childHead.envelope);
              childHead.parent = node2;
            }
          }

          childHead = oldNext;
        }

        out_.n1 = node1;
        out_.n2 = node2;

      };
    }())

  };

  function RTree(options) {
    options = options || ob;
    this._root = null;
    this._mapToEnvelope = options.mapToEnvelope || mapToBbox;
    this._pickSeeds = options.pickSeedsFold || pickSeedsAngTan;
    this._bf = options.bf || 3;
    this._size = 0;
    if (Object.seal) {
      Object.seal(this);
    }
  }

  RTree.LBRTEnvelope = LBRTEnvelope;

  RTree.prototype = {
    draw: function (context) {
      if (this._root) {
        this._root.draw(context);
      }
    },
    size: function () {
      return this._size;
    },
    insert: function (object, envelope) {
      if (!this._root) {
        this._root = new SubTree(envelope.copy(), this._bf, this._pickSeeds);
        this._root.leaf = true;
      }
      this._root._insert(object, envelope, this);
      this._size += 1;
      return this;
    },
    add: function (object) {
      var envelope = this._mapToEnvelope(object);
      return this.insert(object, envelope);
    },
    searchEngine: function () {
      var self = this;
      var envelope, folder, accumulator;
      var spool = function (it) {
        accumulator = folder(accumulator, it);
      };
      var searchEngine = {
        setSearchEnvelope: function (env) {
          envelope = env;
        },
        forEach: function (cb) {
          if (self._root) {
            self._root._search(envelope, cb);
          }
        },
        reduce: function (fold, accum) {
          folder = fold;
          accumulator = accum;
          if (self._root) {
            self._root._search(envelope, spool);
          }
          return accumulator;
        }
      };
      if (Object.freeze) {
        Object.freeze(searchEngine);
      }
      return searchEngine;
    },
    search: (function () {
      var ret;
      var append = function (ob) {
        ret[ret.length] = ob;
      };
      return function (envelope) {
        ret = [];
        if (this._root) {
          this._root._search(envelope, append);
        }
        return ret;
      };
    }())

  };

  if (Object.freeze) {
    Object.freeze(RTree);
    Object.freeze(RTree.prototype);
    Object.freeze(RTree.LBRTEnvelope);
    Object.freeze(RTree.LBRTEnvelope.prototype);
  }

  return RTree;

});