var fetchData = require("./fetchData")
var computeTfIdfs = (tagcollection, tf_, idf) => { //tf-idf implemented directly according to wikipedia's description of tf-idf
  //we have to iterate through all tags anyway to compute any single tfidf, no point using lazy computation
  //just get it done once and never do it again until the next inventory update
  //if we are brave and adventurous we can try using delta updates and delta'ing the tfidf cache
  for (var i = 0; i < tagcollection.length; i++){
    var tags = tagcollection[i]["tags"];
    var adda = {}
    for (var j = 0; j < tags.length; j++){
      if (!adda[tags[j]]){
        if (!idf[tags[j]]){
          idf[tags[j]] = 0
        }
        idf[tags[j]]++
        adda[tags[j]] = 0
      }
      adda[tags[j]] += 1/tags.length
    }
    tf_.push(adda)
  }
  iks = Object.keys(idf)
  for (var i = 0; i < iks.length; i++){
    if (idf[iks[i]]){
      idf[iks[i]] = Math.log(tagcollection.length/idf[iks[i]])
    }
    else{
      idf[iks[i]] = 0
    }
  }
}
var makeRanker = (data) => {
  var run = 0
  var idf = {}
  var tf_ = []
  var data = data["items"]
  return (terms) => {
    var terms = terms.toLowerCase().split(" ")
    if (!run){
      computeTfIdfs(data, tf_, idf)
      run = 1
    }
    var ret = []
    for (var i = 0; i < data.length; i++){
      ret.push([0, 0, i, data[i]])
    }
    for (var i = 0; i < terms.length; i++){
      var term = terms[i]
      console.log(term)
      for (var j = 0; j < data.length; j++){
        if (tf_[j][term]){
          console.log(tf_[j][term])
          console.log(idf[term])
          ret[j][0] -= tf_[j][term] * idf[term]
          ret[j][1] -= tf_[j][term]
        }
      }
    }
    ret = ret.sort((a, b) => {
      var i = 0;
      while(a[i] == b[i]){
        i++;
      }
      return a[i]-b[i]
    }).map(x => x[3])
    return ret
  }
}
var getRanker = async () => {
  storeData = await fetchData.getStoreData()
  return makeRanker(storeData)
}
module.exports = {
  makeRanker: makeRanker,
  getRanker: getRanker
}
