var svg = (function(colors){
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

	canvas.width = 10
	canvas.height = 2
	var upscale = 10

	var im = ctx.getImageData(0,0,canvas.width,canvas.height)
	for (var i = 0; i < im.data.length; i+=4) {
		im.data[i] = Math.round(Math.random()*255)
		im.data[i+1] = Math.round(Math.random()*255)
		im.data[i+2] = Math.round(Math.random()*255)
		im.data[i+3] = 255
	};
	ctx.putImageData(im,0,0)
	var url = canvas.toDataURL()
	im = new Image()
	im.src = url
	canvas.width *= upscale
	canvas.height *= upscale
	ctx.drawImage(im,0,0,canvas.width, canvas.height)
	im = ctx.getImageData(0,0,canvas.width,canvas.height)

	var xmlns = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(xmlns, 'svg')
	svg.setAttribute('viewBox',"0 0 "+im.width+" "+im.height)
	for (var i = 0; i < im.data.length; i+=4) {
		var mindist = 195075
		var mincolor = [0,0,0]
		var pix = [im.data[i],im.data[i+1],im.data[i+2]]
		for (var j = 0; j < colors.length; j++) {
			var color = colors[j]
			var d0 = color[0] - pix[0]
			var d1 = color[1] - pix[1]
			var d2 = color[2] - pix[2]
			var d = Math.abs(d0)+Math.abs(d1)+Math.abs(d2)
			if (d<mindist) {
				mindist = d
				mincolor = color
			}
		};

		var n = i/4
		var elem = document.createElementNS(xmlns, "rect");
		elem.setAttributeNS(null,"x",n%im.width);
		elem.setAttributeNS(null,"y",Math.floor(n/im.width));
		elem.setAttributeNS(null,"width",1.5);
		elem.setAttributeNS(null,"height",1.5);
		elem.setAttributeNS(null,"fill", 'rgba('+Math.min(mincolor[0]+0%2*20,255)+', '+mincolor[1]+', '+mincolor[2]+',1)');
		 
		svg.appendChild(elem);
	};
	return svg
})([
[39, 198, 249],
[6, 188, 249],
// [154, 218, 198],
[116, 218, 251],
[91, 211, 251]])
document.getElementById('marterial').appendChild(svg)