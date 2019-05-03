# RSI-ASR-App
## Callbags
This app is being refactored to use callbags instead of a massively messy adhoc architecture
## License
All rights to all code in this repository belong to their respective authors.  
This is the default copyright position specified by the Berne Convention, which Singapore is a party to.
## About
This is an application created for an RSI project.  
At the moment, this project doesn't use any iOS-specific components and should work on Android.
## Files in order of importance
screens/HomeScreen.js  
fetchData.js  
searchRanker.js  
searchMetrics.js  
dijkstraConvex.js  
polygonRasterizer.js  
screens/ResultsScreen.js  
screens/AccuracyCheck.js  
everything else
## Note on pathing
You need to generate the convex regions for the store map used to ensure optimality.  
Also, there are some blind spots in the current map where the path generated is slightly suboptimal.
