var fetchData = require("./fetchData")
var preprocess = (items, pre) => {
  // pretty pathetic preprocessing, i know. i'm laying groundwork for the future.
  items.map((x, i) => pre[x["iuid"]] = i)
}
var makeRecommender = (data) => {
  var run = 0
  var pre = []
  var data = data["items"]
  return (item) => {
    if (!item || !item["boughtWith"]) {
      return
    }
    if (!run) {
      preprocess(data, pre)
      run = 1
    }
    var item = item["boughtWith"]
    var ret = []
    for (var i = 0; i < item.length; i++) {
      ret.push([item[i]["correlation"], data[pre[item[i]["iuid"]]]])
    }
    return ret.sort((a, b) => b[0]-a[0]).map(x => x[1])
  }
}
var getRecommender = async () => {
  storeData = await fetchData.getStoreData()
  return makeRecommender(storeData)
}
module.exports = {
  makeRecommender: makeRecommender,
  getRecommender: getRecommender
}
