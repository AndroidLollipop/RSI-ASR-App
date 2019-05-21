import clone from './clone' //TO PREVENT fakeupd FROM VIOLATING IMMUTABILITY OF storeData, WILL BE REMOVED IN FINAL APP

const callbags = require("./callbags/callbags")

const guardStart = callbags.funcComposeN(x => (callbags.listenStart(x),x), callbags.latestRDI, callbags.multicast)

const asrStream = callbags.factoryFromCallback()

asrStream.callbag = guardStart(asrStream.callbag)

const mapBaseStream = callbags.factoryFromCallback()

mapBaseStream.callbag = guardStart(mapBaseStream.callbag)

const mapHighlightStream = callbags.factoryFromCallback()

mapHighlightStream.callbag = guardStart(mapHighlightStream.callbag)

const searchCellsStream = callbags.factoryFromCallback()

searchCellsStream.callbag = guardStart(searchCellsStream.callbag)

const storeDataStream = callbags.factoryFromCallback()

storeDataStream.callbag = guardStart(storeDataStream.callbag)

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
      asrStream.callback(res.decodeText.split("\n").join(""))
    }
    catch(e){
      alert(e)
      alert("Server not detected. Returning default response")
      asrStream.callback("where is the bubble gum")
    }
    resolveMyPromise()
    console.log(res)
  }
  return myPromise
}
var storeData = {
  "items": [
    // RedLeft - Sauces, Dried Goods & Candies
    {"iuid": 1, "istock": 10, "itemName": "Premium Red Dates", "price": "$1.50 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "premium", "red", "date", "dates", "xinjiang", "chinese", "china"]},
    {"iuid": 2, "istock": 10, "itemName": "Wild Black Wolfberry", "price": "$7.00 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "wild", "black", "wolfberry", "wolfberries", "xinjiang", "chinese", "china"]},
    {"iuid": 3, "istock": 10, "itemName": "Maya Dates", "price": "$0.86 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "maya", "date", "dates"]},
    {"iuid": 4, "istock": 10, "itemName": "Dried Longan", "price": "$2.70 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "longan", "longans", "thailand", "thai"]},
    {"iuid": 5, "istock": 10, "itemName": "Premium Dried Shrimp", "price": "$4.30 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "premium", "shrimp", "indonesia", "indonesian"]},
    {"iuid": 6, "istock": 10, "itemName": "Premium Dried Anchovies", "price": "$2.00 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 1, "tags": ["dried", "good", "goods", "premium", "anchovy", "anchovies", "vietnam", "vietnamese"]},
    {"iuid": 7, "istock": 10, "itemName": "Organic Dried Tibetan Goji Berries", "price": "$7.20 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "organic", "tibetan", "goji", "berries", "berry", "tibet", "tibetan"]},
    {"iuid": 8, "istock": 10, "itemName": "Hokkaido Premium Scallop SA", "price": "$27.80 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "hokkaido", "premium", "scallop", "scallops", "japan", "japanese"]},
    {"iuid": 9, "istock": 10, "itemName": "Hokkaido Premium Scallop SAS", "price": "$23.00 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "hokkaido", "premium", "scallop", "scallops", "japan", "japanese"]},
    {"iuid": 10, "istock": 10, "itemName": "Japanese Shiitake Mushroom", "price": "$6.00 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "shiitake", "mushroom", "mushrooms", "japanese", "japan"]},
    {"iuid": 11, "istock": 10, "itemName": "Honey Dates", "price": "$0.78 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "honey", "date", "dates"]},
    {"iuid": 12, "istock": 10, "itemName": "American Dried Figs", "price": "$4.00 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "good", "goods", "american", "america", "fig", "figs"]},
    {"iuid": 13, "istock": 10, "itemName": "Organic Extra Virgin Coconut Oil", "price": "$3.95 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 1, "tags": ["organic", "extra", "virgin", "coconut", "oil", "sri", "lanka", "lankan"]},
    {"iuid": 14, "istock": 10, "itemName": "Apple Cider Vinegar", "price": "$0.67 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 1, "tags": ["apple", "cider", "vinegar", "australia", "australian"]},
    {"iuid": 15, "istock": 10, "itemName": "Distilled White Vinegar", "price": "$0.52 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 1, "tags": ["distilled", "white", "vinegar", "australia", "australian"]},
    {"iuid": 16, "istock": 10, "itemName": "Nanyang Premium Light Soya Sauce", "price": "$1.63 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 1, "tags": ["nanyang", "sauce", "sauces", "premium", "light", "soya", "singapore", "singaporean"]},
    {"iuid": 17, "istock": 10, "itemName": "Dark Chocolate with Hazelnut", "price": "$3.40 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "dark", "chocolate", "chocolates", "hazelnut", "hazelnuts", "malaysia", "malaysian"]},
    {"iuid": 18, "istock": 10, "itemName": "Matcha White Chocolate with Almond", "price": "$3.40 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "matcha", "chocolate", "chocolates", "white", "almond", "almonds", "malaysia", "malaysian"]},
    {"iuid": 19, "istock": 10, "itemName": "Milk Chocolate with Strawberry", "price": "$3.40 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "milk", "chocolate", "chocolates", "strawberry", "strawberries", "malaysia", "malaysian"]},
    {"iuid": 20, "istock": 10, "itemName": "Milk Chocolate Assorted", "price": "$3.40 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "milk", "chocolate", "chocolates", "assorted", "malaysia", "malaysian"]},
    {"iuid": 21, "istock": 10, "itemName": "M&M Peanut Chocolate", "price": "$2.80 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "M&M", "M&Ms", "M", "and", "chocolate", "chocolates", "peanut", "peanuts", "US", "USA", "american", "america"]},
    {"iuid": 22, "istock": 10, "itemName": "Milk Chocolate with Raisin", "price": "$2.50 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "milk", "chocolate", "chocolates", "raisin", "raisins", "malaysia", "malaysian"]},
    {"iuid": 23, "istock": 10, "itemName": "M&M Plain Chocolate", "price": "$2.80 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "M&M", "M&Ms", "M", "and", "chocolate", "chocolates", "plain", "US", "USA", "american", "america"]},
    {"iuid": 24, "istock": 10, "itemName": "Milk Chocolate with Almond", "price": "$3.40 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "milk", "chocolate", "chocolates", "almond", "almonds", "malaysia", "malaysian"]},
    {"iuid": 25, "istock": 10, "itemName": "Roasted Coffee Bean Smothered in Premium Dark Chocolate", "price": "$5.80 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "dark", "chocolate", "chocolates", "roasted", "coffee", "bean", "beans", "premium", "australia", "australian"]},
    {"iuid": 26, "istock": 10, "itemName": "Soya Sauce Gift Set", "price": "$38.00", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "soya", "gift", "set", "sets", "singapore", "singaporean"]},
    {"iuid": 27, "istock": 10, "itemName": "Chilli Sauce Gift Set", "price": "$48.00", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "chilli", "gift", "set", "sets", "singapore", "singaporean"]},
    {"iuid": 28, "istock": 10, "itemName": "Nanyang Premium Sweet Sauce", "price": "$1.35 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 1, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "premium", "sweet", "singapore", "singaporean"]},
    {"iuid": 29, "istock": 10, "itemName": "Nanyang Premium Dark Soya Sauce", "price": "$1.63 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "premium", "dark", "soya", "singapore", "singaporean"]},
    {"iuid": 30, "istock": 10, "itemName": "Nanyang Premium Black Vinegar", "price": "$1.93 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "premium", "black", "vinegar", "singapore", "singaporean"]},
    {"iuid": 31, "istock": 10, "itemName": "Superior Light Soya Sauce", "price": "$0.32 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 2, "tags": ["sauce", "sauces", "superior", "light", "soya", "singapore", "singaporean"]},
    {"iuid": 32, "istock": 10, "itemName": "Sesame Oil", "price": "$0.86 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 2, "tags": ["sauce", "sauces", "sesame", "oil", "singapore", "singaporean"]},
    {"iuid": 33, "istock": 10, "itemName": "Balsamic Oil", "price": "$0.86 per 100g", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 2, "shelfColumn": 2, "tags": ["sauce", "sauces", "balsamic", "vinegar", "italy", "italian"]},
    {"iuid": 34, "istock": 10, "itemName": "Nanyang Chicken Rice Chilli Sauce", "price": "$9.90 each", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "chilli", "chicken", "rice", "singapore", "singaporean"]},
    {"iuid": 35, "istock": 10, "itemName": "Nanyang Sambal Prawn Chilli Sauce", "price": "$9.90 each", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "chilli", "sambal", "prawn", "singapore", "singaporean"]},
    {"iuid": 36, "istock": 10, "itemName": "Nanyang Nonya Chilli Sauce", "price": "$9.90 each", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "chilli", "nonya", "singapore", "singaporean"]},
    {"iuid": 37, "istock": 10, "itemName": "Nanyang Tau Cheo Whole Salted Beans", "price": "$9.90 each", "shelfLocation": "RedLeft", "friendlyLocation": "Sauces, Dried Goods & Candies", "shelfRow": 3, "shelfColumn": 2, "tags": ["nanyang", "sauce", "sauces", "tau", "cheo", "whole", "salted", "beans", "bean", "singapore", "singaporean"]},
  
    // OrangeLeft - Honey, Oils & Coffee
    {"iuid": 38, "istock": 10, "itemName": "Longan Nectar Honey", "price": "$5.20 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 1, "shelfColumn": 1, "tags": ["longan", "nectar", "honey"]},
    {"iuid": 39, "istock": 10, "itemName": "Wildflower Nectar Honey", "price": "$8.20 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 1, "shelfColumn": 1, "tags": ["wildflower", "nectar", "honey"]},
    {"iuid": 40, "istock": 10, "itemName": "Pomace Olive Oil", "price": "$1.12 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 2, "shelfColumn": 1, "tags": ["pomace", "olive", "oil", "italy", "italian"]},
    {"iuid": 41, "istock": 10, "itemName": "Extra Virgin Olive Oil", "price": "$1.38 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 2, "shelfColumn": 1, "tags": ["extra", "virgin", "olive", "oil", "italy", "italian"]},
    {"iuid": 42, "istock": 10, "itemName": "Extra Virgin Olive Oil", "price": "$1.38 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 2, "shelfColumn": 1, "tags": ["extra", "virgin", "olive", "oil", "italy", "italian"]},
    {"iuid": 43, "istock": 10, "itemName": "Freshly Roasted Specialty Coffee Beans for Espresso", "price": "$14 per 200g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 3, "shelfColumn": 1, "tags": ["fresh", "freshly", "roasted", "specialty", "coffee", "beans", "espresso", "brazil", "brazilian", "india", "indian", "arabica", "bean"]},
    {"iuid": 44, "istock": 10, "itemName": "Freshly Roasted Specialty Coffee Beans for Filter", "price": "$14 per 200g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 3, "shelfColumn": 1, "tags": ["fresh", "freshly", "roasted", "specialty", "coffee", "bean", "beans", "filter", "brazil", "brazilian", "rainha", "arabica", "beans"]},
    {"iuid": 45, "istock": 10, "itemName": "Organic 100% Arabica Coffee Beans", "price": "$8 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 3, "shelfColumn": 1, "tags": ["organic", "coffee", "beans", "arabica", "bean"]},
    {"iuid": 46, "istock": 10, "itemName": "Sour Blast Tutti Fruitti Rainbow", "price": "$2.90 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "sour", "blast", "tutti", "fruitti", "rainbow", "turkey", "turkish"]},
    {"iuid": 47, "istock": 10, "itemName": "Skittles Original Fruity Candy", "price": "$3.00 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "skittles", "original", "fruity", "rainbow", "US", "USA", "american", "america"]},
    {"iuid": 48, "istock": 10, "itemName": "Marshmallow", "price": "$2.90 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "marshmallow", "marshmallows", "turkey", "turkish"]},
    {"iuid": 49, "istock": 10, "itemName": "Gold Bear Gummy", "price": "$2.40 per 100g", "shelfLocation": "OrangeLeft", "friendlyLocation": "Honey, Oils & Coffee", "shelfRow": 4, "shelfColumn": 1, "tags": ["candy", "candies", "sweet", "sweets", "gold", "bear", "gummy", "gummies", "bears", "malaysia", "malaysian"]},
  
    // YellowLeft - Tea Leaves & Seeds
    {"iuid": 50, "istock": 10, "itemName": "Lemongrass Ginger Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "lemongrass", "ginger"]},
    {"iuid": 51, "istock": 10, "itemName": "Sakura Surprise Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "sakura", "surprise", "japan", "japanese"]},
    {"iuid": 52, "istock": 10, "itemName": "Butterfly Blue Pea Tea Leaves", "price": "$0.83 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "butterfly", "blue", "pea", "thailand", "thai"]},
    {"iuid": 53, "istock": 10, "itemName": "Houjicha Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "houjicha", "hou", "ji", "cha"]},
    {"iuid": 54, "istock": 10, "itemName": "Chinese Green Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "chinese", "green"]},
    {"iuid": 55, "istock": 10, "itemName": "Peppermint Tea Leaves", "price": "$1.20 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 1, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "peppermint", "england", "english"]},
    {"iuid": 56, "istock": 10, "itemName": "Pu Er Tea Leaves", "price": "$1.20 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "pu", "er", "puer", "yunnan", "china", "chinese"]},
    {"iuid": 57, "istock": 10, "itemName": "Orange Pekoe Tea Leaves", "price": "$1.20 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "orange", "pekoe", "sri", "lanka", "lankan"]},
    {"iuid": 58, "istock": 10, "itemName": "Chrysanthemum Tea Leaves", "price": "$1.35 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "chrysanthemum"]},
    {"iuid": 59, "istock": 10, "itemName": "Raffles Rooibos Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "raffles", "rooibos"]},
    {"iuid": 60, "istock": 10, "itemName": "Earl Grey Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "earl", "grey"]},
    {"iuid": 61, "istock": 10, "itemName": "Strawberry Apple Tea Leaves", "price": "nil", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "strawberry", "apple"]},
    {"iuid": 62, "istock": 10, "itemName": "Genmaicha Tea Leaves", "price": "$1.30 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 2, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "genmaicha", "gen", "mai", "cha", "Shizuoka", "japan", "japanese"]},
    {"iuid": 63, "istock": 10, "itemName": "Organic Pumpkin Seeds", "price": "$2.90 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "pumpkin", "peru", "peruvian"]},
    {"iuid": 64, "istock": 10, "itemName": "Organic Sunflower Kernel", "price": "$2.16 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "sunflower", "kernel", "kernels", "US", "USA", "american", "america"]},
    {"iuid": 65, "istock": 10, "itemName": "Organic Golden Flaxseeds", "price": "$1.25 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "golden", "flax", "flaxseed", "flaxseeds", "US", "USA", "american", "america"]},
    {"iuid": 66, "istock": 10, "itemName": "Organic Roasted Sacha Seeds", "price": "$7.90 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "roasted", "sacha", "peru", "peruvian"]},
    {"iuid": 67, "istock": 10, "itemName": "Organic White Sesame Seeds", "price": "$1.81 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "white", "sesame", "china", "chinese"]},
    {"iuid": 68, "istock": 10, "itemName": "Organic Black Sesame Seeds", "price": "$1.22 per 100g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 3, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "black", "sesame", "china", "chinese"]},
    {"iuid": 69, "istock": 10, "itemName": "France Rose Tea Leaves", "price": "$0.65 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "rose", "france", "french"]},
    {"iuid": 70, "istock": 10, "itemName": "Dried Gold Lemon", "price": "$0.35 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["dried", "gold", "lemon", "peel", "peels", "taiwan", "taiwanese"]},
    {"iuid": 71, "istock": 10, "itemName": "Hibiscus Tea Leaves", "price": "$1.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "hibiscus"]},
    {"iuid": 72, "istock": 10, "itemName": "Dried Orange Peels", "price": "$0.20 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["dried", "orange", "peel", "peels"]},
    {"iuid": 73, "istock": 10, "itemName": "Osmanthus Tea Leaves", "price": "$1.17 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "osmanthus", "china", "chinese"]},
    {"iuid": 74, "istock": 10, "itemName": "Lavender Tea Leaves", "price": "$0.50 per 10g", "shelfLocation": "YellowLeft", "friendlyLocation": "Tea Leaves & Seeds", "shelfRow": 4, "shelfColumn": 1, "tags": ["tea", "leaf", "leaves", "lavender", "france", "french"]},
  
    // GreenLeft - Salt, Sugar & Powders
    {"iuid": 75, "istock": 10, "itemName": "Dessicated Coconut", "price": "$1.30 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 1, "shelfColumn": 1, "tags": ["dessicated", "coconut", "coconuts", "dried"]},
    {"iuid": 76, "istock": 10, "itemName": "Organic Toasted Coconut Flakes", "price": "$3.96 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 1, "shelfColumn": 1, "tags": ["organic", "toasted", "coconut", "coconuts", "flake", "flakes"]},
    {"iuid": 77, "istock": 10, "itemName": "Organic Raw Cacao Powder", "price": "$3.96 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 1, "shelfColumn": 1, "tags": ["organic", "raw", "cacao", "powder"]},
    {"iuid": 78, "istock": 10, "itemName": "Organic Sweet Raw Cacao Nibs", "price": "$5.96 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 1, "shelfColumn": 1, "tags": ["organic", "sweet", "raw", "cacao", "nibs", "nib"]},
    {"iuid": 79, "istock": 10, "itemName": "Organic Raw Cacao Nibs", "price": "$5.96 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 1, "shelfColumn": 1, "tags": ["organic", "raw", "cacao", "nibs", "nib"]},
    {"iuid": 80, "istock": 10, "itemName": "Organic Raw Maca Root Powder", "price": "$0.56 per 10g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 2, "shelfColumn": 1, "tags": ["organic", "raw", "maca", "root", "powder", "peru", "peruvian"]},
    {"iuid": 81, "istock": 10, "itemName": "Organic Raw Golden Ginger Powder", "price": "$0.75 per 10g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 2, "shelfColumn": 1, "tags": ["organic", "raw", "gold", "ginger", "powder", "peru", "peruvian"]},
    {"iuid": 82, "istock": 10, "itemName": "Organic Moringa Leaf Powder", "price": "$0.99 per 10g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 2, "shelfColumn": 1, "tags": ["organic", "moringa", "leaf", "leaves", "powder", "india", "indian"]},
    {"iuid": 83, "istock": 10, "itemName": "Organic Acai Berry Powder", "price": "$2.54 per 10g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 2, "shelfColumn": 1, "tags": ["organic", "acai", "berry", "powder", "bolivia", "bolivian"]},
    {"iuid": 84, "istock": 10, "itemName": "Organic Culinary Matcha Powder", "price": "$1.49 per 10g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 2, "shelfColumn": 1, "tags": ["organic", "culinary", "matcha", "powder", "japan", "japanese"]},
    {"iuid": 85, "istock": 10, "itemName": "Organic Granulated Coconut Sugar", "price": "$2.32 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 3, "shelfColumn": 1, "tags": ["organic", "granulated", "coconut", "sugar", "sugars", "indonesia", "indonesian"]},
    {"iuid": 86, "istock": 10, "itemName": "Organic Raw Sugar", "price": "$0.50 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 3, "shelfColumn": 1, "tags": ["organic", "raw", "sugar", "sugars", "australia", "australian"]},
    {"iuid": 87, "istock": 10, "itemName": "Pink Himalayan Rock Salt", "price": "$3.50 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 4, "shelfColumn": 1, "tags": ["pink", "himalayan", "rock", "salt", "salts", "pakistan", "pakistani"]},
    {"iuid": 88, "istock": 10, "itemName": "Organic Rock Salt", "price": "$0.52 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 4, "shelfColumn": 1, "tags": ["organic", "rock", "salt", "salts", "australia", "australian"]},
    {"iuid": 89, "istock": 10, "itemName": "Organic Rock Salt", "price": "$0.52 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 4, "shelfColumn": 1, "tags": ["organic", "rock", "salt", "salts", "australia", "australian"]},
    {"iuid": 90, "istock": 10, "itemName": "Artificial Vinegar", "price": "$1.10 per 1kg", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 5, "shelfColumn": 1, "tags": ["artificial", "vinegar"]},
    {"iuid": 91, "istock": 10, "itemName": "Ecostore Shampoo", "price": "$3.30 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 5, "shelfColumn": 1, "tags": ["ecostore", "shampoo", "new", "zealand"]},
    {"iuid": 92, "istock": 10, "itemName": "Ecostore Conditioner", "price": "$3.30 per 100g", "shelfLocation": "GreenLeft", "friendlyLocation": "Salt, Sugar & Powders", "shelfRow": 5, "shelfColumn": 1, "tags": ["ecostore", "conditioner", "daily", "moisturising", "new", "zealand"]},

    // BlueLeft - Cleaning Agents
    {"iuid": 93, "istock": 10, "itemName": "Multi-purpose Cleaner", "price": "$0.96 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 1, "shelfColumn": 1, "tags": ["multipurpose", "multi", "purpose", "cleaner", "singapore", "singaporean"]},
    {"iuid": 94, "istock": 10, "itemName": "Floor Clean Liquid", "price": "$0.85 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 1, "shelfColumn": 1, "tags": ["floor", "clean", "liquid", "cleaner", "singapore", "singaporean"]},
    {"iuid": 95, "istock": 10, "itemName": "Delicate Laundry Liquid", "price": "$0.95 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 1, "shelfColumn": 1, "tags": ["delicate", "laundry", "liquid", "cleaner", "soap", "singapore", "singaporean"]},
    {"iuid": 96, "istock": 10, "itemName": "Laundry Liquid", "price": "$0.85 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 1, "shelfColumn": 1, "tags": ["laundry", "liquid", "cleaner", "soap", "singapore", "singaporean"]},
    {"iuid": 97, "istock": 10, "itemName": "Natural Hand Soap", "price": "$0.96 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 2, "shelfColumn": 1, "tags": ["natural", "hand", "soap", "singapore", "singaporean"]},
    {"iuid": 98, "istock": 10, "itemName": "Dishwashing Liquid", "price": "$0.96 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 2, "shelfColumn": 1, "tags": ["dishwashing", "dish", "wash", "washing", "liquid", "soap", "singapore", "singaporean"]},
    {"iuid": 99, "istock": 10, "itemName": "Organic Pet Shampoo", "price": "nil", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 2, "shelfColumn": 1, "tags": ["pet", "dog", "washing", "wash", "soap", "shampoo", "vermont", "organic"]},
    {"iuid": 100, "istock": 10, "itemName": "Multipurpose Organic Castile Unscented Liquid Soap", "price": "nil", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 3, "shelfColumn": 1, "tags": ["multipurpose", "multi", "purpose", "castile", "unscented", "liquid", "soap", "vermont", "organic"]},
    {"iuid": 101, "istock": 10, "itemName": "Organic Soap Nuts", "price": "$4.98 per 100g", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 3, "shelfColumn": 1, "tags": ["soap", "nuts", "nepal", "nepalese", "organic"]},
    {"iuid": 102, "istock": 10, "itemName": "Multipurpose Organic Castile Lavender Ecstasy Liquid Soap", "price": "nil", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 3, "shelfColumn": 1, "tags": ["multipurpose", "multi", "purpose", "castile", "lavender", "ecstasy", "liquid", "soap", "vermont", "organic"]},
    {"iuid": 103, "istock": 10, "itemName": "Nature’s Gentle Hand Wash", "price": "$7.20 per 1kg", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 4, "shelfColumn": 1, "tags": ["nature’s", "nature", "natures", "gentle", "hand", "wash", "liquid", "soap"]},
    {"iuid": 104, "istock": 10, "itemName": "No Rinse Floor Cleaner", "price": "$9.60 per 1kg", "shelfLocation": "BlueLeft", "friendlyLocation": "Cleaning Agents", "shelfRow": 4, "shelfColumn": 1, "tags": ["no", "rinse", "floor", "cleaner", "cleaning", "liquid", "soap"]},

    // RedRight - Grains & Dried Fruit
    {"iuid": 105, "istock": 10, "itemName": "Organic Rolled Oats", "price": "$0.98 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "rolled", "oat", "oats", "australia", "australian"]},
    {"iuid": 106, "istock": 10, "itemName": "Organic Instant Oats", "price": "$0.83 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "instant", "oat", "oats", "australia", "australian"]},
    {"iuid": 107, "istock": 10, "itemName": "Organic Barley Pearl Brown", "price": "$0.86 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "barley", "pearl", "brown", "US", "USA", "american", "america"]} ,
    {"iuid": 108, "istock": 10, "itemName": "Organic Raw Buckwheat", "price": "$1.00 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "raw", "buckwheat", "australia", "australian"]},
    {"iuid": 109, "istock": 10, "itemName": "Organic Yellow Split Peas", "price": "$0.61 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "yellow", "split", "pea", "peas", "splitpea", "splitpeas", "US", "USA", "american", "america"]},
    {"iuid": 110, "istock": 10, "itemName": "Organic Red Lentils", "price": "$1.21 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "red", "lentil", "lentils", "US", "USA", "american", "america"]},
    {"iuid": 111, "istock": 10, "itemName": "Organic Green Lentils", "price": "$0.75 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grains", "grain", "organic", "green", "lentil", "lentils", "US", "USA", "american", "america"]},
    {"iuid": 112, "istock": 10, "itemName": "Sun-dried Tomatoes", "price": "$1.40 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "sun", "dry", "sundried", "sun-dried", "tomato", "tomatoes", "tomatos", "china", "chinese"]},
    {"iuid": 113, "istock": 10, "itemName": "Organic Dried White Mulberries", "price": "$4.96 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "berry", "berries", "organic", "white", "mulberry", "mulberries", "US", "USA", "american", "america"]},
    {"iuid": 114, "istock": 10, "itemName": "Organic Sun-dried Figs", "price": "$4.40 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "organic", "sun", "dry", "dried", "sundried", "sun-dried", "fig", "figs", "turkey", "turkish"]},
    {"iuid": 115, "istock": 10, "itemName": "Dried Prunes", "price": "$2.00 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "prunes", "prune", "dry"]},
    {"iuid": 116, "istock": 10, "itemName": "Organic Dried Apricot", "price": "$4.40 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "organic", "apricot", "apricots", "turkey", "turkish"]},
    {"iuid": 117, "istock": 10, "itemName": "Dried Cranberries", "price": "$1.30 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "cranberry", "cranberries", "US", "USA", "american", "america"]},
    {"iuid": 118, "istock": 10, "itemName": "Dried Blueberries", "price": "$4.72 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "blueberry", "blueberries", "US", "USA", "american", "america"]},
    {"iuid": 119, "istock": 10, "itemName": "Organic Sultana Raisin", "price": "$1.80 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 2, "shelfColumn": 1, "tags": ["dried", "fruit", "fruits", "organic", "sultana", "sultanas", "raisin", "raisins", "turkey", "turkish"]},
    {"iuid": 120, "istock": 10, "itemName": "Organic Brown Rice", "price": "$0.55 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "brown", "rice", "thailand", "thai"]},
    {"iuid": 121, "istock": 10, "itemName": "Yellow Coarse Bulgar", "price": "$0.60 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "yellow", "coarse", "bulgar", "turkey", "turkish"]},
    {"iuid": 122, "istock": 10, "itemName": "Organic Millet", "price": "$0.65 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "millet", "china", "chinese"]},
    {"iuid": 123, "istock": 10, "itemName": "Organic Amaranth Grains", "price": "$1.50 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "amaranth", "south", "american", "america"]},
    {"iuid": 124, "istock": 10, "itemName": "Organic Tri-colour Quinoa", "price": "$1.98 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "tricolour", "tri-colour", "tri", "colour", "quinoa", "south", "american", "america"]},
    {"iuid": 125, "istock": 10, "itemName": "Organic White Quinoa", "price": "$1.70 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "white", "quinoa", "peru", "peruvian"]},
    {"iuid": 126, "istock": 10, "itemName": "Popcorn Kernels", "price": "$0.65 per 100g", "shelfLocation": "RedRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 3, "shelfColumn": 1, "tags": ["grain", "grains", "popcorn", "kernel", "kernels", "US", "USA", "american", "america"]},
  
    // OrangeRight - Beans, Cereals & Nuts
    {"iuid": 127, "istock": 10, "itemName": "Organic Kidney Bean", "price": "$0.96 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "kidney", "dalian", "da", "lian", "china", "chinese"]},
    {"iuid": 128, "istock": 10, "itemName": "Organic Garbanzo Bean", "price": "$1.01 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "garbanzo", "US", "USA", "american", "america"]},
    {"iuid": 129, "istock": 10, "itemName": "Organic Black Bean", "price": "$0.90 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "black", "inner", "mongolia", "mongolian"]},
    {"iuid": 130, "istock": 10, "itemName": "Organic Soy Bean", "price": "$0.77 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "soy", "china", "chinese"]},
    {"iuid": 131, "istock": 10, "itemName": "Organic Mung Bean", "price": "$0.92 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "mung", "inner", "mongolia", "mongolian"]},
    {"iuid": 132, "istock": 10, "itemName": "Organic Adzuki Bean", "price": "$1.15 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 1, "shelfColumn": 1, "tags": ["bean", "beans", "organic", "adzuki", "china", "chinese"]},
    {"iuid": 133, "istock": 10, "itemName": "Organic Black Chia Seeds", "price": "$1.50 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Grains & Dried Fruit", "shelfRow": 1, "shelfColumn": 1, "tags": ["grain", "grains", "organic", "black", "chia", "seeds", "seed", "peru", "peruvian"]},
    {"iuid": 134, "istock": 10, "itemName": "Pandan Coconut Nut Mix", "price": "$5.60 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "mix", "mixed", "pandan", "coconut", "malaysia", "malaysian"]},
    {"iuid": 135, "istock": 10, "itemName": "Zesty Maple Glazed Nut Mix", "price": "$5.60 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "mix", "mixed", "maple", "glazed", "zesty", "malaysia", "malaysian"]},
    {"iuid": 136, "istock": 10, "itemName": "Organic Purple Corn Flakes Quinoa Mulberries", "price": "$5.16 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["cereal", "cereals", "organic", "corn", "flakes", "cornflakes", "quinoa", "mulberry", "mulberries", "peru", "peruvian"]},
    {"iuid": 137, "istock": 10, "itemName": "Organic Cinnamon Muesli with Cashews", "price": "$4.60 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["cereal", "cereals", "organic", "muesli", "cinnamon", "cashew", "cashews", "gluten", "free", "vegan", "singapore", "singaporean"]},
    {"iuid": 138, "istock": 10, "itemName": "Organic Raw Chocolate Toasted Muesli with Hazelnut & Mulberries", "price": "$4.60 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["cereal", "cereals", "organic", "raw", "chocolate", "toasted", "muesli", "hazelnut", "hazelnuts", "mulberry", "mulberries", "singapore", "singaporean"]},
    {"iuid": 139, "istock": 10, "itemName": "Hazelnut Blackforest Granola", "price": "$4.20 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["cereal", "cereals", "granola", "hazelnut", "hazelnuts", "blackforest", "black", "forest", "malaysia", "malaysian"]},
    {"iuid": 140, "istock": 10, "itemName": "Matcha Granola", "price": "$4.20 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 2, "shelfColumn": 1, "tags": ["cereal", "cereals", "granola", "matcha", "malaysia", "malaysian"]},
    {"iuid": 141, "istock": 10, "itemName": "Raw Natural Walnut", "price": "$2.52 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "raw", "natural", "walnut", "US", "USA", "american", "america"]},
    {"iuid": 142, "istock": 10, "itemName": "Raw Natural Cashew", "price": "$3.36 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "raw", "natural", "cashew", "US", "USA", "american", "america"]},
    {"iuid": 143, "istock": 10, "itemName": "Roasted Hazelnut", "price": "$3.99 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "roasted", "hazelnut", "turkey", "turkish"]},
    {"iuid": 144, "istock": 10, "itemName": "Raw Natural Almond", "price": "$2.80 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "raw", "natural", "almond", "US", "USA", "american", "america"]},
    {"iuid": 145, "istock": 10, "itemName": "Deluxe Mix Nuts", "price": "$3.20 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "mix", "mixed", "deluxe", "singapore", "singaporean"]},
    {"iuid": 146, "istock": 10, "itemName": "Pine Nut", "price": "$5.50 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["nut", "nuts", "pine"]},
    {"iuid": 147, "istock": 10, "itemName": "Gluten Free Spaghetti", "price": "$1.18 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["pasta", "gluten", "free", "spaghetti"]},
    {"iuid": 148, "istock": 10, "itemName": "Organic Spaghetti", "price": "$0.67 per 100g", "shelfLocation": "OrangeRight", "friendlyLocation": "Beans, Cereals & Nuts", "shelfRow": 3, "shelfColumn": 1, "tags": ["pasta", "organic", "spaghetti", "italy", "italian"]},
  
    // YellowRight - Pasta, Nuts & Chips
    {"iuid": 149, "istock": 10, "itemName": "Organic Gluten Free Fusilli", "price": "$1.18 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "gluten", "free", "fusilli", "italy", "italian"]},
    {"iuid": 150, "istock": 10, "itemName": "Organic Whole Wheat Penne", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "whole", "wheat", "penne", "italy", "italian"]},
    {"iuid": 151, "istock": 10, "itemName": "Organic Whole Wheat Fusilli", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "whole", "wheat", "fusilli", "italy", "italian"]},
    {"iuid": 152, "istock": 10, "itemName": "Organic Conchigle", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "conchigle", "italy", "italian"]},
    {"iuid": 153, "istock": 10, "itemName": "Organic Penne", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "penne", "italy", "italian"]},
    {"iuid": 154, "istock": 10, "itemName": "Organic Macaroni", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "macaroni", "italy", "italian"]},
    {"iuid": 155, "istock": 10, "itemName": "Organic Fusilli", "price": "$0.67 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 1, "shelfColumn": 1, "tags": ["pasta", "organic", "fusilli", "italy", "italian"]},
    {"iuid": 156, "istock": 10, "itemName": "‘Beer’ Nuts", "price": "$1.40 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nuts", "nut", "beer", "US", "USA", "american", "america"]},
    {"iuid": 157, "istock": 10, "itemName": "Abalone Cream Macadamia", "price": "$7.90 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nuts", "nut", "abalone", "cream", "macadamia", "australia", "australian"]},
    {"iuid": 158, "istock": 10, "itemName": "Spicy Prawn Roll", "price": "$2.50 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["snack", "snacks", "spicy", "prawn", "roll", "rolls", "singapore", "singaporean"]},
    {"iuid": 159, "istock": 10, "itemName": "Roasted Cashew", "price": "$3.40 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "roasted", "cashew", "cashews", "US", "USA", "american", "america"]},
    {"iuid": 160, "istock": 10, "itemName": "Roasted Almond", "price": "$3.20 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "roasted", "almond", "almonds", "US", "USA", "american", "america"]},
    {"iuid": 161, "istock": 10, "itemName": "Japanese Mix Nuts", "price": "$2.80 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "mixed", "mix", "japan", "japanese"]},
    {"iuid": 162, "istock": 10, "itemName": "Roasted Peanuts", "price": "$1.00 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 2, "shelfColumn": 1, "tags": ["nut", "nuts", "roasted", "peanut", "peanuts", "malaysia", "malaysian"]},
    {"iuid": 163, "istock": 10, "itemName": "Shiitake Mushroom Chips", "price": "$7.00 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "shiitake", "mushroom", "mushrooms", "taiwan", "taiwanese"]},
    {"iuid": 164, "istock": 10, "itemName": "Vegetable Chips", "price": "$4.75 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "vegetable", "taiwan", "taiwanese"]},
    {"iuid": 165, "istock": 10, "itemName": "Banana Chips", "price": "$4.75 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "snack", "snacks", "banana", "taiwan", "taiwanese"]},
    {"iuid": 166, "istock": 10, "itemName": "Honey Mustard Soya Crisps", "price": "$2.78 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "honey", "mustard", "soya", "australia", "australian"]},
    {"iuid": 167, "istock": 10, "itemName": "Sweet Chilli Lime Soya Crisps", "price": "$2.78 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "sweet", "chilli", "lime", "soya", "australia", "australian"]},
    {"iuid": 168, "istock": 10, "itemName": "Cheese Soya Crisps", "price": "$2.78 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "cheese", "cheesy", "soya", "australia", "australian"]},
    {"iuid": 169, "istock": 10, "itemName": "Apple Chips", "price": "$6.70 per 100g", "shelfLocation": "YellowRight", "friendlyLocation": "Pasta, Nuts & Chips", "shelfRow": 3, "shelfColumn": 1, "tags": ["chip", "chips", "crisps", "crisp", "snack", "snacks", "apple", "taiwan", "taiwanese"]},
  
    // GreenRight - Hygiene & Biscuits
    {"iuid": 170, "istock": 10, "itemName": "Menstrual Cups", "price": "$35.00", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 1, "shelfColumn": 1, "tags": ["hygiene", "products", "women", "womens", "health", "menstrual", "cups", "period", "menstruation"]},
    {"iuid": 171, "istock": 10, "itemName": "Soap Dish", "price": "$8.50", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 1, "tags": ["hygiene", "products", "soap", "dish"]},
    {"iuid": 172, "istock": 10, "itemName": "Makeup Remover Towel", "price": "$18 or $22", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 1, "tags": ["hygiene", "products", "makeup", "make", "up", "remover", "towel"]},
    {"iuid": 173, "istock": 10, "itemName": "Soap Bars", "price": "varies", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 1, "tags": ["hygiene", "products", "soap", "soaps", "bar", "bars", "travel", "facial", "detox", "shampoo", "shaving", "pets", "pet", "handcrafted", "hand", "crafted", "cold", "process", "salt"]},
    {"iuid": 174, "istock": 10, "itemName": "Stainless Steel Razor", "price": "$29.90", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 1, "tags": ["hygiene", "products", "stainless", "steel", "razor"]},
    {"iuid": 175, "istock": 10, "itemName": "Toilet Roll", "price": "1 for $1.30, 8 for $7.90, 36 for $34.90", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 1, "shelfColumn": 2, "tags": ["hygiene", "products", "toilet", "roll", "paper"]},
    {"iuid": 176, "istock": 10, "itemName": "Powdered Toothpaste", "price": "$14 per 100g", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 2, "tags": ["hygiene", "products", "tooth", "paste", "toothpaste", "powder", "powdered"]},
    {"iuid": 177, "istock": 10, "itemName": "Bamboo Toothbrush", "price": "$7", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 2, "tags": ["hygiene", "products", "tooth", "bush", "toothbrush", "bamboo"]},
    {"iuid": 178, "istock": 10, "itemName": "Natural Deodorant", "price": "$14", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 2, "tags": ["hygiene", "products", "natural", "deodorant"]},
    {"iuid": 179, "istock": 10, "itemName": "Lotion Bar", "price": "$12", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 2, "shelfColumn": 2, "tags": ["hygiene", "products", "lotion", "bar", "lavender", "geranium"]},
    {"iuid": 180, "istock": 10, "itemName": "Shampoo Bar", "price": "$16", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 3, "shelfColumn": 2, "tags": ["hygiene", "products", "shampoo", "bar"]},
    {"iuid": 181, "istock": 10, "itemName": "Luffa Sponge", "price": "$3", "shelfLocation": "GreenRight", "friendlyLocation": "Hygiene & Biscuits", "shelfRow": 3, "shelfColumn": 2, "tags": ["hygiene", "products", "luffa", "loofa", "sponge"]},
    {"iuid": 182, "istock": 10, "itemName": "Pockeat Bag", "price": "vary", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 1, "shelfColumn": 3, "tags": ["food", "bag", "container", "pockeat", "reusable"]},
    {"iuid": 183, "istock": 10, "itemName": "Scented Soy Wax Melts", "price": "$10 per 50g box", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 2, "shelfColumn": 3, "tags": ["scented", "soy", "wax", "melts", "candle", "candles"]},
    {"iuid": 184, "istock": 10, "itemName": "Mix Muruku Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 2, "tags": ["snack", "snacks", "biscuit", "biscuits", "muruku", "mix"]},
    {"iuid": 185, "istock": 10, "itemName": "Chilli Prawn Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 5, "shelfColumn": 2, "tags": ["snack", "snacks", "biscuit", "biscuits", "chilli", "prawn"]},
    {"iuid": 186, "istock": 10, "itemName": "Tapioca Stick Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 5, "shelfColumn": 2, "tags": ["snack", "snacks", "biscuit", "biscuits", "tapioca", "stick", "sticks"]},
    {"iuid": 187, "istock": 10, "itemName": "Baby Ball Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 3, "tags": ["snack", "snacks", "biscuit", "biscuits", "baby", "ball"]},
    {"iuid": 188, "istock": 10, "itemName": "Potato Wheel Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 3, "tags": ["snack", "snacks", "biscuit", "biscuits", "potato", "wheel", "wheels"]},
    {"iuid": 189, "istock": 10, "itemName": "Ice Gems Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 3, "tags": ["snack", "snacks", "biscuit", "biscuits", "ice", "gem", "gems"]},
    {"iuid": 190, "istock": 10, "itemName": "Fish Ball Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 5, "shelfColumn": 3, "tags": ["snack", "snacks", "biscuit", "biscuits", "fish", "ball", "balls"]},
    {"iuid": 191, "istock": 10, "itemName": "Butterfly Snack", "price": "nil", "shelfLocation": "GreenRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 5, "shelfColumn": 3, "tags": ["snack", "snacks", "biscuit", "biscuits", "butterfly", "butterflies"]},
  
    // BlueRight - Reusable Cutlery, Utensils & Bags
    {"iuid": 192, "istock": 10, "itemName": "Collapsible Silicone Coffee Cup", "price": "nil", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 1, "shelfColumn": 1, "tags": ["collapsible", "silicone", "coffee", "cup", "cups", "reusable"]},
    {"iuid": 193, "istock": 10, "itemName": "Healthy Human Water Bottles", "price": "nil", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 2, "shelfColumn": 1, "tags": ["healthy", "human", "water", "bottle", "bottles", "waterbottle", "waterbottles", "reusable"]},
    {"iuid": 194, "istock": 10, "itemName": "Marie Biscuits", "price": "$0.50 per 100g", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 3, "shelfColumn": 1, "tags": ["marie", "biscuit", "biscuits", "snack", "snacks"]},
    {"iuid": 195, "istock": 10, "itemName": "Hoa Poa Durian Snack", "price": "$1.50 per 100g", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 1, "tags": ["hoa", "poa", "durian", "biscuit", "biscuits", "snack", "snacks"]},
    {"iuid": 196, "istock": 10, "itemName": "Recyclable Paper Plates and Bowls", "price": "nil", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 1, "shelfColumn": 2, "tags": ["recyclable", "cardboard", "paper", "plate", "plates", "bowl", "bowls"]},
    {"iuid": 197, "istock": 10, "itemName": "Beeswax Mending Bar", "price": "nil", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 2, "shelfColumn": 2, "tags": ["beeswax", "mending", "bar", "bars"]},
    {"iuid": 198, "istock": 10, "itemName": "Superbee Wax Wraps", "price": "vary", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 2, "shelfColumn": 2, "tags": ["beeswax", "super", "bee", "superbee", "wax", "wrap", "wraps", "reusable"]},
    {"iuid": 199, "istock": 10, "itemName": "Reusable Sandwich Wrap", "price": "$16.90 per wrap", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 3, "shelfColumn": 2, "tags": ["reusable", "sandwich", "sandwiches", "wrap", "wraps"]},
    {"iuid": 200, "istock": 10, "itemName": "Reusable Snack Bag", "price": "$18 per piece", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 3, "shelfColumn": 2, "tags": ["reusable", "snack", "snacks", "bag", "bags"]},
    {"iuid": 201, "istock": 10, "itemName": "Body Mist", "price": "$16.50", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 2, "tags": ["natural", "body", "mist", "spray"]},
    {"iuid": 202, "istock": 10, "itemName": "100% Natural Begone Bug Spray", "price": "vary", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 2, "tags": ["natural", "begone", "bug", "insect", "mosquito", "repellent", "spray"]},
    {"iuid": 203, "istock": 10, "itemName": "100% Compostable Pet Poo Bag", "price": "$7 per 30 pieces", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 2, "tags": ["compostable", "compost", "pet", "poo", "bag", "bags", "pets"]},
    {"iuid": 204, "istock": 10, "itemName": "100% Compostable Bin Bag", "price": "$18 per 50 pieces", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 4, "shelfColumn": 2, "tags": ["compostable", "compost", "dust", "bin", "dustbin", "rubbish", "bag", "bags"]},
    {"iuid": 205, "istock": 10, "itemName": "Foldable Bag", "price": "vary", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 1, "shelfColumn": 3, "tags": ["reusable", "foldable", "bag", "bags"]},
    {"iuid": 206, "istock": 10, "itemName": "Mini Maxi Shopper Bag", "price": "$11.90", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 1, "shelfColumn": 3, "tags": ["reusable", "foldable", "mini", "maxi", "shopper", "shopping", "bag", "bags"]},
    {"iuid": 207, "istock": 10, "itemName": "Multipurpose Organic Cotton Produce Bag", "price": "$4 per piece, $18 per 5 pieces", "shelfLocation": "BlueRight", "friendlyLocation": "Reusable Cutlery, Utensils & Bags", "shelfRow": 2, "shelfColumn": 3, "tags": ["multi", "purpose", "multipurpose", "organic", "cotton", "produce", "bag", "bags"]},
  
    // PurpleRight - Cutlery Cases & Cloths
    {"iuid": 208, "istock": 10, "itemName": "Utensil Wrap", "price": "$39.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 1, "tags": ["reusable", "utensil", "wrap", "wraps", "utensils"]},
    {"iuid": 209, "istock": 10, "itemName": "Bowl & Plate Covers", "price": "$49.90 per set of 3", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 1, "tags": ["reusable", "bowl", "cover", "covers", "plate"]},
    {"iuid": 210, "istock": 10, "itemName": "Bento Bag", "price": "$48 per bag", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 1, "tags": ["reusable", "bento", "bag", "bags"]},
    {"iuid": 211, "istock": 10, "itemName": "Baby Bib", "price": "$21 per piece", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 1, "tags": ["reusable", "baby", "bib", "bibs"]},
    {"iuid": 212, "istock": 10, "itemName": "Nursing Pad", "price": "$27 per piece", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 1, "tags": ["reusable", "baby", "nursing", "pad", "pads"]},
    {"iuid": 213, "istock": 10, "itemName": "Burp Cloth", "price": "$18 per piece", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 1, "tags": ["reusable", "baby", "burp", "cloth", "cloths"]},
    {"iuid": 214, "istock": 10, "itemName": "Silicone Fruit Huggers", "price": "nil", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 2, "tags": ["reusable", "silicone", "fruit", "hugger", "huggers"]},
    {"iuid": 215, "istock": 10, "itemName": "Unpaper Towels", "price": "vary", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 2, "tags": ["reusable", "unpaper", "towel", "towels"]},
    {"iuid": 216, "istock": 10, "itemName": "Cloth Napkins", "price": "vary", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 2, "tags": ["reusable", "cloth", "napkin", "napkins"]},
    {"iuid": 217, "istock": 10, "itemName": "Foldable Stainless Steel Straw", "price": "$12.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 3, "tags": ["reusable", "foldable", "stainless", "steel", "straw", "straws"]},
    {"iuid": 218, "istock": 10, "itemName": "Spork and Straw Set", "price": "$16.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 3, "tags": ["reusable", "spork", "straw", "set"]},
    {"iuid": 219, "istock": 10, "itemName": "Adult Cutlery Set", "price": "$9.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 3, "tags": ["reusable", "adult", "cutlery", "set"]},
    {"iuid": 220, "istock": 10, "itemName": "Multi Colour Cutlery Set", "price": "$17.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 3, "tags": ["reusable", "multi", "color", "multicolor", "colour", "multicolour", "cutlery", "set"]},
    {"iuid": 221, "istock": 10, "itemName": "Wheat Cutlery Set", "price": "$11.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 3, "tags": ["reusable", "wheat", "cutlery", "set"]},
    {"iuid": 222, "istock": 10, "itemName": "Travel Spork", "price": "$6", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 2, "shelfColumn": 3, "tags": ["reusable", "travel", "spork"]},
    {"iuid": 223, "istock": 10, "itemName": "Wheat Cutlery Case", "price": "vary", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 3, "shelfColumn": 3, "tags": ["reusable", "big", "wheat", "cutlery", "case"]},
    {"iuid": 224, "istock": 10, "itemName": "Straw and Cutlery Pouch", "price": "$6", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 3, "shelfColumn": 3, "tags": ["reusable", "straw", "cutlery", "pouch", "case"]},
    {"iuid": 225, "istock": 10, "itemName": "Straw and Toothbrush Pouch", "price": "$5", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 3, "shelfColumn": 3, "tags": ["reusable", "straw", "toothbrush", "tooth", "brush", "pouch", "case"]},
    {"iuid": 226, "istock": 10, "itemName": "Bio Pots", "price": "$14.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 4, "shelfColumn": 3, "tags": ["bio", "pot", "pots"]},
    {"iuid": 227, "istock": 10, "itemName": "Plant Grow Kit", "price": "$14.90", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 4, "shelfColumn": 3, "tags": ["plant", "plants", "grow", "kit"]},
    {"iuid": 228, "istock": 10, "itemName": "Grow Your Own Seed Cell", "price": "$9.80", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 4, "shelfColumn": 3, "tags": ["grow", "your", "own", "seed", "cell", "kit"]},
    {"iuid": 229, "istock": 10, "itemName": "Spork", "price": "$10", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 4, "tags": ["reusable", "metal", "spork"]},
    {"iuid": 230, "istock": 10, "itemName": "Glass Straw", "price": "vary", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 4, "tags": ["reusable", "glass", "straw"]},
    {"iuid": 231, "istock": 10, "itemName": "Smoothie Straw", "price": "$2", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 4, "tags": ["reusable", "smoothie", "straw"]},
    {"iuid": 232, "istock": 10, "itemName": "Silicone Foldable Lunch Box", "price": "vary", "shelfLocation": "PurpleRight", "friendlyLocation": "Cutlery Cases & Cloths", "shelfRow": 1, "shelfColumn": 4, "tags": ["reusable", "silicone", "foldable", "lunch", "box", "lunchbox", "boxes", "lunchboxes"]},

    // RedCentre - Herbs, Spices & Seasoning (Upper Right)
    {"iuid": 233, "istock": 10, "itemName": "Organic Powdered White Onion", "price": "$0.76 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "organic", "powdered", "powder", "powders", "white", "onion"]},
    {"iuid": 234, "istock": 10, "itemName": "Organic Whole Brown Mustard Seed", "price": "$0.76 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["seed", "seeds", "organic", "whole", "brown", "mustard"]},
    {"iuid": 235, "istock": 10, "itemName": "Organic Curry Powder", "price": "$0.45 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "organic", "curry", "powder", "powders"]},
    {"iuid": 236, "istock": 10, "itemName": "Organic Cayenne", "price": "$0.85 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "powdered", "powder", "powders", "organic", "cayenne", "pepper", "peppers", "india", "indian"]},
    {"iuid": 237, "istock": 10, "itemName": "Organic Smoked Paprika Ground", "price": "$1.20 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "organic", "smoked", "paprika", "ground", "USA", "US", "american", "america"]},
    {"iuid": 238, "istock": 10, "itemName": "Cajun Seasoning", "price": "$0.95 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "cajun"]},
    {"iuid": 239, "istock": 10, "itemName": "All-Purpose Seasoning", "price": "$1.35 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "all", "purpose", "USA", "US", "american", "america"]},
    {"iuid": 240, "istock": 10, "itemName": "Organic Whole Italian Seasoning", "price": "$2.78 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "organic", "whole", "italian", "italy"]},
    {"iuid": 241, "istock": 10, "itemName": "Five Spices Powder", "price": "$0.14 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "powdered", "powder", "powders", "five", "spice", "spices"]},
    {"iuid": 242, "istock": 10, "itemName": "Fennel Powder", "price": "$0.12 per 10g", "shelfLocation": "RedCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "powdered", "powder", "powders", "fennel"]},

    // OrangeCentre - Herbs, Spices & Seasoning (Upper Left) 
    {"iuid": 243, "istock": 10, "itemName": "Organic Thyme Leaf", "price": "$1.90 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "thyme", "USA", "US", "american", "america"]},
    {"iuid": 244, "istock": 10, "itemName": "Organic Whole Rosemary Leaf", "price": "$1.90 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "organic", "whole", "rosemary", "leaf", "leaves", "spain", "spanish"]},
    {"iuid": 245, "istock": 10, "itemName": "Organic Steak Grilling Seasoning", "price": "$0.75 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["seasoning", "seasonings", "organic", "steak", "grilling"]},
    {"iuid": 246, "istock": 10, "itemName": "Parsley Flakes", "price": "$1.30 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "parsley", "flake", "flakes"]},
    {"iuid": 247, "istock": 10, "itemName": "Organic Oregano", "price": "$1.14 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "organic", "oregano", "turkey", "turkish"]},
    {"iuid": 248, "istock": 10, "itemName": "Baba Meat Curry Powder", "price": "$0.10 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["powder", "powders", "powdered", "seasoning", "seasonings", "baba", "meat", "curry", "malaysia", "malaysian"]},
    {"iuid": 249, "istock": 10, "itemName": "Baba Sambal Mix", "price": "$0.13 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["powder", "powders", "powdered", "seasoning", "seasonings", "baba", "sambal", "mix", "malaysia", "malaysian"]},
    {"iuid": 250, "istock": 10, "itemName": "Granulated Garlic", "price": "$0.76 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["powder", "powders", "powdered", "seasoning", "seasonings", "granulated", "garlic"]},
    {"iuid": 251, "istock": 10, "itemName": "Nutritional Yeast Flakes", "price": "$0.70 per 10g", "shelfLocation": "OrangeCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Upper Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["powder", "powders", "powdered", "seasoning", "seasonings", "nutritional", "yeast", "flake", "flakes"]},

    // YellowCentre - Herbs, Spices & Seasoning (Lower Left)
    {"iuid": 252, "istock": 10, "itemName": "Fennel", "price": "$0.05 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "seasoning", "seasonings", "seed", "seeds", "fennel"]},
    {"iuid": 253, "istock": 10, "itemName": "Coriander Seeds", "price": "$0.68 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "seasoning", "seasonings", "seed", "seeds", "coriander"]},
    {"iuid": 254, "istock": 10, "itemName": "Cloves", "price": "$0.55 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "clove", "cloves"]},
    {"iuid": 255, "istock": 10, "itemName": "Popcorn Seasoning, Cheddar & Spice", "price": "$0.88 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "popcorn", "cheddar", "USA", "US", "american", "america"]},
    {"iuid": 256, "istock": 10, "itemName": "Dried Chilli", "price": "$1.01 per 100g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "dried", "chilli"]},
    {"iuid": 257, "istock": 10, "itemName": "Organic Whole Black Peppercorns Tellicherry", "price": "$1.65 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "organic", "whole", "black", "peppercorn", "peppercorns", "tellicherry"]},
    {"iuid": 258, "istock": 10, "itemName": "Four Pepper Blend Gourmet Peppermill", "price": "$1.60 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "four", "pepper", "blend", "gourmet", "peppermill", "blends"]},
    {"iuid": 259, "istock": 10, "itemName": "Black Pepper Powder", "price": "$0.42 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "powder", "powders", "powdered", "black", "pepper", "peppers", "malaysia", "malaysian"]},
    {"iuid": 260, "istock": 10, "itemName": "White Pepper Powder", "price": "$0.58 per 10g", "shelfLocation": "YellowCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Left)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "powder", "powders", "powdered", "white", "pepper", "peppers", "sarawak", "sarawakian", "malaysia", "malaysian"]},

    // GreenCentre - Herbs, Spices & Seasoning (Lower Right)
    {"iuid": 261, "istock": 10, "itemName": "White Pepper Corn", "price": "$0.38 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "white", "pepper", "peppers", "corn", "corns", "peppercorn", "peppercorns", "malaysia", "malaysian"]},
    {"iuid": 262, "istock": 10, "itemName": "Organic Whole Star Anise", "price": "$3.42 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "organic", "whole", "star", "anise", "vietnam", "vietnamese"]},
    {"iuid": 263, "istock": 10, "itemName": "Bay Leaf", "price": "$0.33 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["herb", "herbs", "bay", "leaf", "leaves"]},
    {"iuid": 264, "istock": 10, "itemName": "Organic Cinnamon Stick", "price": "$3.42 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "organic", "cinnamon", "stick", "sri", "lanka", "lankan"]},
    {"iuid": 265, "istock": 10, "itemName": "Organic Whole Cardamom Seeds", "price": "$1.77 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 1, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "seed", "seeds", "organic", "whole", "cardamom", "USA", "US", "american", "america"]},
    {"iuid": 266, "istock": 10, "itemName": "Coriander Powder", "price": "$0.10 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "powder", "powders", "powdered", "coriander"]},
    {"iuid": 267, "istock": 10, "itemName": "Cumin Powder", "price": "$0.14 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "powder", "powders", "powdered", "cumin"]},
    {"iuid": 268, "istock": 10, "itemName": "Crushed Red Chilli Pepper", "price": "$1.95 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "crushed", "red", "chilli", "pepper", "peppers", "india", "indian"]},
    {"iuid": 269, "istock": 10, "itemName": "Organic Tomato Powder", "price": "$1.05 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "powder", "powders", "powdered", "organic", "tomato", "USA", "US", "american", "america"]},
    {"iuid": 270, "istock": 10, "itemName": "Organic Cumin Seeds", "price": "$0.80 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "seed", "seeds", "organic", "cumin", "turkey", "turkish"]},
    {"iuid": 271, "istock": 10, "itemName": "Organic Cumin Seeds", "price": "$0.80 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "seed", "seeds", "organic", "cumin", "turkey", "turkish"]},
    {"iuid": 272, "istock": 10, "itemName": "Organic Cinnamon Powder", "price": "$1.10 per 10g", "shelfLocation": "GreenCentre", "friendlyLocation": "Herbs, Spices & Seasoning (Lower Right)", "shelfRow": 2, "shelfColumn": 1, "tags": ["spice", "spices", "seasoning", "seasonings", "powder", "powders", "powdered", "organic", "cinnamon", "indonesia", "indonesian"]},
  ],
  //we are going to use ANTI-CLOCKWISE winding order for polygons
  //(x, y), POSITIVE x is RIGHT, POSITIVE y is UP
  "map": { //!!!IMPORTANT: DO NOT CHANGE THIS WITHOUT ALSO CHANGING dijkstraConvex.js!
    "storeMap": [[0, 0], [10, 0], [10, 10], [0, 10]],
    "temporaryScale": 10,
    "shelfMap": {
      "RedLeft": [[[0, 7.5], [1, 7.5], [1, 9], [0, 9]]], 		//Sauces, Dried Goods & Candies
      "OrangeLeft": [[[0 ,6], [1, 6], [1, 7.5], [0, 7.5]]],  //Honey, Oils & Coffee
      "YellowLeft": [[[0, 4.5], [1, 4.5], [1, 6], [0, 6]]],	//Tea Leaves & Seeds
      "GreenLeft": [[[0, 3], [1, 3], [1, 4.5], [0, 4.5]]],	  //Salt, Sugar & Powders
      "BlueLeft": [[[0, 1.5], [1, 1.5], [1, 3], [0, 3]]],		//Cleaning Agents
      "RedRight": [[[9, 8], [10, 8], [10, 10], [9, 10]]],    //Grains & Dried Fruit
      "OrangeRight": [[[9, 6], [10, 6], [10, 8], [9, 8]]],   //Beans, Cereals & Nuts
      "YellowRight": [[[9, 4], [10, 4], [10, 6], [9, 6]]],	  //Pasta, Nuts & Chips
      "GreenRight": [[[9, 2], [10, 2], [10, 4], [9, 4]]],	  //Hygiene & Biscuits
      "BlueRight": [[[9, 0], [10, 0], [10, 2], [9, 2]]],		  //Reusable Cutlery, Utensils & Bags
      "PurpleRight": [[[7, 0], [9, 0], [9, 2], [7, 2]]],		  //Cutlery Cases & Cloths

      "RedCentre": [[[5, 5], [7, 5], [7, 7], [5, 7]]],		//Herbs, Spices & Seeds A
      "OrangeCentre": [[[3, 5], [5, 5], [5, 7], [3, 7]]],	//Herbs, Spices & Seeds B
      "YellowCentre": [[[3, 3], [5, 3], [5, 5], [3, 5]]],	//Herbs, Spices & Seeds C
      "GreenCentre": [[[5, 3], [7, 3], [7, 5], [5, 5]]]	//Herbs, Spices & Seeds D
      
      //FORMAT: [ShelveSections:[Vertices:[x, y]]]
    },
    "convexRegions":[
      [[0, 0], [1, 0], [1, 1.5], [0, 1.5]], //convA
      [[1, 0], [2, 0], [2, 1], [1, 1]], //convB
      [[1, 1], [3, 1], [3, 4], [3, 6], [3, 9], [1, 9], [1, 8.25], [1, 6.75], [1, 5.25], [1, 3.75], [1, 2.25]], //convC
      [[3, 1], [7, 1], [7, 3], [6, 3], [4, 3], [3, 3]], //convD
      [[5, 0], [7, 0], [7, 1], [5, 1]], //convE
      [[7, 1], [8, 1], [9, 1], [9, 1.5], [9, 3], [9, 5], [9, 7], [9, 9], [9, 10], [7, 10], [7, 6], [7, 4]], //convF
      [[3, 7], [4, 7], [6, 7], [7, 7], [7, 9], [3, 9]], //convG
    ],
    //FORMAT: [ConvexPolygons:[Vertices:[x, y]]]
    "shelfAssociates":{
      "RedLeft": [1, 8.25], 		//Sauces, Dried Goods & Candies
      "OrangeLeft": [1, 6.75], 		//Honey, Oils & Coffee
      "YellowLeft": [1, 5.25],		//Tea Leaves & Seeds
      "GreenLeft": [1, 3.75],		//Salt, Sugar & Powders
      "BlueLeft": [1, 2.25],		//Cleaning Agents

      "RedRight": [9, 9],			//Grains & Dried Fruit
      "OrangeRight": [9, 7],		//Beans, Cereals & Nuts
      "YellowRight": [9, 5],		//Pasta, Nuts & Chips
      "GreenRight": [9, 3],		//Hygiene & Biscuits
      "BlueRight": [9, 1.5],		//Reusable Cutlery, Utensils & Bags
      "PurpleRight": [8, 1],		//Cutlery Cases & Cloths

      "RedCentre": [[7, 6], [6, 7]],	//Herbs, Spices & Seeds A
      "OrangeCentre": [[3, 6], [4, 7]],	//Herbs, Spices & Seeds B
      "YellowCentre": [[3, 4], [4, 3]],	//Herbs, Spices & Seeds C
      "GreenCentre": [[6, 3], [7,4]]	//Herbs, Spices & Seeds D
    },
    "scale": 50
  }
}
var inventoryList = {
  "available": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272]
} //returns iuids of items in stock
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
  storeDataStream.callback(getStoreData())
  var stageCompleter
  var stageCompletion = new Promise((resolve) => {
    stageCompleter = resolve
  })
}
var fakeupd = () => { //make fake update
  storeData = clone(storeData)
  storeData.items.push({"iuid": storeData.items.length+100, "istock": 10, "itemName": "Canned Tuna", "shelfLocation": "shelf2 left", "friendlyLocation": "Canned Foods Section", "shelfRow": 5, "shelfColumn": 3, "tags": ["food", "canned", "tuna"], "boughtWith": [{"iuid": 15, "correlation": 0.5}, {"iuid": 16, "correlation": 0.4}, {"iuid": 17, "correlation": 0.6}]})
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
  StateData: {"ServerURL": "http://192.168.1.31/speech/english/imda1.php", "SelectedShelf": null}
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
exports.asrStream = asrStream;
exports.mapBaseStream = mapBaseStream;
exports.mapHighlightStream = mapHighlightStream;
exports.searchCellsStream = searchCellsStream;
exports.storeDataStream = storeDataStream;