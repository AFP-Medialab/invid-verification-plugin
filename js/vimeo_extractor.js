(function() {
	window.extractors = window.extractors || [];

	var vimeoExtractor = function() {};
	extractors.push(vimeoExtractor);

	vimeoExtractor.validUrl = function (url) {
		return url.startsWith("https://vimeo.com/");
	}

	vimeoExtractor.extract = function (url, callback) {
		var jsonPage = "https://player.vimeo.com/video/" + getId(url) + "/config";
		var jsonEncoded = get_page(jsonPage);
		var json = JSON.parse(jsonEncoded);
		var res = {height: 0}
		for (var video of json.request.files.progressive) {
			if (video["height"] > res["height"])
				res = video;
		}
		callback(res["url"]);
	}

	function getId(url) {
		return url.match(/https:\/\/vimeo\.com\/(?:.*[^/]\/)*([^/]+)/)[1];
	}
})();