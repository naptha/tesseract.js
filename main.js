var prog = document.getElementById('prog')
var out = document.getElementById('out')

var disp = document.getElementById('display')
var dctx = disp.getContext('2d')
disp.width = 0
disp.height = 0

document.getElementById('runbutton').onclick = function(){
	setrunning(0)
	run(myCodeMirror)
}

function show_progress(p){

	if(p.loaded_lang_model) prog.value = p.loaded_lang_model
	if(p.recognized) prog.value = p.recognized
	setrunning(p.recognized)
	out.innerText = JSON.stringify(p)
	out.innerText = JSON.stringify(p)

}

function setrunning(v){
	if (v == 1) {
		document.getElementById('running').style.display = 'none'
		document.getElementById('run').style.display = 'block'
		// out.style.visibility = 'hidden'
	}
	else {
		document.getElementById('running').style.display = 'block'
		document.getElementById('run').style.display = 'none'
	}
}

function display(result) {
	console.log(result)

	disp.width = document.getElementById('to_ocr').naturalWidth
	disp.height = document.getElementById('to_ocr').naturalHeight

	disp.style.width = document.getElementById('to_ocr').offsetWidth
	disp.style.height = document.getElementById('to_ocr').offsetHeight


	dctx.shadowColor = "#fff"
	dctx.shadowOffsetX = 0;
	dctx.shadowOffsetY = 0;
	dctx.shadowBlur = 10;

	var m  = result.words.map(function(w){
		
		var b  = w.bbox
		
		var k = (function(){

			dctx.font = '20px Comic Sans MS'
			dctx.font = 20*(b.x1-b.x0)/dctx.measureText(w.text).width+"px Comic Sans MS"

			// dctx.fillStyle="rgba(255,255,255,.01)"
			// dctx.fillRect(b.x0,b.y0,b.x1-b.x0, b.y1-b.y0)
			dctx.fillStyle="rgba(255,0,255,.1)"
				dctx.fillText(w.text, b.x0, w.baseline.y0);

				// dctx.strokeStyle = "rgba(255,255,255,.1)"
				// dctx.strokeText(w.text, b.x0, w.baseline.y0);
		})

		// k()
		return k
	})

	var times = 0
	function draw(i){
		times++
		for (var j = 0; j < i; j++) {
			m[j]()
		};
		if(times<200){
			setTimeout(function(){
				if(i+1<m.length){
					draw(i+1)
				}
				else {
					draw(i)
				}
			},10)					
		}
		else{
			console.log('done')
		}
	}
	draw(0)

}

window.onresize = function() {
	disp.style.width = document.getElementById('to_ocr').offsetWidth
	disp.style.height = document.getElementById('to_ocr').offsetHeight
}

function run(c){
	eval(c.getValue())
}

var val = 
"var img = document.querySelector('img#to_ocr')\n\
\n\
Tesseract\n\
.recognize( img, {progress: show_progress} )\n\
.then( display )"

var myCodeMirror = CodeMirror(document.getElementById('editor'),{
// lineNumbers: true,
viewportMargin: Infinity,
value: val
});



var img = document.getElementById('to_ocr')

if (img.complete) {
	run(myCodeMirror)
} else{
	img.onload = function(){
		run(myCodeMirror)
	}
}