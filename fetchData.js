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
    {"iuid": 15, "istock": 60, "itemName": "Bubble Gum", "shelfLocation": "shelf1", "friendlyLocation": "Banned Foods Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["food", "banned", "bubble", "gum"]},
    {"iuid": 16, "istock": 60, "itemName": "Tide Pods", "shelfLocation": "shelf1", "friendlyLocation": "Not Foods Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["tasty", "drinks", "healthy"]},
    {"iuid": 17, "istock": 60, "itemName": "Chewing Gum", "shelfLocation": "shelf1", "friendlyLocation": "Not Quite Banned Foods Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["food", "notbanned", "chewing", "gum"]},
    {"iuid": 18, "istock": 60, "itemName": "asdf", "shelfLocation": "shelf1", "friendlyLocation": "awbaeb", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 19, "istock": 60, "itemName": "awrhawe", "shelfLocation": "shelf1", "friendlyLocation": "efawfdsf", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 5, "istock": 60, "itemName": "egaerha", "shelfLocation": "shelf1", "friendlyLocation": "fsdzf", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 6, "istock": 60, "itemName": "gawegagew", "shelfLocation": "shelf1", "friendlyLocation": "zsdfzsd", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 7, "istock": 60, "itemName": "bsergsdf", "shelfLocation": "shelf1", "friendlyLocation": "fawef", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 8, "istock": 60, "itemName": "rbawegewa", "shelfLocation": "shelf1", "friendlyLocation": "zdfsdfz", "shelfRow": 5, "shelfColumn": 12, "tags": []},
    {"iuid": 9, "istock": 60, "itemName": "dsfweab", "shelfLocation": "shelf1", "friendlyLocation": "sdfzdfwq", "shelfRow": 5, "shelfColumn": 12, "tags": []}
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
storeDataCache = false
var getStoreData = () => {
  if (!storeDataCache){
    storeDataCache = new Promise(resolve => {
      setTimeout(() => {
        resolve(storeData);
      }, 2000);
    });
  }
  return storeDataCache
}
var exports = module.exports = {
  dataInvalidated : true
}
exports.getAsrText = getAsrText;
exports.getInventory = getInventory;
exports.getStoreData = getStoreData;
