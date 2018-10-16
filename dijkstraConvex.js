var fetchData = require("./fetchData")
var convexRegions
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
//not the fastest dijkstra, i didn't bother to implement a priority queue
var dijkPred = []
var dijkDist = []
var dijkMark = []
var setupDijkstra = (v1) => {
  dijkDist = []
  dijkMark = []
  for (var i = 0; i < nodeID; i++) {
    dijkDist[i] = dijkWeights[v1 * nodeID + i] !== undefined ? dijkWeights[v1 * nodeID + i] : Infinity
    dijkPred[i] = v1
  }
  dijkMark[v1] = 1
}
var dijkstra = (v1, v2) => {
  if (v1[0] == v2[0] && v1[1] == v2[1]){
    return v1
  }
  var v1 = getNodeID(v1)
  if (v1 !== (nodeID - 1)) {
    setupDijkstra(v1)
  }
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
var includedRegions = ([x, y]) => { //i know this would make more sense as (x, y), but i'm following the [x, y] convention i set in this file
  var ret = []
  if (x <= 1) {
    ret.push(convexRegions[0])
  }
  else if (x >= 9) {
    ret.push(convexRegions[1])
  }
  if (y <= 2) {
    ret.push(convexRegions[2])
  }
  else if (y >= 3 && y <= 4) {
    ret.push(convexRegions[3])
  }
  else if (y >= 5 && y <= 6) {
    ret.push(convexRegions[4])
  }
  else if (y >= 7 && y <= 8) {
    ret.push(convexRegions[5])
  }
  else if (y >= 9) {
    ret.push(convexRegions[6])
  }
  return ret
}
var arbitraryStartDijkstra = ([x, y], v2) => {
  if ((xyNodeIDMap[x] == undefined && (xyNodeIDMap[x] = [])) || xyNodeIDMap[x][y] == undefined) { //thanks to operator short circuiting we don't have to worry about xyNodeIDMap[x][y] throwing
    //insert node and connect to line of sight nodes
    //only works for this map
    xyNodeIDMap[x][y] = nodeID - 1
    nodeIDxyMap[nodeID - 1] = [x, y]
    dijkMark = []
    dijkMark[nodeID - 1] = 1
    var convex = includedRegions([x, y])
    dijkDist = []
    for (var i = 0; i < nodeID; i++) {
      dijkDist[i] = Infinity
    }
    convex.map(a => a.map(a => { dijkDist[getNodeID(a)] = dist([x, y], a); dijkPred[getNodeID(a)] = (nodeID - 1) }))
    var ret = dijkstra([x, y], v2)
    xyNodeIDMap[x][y] = undefined
    return ret
  }
  else {
    return dijkstra([x, y], v2)
  }
}
var setup = (async () => {
  convexRegions = (await fetchData.getStoreData()).map.convexRegions  
  convexRegions.map(x => x.map(getNodeID))
  nodeID++ //accomodate the extra node
  dijkWeights = new Array(nodeID * nodeID)
  convexRegions.map(x => x.map(y => x.map(x => setDijkstraWeight(x, y))))
})()
var coorClamp = ([x, y]) => {
  if (x > 1 && x < 9) {
    if ((y > 2 && y < 3) || (y > 4 && y < 5) || (y > 6 && y < 7) || (y > 8 && y < 9)){
      y = Math.round(y)
    }
  }
  return [x, y]
}
var wrappedDijkstra = async (v1, v2) => {
  await setup
  return arbitraryStartDijkstra(coorClamp(v1), v2)
}
var exports = module.exports = {
  dijkstra: wrappedDijkstra
}