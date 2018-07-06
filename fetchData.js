//fake server, wire this up to the server later
var getAsrText = async (uri) => {
  /*const rippedfromimda = function() {
    console.log("sendAsr: chunks length: %d", blob.size);
    var wavContent = "";
    var reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        wavContent = reader.result;
  wavContent = wavContent.replace('data:audio/ogg; codecs=opus;base64,','');
  //console.log("wavContent:" + wavContent);
    
        var myObj = { "Wavfile": "FromBrowser.ogg",
                "EncodedSpeech": wavContent}; 
        $.ajax({type: "POST",
            url: "speech/english/imda1.php",
      contentType: "application/json; charset=utf-8",
            data: JSON.stringify(myObj),
      dataType: "json",
            success : function(data) { 
               // here is the code that will run on client side after running imda.php on server
   $.each(data, function(index, element) {
      console.log(index + ":" + element); 
      if (index == "decodeText") {
    $(".result").html("ASR: " + element + "<br>"); 
      } else if (index == "timeElapse") {
    $(".result").append("Time elapsed: " + element.toFixed(2) + " sec<p>"); 
      }
   });
            }
         });
     }
  }
  console.log("Uploading " + uri);
  let apiUrl = 'http://192.168.1.31/speech/english/imda1.php';
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', {
    uri,
    name: `recording.${fileType}`,
    type: `audio/x-${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  console.log("POSTing " + uri + " to " + apiUrl);
  console.log(await fetch(apiUrl, options))*/
  fetch(uri).then(res => console.log(res.blob()))
  //awwwwwww yisssss
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
    {"iuid": 20, "istock": 60, "itemName": "Bier", "shelfLocation": "shelf-6", "friendlyLocation": "Funeral Items Section", "shelfRow": 5, "shelfColumn": 12, "tags": ["six", "feet", "under"]},
    {"iuid": 20, "istock": 60, "itemName": "Beer", "shelfLocation": "shelf3", "friendlyLocation": "Fun Items Section", "shelfRow": 5, "shelfColumn": 18, "tags": ["dont", "drink", "and", "drive"]},
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
      "shelf1": [[[0.1, 0], [0.5, 0.1], [0.4, 0.5], [0, 0.4]], [[0.5, 0], [1, 0], [1, 0.5], [0.5, 0.5]]],
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
  dataInvalidated : true,
  Images: {},
  StateData: {},
  AsrEventListeners: []
}
exports.getAsrText = getAsrText;
exports.getInventory = getInventory;
exports.getStoreData = getStoreData;
exports.Images.notRecording = require("./not-recording.png");
exports.Images.recording = require("./recording.png")
