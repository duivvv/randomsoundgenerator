(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
/* globals AudioContext: true, bean: true */

require('./modules/polyfill/polyfill');

var Circle = require('./modules/svg/Circle');

var BufferLoader = require('./modules/sound/BufferLoader');
var Player = require('./modules/sound/Player');

var Util = require('./modules/util/Util');
var DataLoader = require('./modules/util/DataLoader');

var __svg, __pauseplay, __moving,
		bounds, context, setting,
		settings, moving, static;

function init(){

	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	__svg = document.querySelector('svg');

	__pauseplay = document.querySelector('#pauseplay');
	__pauseplay.addEventListener('click', pauseplayClick);

	__moving = document.querySelector('#moving');
	__moving.addEventListener('change', movingChange);

	context = new AudioContext();

	DataLoader.loadSettings(function(err, data){
		if(err){
			console.log(err);
			return;
		}
		settings = data.settings;
		initSelect();
	});

}

function movingChange(){
	var amount = parseInt(__moving.value);
	if(amount > 0){
		if(amount < moving.length){
			console.log("less");
		}else{
			console.log("more");
		}
	}
}

function pauseplayClick(e){

	var playing = (__pauseplay.getAttribute('data-playing') === "true");

	if(playing){
		__pauseplay.setAttribute('data-playing', 'false');
		__pauseplay.setAttribute('value', 'play');
	}else{
		__pauseplay.setAttribute('data-playing', 'true');
		__pauseplay.setAttribute('value', 'pause');
	}

	for(var i = 0; i < moving.length;i++){
		if(playing){
			moving[i].stop();
		}else{
			moving[i].start();
		}
	}

}

function initSelect(){

	var __settings = document.querySelector('#settings');
	__settings.addEventListener('change', settingChange);

	for(var i = 0;i < settings.length;i++){
		var __el = new Option(settings[i].name, settings[i].name);
		__settings.appendChild(__el);
	}

	loadSet(0);

}

function settingChange(e){
	loadSet(e.currentTarget.selectedIndex);
}

function loadSet(id){

	setting = settings[id];

	DataLoader.loadSet(setting.name, function(err, data){
		if(err){
			console.log(err);
			return;
		}
		create(data[setting.name]);
	});

}

function create(set){

	__svg.innerHTML = '';

	if(moving){
		for(var i = 0;i < moving.length;i++){
			moving[i].stop();
		}
	}

	__pauseplay.setAttribute('data-playing', 'true');
	__pauseplay.setAttribute('value', 'pause');

	moving = [];
	static = [];

  var loader = new BufferLoader(context, set, createCircles);
  loader.load();

}

function createCircles(list){
	createAllStatic(list);
	createAllMoving(setting.moving);
}

function createMoving(){

	var circle = new Circle(
		Util.randomPoint(bounds),
		Circle.MOVING
	);

	circle.target = Util.randomStatic(static);

	bean.on(circle, "done", done);

	__svg.appendChild(circle.__element);
	moving.push(circle);

	return circle;

}

function createStatic(sound){

	var circle = new Circle(
		Util.randomPoint(bounds),
		Circle.STATIC
	);

	circle.sound = sound;
	circle.panning = Util.getPanning(bounds, circle.position.x);
	circle.volume = Util.getVolume(bounds, circle.position.y);
	circle.context = context;

	__svg.appendChild(circle.__element);
	static.push(circle);

	return circle;

}

function createAllMoving(amount){

	__moving.value = amount;

	for(var i = 0;i < amount; i++){
		var circle = createMoving();
		circle.__element.setAttribute('id', 'moving-' + (i+1));
	}

}

function done(){

	var player = new Player(context);
	player.play(this, this.target);
	this.target = Util.randomStatic(static);

}

function createAllStatic(list){

	for(var i = 0;i < list.length; i++){
		var circle = createStatic(list[i]);
		circle.__element.setAttribute('id', 'static-' + (i+1));
	}

}

init();

},{"./modules/polyfill/polyfill":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/polyfill.js","./modules/sound/BufferLoader":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/sound/BufferLoader.js","./modules/sound/Player":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/sound/Player.js","./modules/svg/Circle":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/svg/Circle.js","./modules/util/DataLoader":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/DataLoader.js","./modules/util/Util":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Util.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/AudioContext.js":[function(require,module,exports){
module.exports = (function(){

	window.AudioContext = window.AudioContext || window.webkitAudioContext;

})();

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/polyfill.js":[function(require,module,exports){
module.exports = (function(){

	require('./requestAnimationFrame');
	require('./AudioContext');
	require('es6-promise').polyfill();
	require('fetch');

})();

},{"./AudioContext":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/AudioContext.js","./requestAnimationFrame":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/requestAnimationFrame.js","es6-promise":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/es6-promise/dist/es6-promise.js","fetch":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/fetch/fetch.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/polyfill/requestAnimationFrame.js":[function(require,module,exports){
module.exports = (function(){

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame){
      window.cancelAnimationFrame = function(id) {
      	clearTimeout(id);
      };
    }

}());

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/sound/BufferLoader.js":[function(require,module,exports){
function BufferLoader(context, urlList, callback) {

	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = [];
	this.loadCount = 0;

}

BufferLoader.prototype.loadBuffer = function(url, index) {

	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function(buffer){
				if (!buffer){
					console.error('error decoding file data: ' + url);
					return;
				}
				loader.bufferList.push(buffer);
				if(++loader.loadCount === loader.urlList.length){
					loader.onload(loader.bufferList);
				}
			},
			function(error){
				console.error('decodeAudioData error', error);
			}
		);
	};

	request.onerror = function() {
		console.error('BufferLoader: XHR error');
	};

	request.send();

};

BufferLoader.prototype.load = function() {
	for (var i = 0; i < this.urlList.length; ++i){
		this.loadBuffer(this.urlList[i].file, this.urlList[i].name);
	}
};

module.exports = BufferLoader;

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/sound/Player.js":[function(require,module,exports){
var Effects = require('../util/Effects');

function Player(context){
	this.context = context;
}

Player.prototype.play = function(moving, static){

  var source = this.context.createBufferSource();
  source.buffer = static.sound;

  var panner = this.context.createPanner();
	panner.panningModel = 'equalpower';
  panner.setPosition(static.panning, 0, 1 - Math.abs(static.panning));

	var gain = this.context.createGain();
	gain.gain.value = static.volume;

	source.connect(panner);
  panner.connect(gain);

	switch(moving.effect.type){

		case Effects.FILTER.type:
			var filter = this.context.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 500;
			filter.gain.value = 60;
			gain.connect(filter);
  		filter.connect(this.context.destination);
		break;

		case Effects.REVERB.type:
			var convolver = this.context.createConvolver();
			convolver.buffer = static.sound;
			gain.connect(convolver);
  		convolver.connect(this.context.destination);
		break;

		default:
		case Effects.NONE.type:
  		gain.connect(this.context.destination);
		break;

	}

  source.start(0);

};

module.exports = Player;

},{"../util/Effects":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Effects.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/svg/Circle.js":[function(require,module,exports){
/* globals bean: true */

var SVGHelper = require('./SVGHelper');
var Util = require('../util/Util');

function Circle(position, type){

	this.position = position || {x: 0, y: 0};
	this.type = type || Circle.STATIC;

	var min = 10;
	var max = 80;

	switch(this.type){

		case Circle.STATIC:
			this.radius = 12;
			this.fill = "black";
		break;

		case Circle.MOVING:
			this.speed = min + Math.round(Math.random()*(max-min));
			this.effect = Util.randomEffect();
			this.radius = 7;
			this.fill = this.effect.color;
			this.start();
		break;

	}

	this.create();

}

Circle.MOVING = "moving";
Circle.STATIC = "static";

Circle.prototype.start = function(){
	this.stop();
  this.anim = requestAnimationFrame(_onFrame.bind(this));
};

Circle.prototype.stop = function(){
	if(this.anim){
		cancelAnimationFrame(this.anim);
		this.anim = undefined;
	}
};

function _setPosition(){
	this.__element.setAttribute('cx', this.position.x);
	this.__element.setAttribute('cy', this.position.y);
}

function _setStyle(){
	this.__element.setAttribute("r", this.radius);
	this.__element.setAttribute("fill", this.fill);
	_setPosition.call(this);
}

function _onFrame(){

	this.position.x += (this.target.position.x-this.position.x)/this.speed;
	this.position.y += (this.target.position.y-this.position.y)/this.speed;

	var distance = Util.distanceBetweenPoint(this.position, this.target.position);

	if(distance < 5){
		bean.fire(this, "done");
	}

	_setPosition.call(this);

	if(this.anim){
  	requestAnimationFrame(_onFrame.bind(this));
	}

}

Circle.prototype.create = function(){

	this.__element = SVGHelper.createElement("circle");
	_setStyle.call(this);

};

module.exports = Circle;

},{"../util/Util":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Util.js","./SVGHelper":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/svg/SVGHelper.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el);
};

module.exports = SVGHelper;

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/DataLoader.js":[function(require,module,exports){
/* globals fetch:true */

function DataLoader(){

}

DataLoader.loadSettings = function(cb){

	fetch('assets/data/settings.json')
		.then(function(response){
	    return response.json();
	  }).then(function(data){
	  	return cb(null, data);
	  });

};

DataLoader.loadSet = function(set, cb){

	fetch('assets/data/' + set + '.json')
		.then(function(response){
	    return response.json();
	  }).then(function(data){
	  	cb(null, data);
	  });

};

module.exports = DataLoader;

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Effects.js":[function(require,module,exports){
module.exports = {

	REVERB: {
		type: "reverb",
		color: "blue"
	},

	FILTER: {
		type: "filter",
		color: "green"
	},

	NONE: {
		type: "none",
		color: "black"
	}

};

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Util.js":[function(require,module,exports){
var Effects = require('./Effects');

function Util(){

}

Util.randomPoint = function(bounds){
	bounds.border = bounds.border || 0;
	return {
		x: bounds.border + Math.round(Math.random() * (bounds.width-(bounds.border*2))),
		y: bounds.border + Math.round(Math.random() * (bounds.height-(bounds.border*2)))
	};
};

Util.randomStatic = function(static){
	var rand = Math.round(Math.random()*(static.length-1));
	return static[rand];
};

Util.randomEffect = function(static){
	var effects = [
		Effects.NONE,
		Effects.REVERB,
		Effects.FILTER
	];
	var rand = Math.round(Math.random()*(effects.length-1));
	return effects[rand];
};

Util.distanceBetweenPoint = function(position1, position2){

  var xs = position2.x - position1.x;
  xs = xs * xs;

  var ys = position2.y - position1.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);

};

