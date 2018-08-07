import clone from './clone'; //TO PREVENT fakeupd FROM VIOLATING IMMUTABILITY OF storeData, WILL BE REMOVED IN FINAL APP

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
   //we are going to use ANTI-CLOCKWISE winding order for polygons
  //(x, y), POSITIVE x is RIGHT, POSITIVE y is UP
  "map": {
    "storeMap": [[0, 0], [10, 0], [10, 10], [0, 10]],
    "shelfMap": {
      "shelf1 left": [
        [[1, 2], [3, 2], [3, 2.5], [1, 2.5]], //1lA
        [[3, 2], [5, 2], [5, 2.5], [3, 2.5]], //1lB
        [[5, 2], [7, 2], [7, 2.5], [5, 2.5]], //1lC
        [[7, 2], [9, 2], [9, 2.5], [7, 2.5]] //1lD
      ],
       "shelf2 right": [
        [[1, 2.5], [3, 2.5], [3, 3], [1, 3]], //2rA
        [[3, 2.5], [5, 2.5], [5, 3], [3, 3]], //2rB
        [[5, 2.5], [7, 2.5], [7, 3], [5, 3]], //2rC
        [[7, 2.5], [9, 2.5], [9, 3], [7, 3]] //2rD
       ],
       "shelf2 left": [
        [[1, 4], [3, 4], [3, 4.5], [1, 4.5]], //2lA
        [[3, 4], [5, 4], [5, 4.5], [3, 4.5]], //2lB
        [[5, 4], [7, 4], [7, 4.5], [5, 4.5]], //2lC
        [[7, 4], [9, 4], [9, 4.5], [7, 4.5]] //2lD
      ],
       "shelf3 right": [
        [[1, 4.5], [3, 4.5], [3, 5], [1, 5]], //3rA
        [[3, 4.5], [5, 4.5], [5, 5], [3, 5]], //3rB
        [[5, 4.5], [7, 4.5], [7, 5], [5, 5]], //3rC
        [[7, 4.5], [9, 4.5], [9, 5], [7, 5]] //3rD
      ],
       "shelf3 left": [
        [[1, 6], [3, 6], [3, 6.5], [1, 6.5]], //3lA
        [[3, 6], [5, 6], [5, 6.5], [3, 6.5]], //3lB
        [[5, 6], [7, 6], [7, 6.5], [5, 6.5]], //3lC
        [[7, 6], [9, 6], [9, 6.5], [7, 6.5]] //3lD
      ],
       "shelf4 right": [
        [[1, 6.5], [3, 6.5], [3, 7], [1, 7]], //4rA
        [[3, 6.5], [5, 6.5], [5, 7], [3, 7]], //4rB
        [[5, 6.5], [7, 6.5], [7, 7], [5, 7]], //4rC
        [[7, 6.5], [9, 6.5], [9, 7], [7, 7]] //4rD
      ],
       "shelf4 left": [
        [[1, 8], [3, 8], [3, 8.5], [1, 8.5]], //4lA
        [[3, 8], [5, 8], [5, 8.5], [3, 8.5]], //4lB
        [[5, 8], [7, 8], [7, 8.5], [5, 8.5]], //4lC
        [[7, 8], [9, 8], [9, 8.5], [7, 8.5]] //4lD
      ],
       "shelf5 right": [
        [[1, 8.5], [3, 8.5], [3, 9], [1, 9]], //5rA
        [[3, 8.5], [5, 8.5], [5, 9], [3, 9]], //5rB
        [[5, 8.5], [7, 8.5], [7, 9], [5, 9]], //5rC
        [[7, 8.5], [9, 8.5], [9, 9], [7, 9]] //5rD
      ],
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
    var fakeNetworkRequest = new Promise(resolve => {
      setTimeout(() => {
        resolve(storeData);
      }, 2000);
    });
    if (!storeDataCache){
      storeDataCache = fakeNetworkRequest //we don't have any data yet
    }
    else {
      fakeNetworkRequest.then((refreshedData) => {storeDataCache = refreshedData}) //serve old data until new data arrives
      return fakeNetworkRequest //give the caller a completion handle
    }
  }
  return storeDataCache
}
var refresh = async () => {
  await getStoreData(true)
  var stageCompleter
  var stageCompletion = new Promise((resolve) => {
    stageCompleter = resolve
  })
  for (var i = 0; i < exports.RefEventListeners.length; i++){
    var f = exports.RefEventListeners[i]
    if (f){
      f(stageCompletion, stageCompleter)
    }
  }
}
var fakeupd = () => { //make fake update
  storeData = clone(storeData)
  storeData.items.push({"iuid": storeData.items.length+100, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 3, "tags": ["food", "canned", "tuna"]})
  refresh()
}
var interval = false;
var toggleInterval = () => {
  if (interval){
    clearInterval(interval)
    interval = false;
    return
  }
  interval = setInterval(() => {fakeupd()}, 15000); fakeupd()
}
var intervalActive = () => interval;
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
exports.refresh = refresh;
exports.fupdate = fakeupd;
exports.intervalActive = intervalActive;
exports.toggleInterval = toggleInterval;