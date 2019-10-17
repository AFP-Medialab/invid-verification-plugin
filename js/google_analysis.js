/* Analysis */
$("#video_analysis_submit").on( "click", function ga_analysis_url(e) {
	var url = $("#apibox").val();
	var tmp = url.split( "facebook.com" );
	$("#facebook_connect_for_analysis").hide();
	if( tmp.length > 1 && fb_access_token == "" ) {
		$("#error-content").hide();
		$("#api-content").hide();
		$("#facebook_connect_iframe").prop("src", "https://caa.iti.gr/plugin_login_fb" );
		$("#facebook_connect_for_analysis").show();
		$("#facebook_connect_iframe").css("display","");
		$("#facebook_connect_iframe").show();
		e.preventDefault();
		return false;
	}
	ga("send", "event", "Url_provided", 'submit', url);
});

(function test() {
	var list = {
		google: "#google_search_btn",
		yandex: "#yandex_search_btn",
		twitter: "#twitter_search_btn",
		tineye: "#tineye_search_btn"
	};
	for (index in list) {
		$(list[index])[0].addEventListener("click", function ga_analysis_reverse_event(e) {
			ga("send", "event", "ReverseSearch", "click", index);
		});
	}
})();

/* Thumbnails */
$("#video_form input[type='submit']")[0].addEventListener("click", function ga_thumbnail_search(e) {
	let engines = {
		google: "#google_engine",
		yandex: "#yandex_engine",
		bing: "#bing_engine",
		tineye: "#tineye_engine"
	};
	let engine = "google";
	for (let index in engines) {
		if ($(engines[index]).checked) {
			engine = index;
			break;
		}
	}
	ga("send", "event", "Url_provided", 'submit', engine);
});

/* Twitter */
$("#twitter_form input[type=submit]")[0].addEventListener("click", function ga_twitter_search(e) {
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
	ga('send', 'event', 'Url_provided', 'submit', JSON.stringify(form));
});

/* Magnifier */
$("#img_form input[type='submit']")[0].addEventListener("click", function ga_magnifier_search(e) {
	var url = $("#urlbox").val();
	if (url.match(/https?:\/\//))
		ga('send', 'event', 'Url_provided', 'submit', url);
});

/* Metadata */
$("#metadata_form input[type='submit']")[0].addEventListener("click", function ga_metadata_search(e) {
	var url = $("#url-metadata").val();
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
		ga("send", "event", "Url_provided", "submit", url);
	}
});

/* Copyright */
$("#copyright-form > input")[0].addEventListener("click", function ga_analysis_url(e) {
  ga("send", "event", "Url_provided", 'submit', $("#copyright-video_url").val());
});
