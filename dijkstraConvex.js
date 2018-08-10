var convexRegions = [
  [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9]], //i know that this is a degenerate polygon
  [[9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9]],
  [[1, 2], [2, 2], [4, 2], [6, 2], [8, 2], [9, 2]],
  [[1, 3], [2, 3], [4, 3], [6, 3], [8, 3], [9, 3], [9, 4], [8, 4], [6, 4], [4, 4], [2, 4], [1, 4]],
  [[1, 5], [2, 5], [4, 5], [6, 5], [8, 5], [9, 5], [9, 6], [8, 6], [6, 6], [4, 6], [2, 6], [1, 6]],
  [[1, 7], [2, 7], [4, 7], [6, 7], [8, 7], [9, 7], [9, 8], [8, 8], [6, 8], [4, 8], [2, 8], [1, 8]],
  [[1, 9], [2, 9], [4, 9], [6, 9], [8, 9], [9, 9]]
]
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
    if (dijkMark[min]) {
      return
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
console.log(dijkstra([1, 2], [2, 5]))