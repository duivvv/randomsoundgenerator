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
