(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tesseract = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.defaultOptions = {
    langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
    workerPath: 'dist/worker.js',
    tesseractPath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js'
};

exports.spawnWorker = function spawnWorker(instance, workerOptions) {
    var worker = new Worker(workerOptions.workerPath);
    worker.onmessage = function (e) {
        instance._recv(e.data);
    };
    return worker;
};

exports.terminateWorker = function (instance) {
    instance.worker.terminate();
};

exports.sendPacket = function sendPacket(instance, packet) {
    loadImage(packet.payload.image, function (img) {
        packet.payload.image = img;
        instance.worker.postMessage(packet);
    });
};

function loadImage(image, cb) {
    if (typeof image === 'string') {
        if (/^\#/.test(image)) {
            // element css selector
            return loadImage(document.querySelector(image), cb);
        } else {
            // url or path
            var im = new Image();
            im.src = image;
            im.onload = function (e) {
                return loadImage(im, cb);
            };
            return;
        }
    } else if (image instanceof File) {
        // files
        var fr = new FileReader();
        fr.onload = function (e) {
            return loadImage(fr.result, cb);
        };
        fr.readAsDataURL(image);
        return;
    } else if (image instanceof Blob) {
        return loadImage(URL.createObjectURL(image), cb);
    } else if (image.getContext) {
        // canvas element
        return loadImage(image.getContext('2d'), cb);
    } else if (image.tagName == "IMG" || image.tagName == "VIDEO") {
        // image element or video element
        var c = document.createElement('canvas');
        c.width = image.naturalWidth || image.videoWidth;
        c.height = image.naturalHeight || image.videoHeight;
        var ctx = c.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return loadImage(ctx, cb);
    } else if (image.getImageData) {
        // canvas context
        var data = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
        return loadImage(data, cb);
    }
    cb(image);
}

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var adapter = require('./node/index.js');

function createWorker(workerOptions) {
	return new TesseractWorker(workerOptions);
}

var TesseractWorker = function () {
	function TesseractWorker(workerOptions) {
		_classCallCheck(this, TesseractWorker);

		this.worker = null;
		this.workerOptions = workerOptions;
		this._currentJob = null;
		this._queue = [];
	}

	_createClass(TesseractWorker, [{
		key: 'recognize',
		value: function recognize(image, options) {
			var _this = this;

			return this._delay(function (job) {
				options = options || {};
				options.lang = options.lang || 'eng';
				job._send('recognize', { image: image, options: options, workerOptions: _this.workerOptions });
			});
		}
	}, {
		key: 'detect',
		value: function detect(image, options) {
			var _this2 = this;

			options = options || {};
			return this._delay(function (job) {
				job._send('detect', { image: image, options: options, workerOptions: _this2.workerOptions });
			});
		}
	}, {
		key: 'terminate',
		value: function terminate() {
			if (this.worker) adapter.terminateWorker(this);
			this.worker = null;
		}
	}, {
		key: '_delay',
		value: function _delay(fn) {
			var _this3 = this;

			if (!this.worker) this.worker = adapter.spawnWorker(this, this.workerOptions);

			var job = new TesseractJob(this);
			this._queue.push(function (e) {
				_this3._queue.shift();
				_this3._currentJob = job;
				fn(job);
			});
			if (!this._currentJob) this._dequeue();
			return job;
		}
	}, {
		key: '_dequeue',
		value: function _dequeue() {
			this._currentJob = null;
			if (this._queue.length > 0) {
				this._queue[0]();
			}
		}
	}, {
		key: '_recv',
		value: function _recv(packet) {
			if (this._currentJob.id === packet.jobId) {
				this._currentJob._handle(packet);
			} else {
				console.warn('Job ID ' + packet.jobId + ' not known.');
			}
		}
	}]);

	return TesseractWorker;
}();

var jobCounter = 0;

var TesseractJob = function () {
	function TesseractJob(instance) {
		_classCallCheck(this, TesseractJob);

		this.id = 'Job-' + ++jobCounter + '-' + Math.random().toString(16).slice(3, 8);

		this._instance = instance;
		this._resolve = [];
		this._reject = [];
		this._progress = [];
	}

	_createClass(TesseractJob, [{
		key: 'then',
		value: function then(resolve, reject) {
			if (this._resolve.push) {
				this._resolve.push(resolve);
			} else {
				resolve(this._resolve);
			}

			if (reject) this.catch(reject);
			return this;
		}
	}, {
		key: 'catch',
		value: function _catch(reject) {
			if (this._reject.push) {
				this._reject.push(reject);
			} else {
				reject(this._reject);
			}
			return this;
		}
	}, {
		key: 'progress',
		value: function progress(fn) {
			this._progress.push(fn);
			return this;
		}
	}, {
		key: '_send',
		value: function _send(action, payload) {
			adapter.sendPacket(this._instance, {
				jobId: this.id,
				action: action,
				payload: payload
			});
		}
	}, {
		key: '_handle',
		value: function _handle(packet) {
			var data = packet.data;
			if (packet.status === 'resolve') {
				if (this._resolve.length === 0) console.debug(data);
				this._resolve.forEach(function (fn) {
					var ret = fn(data);
					if (ret && typeof ret.then == 'function') {
						console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.');
					}
				});
				this._resolve = data;
				this._instance._dequeue();
			} else if (packet.status === 'reject') {
				if (this._reject.length === 0) console.error(data);
				this._reject.forEach(function (fn) {
					return fn(data);
				});
				this._reject = data;
				this._instance._dequeue();
			} else if (packet.status === 'progress') {
				this._progress.forEach(function (fn) {
					return fn(data);
				});
			} else {
				console.warn('Message type unknown', packet.status);
			}
		}
	}]);

	return TesseractJob;
}();

var DefaultTesseract = createWorker(adapter.defaultOptions);
DefaultTesseract.createWorker = createWorker;

module.exports = DefaultTesseract;

},{"./node/index.js":1}]},{},[2])(2)
});