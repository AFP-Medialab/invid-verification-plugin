(function () {

	// var page_name = "invid.html";
	var page_name = "we-verify.html";

	window.extractors = window.extractors || [];
	/* Creation of a new extractor */
	/* The extractor must follow this format :
		(function() {
			window.extractors = window.extractors || [];

			var myExtractor = function() {};
			extractors.push(myExtractor);


			myExtractor.validUrl = function (url) {
				return true if the url given as parameter is compatible with the extractor
			}

			myExtractor.extract = function (url, callback) {
				extract the url..
				callback(url_extraite);
			}
		})();
	*/
	/* and the file must be added to popup.html in the list of extractor */

	var nothing_found_msg = "<div class='centerText'>Service not available on this page</div>";

	function openTab (url) {
		chrome.tabs.create({url: url});
		window.close();
	}

	function clearElement (id) {
		var elt = document.getElementById(id);
		while (elt.hasChildNodes())
			elt.removeChild(elt.firstChild);
	}

	document.getElementById("invid-item").addEventListener("click", function openInvid() {
		openTab(page_name);
	});

	var active = "";
	function activate(divId) {
		if (active != "")
			clearElement(active);
		if (active == divId) {
			active = "";
			return false;
		}
		active = divId;
		return true;
	}

	function createScript(tag, field) {
		var script =  
		"var array = [];" +
		"for (var elt of document.getElementsByTagName('" + tag + "')) {" +
		"	if (elt." + field + ") {" +
		"    var url = elt." + field + ";" +
		"	 if (url.startsWith('blob'))" +
		"      continue;" +
		"	 if (!url.startsWith('http')) {" +
		"		url = new URL(url).href;" +
		"	 }" +
		"    if (!array.includes(url))" +
		"      array.push(url);" +
		"  }" +
		"}" +
		"array;";
		return script;
	}

	function addUrls(divId, tagName, fieldName, addEltFunc) {
		var script = createScript(tagName, fieldName);
		chrome.tabs.executeScript({
			code: script
		}, function callback(results) {
			var domText = document.getElementById(divId);
			if (results && results.length && results[0] && results[0].length) {
				for (var url of results[0]) {
					addEltFunc(domText, url);
				}
			}
			else
				domText.innerHTML = nothing_found_msg;
		});
	}

	function addUrl(domText, url) {
		appendLink(domText, url);
		domText.appendChild(document.createTextNode(" "));
		addCopy(domText, url);
		domText.appendChild(document.createElement("br"));
	}

	function upImg(img) {
		if (img.offsetLeft !== 0)
			img.setAttribute("style", 
				"height: 100px; width: 100px; background-color: inherit; position: absolute");
		else
			img.setAttribute("style", 
				"height: 100px; width: 100px; background-color: inherit;");
	}

	function addImg(div, url) {
		var img = document.createElement("img");
		img.src = url;
		img.setAttribute("style", "max-height: 50px; max-width: 50px;");

		div.appendChild(img)

		img.addEventListener('click', event => {
			event.preventDefault();
			chrome.tabs.create({url: url});
		});
		
		img.addEventListener('mouseenter', event => {
			event.preventDefault();
			upImg(img);
		});

		img.addEventListener('mouseleave', event => {
			event.preventDefault();
			img.setAttribute("style", "max-height: 50px; max-width: 50px;");
		});

	}

	function addIframe(divId) {
		var script = createScript("iframe", "src");
		chrome.tabs.executeScript({
			code: script
		}, function callback(results) {
			var domText = document.getElementById(divId);
			if (results && results.length && results[0] && results[0].length) {
				if (domText.childNodes.length == 1)
					domText.innerHTML = "";
				var promises = [];
				for (var url of results[0]) {
					if (isYtUrl(url))
						addUrl(domText, getYtUrl(url)); //getYtVideoUrl(getYtUrl(url)));
					for (var extractor of window.extractors) {

						if (extractor.validUrl(url)){
							extractor.extract(url, function (urlRes) {
								promises.push(new Promise(addUrl(domText, urlRes)));
							});
						}
					}
				}
				var isEmpty = true;
				promises.forEach(promise => {
				promise.then((response) => {
					if (domText.innerHTML != "")
						isEmpty = false;
				})
				.catch((err) => {
					window.alert("ERROR: " + err);
				})
			})
				if (isEmpty)
				{
					domText.innerHTML = nothing_found_msg;
				}
		}
	})
	}

	function getTabUrl(callback) {
		chrome.tabs.executeScript({
			code: "document.location.href"
		}, function (results) {
			callback(results[0]);
		});
	}

	function addCopy(domText, url) {
		var button = document.createElement("button");
		button.setAttribute("type", "button");
		button.innerHTML = "COPY";
		button.addEventListener("click", function () {
			copyText(url);
		});
		domText.appendChild(button);
	}

	document.getElementById("image-button").addEventListener("click", function getImages() {
		if (!activate("image-content"))
			return;
		addUrls("image-content", "img", "src", addImg);
	});

	document.getElementById("video-button").addEventListener("click", function getImages() {
		if (!activate("video-content"))
			return;
		addUrls("video-content", "video", "src", addUrl);
		addIframe("video-content");
		getTabUrl(function(urlPage) {
			for (var extractor of window.extractors) {
				if (extractor.validUrl(urlPage))
					extractor.extract(urlPage, function (urlRes) {
						addUrl(document.getElementById("video-content"), urlRes);
					});
			}
		})
		/*getTabUrl(function (urlPage) {
			if (isYtUrl(urlPage)) {
				addUrl(document.getElementById("video-content"), getYtVideoUrl(getYtUrl(urlPage)));
			}
		});*/
	});

	/*document.getElementById("link-button").addEventListener("click", function getImages() {
		if (!activate("link-content"))
			return;
		addUrls("link-content", "a", "href");
	});*/
})();
