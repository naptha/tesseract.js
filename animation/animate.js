var canvas = document.getElementById('logo-canvas'),
	ctx = canvas.getContext('2d'),
	logo_wrap = document.getElementById('logo-wrap'),
	splash = document.getElementById('splash'),
	logo_img = document.getElementById('logo-img'),
	color = "white",
	lasttime, 
	freeze


function fixdim() {
	dimensions.update()

	var displaywidth = Math.sqrt(dimensions.width)*18//dimensions.width > 900 ? 900 : 450

	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	
	// logo_wrap.style.top = top / 2 + 'px'
	var rect = splash.getBoundingClientRect()
	var bottom = rect.top + rect.height

	var fadestart = rect.height/2

	logo_wrap.style.opacity = Math.max(Math.min((bottom-fadestart)/fadestart,1),0)

	logo_img.style.width = displaywidth + 'px'

	if(!freeze){
		var displayheight = displaywidth * 4/15 //dimensions.width > 900 ? 250 : 125
		canvas.width = displayheight*window.devicePixelRatio
		canvas.style.width = displayheight + 'px'
		canvas.height = displayheight*window.devicePixelRatio
		canvas.style.height = displayheight + 'px'
	}
}

addEventListener('scroll', fixdim)

var gh = .12;

function main (time) {
	fixdim()
	ctx.clearRect(0,0,canvas.width,canvas.height)

	var t = time/10000

	ctx.strokeStyle = ctx.fillStyle = color
	var sm = 1

	var m = tesseractwithrotation(t, t*2, t*3, mouse.x/100, mouse.y/100, 0)

	drawtesseract(ctx, m, {
		x: canvas.width/2, 
		y: canvas.height/2, 
		size: gh*canvas.height, 
		line_width: 2,
	})

	lasttime = time
	requestAnimationFrame(main)
}



requestAnimationFrame(function init(t) {
	fixdim()
	lasttime = t
	requestAnimationFrame(main)
})