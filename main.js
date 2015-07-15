function builddemo(id, val){
	var demo = document.getElementById(id)
	var prog = demo.querySelector('.prog')
	var out = demo.querySelector('.out')

	var disp = demo.querySelector('.display')
	var dctx = disp.getContext('2d')
	disp.width = 0
	disp.height = 0

	demo.querySelector('.runbutton').onclick = function(){
		setrunning(0)
		run(editor)
	}

	function show_progress(p){

		setrunning(0)
		console.log(p)
		if(p.loaded_lang_model) prog.value = p.loaded_lang_model
		if(p.recognized) prog.value = p.recognized
		out.innerText = JSON.stringify(p)
		out.innerText = JSON.stringify(p)

	}

	function setrunning(v){
		if (v == 1) {
			demo.querySelector('.running').style.display = 'none'
			demo.querySelector('.notrunning').style.display = 'block'
			// out.style.visibility = 'hidden'
		}
		else {
			demo.querySelector('.running').style.display = 'block'
			demo.querySelector('.notrunning').style.display = 'none'
		}
	}

	function display(result) {

		React.render(React.createElement(Node, { node: result, expanded: true, label: "output_of_above_demo"}), document.getElementById("explorer"));

		setrunning(1)

		out.innerText = "Lightning Speeeeeeed"
		prog.value = 0

		console.log(result)

		disp.width = demo.querySelector('.to_ocr').naturalWidth
		disp.height = demo.querySelector('.to_ocr').naturalHeight

		disp.style.width = demo.querySelector('.to_ocr').offsetWidth
		disp.style.height = demo.querySelector('.to_ocr').offsetHeight


		dctx.shadowColor = "rgba(255,255,255,.1)"
		dctx.shadowOffsetX = 0;
		dctx.shadowOffsetY = 0;
		dctx.shadowBlur = 10;

		dctx.fillRect(0,0,disp.width, disp.height)

		var m  = result.words.map(function(w){
			
			var b = w.bbox
			dctx.font = '20px Times'
			var font = 20*(b.x1-b.x0)/dctx.measureText(w.text).width+"px Times"

			
			var k = function(){
				dctx.font = font
				dctx.fillText(w.text, b.x0, w.baseline.y0);
				return font
			}

			return k
		})

		var times = 0
		var maxtimes = m.length + 100
		function draw(i){

			times++
			dctx.fillStyle="rgba(30, 29, 49, .8)"
			dctx.clearRect(0,0,disp.width, disp.height)
			dctx.fillRect(0,0,disp.width, disp.height)

			for (var j = 0; j < Math.min(i,m.length); j++) {
				var asdf = Math.min(Math.max(i - j,0), 100)
				dctx.fillStyle = "rgba(255,255,255,"+asdf*.01+")"
				m[j]()
			};

			if(i<maxtimes){
				setTimeout(function(){
					draw(i+1)
				},10)					
			}
			else{
				console.log('done')
			}
		}
		draw(0)
		// result.words.forEach(function(word, index){
		// 	var wdiv = document.createElement('div')
		// 	wdiv.innerText = word.text+' '
		// 	wdiv.style['font-family'] = "Times"
		// 	wdiv.style.position = 'absolute'
		// 	var scale = document.getElementById('to_ocr').offsetHeight / document.getElementById('to_ocr').naturalHeight
		// 	wdiv.style['font-size'] = parseFloat(m[index]().split('px')[0]) * scale
		// 	wdiv.style.color = "rgba(0,0,0,0)"
		// 	wdiv.style.top = word.bbox.y0 * scale
		// 	wdiv.style.left = word.bbox.x0 * scale
		// 	wdiv.style.height = (word.bbox.y1 - word.bbox.y0)*scale
		// 	wdiv.style.width = (word.bbox.x1 - word.bbox.x0)*scale
		// 	document.getElementById('ocroutput').appendChild(wdiv)
		// })
	}

	window.addEventListener('resize', function() {
		disp.style.width = demo.querySelector('.to_ocr').offsetWidth
		disp.style.height = demo.querySelector('.to_ocr').offsetHeight
	})

	function run(c){
		eval(c.getValue())
	}

	var editor = CodeMirror(demo.querySelector('.editor'),{
		// lineNumbers: true,
		viewportMargin: Infinity,
		value: val
	});

	var sc = demo.querySelector('.demoheader')
	var scdiv = document.createElement('div')
	sc.appendChild(scdiv)
	scdiv.className = 'CodeMirror cm-s-default'
	// scdiv.className = 'cm-s-default'
	CodeMirror.runMode('<script src="Tesseract.js"></script>', {name: 'xml', htmlMode: true}, scdiv)

	// var scripttag = CodeMirror(,{
	// 	mode: {name: 'xml', htmlMode: true},
	// 	readOnly: 'nocursor',
	// 	value: 
	// });


	return {

		run: function(){
			var img = demo.querySelector('.to_ocr')
	
			if (img.complete) {
				run(editor)
			} else{
				img.onload = function(){
					run(editor)
				}
			}
	
		}
	}
}

builddemo('wow', 
"var img = demo.querySelector('img.to_ocr')\n\n\
Tesseract\n\
  .recognize( img, {progress: show_progress} )\n\
  .then( display )")
.run()

// document.querySelector('.getStarted')[0].onclick = function(){
// 	location.href = '#'
// 	location.href = '#get_started'
// }

// builddemo('demo2',
// "var img = demo.querySelector('img.to_ocr')\n\n\
// Tesseract\n\
//   .recognize( img, {progress: show_progress, lang:'chi_sim'} )\n\
//   .then( display )")