Util.getPanning = function(bounds, x){
	var range = bounds.width - (bounds.border * 2);
	var half_range = range/2;
	x = x - bounds.border;
	var panning = x/range;
	if(panning < 0.5){
		panning = - (1- (x/half_range));
	}else if(panning === 0.5){
		panning = 0;
	}else{
		panning = (x-half_range)/half_range;
	}
	return panning;
};

Util.getVolume = function(bounds, y){
	var range = bounds.height - (bounds.border * 2);
	y = y - bounds.border;
	return 1- (y/range);
};

module.exports = Util;

},{"./Effects":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/_js/modules/util/Effects.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/es6-promise/dist/es6-promise.js":[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.0.0
 */

(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function $$es6$promise$promise$$Promise(resolver, label) {
      this._id = $$es6$promise$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        parent._onerror = null;

        var child = new this.constructor($$$internal$$noop, label);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(null, onRejection, label);
      }
    };

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      Promise: $$es6$promise$promise$$default,
      polyfill: $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
}).call(this);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/browserify/node_modules/process/browser.js"}],"/Users/duivvv/Documents/dev/projects/randomsoundgenerator/node_modules/fetch/fetch.js":[function(require,module,exports){
(function() {
  'use strict';

  if (window.fetch) {
    return
  }

  function Headers(headers) {
    this.map = {}

    var self = this
    if (headers instanceof Headers) {
      headers.forEach(function(name, values) {
        values.forEach(function(value) {
          self.append(name, value)
        })
      })

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        self.append(name, headers[name])
      })
    }
  }

  Headers.prototype.append = function(name, value) {
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[name]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[name]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[name] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(name)
  }

  Headers.prototype.set = function(name, value) {
    this.map[name] = [value]
  }

  // Instead of iterable for now.
  Headers.prototype.forEach = function(callback) {
    var self = this
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      callback(name, self.map[name])
    })
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Body already consumed'))
    }
    body.bodyUsed = true
  }

  function Body() {
    this._body = null
    this.bodyUsed = false

    this.arrayBuffer = function() {
      throw new Error('Not implemented yet')
    }

    this.blob = function() {
      var rejected = consumed(this)
      return rejected ? rejected : Promise.resolve(new Blob([this._body]))
    }

    this.formData = function() {
      var rejected = consumed(this)
      return rejected ? rejected : Promise.resolve(decode(this._body))
    }

    this.json = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      var body = this._body
      return new Promise(function(resolve, reject) {
        try {
          resolve(JSON.parse(body))
        } catch (ex) {
          reject(ex)
        }
      })
    }

    this.text = function() {
      var rejected = consumed(this)
      return rejected ? rejected : Promise.resolve(this._body)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url
    this._body = options.body
    this.credentials = options.credentials || null
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Request.prototype.fetch = function() {
    var self = this

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr)
        }
        resolve(new Response(xhr.responseText, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(self.method, self.url)

      self.headers.forEach(function(name, values) {
        values.forEach(function(value) {
          xhr.setRequestHeader(name, value)
        })
      })

      xhr.send((self._body === undefined) ? null : self._body)
    })
  }

  Body.call(Request.prototype)

  function Response(body, options) {
    this._body = body
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.statusText = options.statusText
    this.headers = options.headers
  }

  Body.call(Response.prototype)

  window.fetch = function (url, options) {
    return new Request(url, options).fetch()
  }
})();

},{}]},{},["./_js/app.js"]);
