var storeData = [
  {"iuid": 10, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 3, "tags": ["food", "canned", "tuna"]},
  {"iuid": 15, "istock": 60, "itemName": "Bubble Gum", "shelfLocation": "shelf1", "friendlyLocation": "Banned Foods Section", "shelfRow": 5, "shelfColumn": 1, "tags": ["food", "banned", "bubble", "gum"]},
  {"iuid": 16, "istock": 60, "itemName": "Tide Pods", "shelfLocation": "shelf1", "friendlyLocation": "Not Foods Section", "shelfRow": 5, "shelfColumn": 2, "tags": ["tasty", "drinks", "healthy"]},
  {"iuid": 17, "istock": 60, "itemName": "Chewing Gum", "shelfLocation": "shelf1", "friendlyLocation": "Not Quite Banned Foods Section", "shelfRow": 0, "shelfColumn": 12, "tags": ["food", "notbanned", "chewing", "gum"]},
  {"iuid": 20, "istock": 60, "itemName": "Bier", "shelfLocation": "shelf-6", "friendlyLocation": "Funeral Items Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["six", "feet", "under"]},
  {"iuid": 20, "istock": 60, "itemName": "Beer", "shelfLocation": "shelf3", "friendlyLocation": "Fun Items Section", "shelfRow": 5, "shelfColumn": 18, "tags": ["dont", "drink", "and", "drive", "beer"]},
  {"iuid": 18, "istock": 60, "itemName": "asdf", "shelfLocation": "shelf1", "friendlyLocation": "awbaeb", "shelfRow": 5, "shelfColumn": 0, "tags": []},
  {"iuid": 19, "istock": 60, "itemName": "awrhawe", "shelfLocation": "shelf1", "friendlyLocation": "efawfdsf", "shelfRow": 5, "shelfColumn": 1, "tags": []},
  {"iuid": 5, "istock": 60, "itemName": "egaerha", "shelfLocation": "shelf2", "friendlyLocation": "fsdzf", "shelfRow": 5, "shelfColumn": 2, "tags": []},
  {"iuid": 6, "istock": 60, "itemName": "gawegagew", "shelfLocation": "shelf3", "friendlyLocation": "zsdfzsd", "shelfRow": 5, "shelfColumn": 3, "tags": []},
  {"iuid": 7, "istock": 60, "itemName": "bsergsdf", "shelfLocation": "shelf2", "friendlyLocation": "fawef", "shelfRow": 5, "shelfColumn": 0, "tags": []},
  {"iuid": 8, "istock": 60, "itemName": "rbawegewa", "shelfLocation": "shelf3", "friendlyLocation": "zdfsdfz", "shelfRow": 5, "shelfColumn": 1, "tags": []},
  {"iuid": 9, "istock": 60, "itemName": "dsfweab", "shelfLocation": "shelf4", "friendlyLocation": "sdfzdfwq", "shelfRow": 5, "shelfColumn": 2, "tags": []}
]
var normalizationPassMaximumFrequency = (tagcollection, tf_, idf) => { //mostly irrelevant for our project
  for (var i = 0; i < tagcollection.length; i++){
    var tags = tagcollection[i]["tags"]
    var tfi = tf_[i]
    var mft = 0
    Object.keys(tfi).map((x) => {mft = Math.max(mft, tfi[x])})
    mft == 0 ? null : Object.keys(tfi).map((x) => {tfi[x] = 0.5 + 0.5*tfi[x]/mft})
  }
}
var normalizationPassLogarithmic = (tagcollection, tf_, idf) => { //this could be useful for our project
  for (var i = 0; i < tagcollection.length; i++){
    var tags = tagcollection[i]["tags"]
    var tfi = tf_[i]
    Object.keys(tfi).map((x) => {tfi[x] = (Math.log(tfi[x]+1))})
  }
}
var normalizationPass = (tagcollection, tf_, idf) => { //divide by text length normalization standard
  for (var i = 0; i < tagcollection.length; i++){
    var tags = tagcollection[i]["tags"]
    var tfi = tf_[i]
    Object.keys(tfi).map((x) => {tfi[x] = tfi[x]/tags.length})
  }
}
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
      adda[tags[j]] += 1
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
  return (terms) => {
    var terms = terms.toLowerCase().split(" ")
    if (!run){
      computeTfIdfs(data, tf_, idf)
      normalizationPass(data, tf_, idf)
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
var ranker = makeRanker(storeData)
var validators = {
  topcontains: (top) => (expected, rankings) => {
    var rankingscontain = {}
    rankings.slice(0, top).map((x) => {rankingscontain[x.iuid] = true})
    var score = expected.length == 0 ? 1 : 0
    expected.map((v) => {rankingscontain[v] ? score += 1/expected.length : null})
    return score*(2-score)
  },
  rankingsum: (expected, rankings) => {
    var rankingindices = {}
    rankings.map((x, i) => {rankingindices[x.iuid] = i})
    var score = 0
    var cexpected = []
    expected.map(v => {rankingindices[v] ? cexpected.push(v) : null})
    cexpected.map((v, i) => {score += rankingindices[v]-i})
    var worst = (rankings.length-expected.length)*expected.length
    score = (worst-score)/worst
    return score*(2-score)
  }
}
//we want our scoring functions to be convex to encourage consistent performance
var testset = [
    {query: "where is the bubble gum", expected: [15], validator: validators.topcontains(5)},
    {query: "i want food and i want it now", expected: [10, 15, 17], validator: validators.topcontains(5)},
    {query: "obviously trash query", expected: [13], validator: validators.topcontains(5)}
]
var accuracyChecker = (override) => {
    var score = 0
    testset.map(x => override ? override(x.expected, ranker(x.query)) : x.validator(x.expected, ranker(x.query))).map(x => {score += x})
    return score/testset.length
}
accuracyChecker()
//accuracyChecker(validators.rankingsum)