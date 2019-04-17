/**
* Javascript used by reddit extractor
*/

(function() {
	window.extractors = window.extractors || [];

	// https://www.reddit.com/r/*/comments/ID/*/
	var commentsRedditExtractor = function() {};
	extractors.push(commentsRedditExtractor);

	var regexUrl = /https:\/\/www\.reddit\.com\/r\/.*\/comments\/(.*)\/.*\//

	commentsRedditExtractor.validUrl = function (url) {
		return regexUrl.test(url) && get_page(url).includes("data-mpd-url");
	}

	commentsRedditExtractor.extract = function (url, callback) {
		var listFormatUrl = getXmlFormatsUrl(url);
		var listFormat = getXml(listFormatUrl);
		var res = {width: 0};
		for (var file of listFormat.getElementsByTagName("Representation")) {
			if (file.getAttribute("width") > res.width) {
				res.ending = file.firstElementChild.innerHTML;
				res.width = file.getAttribute("width");
			}
		}
		callback(listFormatUrl.match(/(.*)\/[^/]*/)[1] + "/" + res.ending);
	}

	function getID(url) {
		return url.match(regexUrl)[1];
	}

	function getXmlFormatsUrl(url) {
		var page = get_page(url);
		var regex = /data-mpd-url="([^"]+)"/;
		return page.match(regex)[1];
	}
})();