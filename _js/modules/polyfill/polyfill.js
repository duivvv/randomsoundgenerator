module.exports = (function(){

	require('./requestAnimationFrame');
	require('./AudioContext');
	require('es6-promise').polyfill();
	require('fetch');

})();
