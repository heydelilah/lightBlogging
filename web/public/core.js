define(function(require, exports){


	function create(uri){
		var url = window.ROOT(uri);
		var type = url;
		var pos = type.lastIndexOf('.');
		var uri;
		if (pos !== -1){
			uri = type.substr(0, pos);
			type = type.substr(pos + 1);
		}else {
			uri = type;
			type = null;
		}

		require.async(uri, function(mod){
			mod = mod[type];
			mod();
		});
	}
	exports.create = create;


});