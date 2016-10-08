"use strict";

var adapter = require('./node/index.js')
var circularize = require('./common/circularize.js')


function createWorker(workerOptions){
	return new TesseractWorker(workerOptions)
}

class TesseractWorker {
	constructor(workerOptions){
		this.worker = null;
		this.workerOptions = workerOptions;
		this._currentJob = null;
		this._queue = []
	}

	recognize(image, options){
		return this._delay(job => {
			if(typeof options === 'string'){
				options = { lang: options };
			}else{
				options = options || {}
				options.lang = options.lang || 'eng';	
			}
			
			job._send('recognize', { image: image, options: options, workerOptions: this.workerOptions })
		})
	}
	detect(image, options){
		options = options || {}
		return this._delay(job => {
			job._send('detect', { image: image, options: options, workerOptions: this.workerOptions })
		})
	}

	terminate(){ 
		if(this.worker) adapter.terminateWorker(this);
		this.worker = null;
	}

	_delay(fn){
		if(!this.worker) this.worker = adapter.spawnWorker(this, this.workerOptions);

		var job = new TesseractJob(this);
		this._queue.push(e => {
			this._queue.shift()
			this._currentJob = job;
			fn(job)
		})
		if(!this._currentJob) this._dequeue();
		return job
	}

	_dequeue(){
		this._currentJob = null;
		if(this._queue.length > 0){
			this._queue[0]()
		}
	}

	_recv(packet){

        if(packet.status === 'resolve' && packet.action === 'recognize'){
            packet.data = circularize(packet.data);
        }

		if(this._currentJob.id === packet.jobId){
			this._currentJob._handle(packet)
		}else{
			console.warn('Job ID ' + packet.jobId + ' not known.')
		}
	}
}

var jobCounter = 0;

class TesseractJob {
	constructor(instance){
		this.id = 'Job-' + (++jobCounter) + '-' + Math.random().toString(16).slice(3, 8)

		this._instance = instance;
		this._resolve = []
		this._reject = []
		this._progress = []
	}

	then(resolve, reject){
		if(this._resolve.push){
			this._resolve.push(resolve)	
		}else{
			resolve(this._resolve)
		}

		if(reject) this.catch(reject);
		return this;
	}
	catch(reject){
		if(this._reject.push){
			this._reject.push(reject)	
		}else{
			reject(this._reject)
		}
		return this;
	}
	progress(fn){
		this._progress.push(fn)
		return this;
	}
	_send(action, payload){
		adapter.sendPacket(this._instance, {
			jobId: this.id,
			action: action,
			payload: payload
		})
	}

	_handle(packet){
		var data = packet.data;
		if(packet.status === 'resolve'){
			if(this._resolve.length === 0) console.debug(data);
			this._resolve.forEach(fn => {
				var ret = fn(data);
				if(ret && typeof ret.then == 'function'){
					console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.')
				}
			})
			this._resolve = data;
			this._instance._dequeue()
		}else if(packet.status === 'reject'){
			if(this._reject.length === 0) console.error(data);
			this._reject.forEach(fn => fn(data))
			this._reject = data;
			this._instance._dequeue()
		}else if(packet.status === 'progress'){
			this._progress.forEach(fn => fn(data))
		}else{
			console.warn('Message type unknown', packet.status)
		}
	}
}


var DefaultTesseract = createWorker(adapter.defaultOptions)
DefaultTesseract.createWorker = createWorker;

module.exports = DefaultTesseract

