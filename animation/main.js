// (function(){

// var color = "rgb(255,133,0)"
// var color = "rgb(55,110,79)"
var color="white"

// var color = "rgb(255,221,21)"
// var color = '#'+(16777216+Math.floor(Math.random()*16777215)).toString(16).slice(1)
// document.styleSheets[0].insertRule("a {color: "+color+"}",0)

var lasttime,
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

// canvas.style['background-color'] = color;

var logo = new Image(), logo_small = new Image()
logo.src = 'img/logo.png'
logo_small.src = 'img/logo.png'


// var pixelRatio = (function(context) {
//     var backingStore = context.backingStorePixelRatio ||
//           context.webkitBackingStorePixelRatio ||
//           context.mozBackingStorePixelRatio ||
//           context.msBackingStorePixelRatio ||
//           context.oBackingStorePixelRatio ||
//           context.backingStorePixelRatio || 1;

//     return (window.devicePixelRatio || 1) / backingStore;
// })(ctx);

function app1(p,a,c1,c2){
	var l = Math.cos(a)*p[c1]+Math.sin(a)*p[c2]
	var k = -Math.sin(a)*p[c1]+Math.cos(a)*p[c2]
	p[c1] = l
	p[c2] = k
}

function app2(p,a,c1,c2){
	var l = Math.cos(a)*p[c1]-Math.sin(a)*p[c2]
	var k = Math.sin(a)*p[c1]+Math.cos(a)*p[c2]
	p[c1] = l
	p[c2] = k
}

var _edges
function tesseractedges(){
	if(!_edges){
		var m = tesseractwithrotation(0,0,0,0,0,0)
		var edges = []
		var indicies = ['x','y','z','w']
		for (var i = 0; i < m.length; i++) {
			for (var j = i+1; j < m.length; j++) {
				var count = 0
				for (var k = 0; k < 4; k++) {
					if (m[i][indicies[k]] === m[j][indicies[k]]) count++
				};
				if (count === 3) edges.push([i,j])
			}
		}
		_edges = edges
	}
	return _edges	
}

function tesseractwithrotation(a,b,c,d,e,f) {
	var verticies = []
	for (var i = 0; i < 16; i++) {
		var p = {
			x: (i&1)*2 - 1,
			y: ((i>>1)&1)*2 - 1,
			z: ((i>>2)&1)*2 - 1,
			w: ((i>>3)&1)*2 - 1
		}
		app1(p,a,'x','y')
		app1(p,b,'y','z')
		app1(p,c,'x','w')
		app2(p,d,'x','z')
		app2(p,e,'y','w')
		app2(p,f,'z','w')
		verticies.push(p)
	}
	return verticies
}

function project(point, size){
	return {
		x: (point.x+Math.SQRT2*point.z)*size,
		y: (point.y+Math.SQRT2*point.w)*size
	}
}


function init () {
	fixdim()
	lasttime = new Date().getTime()
	requestAnimationFrame(main)
}

function fixdim() {
	if(dimensions.update()){
		var displaywidth = Math.sqrt(dimensions.width)*18//dimensions.width > 900 ? 900 : 450
		var displayheight = displaywidth * 4/15//dimensions.width > 900 ? 250 : 125
		canvas.width = displaywidth*window.devicePixelRatio
		canvas.style.width = displaywidth
		canvas.height = displayheight*window.devicePixelRatio
		canvas.style.height = displayheight
	}	
}

function drawtesseract(tesseract, opts){
	var edges = tesseractedges()
	for (var i = 0; i < tesseract.length; i++) {
		var proj = project(tesseract[i], opts.size)
		ctx.beginPath()
		ctx.arc(proj.x + opts.x, proj.y + opts.y, opts.corner_radius, 0, 2 * Math.PI)
		ctx.fill()
	};
	ctx.lineWidth = opts.line_width || 1
	ctx.beginPath()
	for (var i = 0; i < edges.length; i++) {
		var v1 = project(tesseract[edges[i][0]], opts.size), 
			v2 = project(tesseract[edges[i][1]], opts.size)
		ctx.moveTo(v1.x+opts.x,v1.y+opts.y)
		ctx.lineTo(v2.x+opts.x,v2.y+opts.y)
	};
	ctx.stroke()
}

var as = -.371, df = -.01, gh = .12;

var asdf = 120
var sdfg = .01

var x = 10, y=10,w = 10,h = 10

function main (time) {
	fixdim()
	ctx.clearRect(0,0,canvas.width,canvas.height)

	var t = time/10000

	// "rgb(0,140,255)"
	// ctx.strokeStyle = '#444'
	// ctx.fillStyle = "rgb(0,140,255)"
	ctx.strokeStyle = ctx.fillStyle = color
	var sm = 1

	// var m = tesseractwithrotation( 0,0,0,mouse.x/100    ,mouse.y/100, 0)
	var m = tesseractwithrotation(t, t*2, t*3, mouse.x/100    , mouse.y/100, 0)

	drawtesseract(m, {
		x: as*canvas.width + canvas.width/2, 
		y: df*canvas.height + canvas.height/2, 
		size: gh*canvas.height, 
		corner_radius: 0,
		line_width: 2
	})

	ctx.beginPath()
	// ctx.fillStyle = 'red'
	// ctx.fillRect(
	// 	(as+.5 - .0058)*canvas.width,
	// 	(df+.002+.5-.164)*canvas.height,// + canvas.height/2 - asdf/2,
	// 	.0058*2*canvas.width,
	// 	.164*2*canvas.height
	// )
	// ctx.fillRect(
	// 	0.0951*canvas.width,
	// 	0.0871*canvas.width,
	// 	0.0673*canvas.width,
	// 	0.0109*canvas.width
	// )

	// ctx.fill()

	// var m = tesseractwithrotation(0,0,0, mouse.x/100    , mouse.y/100, 0)
	// var m = tesseractwithrotation(t, t*2, t*3, mouse.x/100    , mouse.y/100, 0)
	// var k = tesseractwithrotation(t, t*2, t*3, mouse.x/100+.08, mouse.y/100, 0)


	lasttime = time
	requestAnimationFrame(main)
}

init()

// })()