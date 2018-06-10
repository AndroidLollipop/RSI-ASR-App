var reschedule = (time=17) => {
  return new Promise((resolve) => setTimeout(() => resolve(), time))
}
var conditionalReschedule = async (condition, time=17) => {
  while(condition()){
    await reschedule(time)
  }
}
var flattenList = (list) => {
  var ret = []
  for (i = 0; i < list.length; i++){
    for (j = 0; j < list[i].length; j++){
      ret.push(list[i][j])
    }
  }
  return ret
}
var deepFlattenList = (list) => {
  var ret = []
  for (var i = 0; i < list.length; i++){
    if (typeof list[i] == "object"){
      var rel = deepFlattenList(list[i])
      for (var j = 0; j < rel.length; j++){
        ret.push(rel[j])
      }
    }
    else{
      ret.push(list[i])
    }
  }
  return ret
}
var exports = module.exports = {
  gv : {

  }
}
exports.reschedule = reschedule;
exports.conditionalReschedule = conditionalReschedule;
exports.flattenList = flattenList;
