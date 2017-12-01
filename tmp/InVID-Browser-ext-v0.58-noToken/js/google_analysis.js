/* Analysis */
$("#video_form2 > input")[0].addEventListener("click", function ga_analysis_url(e) {
	/*gtag('event', 'Url_provided', {
		'url': $("#apibox").val()
	});*/
	ga("send", "event", "Url_provided", 'submit', $("#apibox").val());
});

(function test() {
	var list = {
		google: "#google_search_btn",
		yandex: "#yandex_search_btn",
		twitter: "#twitter_search_btn"
	};
	for (index in list) {
		$(list[index])[0].addEventListener("click", function ga_analysis_reverse_event(e) {
			/*gtag('event', 'ReverseSearch', {
				'searchEngine': index
			});*/
			ga("send", "event", "ReverseSearch", "click", index);
		});
	}
})();

/* Thumbnails */
$("#video_form input[type='submit']")[0].addEventListener("click", function ga_thumbnail_search(e) {
	var url = $(this).find("input[type='text']").val();
	var engines = {
		google: "#google_engine",
		yandex: "#yandex_engine",
		bing: "#bing_engine"
	};
	var engine = "google";
	for (index in engines) {
		if ($(engines[index]).checked) {
			engine = index;
			break;
		}
	}
	/*gtag('event', 'Url_provided', {
		'url': url,
		'searchEngine': engine
	});*/
	ga("send", "event", "Url_provided", 'submit', engine);
});

/* Twitter */
/*$("#twitter_form input[type=submit]")[0].addEventListener("click", function ga_twitter_search(e) {
	var form = {
		'keyword': "#termbox",
		'from': "#tw-account",
		'filter': "#filter",
		'language': "#lang",
		'geocode': "#geocode",
		'near': "#near",
		'since': "#from-date",
		'until': "#to-date",
	}
	for (index in form)
		form[index] = $(form[index]).val();
	var time = {
		local: "#local_time",
		GTM: "#gmt"
	}
	form['standart-time'] = "local";
	for (index in time) {
		if ($(time[index]).checked)
		{
			form['standart-time'] = index;
			break;
		}
	}
	/*gtag('event', 'Url_provided', form);
	ga('send', 'event', 'Url_provided', 'submit', form);
});*/

/* Magnifier */
$("#img_form input[type='submit']")[0].addEventListener("click", function ga_magnifier_search(e) {
	var url = $("#urlbox").val();
	if (url.match(/https?:\/\//))
		/*gtag('event', 'Url_provided', {
			'url': url
		});*/
		ga('send', 'event', 'Url_provided', 'submit', url);
});

/* Metadata */
$("#metadata_form input[type='submit']")[0].addEventListener("click", function ga_metadata_search(e) {
	var url = $("url-metadata").val();
	var types = {
		image: "#img-meta-radio",
		video: "#video-meta-radio"
	}
	var type = "image";
	for (index in types) {
		if ($(types[index]).checked)
		{
			type = index;
			break;
		}
	}
	if (url.match(/https?:\/\//)) {
		/*gtag('event', 'Url_provided', {
			'url': url,
			'type': type
		});*/
		ga("send", "event", "Url_provided", "submit", url);
	}
});