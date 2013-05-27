define([], function () {


  function deepFreeze(object) {
    Object.freeze(object);
    for (var i in object) {
      if (typeof object[i] === 'object') {
        deepFreeze(object[i]);
      }
    }
  }

  //adjacency list representation

  var THE_GRAPH = {
    s: {
      id: 's',
      x: 0,
      y: 1,
      edges: [
        {to: 'a', cost: 3},
        {to: 'd', cost: 4}
      ]
    },
    a: {
      id: 'a',
      x: 1,
      y: 0,
      edges: [
        {to: 'b', cost: 4},
        {to: 'd', cost: 5},
        {to: 's', cost: 3}
      ]
    },
    b: {
      id: 'b',
      x: 2,
      y: 0,
      edges: [
        {to: 'a', cost: 4},
        {to: 'c', cost: 4},
        {to: 'e', cost: 5}
      ]
    },
    c: {
      id: 'c',
      x: 3,
      y: 0,
      edges: [
        {to: 'b', cost: 4}
      ]
    },
    d: {
      id: 'd',
      x: 1,
      y: 2,
      edges: [
        {to: 'a', cost: 4},
        {to: 'e', cost: 2},
        {to: 's', cost: 4}
      ]
    },
    e: {
      id: 'e',
      x: 2,
      y: 2,
      edges: [
        {to: 'b', cost: 5},
        {to: 'd', cost: 2},
        {to: 'f', cost: 4}
      ]
    },
    f: {
      id: 'f',
      x: 3,
      y: 2,
      edges: [
        {to: 'e', cost: 4},
        {to: 'g', cost: 3}
      ]
    },
    g: {
      id: 'g',
      x: 4,
      y: 1,
      edges: [
        {to: 'f', cost: 3}
      ]
    }
  };

  deepFreeze(THE_GRAPH);


  function G() {
    //this is just an example graph.
    //Can't be modified.
  }

  G.prototype = {

    getNode: function (nodeId) {
      return THE_GRAPH[nodeId];
    },

    reduceNeighbours: function (node, fold, accumulator) {
      for (var i in node.edges) {
        accumulator = fold(accumulator, node.edges[i]);
      }
      return accumulator;
    },

    reduceNodes: function (fold, accumulator) {
      for (var nodeId in THE_GRAPH) {
        accumulator = fold(accumulator, THE_GRAPH[nodeId]);
      }
      return accumulator;
    },

    getCost: function (edge) {
      return edge.cost;
    },

    estimateCost: function (from, to) {
      return Math.sqrt(
          Math.pow(to.x - from.x, 2) +
          Math.pow(to.y - from.y, 2)
      );
    },

    getToNode: function (edge) {
      var toNodeId = edge.to;
      return THE_GRAPH[toNodeId];
    },

    getNodeIdentity: function (node) {
      return node.id;
    }

  };

  deepFreeze(G.prototype);

  return G;

});