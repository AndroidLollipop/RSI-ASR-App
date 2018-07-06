//fake server, wire this up to the server later
var getAsrText = async (uri) => {
  const ajax = function (option) { // $.ajax(...) without jquery.
    if (typeof(option.url) == "undefined") {
        try {
            option.url = location.href;
        } catch(e) {
            var ajaxLocation;
            ajaxLocation = document.createElement("a");
            ajaxLocation.href = "";
            option.url = ajaxLocation.href;
        }
    }
    if (typeof(option.type) == "undefined") {
        option.type = "GET";
    }
    if (typeof(option.data) == "undefined") {
        option.data = null;
    } else {
        console.log(option.data.length)
        /*var data = "";
        for (var x in option.data) {
            if (data != "") {
                data += "&";
            }
            data += encodeURIComponent(x)+"="+encodeURIComponent(option.data[x]);
        };
        option.data = data;*/
    }
    if (typeof(option.statusCode) == "undefined") { // 4
        option.statusCode = {};
    }
    if (typeof(option.beforeSend) == "undefined") { // 1
        option.beforeSend = function () {};
    }
    if (typeof(option.success) == "undefined") { // 4 et sans erreur
        option.success = function () {};
    }
    if (typeof(option.error) == "undefined") { // 4 et avec erreur
        option.error = function () {};
    }
    if (typeof(option.complete) == "undefined") { // 4
        option.complete = function () {};
    }
    typeof(option.statusCode["404"]);

    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) { try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } }
        else { xhr = new XMLHttpRequest(); }
    } else { alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest..."); return null; }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 1) {
            option.beforeSend();
        }
        if (xhr.readyState == 4) {
            option.complete(xhr, xhr.status);
            if (xhr.status == 200 || xhr.status == 0) {
                option.success(xhr.responseText);
            } else {
                option.error(xhr.status);
                if (typeof(option.statusCode[xhr.status]) != "undefined") {
                    option.statusCode[xhr.status]();
                }
            }
        }
    };

    if (option.type == "POST") {
        xhr.open(option.type, option.url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(option.data);
    } else {
        xhr.open(option.type, option.url+option.data, true);
        xhr.send(null);
    }

}
  const rippedfromimda = function() {
    console.log("hello")
    console.log("sendAsr: chunks length: %d", blob.size);
    var wavContent = "";
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        wavContent = reader.result;
  wavContent = wavContent.replace('data:audio/ogg; codecs=opus;base64,','');
  //console.log("wavContent:" + wavContent);
    
        var myObj = { "Wavfile": "FromBrowser.ogg",
                "EncodedSpeech": wavContent}; 
        ajax({type: "POST",
            url: "http://192.168.1.31/speech/english/imda1.php",
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
  const res = await fetch(uri)
  const blob = await res.blob()
  console.log(blob)
  rippedfromimda()
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
