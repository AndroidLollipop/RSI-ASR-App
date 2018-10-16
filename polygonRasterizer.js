/*var width = 72;
var height = 72;
var myImageData = null;
var Polygons = [
	[[1, 1], [10, 1], [10, 10], [1, 10]],
	[[10, 10], [30, 20], [20, 30]],
	[[25, 25], [50, 25], [30, 30], [25, 50]],
	[[30, 30], [72, 30], [72, 72], [30, 72]],
];
var dot = [];
for (i = 0; i < Math.PI * 2; i += Math.PI / 20) {
	dot.push([250 + 30 * Math.sin(i), 250 + 30 * Math.cos(i)]);
}
//these do not have to be convex
var ExtremePolygons = [
	[[1, 2], [500, 500], [500, 285], [230, 342], [124, 353], [123, 536]],
];*/
var width = 10;
var height = 10;
var Polygons = []
var exclusionRegions = [[
        [[1, 2], [3, 2], [3, 2.5], [1, 2.5]], //1lA
        [[3, 2], [5, 2], [5, 2.5], [3, 2.5]], //1lB
        [[5, 2], [7, 2], [7, 2.5], [5, 2.5]], //1lC
        [[7, 2], [9, 2], [9, 2.5], [7, 2.5]] //1lD
      ],[
        [[1, 2.5], [3, 2.5], [3, 3], [1, 3]], //2rA
        [[3, 2.5], [5, 2.5], [5, 3], [3, 3]], //2rB
        [[5, 2.5], [7, 2.5], [7, 3], [5, 3]], //2rC
        [[7, 2.5], [9, 2.5], [9, 3], [7, 3]] //2rD
       ],[
        [[1, 4], [3, 4], [3, 4.5], [1, 4.5]], //2lA
        [[3, 4], [5, 4], [5, 4.5], [3, 4.5]], //2lB
        [[5, 4], [7, 4], [7, 4.5], [5, 4.5]], //2lC
        [[7, 4], [9, 4], [9, 4.5], [7, 4.5]] //2lD
      ],[
        [[1, 4.5], [3, 4.5], [3, 5], [1, 5]], //3rA
        [[3, 4.5], [5, 4.5], [5, 5], [3, 5]], //3rB
        [[5, 4.5], [7, 4.5], [7, 5], [5, 5]], //3rC
        [[7, 4.5], [9, 4.5], [9, 5], [7, 5]] //3rD
      ],[
        [[1, 6], [3, 6], [3, 6.5], [1, 6.5]], //3lA
        [[3, 6], [5, 6], [5, 6.5], [3, 6.5]], //3lB
        [[5, 6], [7, 6], [7, 6.5], [5, 6.5]], //3lC
        [[7, 6], [9, 6], [9, 6.5], [7, 6.5]] //3lD
      ],[
        [[1, 6.5], [3, 6.5], [3, 7], [1, 7]], //4rA
        [[3, 6.5], [5, 6.5], [5, 7], [3, 7]], //4rB
        [[5, 6.5], [7, 6.5], [7, 7], [5, 7]], //4rC
        [[7, 6.5], [9, 6.5], [9, 7], [7, 7]] //4rD
      ],[
        [[1, 8], [3, 8], [3, 8.5], [1, 8.5]], //4lA
        [[3, 8], [5, 8], [5, 8.5], [3, 8.5]], //4lB
        [[5, 8], [7, 8], [7, 8.5], [5, 8.5]], //4lC
        [[7, 8], [9, 8], [9, 8.5], [7, 8.5]] //4lD
      ],[
        [[1, 8.5], [3, 8.5], [3, 9], [1, 9]], //5rA
        [[3, 8.5], [5, 8.5], [5, 9], [3, 9]], //5rB
        [[5, 8.5], [7, 8.5], [7, 9], [5, 9]], //5rC
        [[7, 8.5], [9, 8.5], [9, 9], [7, 9]] //5rD
      ]]
