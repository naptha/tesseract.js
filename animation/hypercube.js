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

function drawtesseract(ctx, tesseract, opts){
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
