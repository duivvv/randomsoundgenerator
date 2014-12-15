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
