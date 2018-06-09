var reschedule = async (time=17) => {
  return new Promise((resolve) => setTimeout(() => resolve(), time))
}
var conditionalReschedule = async (condition, time=17) => {
  while(condition()){
    await reschedule(time)
  }
}
var exports = module.exports = {
  gv : {

  }
}
exports.reschedule = reschedule;
exports.conditionalReschedule = conditionalReschedule;
