var input = document.getElementById('input')
var input_overlay = document.getElementById('input-overlay')
var ioctx = input_overlay.getContext('2d')
var output = document.getElementById('output')
var octx = output.getContext('2d')
var language = 'eng'
var demoStarted = false


output.width = input.naturalWidth
output.height = input.naturalHeight

output.style.width = input.offsetWidth
output.style.height = input.offsetHeight

input_overlay.width = input.naturalWidth
input_overlay.height = input.naturalHeight

input_overlay.style.width = input.offsetWidth
input_overlay.style.height = input.offsetHeight


function isOutputVisible(){
	return output.getBoundingClientRect().top < dimensions.height
}

function startDemoIfVisible(argument) {
	if(isOutputVisible() && !demoStarted) startDemo();
}

function startDemo(){
	demoStarted = true
    
	octx.font = '20px Times';
	octx.font = .8 * output.width * 20 / octx.measureText('texttexttexttexttexttexttexttexttexttexttext').width + "px Times";

	Tesseract.recognize(input)
	.progress(progress)
	.then(result)
}

function progress(p){
	var text = JSON.stringify(p)

	octx.clearRect(0, 0, output.width, output.height)

	octx.textAlign = 'center'
	octx.fillText(text, output.width/2, output.height/2)
}

function result(res){
	octx.clearRect(0, 0, output.width, output.height)
	octx.textAlign = 'left'

	res.words.forEach(function(w){
		var b = w.bbox;
		ioctx.strokeStyle = 'red'
		ioctx.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0)
		ioctx.beginPath()
		ioctx.moveTo(w.baseline.x0, w.baseline.y0)
		ioctx.lineTo(w.baseline.x1, w.baseline.y1)
		ioctx.strokeStyle = 'yellow'
		ioctx.stroke()


        octx.font = '20px Times';
        octx.font = 20 * (b.x1 - b.x0) / octx.measureText(w.text).width + "px Times";
        octx.fillText(w.text, b.x0, w.baseline.y0);
	})
}


document.addEventListener('scroll', startDemoIfVisible)
startDemoIfVisible()