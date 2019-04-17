/**
* Javascript used by live leaks extractor
*/

(function() {
	window.extractors = window.extractors || [];

	var liveleakExtractor = function() {};
	extractors.push(liveleakExtractor);

	var regexUrl = /https?:\/\/www\.liveleak\.com\/ll_embed\?f=.*/;

	liveleakExtractor.validUrl = function (url) {
		return regexUrl.test(url);
	}

	liveleakExtractor.extract = function (url, callback) {
		if (url.startsWith("http://")) {
			url = "https:" + url.split(':')[1];
		}
		var page = get_page(url);
		var regexExtractor = /<source [^>]*src="([^"]+)"[^>]*>/;
		callback(page.match(regexExtractor)[1]);
	}
})();