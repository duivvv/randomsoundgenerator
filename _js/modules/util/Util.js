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
