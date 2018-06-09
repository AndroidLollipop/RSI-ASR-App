//fake server, wire this up to the server later
var getAsrText = (audio) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("where is the bubble gum")
    }, 2000);
  });
}
storeData = {
  "items": [
    {"iuid": 10, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["food", "canned", "tuna"]},
    {"iuid": 15, "istock": 60, "itemName": "Bubble Gum", "shelfLocation": "shelf1", "friendlyLocation": "Banned Foods section", "shelfRow": 5, "shelfColumn": 12, "tags": ["food", "banned", "bubble", "gum"]}
  ],
  //we are going to use ANTI-CLOCKWISE winding order for polygons
  //(x, y), POSITIVE x is RIGHT, POSITIVE y is UP
  "map": {
    "storeMap": [[0, 0], [1, 0], [1, 1], [0, 1]],
    "shelfMap": {
      "shelf1": [[[0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5]], [[0.5, 0], [1, 0], [1, 0.5], [0.5, 0.5]]],
      "shelf2": [[[0, 0.5], [0.5, 0.5], [0.5, 1], [0, 1]], [[0.5, 0.5], [1, 0.5], [1, 1], [0.5, 1]]]
      //FORMAT: [ShelveSections:[Vertices:[x, y]]]
    },
    "scale": 50
  }
}
inventoryList = {
  "available": [10, 15]
}
//returns iuids of items in stock
var getInventory = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(inventoryList);
    }, 2000);
  });
}
var getStoreData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(storeData);
    }, 2000);
  });
}
var exports = module.exports = {
  dataInvalidated : true
}
exports.getAsrText = getAsrText;
exports.getInventory = getInventory;
exports.getStoreData = getStoreData;
