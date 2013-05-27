define(['../struct/BinaryHeap'], function (BinaryHeap) {

//    var OpenSet = (function () {
//
//      function sortSmallestF(node1, node2) {
//        return node1.fScore - node2.fScore;
//      }
//
//      function OS() {
//        this._bh = new BinaryHeap(sortSmallestF);
//        this._keyMap = {  };
//      }
//
//      OS.prototype = {
//        push: function (elem) {
//          this._keyMap = elem.id;
//          this._bh.push(elem);
//        },
//        pop: function () {
//          return this._bh.pop();
//        },
//        hasId: function (id) {
//          return !!this._keyMap[id];
//        },
//        size: function () {
//          return this._bh.size();
//        }
//      };
//
//      return OS;
//
//    }());

    var OpenSet = (function () {

      //todo: optimize. use priority queue with decrease-key optimization

      function UnvisitedSet() {
        this._size = 0;
        this._els = [];
        this._mp = {};
      }

      UnvisitedSet.prototype = {
        push: function (element) {
          this._els.push(element);
          this._size += 1;
          this._mp[element.id] = element;
        },
        size: function () {
          return this._size;
        },
        hasId: function (id) {
          return !!this._mp[id];
        },
        pop: (function () {
          function sortSmallestF(node1, node2) {
            return node1.fScore - node2.fScore;
          }

          return function () {
            this._els.sort(sortSmallestF);
            var el = this._els.shift();
            this._size -= 1;
            delete this._mp[el.id];
            return el;
          };
        }())
      };
      return UnvisitedSet;
    }());

    var ClosedSet = (function () {


      function CS() {
        this._m = {};
      }

      CS.prototype = {
        add: function (node) {
          var k = node.id;
          if (!this._m[k]) {
            this._m[k] = node;
          } else {
            throw 'Already in closed set';
          }
        },
        hasId: function (nodeId) {
          return !!this._m[nodeId];
        }
      };
      return CS;
    }());

    function AStarResources(graph, goal) {
      this.openSet = new OpenSet();
      this.closedSet = new ClosedSet();
      this.current = null;
      this.previousMap = {};
      this.gScoreMap = {};
      this.fScoreMap = {};
      this.graph = graph;
      this.goal = goal;
    }


    function updateDistances(astar, edge) {

      var toNode = astar.graph.getToNode(edge);
      var toId = astar.graph.getNodeIdentity(toNode);
      var cost = astar.graph.getCost(edge);

      var tentativeGScore = astar.currentGScore + cost;

      var inClosedSet = astar.closedSet.hasId(toId);
      var fscore, qelem, neighbourInOpenSet;
      var gscore = astar.gScoreMap[toId] || Infinity;


      var estimate;
      if (inClosedSet) {
        //already visited. best path is known already.
        return astar;
      } else if (tentativeGScore >= gscore) {
        //no improvement, so skip as well.
        return astar;
      } else if (tentativeGScore < gscore) {

        neighbourInOpenSet = astar.openSet.hasId(toId);
        astar.previousMap[toId] = astar.current.id;
        astar.gScoreMap[toId] = tentativeGScore;

        estimate = astar.graph.estimateCost(toNode, astar.goal);
        fscore = tentativeGScore + estimate;

        if (!neighbourInOpenSet) {
          qelem = {
            id: toId,
            fScore: fscore,
            node: toNode
          };
          astar.openSet.push(qelem);
          astar.fScoreMap[toId] = qelem;
        } else {
          astar.fScoreMap[toId].fScore = fscore;
        }

      }

      return astar;
    }

    return {
      AStar: function (start, goal) {
        //initialize
        var goalId = this.getNodeIdentity(goal);
        var astar = new AStarResources(this, goal);
        var heurcost = this.estimateCost(start, goal);
        var startElem = {
          id: this.getNodeIdentity(start),
          node: start,
          fScore: heurcost
        };
        astar.gScoreMap[startElem.id] = 0;
        astar.fScoreMap[startElem.id] = startElem;
        astar.openSet.push(startElem);

        var current;
        var found = false;

        while (astar.openSet.size() !== 0 && !found) {

          current = astar.openSet.pop();

          astar.current = current;
          astar.currentGScore = astar.gScoreMap[current.id];

          if (current.id === goalId) {
            found = true;
          } else {
            astar.closedSet.add(current);
            astar = this.reduceNeighbours(current.node, updateDistances, astar);
          }
        }

        return {
          found: found,
          distanceTo: function (to) {
            return astar.gScoreMap[to];
          },
          reduceFoundNodes: function (cb, acc) {
            for (var i in astar.previousMap) {
              acc = cb(acc,astar.previousMap[i]);
            }
            return acc;
          },
          reduceHopsToStart: function (toNodeId, callback, accumulator) {
            toNodeId = astar.previousMap[toNodeId];
            while (toNodeId !== undefined) {
              accumulator = callback(accumulator, toNodeId);
              toNodeId = astar.previousMap[toNodeId];
            }
            return accumulator;
          }
        };

      }
    }
      ;

  }

)
;