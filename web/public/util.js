define(function(require, exports){
	exports.count = function(a, b){
		return a+b;
	}

	function isString(str){
		return (typeof(str) === 'string');
	}
	exports.isString = isString;

	function ucFirst(str){
		if (isString(str)){
			var c = str.charAt(0).toUpperCase();
			return c + str.substr(1);
		}
		return str;
	}
	exports.ucFirst = ucFirst;

	function isFunc(func){
		return (func instanceof Function);
	}
	exports.isFunc = isFunc;
});