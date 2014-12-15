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
