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
