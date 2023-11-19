var input = document.getElementById('input')
var input_overlay = document.getElementById('input-overlay')
var ioctx = input_overlay.getContext('2d')
// var output = document.getElementById('output')
// var output_overlay = document.getElementById('output-overlay')
var output_text = document.getElementById('log')

var demo_instructions = document.getElementById('demo-instructions')

var drop_instructions = [].slice.call(document.querySelectorAll('.drop-instructions'))
var options = [].slice.call(document.querySelectorAll('.option'))

// var octx = output.getContext('2d')
var language = 'eng'
var demoStarted = false
var lang_demo_images = {
	eng: 'img/eng_bw.png',
	chi_sim: 'img/chi_sim.png',
	rus: 'img/rus.png'
}

var lang_drop_instructions = {
	eng: 'an English',
	chi_sim: 'a Chinese',
	rus: 'a Russian'
}

const workerPromise = Tesseract.createWorker('eng', 1, {
	logger: progressUpdate,
});

function setUp(){
	input_overlay.width = input.naturalWidth
	input_overlay.height = input.naturalHeight

	output_text.style.height = input.height + 'px'
}

setUp()
input.onload = setUp


function isOutputVisible(){
	return output_text.getBoundingClientRect().top < dimensions.height
}

function startDemoIfVisible(argument) {
	if(isOutputVisible() && !demoStarted) startDemo();
}

function startDemo(){
	demoStarted = true

	async function start(){
		const worker = await workerPromise;
		const { data } = await worker.recognize(input);
		result(data);

		input.removeEventListener('load', start)
	}

	if(input.complete) start();
	else input.addEventListener('load', start)
}

// function progress(p){
// 	var text = JSON.stringify(p)

// 	// octx.clearRect(0, 0, output.width, output.height)

// 	// octx.textAlign = 'center'
// 	// octx.fillText(text, output.width/2, output.height/2)
// 	output_overlay.style.display = 'block'
// 	output_overlay.innerHTML += output_overlay.innerHTML.length ? "\n" + text : text
// 	output_overlay.scrollTop = output_overlay.scrollHeight;
// }


function progressUpdate(packet){
	var log = document.getElementById('log');

	const statusLabel = {"initializing api": "Initializing API", "initializing api": "Initializing API", "recognizing text" : "Recognizing Text",
	"initializing tesseract": "Initializing Tesseract", "initializing tesseract" : "Initializing Tesseract",
	"loading language traineddata": "Loading Language Traineddata", "loading language traineddata": "Loading Language Traineddata",
	"loading language traineddata (from cache)": "Loading Language Traineddata",
	"loading tesseract core": "Loading Tesseract Core", "done": "done"}[packet.status];

	if (!statusLabel) console.log(packet.status);

	if(log.firstChild && log.firstChild.status === statusLabel){
		if('progress' in packet){
			var progress = log.firstChild.querySelector('progress')
			progress.value = packet.progress
		}
	}else{
		var line = document.createElement('div');
		line.status = statusLabel;
		var status = document.createElement('div')
		status.className = 'status'
		status.appendChild(document.createTextNode(statusLabel))
		line.appendChild(status)

		if('progress' in packet){
			var progress = document.createElement('progress')
			progress.value = packet.progress
			progress.max = 1
			line.appendChild(progress)
		}


		if(packet.status == 'done'){
			var pre = document.createElement('pre')
			pre.appendChild(document.createTextNode(packet.data.text))
			line.innerHTML = ''
			line.appendChild(pre)

		}

		log.insertBefore(line, log.firstChild)
	}
}

function result(res){
	// octx.clearRect(0, 0, output.width, output.height)
	// octx.textAlign = 'left'

	console.log('result was:', res)
	// output_overlay.style.display = 'none'
	// output_text.innerHTML = res.text

	progressUpdate({ status: 'done', data: res })

	res.words.forEach(function(w){
		var b = w.bbox;

		ioctx.strokeWidth = 2

		ioctx.strokeStyle = 'red'
		ioctx.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0)
		ioctx.beginPath()
		ioctx.moveTo(w.baseline.x0, w.baseline.y0)
		ioctx.lineTo(w.baseline.x1, w.baseline.y1)
		ioctx.strokeStyle = 'green'
		ioctx.stroke()


		// octx.font = '20px Times';
		// octx.font = 20 * (b.x1 - b.x0) / octx.measureText(w.text).width + "px Times";
		// octx.fillText(w.text, b.x0, w.baseline.y0);
	})
}


document.addEventListener('scroll', startDemoIfVisible)
startDemoIfVisible()


function clearOverLayAndOutput(){
	ioctx.clearRect(0,0, input_overlay.width, input_overlay.height)

	output_text.style.display = 'none'

	demo_instructions.style.display = 'block'

	// octx.clearRect(0,0,output.width, output.height)
}


async function play(){

	demo_instructions.style.display = 'none'
	output_text.style.display = 'block'
	output_text.innerHTML = ''
	// output_overlay.innerHTML = ''
	const worker = await workerPromise;
	await worker.reinitialize(language);
	const { data } = await worker.recognize(input);
	result(data);
}

options.forEach(function(option){
	option.addEventListener('click', function(){

		clearOverLayAndOutput()


		drop_instructions.forEach(function(di){
			di.innerHTML = lang_drop_instructions[option.lang]
		})

		language = option.lang

		options.forEach(function(option){option.className = 'option'})
		option.className = 'option selected'
		if(option.lang in lang_demo_images){
			input.src = lang_demo_images[option.lang]
			// displayPlayButtonFor(option.lang)
		}
	})
})


const recognizeFromFile = async (file) => {
	var reader = new FileReader();
	reader.onload = function(e){
		input.src = e.target.result;
		input.onload = function(){

			setUp();

		}
	};
	reader.readAsDataURL(file);
	const worker = await workerPromise;
	await worker.reinitialize(language);
	const { data } = await worker.recognize(file);
	result(data);
}

document.body.addEventListener('drop', async function(e){
	e.stopPropagation();
	e.preventDefault();
	var file = e.dataTransfer.files[0]
	recognizeFromFile(file);
})




document.getElementById("openFileInput").addEventListener('change', (event) => {
	if (event.target.files.length == 0) return;
	recognizeFromFile(event.target.files[0]);
});