exclusionRegions = exclusionRegions.map(x => x.map(x => x.map(x => [x[0], x[1]-0.5])))
exclusionRegions.map(x => x.map(x => Polygons.push(x)))
var conservativePolygonBounds = polygon => {
	//why conservative? future implementations can return a list of regions
	var boundYS = Infinity;
	var boundYL = -Infinity;
	for (i = 0; i < polygon.length; i++) {
		boundYS = Math.min(boundYS, polygon[i][1]);
		boundYL = Math.max(boundYL, polygon[i][1]);
	}
	return [boundYS, boundYL];
};
var lines = p => {
	var ret = [];
	ret.push([p[p.length - 1], p[0]]);
	var pre = p[0];
	for (var i = 1; i < p.length; i++) {
		ret.push([pre, p[i]]);
		pre = p[i];
	}
	return ret;
};
var lineIntersects = (l, py) => {
	var miy = Math.min(l[0][1], l[1][1]);
	var may = Math.max(l[0][1], l[1][1]);
	if (miy <= py && may > py) {
		return true;
	}
	return false;
};
var lineIntersectPos = (l, py) => {
	//line intersect @py
	var d1y = py - l[0][1];
	var d2y = l[1][1] - py;
	var sum = d1y + d2y;
	var inx = (d2y * l[0][0] + d1y * l[1][0]) / sum;
	//reduced fp inaccuracies
	return Math.floor(inx);
};
var preComputeArray;
var preComputeIntersections = (lines, py) => {
	var arr = new Array();
	preComputeArray = new Array();
	for (var i = 0; i < lines.length; i++) {
		var l = lines[i];
		if (lineIntersects(l, py)) {
			var m = lineIntersectPos(l, py);
			arr.push(m);
		}
	}
	arr = mergesort(arr);
	for (var i = 0; i < arr.length; i += 2) {
		if (arr[i] !== arr[i + 1]) {
			preComputeArray.push([arr[i], arr[i + 1]]);
		}
	}
};
var rasterizePolygon = polygon => {
	var [bYS, bYL] = conservativePolygonBounds(polygon);
	var l = lines(polygon);
	for (var y = Math.floor(bYS) - 1; y < bYL + 1; y++) {
		preComputeIntersections(l, y);
		for (var i = 0; i < preComputeArray.length; i++) {
			var [sX, lX] = preComputeArray[i];
			for (var x = sX; x < lX; x++) {
				writeImageData(x, y);
			}
		}
	}
};
var writeImageData = (x, y) => {
	myImageData[(y * width + x)] = 1
};
var readImageData = (x, y) => {
  return myImageData[(y * width + x)]
}
var whiteOutImage = () => {
	myImageData = new Array(width*height)
}
//experimental optimization, after performance profiling it seems that
//v8's built in sort is weirdly slow (?) is it my fault
//so i wrote an optimized mergesort
const mergesort = a1 => {
	const l = a1.length;
	var a2 = Array(l);
	var sz = 1;
	const s12 = (sa1, sa2) => {
		for (i = 0; i < l; i += sz * 2) {
			var p1 = i;
			var p2 = i + sz;
			var f1 = i;
			const l1 = l < p2 ? l : p2;
			const l2 = l < p2 + sz ? l : p2 + sz;
			while (p1 < l1 && p2 < l2) {
				if (sa1[p1] > sa1[p2]) {
					sa2[f1++] = sa1[p2++];
				} else {
					sa2[f1++] = sa1[p1++];
				}
			}
			while (p1 < l1) {
				sa2[f1++] = sa1[p1++];
			}
			while (p2 < l2) {
				sa2[f1++] = sa1[p2++];
			}
		}
		sz *= 2;
	};
	while (sz < l) {
		s12(a1, a2);
		if (sz >= l) {
			return a2;
		}
		s12(a2, a1);
	}
	return a1;
};
whiteOutImage();
str = ""
filledPoints = []
Polygons.map(rasterizePolygon);
for (var i = 0; i < height; i++){
  for (var j = 0; j < width; j++){
    if (readImageData(j, i)){
      str += "  "
    }
    else{
      str += ". "
      filledPoints.push([j, i])
    }
  }
  str += "\n"
}
console.log(str)
filledPoints = filledPoints.map(x => [x[0], x[1]+0.5])
console.log(filledPoints)