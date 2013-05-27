define([
], function () {

  "use strict";

  var UnvisitedSet = (function () {

    //todo: optimize. use priority queue with decrease-key optimization

    function UnvisitedSet() {
      this._size = 0;
      this._els = [];
    }

    UnvisitedSet.prototype = {
      push: function (element) {
        this._els.push(element);
        this._size += 1;
      },
      size: function () {
        return this._size;
      },
      pop: (function () {
        var smallestDistance = function (a, b) {
          return a.dist - b.dist;
        };
        return function () {
          this._els.sort(smallestDistance);
          var el = this._els.shift();
          this._size -= 1;
          return el;
        };
      }())
    };
    return UnvisitedSet;
  }());

  function updateDistances(dijk, edge) {

    var toNode = dijk.graph.getToNode(edge);
    var toId = dijk.graph.getNodeIdentity(toNode);
    var cost = dijk.graph.getCost(edge);

    var newdist = dijk.currentDistance + cost;
    if (newdist < dijk.distanceMap[toId].dist) {
      dijk.distanceMap[toId].dist = newdist;
      dijk.previousMap[toId] = dijk.selection.id;
    }

    return dijk;

  }

  function DijkstraResources(graph, source) {
    this.unvisitedSet = new UnvisitedSet(graph);
    this.distanceMap = {};
    this.previousMap = {};
    this.graph = graph;
    this.currentDistance = 0;
    this.selection = null;
    this.sourceId = graph.getNodeIdentity(source);
  }

  /**
   * initialize dijkstra state with a node from the graph.
   */
  function initializeWithNode(dijk, node) {

    var id = dijk.graph.getNodeIdentity(node);
    var initialDistance = (id === dijk.sourceId) ? 0 : Infinity;
    var nodeMarker = {node: node, id: id, dist: initialDistance};

    dijk.unvisitedSet.push(nodeMarker);
    dijk.distanceMap[id] = nodeMarker;

    return dijk;
  }

  return {
    /**
     * run Dijkstra's algorithm.
     * @param sourceNode the source node for which to compute all distances.
     * @return {Object}
     */
    dijkstra: function (sourceNode) {

      //initialize
      var dijk = new DijkstraResources(this, sourceNode);
      dijk = this.reduceNodes(initializeWithNode, dijk);

      //as long as there are unvisited nodes
      var selection;

      while (dijk.unvisitedSet.size() !== 0) {

        //select the node with the smallest distance
        selection = dijk.unvisitedSet.pop();
        if (dijk.distanceMap[selection.id].dist === Infinity) {
          break;
        }

        dijk.currentDistance = dijk.distanceMap[selection.id].dist;
        dijk.selection = selection;

        //for all the neighbours, update the distances.
        dijk = this.reduceNeighbours(selection.node, updateDistances, dijk);

      }

      return {
        distanceTo: function (nodeId) {
          return dijk.distanceMap[nodeId].dist;
        },
        reduceHopsToStart: function (toNodeId, callback, accumulator) {
          toNodeId = dijk.previousMap[toNodeId];
          while (toNodeId !== undefined) {
            accumulator = (callback(accumulator, toNodeId) || accumulator);
            toNodeId = dijk.previousMap[toNodeId]
          }
          return accumulator;
        }
      };
    }
  };

});
