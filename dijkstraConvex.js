var convexRegions = [[[1, 1], [3, 2], [3, 3]], [[3, 3], [3, 2], [5, 1]], [[3, 3], [5, 1], [2, 5]]]
//FORMAT: [ConvexPolygons:[Vertices:[x,y]]]
var dijkWeights = []
var xyNodeIDMap = []
var nodeIDxyMap = []
var nodeID = 0
var getNodeID = ([x, y]) => {
  if (xyNodeIDMap[x] !== undefined) {
    if (xyNodeIDMap[x][y] !== undefined) {
      return xyNodeIDMap[x][y]
    }
  }
  else {
    xyNodeIDMap[x] = []
  }
  xyNodeIDMap[x][y] = nodeID
  nodeIDxyMap[nodeID] = [x, y]
  nodeID++
  return xyNodeIDMap[x][y]
}
var dist = ([x1, y1], [x2, y2]) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}
var setDijkstraWeight = (v1, v2) => {
  var d = dist(v1, v2)
  var v1 = getNodeID(v1)
  var v2 = getNodeID(v2)
  dijkWeights[v1 * nodeID + v2] = d
}
convexRegions.map(x => x.map(getNodeID))
dijkWeights = new Array(nodeID * nodeID)
convexRegions.map(x => x.map(y => x.map(x => setDijkstraWeight(x, y))))
console.log(dijkWeights)
//not the fastest dijkstra, i didn't bother to implement a priority queue
var dijkPred = []
var dijkDist = []
var dijkMark = []
var setupDijkstra = (v1) => {
  for (var i = 0; i < nodeID; i++) {
    dijkDist[i] = dijkWeights[v1 * nodeID + i] !== undefined ? dijkWeights[v1 * nodeID + i] : Infinity
    dijkPred[i] = v1
  }
  dijkMark[v1] = 1
}
var dijkstra = (v1, v2) => {
  var v1 = getNodeID(v1)
  setupDijkstra(v1)
  var v2 = getNodeID(v2)
  while (true) {
    var min = 0
    for (var i = 0; i < nodeID; i++) {
      if (!dijkMark[i] && (dijkDist[i] < dijkDist[min] || dijkMark[min])) {
        min = i
      }
    }
    if (min == v2) {
      var ret = [nodeIDxyMap[v2]]
      var cur = v2
      while (cur !== v1) {
        cur = dijkPred[cur]
        ret.push(nodeIDxyMap[cur])
      }
      return ret
    }
    dijkMark[min] = 1
    for (var i = 0; i < nodeID; i++) {
      if ((dijkDist[min] + dijkWeights[min * nodeID + i]) < dijkDist[i]) {
        dijkDist[i] = dijkDist[min] + dijkWeights[min * nodeID + i]
        dijkPred[i] = min
      }
    }
  }
}
console.log(dijkstra([1, 1], [2, 5]))