const adapter = require('./node/index.js')
const circularize = require('./common/circularize.js')
const TesseractJob = require('./common/job');
const objectAssign = require('object-assign');
const version = require('../package.json').version;

function create(workerOptions){
	workerOptions = workerOptions || {};
	var worker = new TesseractWorker(objectAssign({}, adapter.defaultOptions, workerOptions))
	worker.create = create;
	worker.version = version;
	return worker;
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

var DefaultTesseract = create()

module.exports = DefaultTesseract