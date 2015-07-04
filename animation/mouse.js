var mouse = {
	x: 0,
	y: 0,
	direction:0,

	start: {
		x:0,
		y:0
	},

	dragging: false,

	set: function (x,y) {
		mouse.x = x
		mouse.y = y
		mouse.direction = Math.atan2(y-mouse.start.y,x-mouse.start.x)
	},

	coords: function (e) {
		// e.preventDefault(); 
		if(e.pageX){
			mouse.set(e.pageX,e.pageY)
		}
		else if(e.offsetX) {
			mouse.set(e.offsetX,e.offsetY)
		}
		else if(e.layerX) {
			mouse.set(e.layerX,e.layerY)
		}
		else if(e.targetTouches && e.targetTouches.length > 0){
			mouse.set(e.targetTouches[0].pageX,e.targetTouches[0].pageY)
		}
	},

	down: function (e) {
		mouse.coords(e)
		mouse.start.x=mouse.x
		mouse.start.y=mouse.y
		mouse.dragging = true
		// console.log(e)

	},

	up: function (e) {
		mouse.coords(e)
		mouse.dragging = false
	}
}

document.addEventListener("touchstart", mouse.down, true);
document.addEventListener("touchend", mouse.up, true);
document.addEventListener("touchmove", mouse.coords, true);

document.addEventListener("mousedown", mouse.down, true);
document.addEventListener("mouseup", mouse.up, true);
document.addEventListener("mousemove", mouse.coords, true);