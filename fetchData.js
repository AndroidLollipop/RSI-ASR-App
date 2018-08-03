var getAsrText = async (uri) => { //this code directly mirrors the server request code from the asr engine test page
  //i converted the jquery requests to fetch requests because jquery doesn't play nice with react native
  var resolveMyPromise
  const myPromise = new Promise(resolve => {
    resolveMyPromise = resolve
  })
  const res = await fetch(uri)
  const blob = await res.blob()
  const url = exports.StateData.ServerURL
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json; charset=utf-8');
  var reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = async function (){
    var wavContent = reader.result
    wavContent = wavContent.replace("data:application/octet-stream;base64,", "")
    wavContent = wavContent.replace("data:audio/mpeg;base64,", "")
    var myObj = { "Wavfile": "FromBrowser.ogg",
      "EncodedSpeech": wavContent
    }
    var myInit = { method: "POST",
      headers: myHeaders,
      body: JSON.stringify(myObj)
    }
    try {
      var ime = await fetch(url, myInit)
      var res = await ime.json()
      resolveMyPromise(res.decodeText.split("\n").join(""))
    }
    catch(e){
      alert(e)
      alert("Server not detected. Returning default response")
      resolveMyPromise("where is the bubble gum")
    }
    console.log(res)
  }
  return myPromise
}
var storeData = {
  "items": [
    {"iuid": 10, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 3, "tags": ["food", "canned", "tuna"]},
    {"iuid": 15, "istock": 60, "itemName": "Bubble Gum", "shelfLocation": "shelf1", "friendlyLocation": "Banned Foods Section", "shelfRow": 5, "shelfColumn": 1, "tags": ["food", "banned", "bubble", "gum"]},
    {"iuid": 16, "istock": 60, "itemName": "Tide Pods", "shelfLocation": "shelf1", "friendlyLocation": "Not Foods Section", "shelfRow": 5, "shelfColumn": 2, "tags": ["tasty", "drinks", "healthy"]},
    {"iuid": 17, "istock": 60, "itemName": "Chewing Gum", "shelfLocation": "shelf1", "friendlyLocation": "Not Quite Banned Foods Section", "shelfRow": 5, "shelfColumn": 2, "tags": ["food", "notbanned", "chewing", "gum"]},
    {"iuid": 29, "istock": 60, "itemName": "Bier", "shelfLocation": "shelf-6", "friendlyLocation": "Funeral Items Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["six", "feet", "under"]},
    {"iuid": 20, "istock": 60, "itemName": "Beer", "shelfLocation": "shelf3", "friendlyLocation": "Fun Items Section", "shelfRow": 5, "shelfColumn": 18, "tags": ["dont", "drink", "and", "drive", "beer"]},
    {"iuid": 18, "istock": 60, "itemName": "asdf", "shelfLocation": "shelf1", "friendlyLocation": "awbaeb", "shelfRow": 5, "shelfColumn": 0, "tags": []},
    {"iuid": 19, "istock": 60, "itemName": "awrhawe", "shelfLocation": "shelf1", "friendlyLocation": "efawfdsf", "shelfRow": 5, "shelfColumn": 1, "tags": []},
    {"iuid": 5, "istock": 60, "itemName": "egaerha", "shelfLocation": "shelf2", "friendlyLocation": "fsdzf", "shelfRow": 5, "shelfColumn": 2, "tags": []},
    {"iuid": 6, "istock": 60, "itemName": "gawegagew", "shelfLocation": "shelf3", "friendlyLocation": "zsdfzsd", "shelfRow": 5, "shelfColumn": 3, "tags": []},
    {"iuid": 7, "istock": 60, "itemName": "bsergsdf", "shelfLocation": "shelf2", "friendlyLocation": "fawef", "shelfRow": 5, "shelfColumn": 0, "tags": []},
    {"iuid": 8, "istock": 60, "itemName": "rbawegewa", "shelfLocation": "shelf3", "friendlyLocation": "zdfsdfz", "shelfRow": 5, "shelfColumn": 1, "tags": []},
    {"iuid": 9, "istock": 60, "itemName": "dsfweab", "shelfLocation": "shelf4", "friendlyLocation": "sdfzdfwq", "shelfRow": 5, "shelfColumn": 2, "tags": []}
  ],
  //we are going to use ANTI-CLOCKWISE winding order for polygons
  //(x, y), POSITIVE x is RIGHT, POSITIVE y is UP
  "map": {
    "storeMap": [[0, 0], [1, 0], [1, 1], [0, 1]],
    "shelfMap": {
      "shelf1": [
        [[0.1, 0.2], [0.3, 0.2], [0.3, 0.3], [0.1, 0.3]], //1A
        [[0.3, 0.2], [0.5, 0.2], [0.5, 0.3], [0.3, 0.3]], //1B
        [[0.5, 0.2], [0.7, 0.2], [0.7, 0.3], [0.5, 0.3]], //1C
        [[0.7, 0.2], [0.9, 0.2], [0.9, 0.3], [0.7, 0.3]]
       ], //1D
      "shelf2": [
        [[0.1, 0.4], [0.3, 0.4], [0.3, 0.5], [0.1, 0.5]], //2A
        [[0.3, 0.4], [0.5, 0.4], [0.5, 0.5], [0.3, 0.5]], //2B
        [[0.5, 0.4], [0.7, 0.4], [0.7, 0.5], [0.5, 0.5]], //2C
        [[0.7, 0.4], [0.9, 0.4], [0.9, 0.5], [0.7, 0.5]]
       ], //2D
      "shelf3": [
        [[0.1, 0.6], [0.3, 0.6], [0.3, 0.7], [0.1, 0.7]], //3A
        [[0.3, 0.6], [0.5, 0.6], [0.5, 0.7], [0.3, 0.7]], //3B
        [[0.5, 0.6], [0.7, 0.6], [0.7, 0.7], [0.5, 0.7]], //3C
        [[0.7, 0.6], [0.9, 0.6], [0.9, 0.7], [0.7, 0.7]]
       ], //3D
      "shelf4": [
        [[0.1, 0.8], [0.3, 0.8], [0.3, 0.9], [0.1, 0.9]], //3A
        [[0.3, 0.8], [0.5, 0.8], [0.5, 0.9], [0.3, 0.9]], //3B
        [[0.5, 0.8], [0.7, 0.8], [0.7, 0.9], [0.5, 0.9]], //3C
        [[0.7, 0.8], [0.9, 0.8], [0.9, 0.9], [0.7, 0.9]]
       ] //3D
      //FORMAT: [ShelveSections:[Vertices:[x, y]]]
    },
    "scale": 50
  }
}
var inventoryList = {
  "available": [10, 15, 16, 17, 20, 18]
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
var getStoreData = (refresh) => {
  if (!storeDataCache || refresh){
    storeDataCache = new Promise(resolve => {
      setTimeout(() => {
        resolve(storeData);
      }, 2000);
    });
  }
  return storeDataCache
}
var exports = module.exports = {
  dataInvalidated : true,
  Images: {},
  StateData: {"ServerURL": "http://192.168.1.31/speech/english/imda1.php", "SelectedShelf": null},
  AsrEventListeners: [],
  MapEventListeners: [],
  RefEventListeners: []
}
exports.getAsrText = getAsrText;
exports.getInventory = getInventory;
exports.getStoreData = getStoreData;
exports.Images.notRecording = require("./not-recording.png");
exports.Images.recording = require("./recording.png");
exports.Images.animationRipple = require("./animation-ripple.png");
var refresh = async () => {
  storeData.items.push({"iuid": storeData.items.length+100, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 3, "tags": ["food", "canned", "tuna"]})
  await getStoreData(true)
  for (var i = 0; i < exports.RefEventListeners.length; i++){
    var f = exports.RefEventListeners[i]
    if (f){
      f()
    }
  }
  setTimeout(refresh, 10000)
}
refresh()