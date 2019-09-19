/*
* Javascript code used to fill all interface translated contents
* and to rebuild static contents (tutorial, about, classroom)
*/

/**
* @func clear all navbar and menu items text
*/
function clearNavbarAndMenuItems() 
{
	cleanId("navbar_analysis");
	cleanId("navbar_tools");
	cleanId("navbar_classroom");
	cleanId("navbar_keyframes");
	cleanId("navbar_thumbnails");
	cleanId("navbar_twitter");
	cleanId("navbar_magnifier");
	cleanId("navbar_metadata");
	cleanId("navbar_rights");
	cleanId("navbar_forensic");
	cleanId("navbar_about");
	cleanId("navbar_survey");
	cleanId("navbar_tuto");
	cleanId("navbar_quiz");
}

/**
* @func update the content of the navbar in function of language
* @lang actual lang to display
*/
function update_navbar(lang) 
{
	// clear navbar and menu items
	clearNavbarAndMenuItems();
	// add translation to each tool
	setInnerHtml("navbar_tools",				addSpan(json_lang_translate[lang]["navbar_tools"]));
	setInnerHtml("navbar_classroom",			addSpan(json_lang_translate[lang]["navbar_classroom"]));
	setInnerHtml("navbar_about",				addSpan(json_lang_translate[lang]["navbar_about"]));
	setInnerHtml("navbar_survey",				addSpan(json_lang_translate[lang]["navbar_survey"]));
	setInnerHtml("navbar_tuto",					addSpan(json_lang_translate[lang]["navbar_tuto"]));
	setInnerHtml("navbar_quiz",					addSpan(json_lang_translate[lang]["navbar_quiz"]));
}

/**
* @func update the content of the tools menu in function of language
* @lang actual lang to display
*/
function update_tools_menu(lang) 
{
	setInnerHtml("menu_api_tit",				json_lang_translate[lang]["navbar_analysis"]);
	setInnerHtml("menu_key_tit",				json_lang_translate[lang]["navbar_keyframes"]);
	setInnerHtml("menu_thu_tit",				json_lang_translate[lang]["navbar_thumbnails"]);
	setInnerHtml("menu_twi_tit",				json_lang_translate[lang]["navbar_twitter"]);
	setInnerHtml("menu_mag_tit",				json_lang_translate[lang]["navbar_magnifier"]);
	setInnerHtml("menu_met_tit",				json_lang_translate[lang]["navbar_metadata"]);
	setInnerHtml("menu_vid_tit",				json_lang_translate[lang]["navbar_rights"]);
	setInnerHtml("menu_for_tit",				json_lang_translate[lang]["navbar_forensic"]);
	setInnerHtml("menu_sna_tit", 				json_lang_translate[lang]["navbar_twitter_sna"]);

	setTitle("menu_api_dsc",					json_lang_translate[lang]["api_title"]);
	setTitle("menu_key_dsc",					json_lang_translate[lang]["keyframes_title"]);
	setTitle("menu_thu_dsc",					json_lang_translate[lang]["youtube_title"]);
	setTitle("menu_twi_dsc",					json_lang_translate[lang]["twitter_title"]);
	setTitle("menu_mag_dsc",					json_lang_translate[lang]["magnifier_title"]);
	setTitle("menu_met_dsc",					json_lang_translate[lang]["metadata_title"]);
	setTitle("menu_vid_dsc",					json_lang_translate[lang]["copyright_title"]);
	setTitle("menu_for_dsc",					json_lang_translate[lang]["forensic_title"]);
	setTitle("menu_sna_dsk",					json_lang_translate[lang]["twitter_sna_title"])
}

/**
* @func update the content of the tools menu in function of language
* @lang actual lang to display
*/
function update_third_parties_menu(lang) 
{
	setInnerHtml("third_parties_title",			json_lang_translate[lang]["third_parties_title"]);
	for( var i = 1; i <= 6; i ++ ) {
		if( json_lang_translate[lang]["other_tools_title_"+i] != "" ) {
			setInnerHtml("other_tools_title_"+i,	json_lang_translate[lang]["other_tools_title_"+i]);
			setImageSource("other_tools_image_"+i,	"img/pictos/"+json_lang_translate[lang]["other_tools_image_"+i]);
			setLinkHref("other_tools_link_"+i,		json_lang_translate[lang]["other_tools_link_"+i]);
			document.getElementById("other_tools_"+i).style.display = "block";
		} else {
			document.getElementById("other_tools_"+i).style.display = "none";
		}
	}
}

/**
* @func update the content of the api tab in function of language
* @lang actual lang to display
*/
function update_api(lang) 
{
	// add translation to items needed from api tab
	setInnerHtml("api_title",					"<h1>" + json_lang_translate[lang]["api_title"] + "</h1>");
	setInnerHtml("api_repro",					json_lang_translate[lang]["api_repro"]);
	setInnerHtml("api_comments",				addSpan(json_lang_translate[lang]["api_comments"]));
	setInnerHtml("api_map",						addSpan(json_lang_translate[lang]["api_map"]));
	setInnerHtml("pac-button",					json_lang_translate[lang]["button_submit"]);
	setInnerHtml("google_search_btn",			json_lang_translate[lang]["button_reverse_google"]);
	setInnerHtml("yandex_search_btn",			json_lang_translate[lang]["button_reverse_yandex"]);
	setInnerHtml("tineye_search_btn",			json_lang_translate[lang]["button_reverse_tineye"]);
	setInnerHtml("twitter_search_btn",			json_lang_translate[lang]["button_reverse_twitter"]);
	setInnerHtml("footer_analysis",				json_lang_translate[lang]["footer_analysis"]);
	setPlaceholder("apibox",					json_lang_translate[lang]["api_input"]);
	// setPlaceholder("pac-input",					json_lang_translate[lang]["api_searchbox"]);
}

/**
* @func update the translations of keyframes tab in function of language
* @lang actual lang to display
*/
function update_keyframes(lang) 
{
	// add translations to item needed
	setInnerHtml("keyframes_title",				"<h1>" + json_lang_translate[lang]["keyframes_title"] + "</h1>");
	setInnerHtml("keyframes_localfile",			addSpan(json_lang_translate[lang]["button_localfile"]));
	setInnerHtml("keyframes_content_title",		"<h3>" + json_lang_translate[lang]["keyframes_content_title"] + "</h3>");
	setInnerHtml("keyframes_tip",				json_lang_translate[lang]["keyframes_tip"]);
	setInnerHtml("keyframes_content_acco",		json_lang_translate[lang]["keyframes_content_acco"]);
	setInnerHtml("keyframes_iframe_back",		addSpan(json_lang_translate[lang]["forensic_card_back"]));
	setInnerHtml("keyframes_download_subshots",	json_lang_translate[lang]["keyframes_download"]);
	setInnerHtml("footer_keyframes",			json_lang_translate[lang]["footer_keyframes"]);
	setPlaceholder("keyframes_input",			json_lang_translate[lang]["keyframes_input"]);
}

/**
* @func update the translations of YouTube thumbnails tab in function of language
* @lang actual lang to display
*/
function update_thumbnails(lang) 
{
	// add translations to item needed
	setInnerHtml("youtube_title",				"<h1>" + json_lang_translate[lang]["youtube_title"] + "</h1>");
	setInnerHtml("footer_thumbnails",			json_lang_translate[lang]["footer_thumbnails"]);
	setPlaceholder("youtube_input",				json_lang_translate[lang]["youtube_input"]);
}

/**
* @func update the translations of twitter search tab in function of language
* @lang actual lang to display
*/
function update_twitter(lang)
{
	// add translations to item needed
	setInnerHtml("twitter_title",				"<h1>" + json_lang_translate[lang]["twitter_title"] + "</h1>");
	setInnerHtml("twitter_local_time",			json_lang_translate[lang]["twitter_local_time"]);
	setInnerHtml("twitter_gmt",					json_lang_translate[lang]["twitter_gmt"]);
	setInnerHtml("footer_twitter",				json_lang_translate[lang]["footer_twitter"]);

	setPlaceholder("termbox",					json_lang_translate[lang]["twitter_termbox"]);
	setPlaceholder("tw-account",				json_lang_translate[lang]["twitter_tw-account"]);
	setPlaceholder("filter",					json_lang_translate[lang]["twitter_filter"]);
	setPlaceholder("lang",						json_lang_translate[lang]["twitter_lang"]);
	setPlaceholder("geocode",					json_lang_translate[lang]["twitter_geocode"]);
	setPlaceholder("near",						json_lang_translate[lang]["twitter_near"]);
	setPlaceholder("within",					json_lang_translate[lang]["twitter_within"]);
	setPlaceholder("from-date",					json_lang_translate[lang]["twitter_from-date"]);
	setPlaceholder("to-date",					json_lang_translate[lang]["twitter_to-date"]);
}

/**
 * @func update the translations of twitter sna tab in function of language
 * @lang actual lang to display
 */
function update_twitter_sna(lang)
{
	// add translations to item needed
	setInnerHtml("twitterStats_title",				"<h1>" + json_lang_translate[lang]["twitter_sna_title"] + "</h1>");
	setInnerHtml("twitterStats_local_time",			json_lang_translate[lang]["twitter_sna_local_time"]);
	setInnerHtml("twitterStats_gmt",				json_lang_translate[lang]["twitter_sna_gmt"]);
	setInnerHtml("twitterStats-footer",				json_lang_translate[lang]["footer_twitter"]);
	setInnerHtml("twitterStats-media",				json_lang_translate[lang]["twitter_sna_media"]);
	setInnerHtml("twitterStats_media_none",			json_lang_translate[lang]["twitterStats_media_none"]);
	setInnerHtml("twitterStats_media_images",		json_lang_translate[lang]["twitterStats_media_images"]);
	setInnerHtml("twitterStats_media_videos",		json_lang_translate[lang]["twitterStats_media_videos"]);
	setInnerHtml("twitterStats_media_both",			json_lang_translate[lang]["twitterStats_media_both"]);
	setInnerHtml("twitterStats-verified",			json_lang_translate[lang]["twitter_sna_verified"]);
	setInnerHtml("twitterStats_verified_no",		json_lang_translate[lang]["twitterStats_verified_no"]);
	setInnerHtml("twitterStats_verified_yes",		json_lang_translate[lang]["twitterStats_verified_yes"]);


	setPlaceholder("twitterStats-search",			json_lang_translate[lang]["twitter_sna_search"]);
	setPlaceholder("twitterStats-user",				json_lang_translate[lang]["twitter_sna_user"]);
	setPlaceholder("twitterStats-lang",				json_lang_translate[lang]["twitter_sna_lang"]);
	setPlaceholder("twitterStats-from-date",		json_lang_translate[lang]["twitter_sna_from_date"]);
	setPlaceholder("twitterStats-to-date",			json_lang_translate[lang]["twitter_sna_until_date"]);
}


/**
* @func update the translations of magnifier tab in function of language
* @lang actual lang to display
*/
function update_magnifier(lang) 
{
	// add translations to item needed
	setInnerHtml("magnifier_title",				"<h1>" + json_lang_translate[lang]["magnifier_title"] + "</h1>");
	setInnerHtml("local_file",					addSpan(json_lang_translate[lang]["button_localfile"]));
	setInnerHtml("magnifier_accor",				json_lang_translate[lang]["magnifier_accor"]);
	setInnerHtml("magnifier_radio_1",			json_lang_translate[lang]["magnifier_radio_1"]);
	setInnerHtml("magnifier_radio_2",			json_lang_translate[lang]["magnifier_radio_2"]);
	setInnerHtml("magnifier_radio_3",			json_lang_translate[lang]["magnifier_radio_3"]);
	setInnerHtml("magnifier_radio_4",			json_lang_translate[lang]["magnifier_radio_4"]);
	setInnerHtml("magnifier_radio_5",			json_lang_translate[lang]["magnifier_radio_5"]);
	setInnerHtml("magnifier_scale",				json_lang_translate[lang]["magnifier_scale"]);
	setInnerHtml("button_undo",					json_lang_translate[lang]["button_undo"]);
	setInnerHtml("button_redo",					json_lang_translate[lang]["button_redo"]);
	setInnerHtml("magnifier_switch",			"<h3>" + json_lang_translate[lang]["magnifier_switch"] + "</h3>");
	setInnerHtml("button_downloads",			json_lang_translate[lang]["button_download"]);
	setInnerHtml("img_rev_search_btn",			addSpan(json_lang_translate[lang]["magnifier_google"]));
	setInnerHtml("baidu_rev_search_btn",		addSpan(json_lang_translate[lang]["magnifier_baidu"]));
	setInnerHtml("yandex_rev_search_btn",		addSpan(json_lang_translate[lang]["magnifier_yandex"]));
	setInnerHtml("tineye_rev_search_btn",		addSpan(json_lang_translate[lang]["magnifier_tineye"]));
	setInnerHtml("img_verif_btn",				addSpan(json_lang_translate[lang]["magnifier_forensic"]));
	setInnerHtml("footer_magnifier",			json_lang_translate[lang]["footer_magnifier"]);
	setPlaceholder("urlbox",					json_lang_translate[lang]["magnifier_urlbox"]);
}

/**
* @func update the translations of metadata tab in function of language
* @lang actual lang to display
*/
function update_metadata(lang) 
{
	// add translations to item needed
	setInnerHtml("metadata_content_title",		"<h1>" + json_lang_translate[lang]["metadata_content_title"] + "</h1>");
	setInnerHtml("metadata_localfile",			addSpan(json_lang_translate[lang]["button_localfile"]));
	setInnerHtml("metadata_radio_image",		json_lang_translate[lang]["metadata_radio_image"]);
	setInnerHtml("metadata_radio_video",		json_lang_translate[lang]["metadata_radio_video"]);
	setInnerHtml("footer_metadata",				json_lang_translate[lang]["footer_metadata"]);
	setPlaceholder("url-metadata",				json_lang_translate[lang]["metadata_content_input"]);
}

/**
* @func update the translations of copyright tab in function of language
* @lang actual lang to display
*/
function update_copyright(lang) 
{
	// add translations to item needed
	setInnerHtml("copyright_title",				"<h1>" + json_lang_translate[lang]["copyright_title"] + "</h1>");
	setInnerHtml("footer_rights",				json_lang_translate[lang]["footer_rights"]);
	setPlaceholder("copyright-video_url",		json_lang_translate[lang]["copyright_input"]);
}

/**
* @func update the translations of forensic tab in function of language
* @lang actual lang to display
*/
function update_forensic(lang) 
{
	// add translations to item needed
	setInnerHtml("forensic_title",				"<h1>" + json_lang_translate[lang]["forensic_title"] + "</h1>");
	setInnerHtml("forensic_localfile",			addSpan(json_lang_translate[lang]["button_localfile"]));
	setInnerHtml("forensic_iframe_back",		addSpan(json_lang_translate[lang]["forensic_card_back"]));
	setInnerHtml("forensic_content_title",		"<h3>" + json_lang_translate[lang]["forensic_content_title"] + "</h3>");
	setInnerHtml("footer_forensic",				json_lang_translate[lang]["footer_forensic"]);
	setPlaceholder("forensic_input",			json_lang_translate[lang]["forensic_input"]);
}

/**
* @func update the translations of submit buttons in function of language
* @lang actual lang to display
*/
function update_submit(lang)
{
	// find all button class
	var butts = document.getElementsByClassName("button");

	// foreach submit button add corresponding translation
	Array.prototype.forEach.call(butts, function(el) {
		if (el.type == "submit") {
			if (el.id != "apply_button") {
				el.value = json_lang_translate[lang]["button_submit"];
			} else {
				el.value = json_lang_translate[lang]["button_apply"];
			}
		}
	});
}

/**
* @func update the content of about tab in function of language
* @lang actual language to display
*/
function update_about(lang) 
{
	// clean about tab
	var about_tab = document.getElementById("about");
	about_tab.innerHTML = "";

	// get all translations for about tab
	var arr_trans = list_from_json(json_lang_translate[lang], "about_");

	// main title
	var h = document.createElement("h1");
	h.innerHTML = json_lang_translate[lang]["about_title"];
	about_tab.appendChild(h);

	var sp = document.createElement("span");
	sp.innerHTML = json_lang_translate[lang]["about_lang"]+"&nbsp;";
	// about_tab.appendChild(sp);

	var sel = document.createElement("select");
	sel.name = "language";
	sel.style.display = "none";
	var keys = Object.keys(json_lang_translate);
	for (var i = 0; i < keys.length; ++i) {
		var new_opt = document.createElement("option");
		if (keys[i] == global_language) {
			new_opt.setAttribute("selected", "selected");
		}
		new_opt.value = keys[i];
		new_opt.text = json_lang_translate[keys[i]]["name"];
		sel.add(new_opt);
	}
	about_tab.appendChild(sel);

	var br = document.createElement("hr");
	// about_tab.appendChild(br);


	setInnerHtml("lang_code", json_lang_translate[lang]["lang_code"] );
	let all_lang = json_lang_translate;


	// Creates a list of all languages existing in the .tsv file.

	let languages_item = "";
	for(let lang_symb in all_lang) {
		let list = document.createElement('li');
		let link = document.createElement('a');
		link.type = "button";
		link.setAttribute('data-lang', lang_symb);
		if (lang == lang_symb)
			link.setAttribute("class", "dropdown-item on");
		else
			link.setAttribute("class", "dropdown-item");
		link.text =  json_lang_translate[lang_symb]["lang_label"];
		list.appendChild(link);
		languages_item += list.outerHTML;
	};
	setInnerHtml("lang_list", languages_item);

	// set the on function for selector to update language
	$("[name='language']").on("change", function(event) {
		var language = $(this).val();
		console.log(language + "change");
		if( language != global_language ) {
			updateLanguageText(language);
			updateAllTranslations( language );
			setCookieLang(language);
			select_current_language( language );
		}
	});
	$(".languages-list a").on("click", function(event) {
		var language = $(this).attr("data-lang");
		console.log(language + "click");
		if( language != global_language ) {
			updateLanguageText(language);
			updateAllTranslations( language );
			setCookieLang(language);
		}
		select_current_language( language );
	});


	for (var i = 0; i < arr_trans.length; ++i) {
		var p = document.createElement("p");
		p.innerHTML = arr_trans[i];
		about_tab.appendChild(p);
	}

	var imgs = document.createElement("p");
	imgs.class = 'logos';
	var img1 = document.createElement("img");
	img1.src = "img/Logo-AFP-384.png";
	img1.height = "83";
	var img2 = document.createElement("img");
	img2.src = "img/iti.jpg";
	img2.height = "70";
	var img3 = document.createElement("img");
	img3.src = "img/logo_EUh2020_horizontal.png";
	img3.height = "83";
	img3.width = "462";
	img3.alt = "Europe";

	imgs.appendChild(document.createElement("br"));
	imgs.appendChild(img1);
	imgs.appendChild(document.createElement("br"));
	imgs.appendChild(img2);
	imgs.appendChild(img3);

	about_tab.appendChild(imgs);

	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("name", "human_rights");
	input.setAttribute("id", "checkbox_rights");
	// if cookie, check box
	var chk = ( cookie_value( "rights" ) == "1" ? true : false );
	if( chk ) {
		input.checked = true;
		document.getElementById("panel").style.display = "";
		document.getElementById("download-content").style.display = "";
	} else {
		document.getElementById("panel").style.display = "none";
		document.getElementById("download-content").style.display = "none";
	}
	input.addEventListener("change", function () {
		if (this.checked) {
			document.cookie = "rights=1;";
			document.getElementById("panel").style.display = "";
			document.getElementById("download-content").style.display = "";
		} else {
			document.cookie = "rights=0;";
			document.getElementById("panel").style.display = "none";
			document.getElementById("download-content").style.display = "none";
		}
	});

	var label = document.createElement("label");
	label.setAttribute("for", "checkbox_rights");
	label.innerHTML = "&nbsp;" + json_lang_translate[lang]["about_human_rights"];

	about_tab.appendChild(input);
	about_tab.appendChild(label);

	about_tab.appendChild( document.createElement("br") );
	about_tab.appendChild( document.createElement("br") );

	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("name", "unlock_explanations");
	input.setAttribute("id", "checkbox_explain");
	input.checked = ( cookie_value( "unlock" ) == "1" ? true : false );
	
	input.addEventListener("change", function () {
		var date = new Date();
		date.setTime( date.getTime() + ( 3*365*24*60*60*1000 ) );
		var expires = "expires="+date.toGMTString();
		if (this.checked) {
			document.cookie = "unlock=1; " + "path=/ ; " + expires;
		} else {
			document.cookie = "unlock=0; " + "path=/; " + expires;
			for( var i = 1; i <= config_quiz_max_items; i++ ) {
				if( document.getElementById("quiz_explanation_"+i) ) {
					document.getElementById("quiz_explanation_"+i).className = "hidden";
				}
			}
		}
		var btns = document.getElementById('quiz_all').getElementsByClassName('explanations');
		for( var i = 0; i < btns.length; i++ ) {
			btns[i].style.backgroundImage = ( this.checked ? "url(img/quiz/cadenas-on-bg.png)" : "url(img/quiz/cadenas-bg.png)" );
			btns[i].style.backgroundRepeat = "no-repeat";
		}
	});

	var label = document.createElement("label");
	label.setAttribute("for", "checkbox_explain");
	label.innerHTML = "&nbsp;" + json_lang_translate[lang]["quiz_unlock_explanations"];

	about_tab.appendChild(input);
	about_tab.appendChild(label);

	var div_trans = document.createElement("div");
	div_trans.id = "footer_about";
	div_trans.setAttribute("class", "footer");
	div_trans.innerHTML = json_lang_translate[lang]["footer_about"];
	about_tab.appendChild(div_trans);
}


/**
* @func update the content of tuto tab in function of language
* @lang actual language to display
*/
function update_tuto(lang) 
{
	// clean tutorial tab
	var tuto_tab = document.getElementById("tutorial");
	tuto_tab.innerHTML = "";

	// get all translations for tutorial tab
	var arr_trans = list_from_json(json_lang_translate[lang], "tuto_");

	// main title
	var h = document.createElement("h1");
	h.innerHTML = json_lang_translate[lang]["tuto_title"];
	tuto_tab.appendChild(h);

	var h = document.createElement("h2");
	h.innerHTML = json_lang_translate[lang]["tuto_h_1"];
	tuto_tab.appendChild(h);

	var img = document.createElement("img");
	img.src = "img/VideoURLmenu.png";
	tuto_tab.appendChild(img);

	for (var i = 0; i < 3; ++i) {
	var p = document.createElement("p");
	p.innerHTML = arr_trans[i];
	tuto_tab.appendChild(p);
	}

	var img2 = document.createElement("img");
	img2.src = "img/InstagramDemo.png";
	img2.style.width = "100%";
	tuto_tab.appendChild(img2);

	var h = document.createElement("h2");
	h.innerHTML = json_lang_translate[lang]["tuto_h_2"];
	tuto_tab.appendChild(h);

	/*var div = document.createElement("div");
	div.style = "text-align: center";
	var iframe = document.createElement("iframe");
	iframe.width = "640";
	iframe.height = "385";
	iframe.src = "https://www.youtube.com/embed/nmgbFODPiBY";
	iframe.frameborder = "0"
	div.appendChild(iframe);
	tuto_tab.appendChild(div);*/

	for (var i = 3; i < 8; ++i) {
		var p = document.createElement("p");
		p.innerHTML = arr_trans[i];
		tuto_tab.appendChild(p);
	}

	/*var div = document.createElement("div");
	div.style = "text-align: center";
	var iframe = document.createElement("iframe");
	iframe.width = "640";
	iframe.height = "385";
	iframe.src = "https://www.youtube.com/embed/8S59OMBvT8w";
	iframe.frameborder = "0"
	div.appendChild(iframe);
	tuto_tab.appendChild(div);*/

	for (var i = 8; i < 12; ++i) {
		var p = document.createElement("p");
		p.innerHTML = arr_trans[i];
		tuto_tab.appendChild(p);
	}

	var div_trans = document.createElement("div");
	div_trans.id = "footer_tutorial";
	div_trans.setAttribute("class", "footer");
	div_trans.innerHTML = json_lang_translate[lang]["footer_tutorial"];
	tuto_tab.appendChild(div_trans);
}

/**
* @func update the content of classroom tab in function of language
* @lang actual language to display
*/
function update_classroom(lang) 
{
	// main title
	setInnerHtml( "classroom_title", json_lang_translate[lang]["classroom_title"] );

	// sections titles
	setInnerHtml( "remote_resources_title", json_lang_translate[lang]["remote_resources_title"] );
	setInnerHtml( "user_resources_title", json_lang_translate[lang]["user_resources_title"] );

	// adds title and video of 1 to 5 lessons
	var content = "";
	var display = json_lang_translate[lang]["display"];
	var pic = '<img src="img/pictos/classroom-on.png">';
	var att = 'data-toggle="modal" data-keyboard="true" data-target="#lesson_modal"';
	for( var i = 1; i <= 5; i++ ) {
		var title = json_lang_translate[lang]["classroom_title_"+i];
		var embed = json_lang_translate[lang]["classroom_embed_"+i];
		var itm = "";
		var btn = "";
		if( embed != "" ) {
			btn = '<button '+att+' class="btn-primary btn-lg">'+display+'</button>';
			itm = '<div class="row">';
			itm+= '	<div class="col-sm-9 col-xs-12 text-left padding-top-10">'+pic+'<span class="lesson-title">'+title+'</span></div>';
			itm+= '	<div class="col-sm-3 col-xs-12 text-right">'+btn+'</div>';
			itm+= '	<div class="hidden">'+i+'</div>';
			itm+= '</div>';
			content+= itm;
		}
	}
	setInnerHtml( "remote_resources_content", content );

	// Popup of classroom lessons
	$("#remote_resources_content div.row div button").on( "click", function() {
		// Title
		$("#lesson_modal_title").html(json_lang_translate[global_language]["classroom_title"]);
		// ID of lesson (1 to 5)
		var id = $(this).parent().next().html();
		// Lesson name
		$("#lesson_modal_description").html(json_lang_translate[global_language]["classroom_title_"+id]);
		// Lesson embed
		var embed = json_lang_translate[global_language]["classroom_embed_"+id];
		var is_iframe = ( embed.substr(0, 7) == "<iframe" ? true : false );
		if( is_iframe ) {
			embed = embed.replace( '<iframe ', '<iframe frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" ' );
			var ratio = calculateIFrameHeightRatio( embed );
			$("#lesson_modal_embed").css("padding-bottom", ratio+"%" );
		}
		$("#lesson_modal_embed").html(embed);
		$("#lesson_modal_embed").show();
		// Lesson iframe (hidden for educational lessons)
		$("#lesson_modal_iframe").prop("src", "");
		$("#lesson_modal_iframe").hide();
		// Modal close button
		$("#lesson_modal_close").html(json_lang_translate[global_language]["close"]);
	});

	// inputs of user lessons
	setInnerHtml( "user_resources_intro", json_lang_translate[global_language]["user_resources_intro"] );
	setInnerHtml( "user_resources_intro_local", json_lang_translate[global_language]["user_resources_intro_local"] );
	setInnerHtml( "user_resources_intro_remote", json_lang_translate[global_language]["user_resources_intro_remote"] );
	$("#user_resources_content button").html(json_lang_translate[global_language]["display"]);

	// Popup of user lessons
	// $("#user_resources_content div.row div button").on( "click", function() {
	$("#lesson_user_tutorial_button").on( "click", function() {
		// Title
		$("#lesson_modal_title").html(json_lang_translate[global_language]["classroom_title"]);
		// Lesson name
		$("#lesson_modal_description").hide();
		// Lesson iframe
		var embed = $(this).parent().prev().find("input").val();
		var is_iframe = ( embed.substr(0, 7) == "<iframe" ? true : false );
		if( is_iframe ) {
			// Lesson embed iframe
			embed = embed.replace( '<iframe ', '<iframe frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" ' );
			$("#lesson_modal_iframe").prop("src", "");
			$("#lesson_modal_iframe").hide();
			$("#lesson_modal_embed").html(embed);
			$("#lesson_modal_embed").show();
		} else {
			// Lesson url
			$("#lesson_modal_iframe").prop("src", embed);
			$("#lesson_modal_iframe").show();
			$("#lesson_modal_embed").html("");
			$("#lesson_modal_embed").hide();
		}
		// Modal close button
		$("#lesson_modal_close").html(json_lang_translate[global_language]["close"]);
	});

	// Stop iframe videos on lesson popup close
	$("#lesson_modal").on("hidden.bs.modal", function() {
		$("iframe").each( function() {
			$(this).prop("src", "");
			$(this).attr("src", "");
		});
		$("#lesson_modal_iframe").prop("src", "");
		$("#lesson_modal_embed").find("iframe").prop("src", "");
	});

	// Footer
	setInnerHtml("footer_classroom", json_lang_translate[lang]["footer_classroom"]);
}


/**
* @func update the content of about tab in function of language
* @lang actual language to display
*/
function update_quiz(lang) 
{
	// clean quiz tab
	var quiz_tab = document.getElementById("quiz");
	quiz_tab.innerHTML = "";

	// main title
	var h = document.createElement("h1");
	h.innerHTML = json_lang_translate[lang]["quiz_title"];
	quiz_tab.appendChild(h);

	var quiz_items = document.createElement("div");
	quiz_items.style.float = "left";
	quiz_items.style.width = "70%";
	quiz_items.style.textAlign = "center";
	quiz_items.style.margin = "0 auto";
	var classname = "";
	for( var i = 1; i <= config_quiz_max_items; i++ ) {
		if( json_lang_translate[lang]["quiz_item_url_"+i] != "" ) {
			var main_div = document.createElement("div");
			main_div.id = "quiz_item_"+i;
			main_div.style.float = "left";
			main_div.style.width = "100%";
			main_div.style.textAlign = "center";
			main_div.style.height = "auto";
			if( classname == "" ) {
				main_div.className = "";
				classname = "hidden";
			} else {
				main_div.className = classname;
			}
			// Title
			if( json_lang_translate[lang]["quiz_item_title_"+i] != "" ) {
				var h2 = document.createElement("h2");
				h2.style.marginTop = "20px";
				h2.innerHTML = json_lang_translate[lang]["quiz_item_title_"+i];
				main_div.appendChild(h2);
			}
			// Image
			var src = json_lang_translate[lang]["quiz_item_url_"+i];
			var tmp = src.split(".");
			var ext = tmp[tmp.length-1];
			var typ = "";
			if( ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "bmp" || ext == "gif" ) {
				typ = "image";
				var img = document.createElement("img");
				img.id = 'quiz_image_'+i;
				img.src = src;
				img.style.maxHeight = "500px";
				img.style.maxWidth = "100%";
				img.style.margin = "40px auto 20px auto";
				img.style.display = "block";
				main_div.appendChild(img);
			} else if( ext == "mp4" ) {
				typ = "video";
				var vid = document.createElement("video");
				img.id = 'quiz_video_'+i;
				vid.width = "625";
				vid.height = "450";
				vid.controls = "controls";
				vid.style.marginTop = "0";
				vid.style.marginBottom = "20px";
				var sou = document.createElement("source");
				sou.src = src;
				sou.type = "video/mp4";
				vid.appendChild(sou);
				main_div.appendChild(vid);
			} else {
				typ = "video";
				var frm = document.createElement("iframe");
				frm.id = 'quiz_iframe_'+i; 
				frm.src = src;
				frm.border = "0";
				frm.width = "625";
				frm.height = "450";
				frm.style.marginTop = "40px";
				frm.style.marginBottom = "20px";
				main_div.appendChild(frm); 
			}
			if( typ == "image" ) {
				// SIMILARITY search
				var btn = document.createElement("button");
				btn.id = "similarity_button";
				btn.className = "btn-primary btn-lg";
				btn.index = i;
				btn.innerHTML = json_lang_translate[lang]["quiz_similarity"];
				btn.style.marginTop = "20px";
				btn.style.marginRight = "30px";
				btn.style.backgroundImage = "none";
				btn.addEventListener( 'click', function() {
					for( i = 1; i <= config_quiz_max_items; i++ ) {
						if( ! $("#quiz_item_"+i).hasClass("hidden") ) {
							var image_url = "https://www.google.com/searchbyimage?image_url=";
							image_url+= $("#quiz_image_"+i).attr("src");
							openTab( image_url );
							break;
						}
					}
				});
				main_div.appendChild(btn);
				// FORENSIC search
				var btn = document.createElement("button");
				btn.id = "forensic_button";
				btn.className = "btn-primary btn-lg";
				btn.index = i;
				btn.innerHTML = json_lang_translate[lang]["quiz_forensic"];
				btn.style.marginTop = "20px";
				btn.style.backgroundImage = "none";
				btn.addEventListener( 'click', function() {
					for( i = 1; i <= config_quiz_max_items; i++ ) {
						if( ! $("#quiz_item_"+i).hasClass("hidden") ) {
							var image_url = page_name+"?imgforen=";
							image_url+= encodeURIComponent( $("#quiz_image_"+i).attr("src") );
							window.location.href = image_url;
							break;
						}
					}
				});
				main_div.appendChild(btn);
			}
			if( typ == "video" ) {
				// KEYFRAMES search
				var btn = document.createElement("button");
				btn.id = "keyframe_button";
				btn.className = "btn-primary btn-lg";
				btn.index = i;
				btn.innerHTML = json_lang_translate[lang]["quiz_keyframes"];
				btn.style.marginTop = "20px";
				btn.style.backgroundImage = "none";
				btn.addEventListener( 'click', function() {
					for( i = 1; i <= config_quiz_max_items; i++ ) {
						if( ! $("#quiz_item_"+i).hasClass("hidden") ) {
							var youtube_url = $("#quiz_iframe_"+i).attr("src");
							var video_url = page_name+"?imgkey=";
							video_url+= encodeURIComponent( youtube_url.replace( '/embed/', '/watch?v=' ) );
							window.location.href = video_url;
							break;
						}
					}
				});
				main_div.appendChild(btn);
			}
			var br = document.createElement("br");
			br.style.clear = "both";
			main_div.appendChild(br);
			// Display explanations
			var btn = document.createElement("button");
			btn.className = "btn-primary btn-lg explanations";
			btn.innerHTML = json_lang_translate[lang]["quiz_explanations"];
			btn.index = i;
			btn.style.marginTop = "40px";
			btn.style.width = "100%";
			btn.addEventListener( 'click', function() {
				var d = document.getElementById("quiz_explanation_"+this.index).className;
				var cook_val = cookie_value( "unlock" );
				var locked;
				//Hack for firefox addon that do not support cookies
				if(!cook_val){
					locked = (document.getElementById("checkbox_explain").checked)? false : true ;
				}else{
					locked = ( cookie_value( "unlock" ) == "1" ? false : true );
				}
				if( locked ) {
					alert( json_lang_translate[lang]["quiz_unlock_message"] );
					document.getElementById("quiz_explanation_"+this.index).className = "hidden";
				} else {
					document.getElementById("quiz_explanation_"+this.index).className = ( d == "hidden" ? "" : "hidden" );
				}
			}, true);
			if( cookie_value( "unlock" ) == "1" ) {
				btn.style.backgroundImage = "url(img/quiz/cadenas-on-bg.png)";
				btn.style.backgroundRepeat = "no-repeat";
				btn.style.backgroundPosition = "98% 50%";
			} else {
				btn.style.backgroundImage = "url(img/quiz/cadenas-bg.png)";
				btn.style.backgroundRepeat = "no-repeat";
				btn.style.backgroundPosition = "98% 50%";
			}
			main_div.appendChild(btn);
			// Explanations
			var div = document.createElement("div");
			div.id = "quiz_explanation_"+i;
			div.innerHTML = json_lang_translate[lang]["quiz_item_answer_"+i];
			div.style.textAlign = "justify";
			div.style.padding = "15px";
			div.style.backgroundColor= "#f8f8f8";
			div.className = "hidden";
			div.style.margin = "0";
			main_div.appendChild(div);
			var br = document.createElement("br");
			main_div.appendChild(br);
			quiz_items.appendChild(main_div);
		}
	}

	var quiz_prev = document.createElement("div");
	quiz_prev.id = "quiz_prev";
	quiz_prev.style.visibility = "hidden";
	quiz_prev.style.float = "left";
	quiz_prev.style.padding = "";
	quiz_prev.style.fontSize = "50px";
	quiz_prev.innerHTML = '<div class="quiz-move-left"><img src="img/quiz/left.png" /></div>';
	quiz_prev.addEventListener( 'click', function() {
		quiz_toggle_items( "-1" );
	});

	var quiz_next = document.createElement("div");
	quiz_next.id = "quiz_next";
	quiz_next.style.float = "right";
	quiz_next.style.padding = "";
	quiz_next.style.fontSize = "50px";
	quiz_next.innerHTML = '<div class="quiz-move-right"><img src="img/quiz/right.png" /></div>';
	quiz_next.addEventListener( 'click', function() {
		quiz_toggle_items( "1" );
	});

	var quiz_all = document.createElement("div");
	quiz_all.id = "quiz_all";
	quiz_all.style.overflow = "hidden";
	quiz_all.appendChild(quiz_prev);
	quiz_all.appendChild(quiz_items);
	quiz_all.appendChild(quiz_next);

	quiz_tab.appendChild(quiz_all);
}

/**
* @func update the content of home tutorial popup
* @lang actual language to display
*/
function updateHomeTutorial(lang)
{
	// title and close button
	$("#tutorial_modal_title").html(json_lang_translate[lang]["home_tutorial_title"]);
	$("#tutorial_modal_close").html(json_lang_translate[lang]["close"]);

	// display home tutorial hidden input
	// 0 => never, 1 => first time, 2 => always
	var input = document.getElementById("home_tutorial_display");
	input.value = json_lang_translate[lang]["home_tutorial_display"];

	// clean home tutorial popup images
	var tutorial_tab = document.getElementById("tutorial_modal_images");
	tutorial_tab.innerHTML = "";

	// prepare tutorial images of carrousel
	var tutorial_items = document.createElement("div");
	tutorial_items.style.float = "left";
	tutorial_items.style.width = "70%";
	tutorial_items.style.textAlign = "center";
	tutorial_items.style.margin = "0 auto";
	var classname = "";
	for( var i = 1; i <= 5; i++ ) {
		if( json_lang_translate[lang]["home_tutorial_image_"+i] != "" ) {
			var main_div = document.createElement("div");
			main_div.id = "tutorial_item_"+i;
			main_div.style.float = "left";
			main_div.style.width = "100%";
			main_div.style.textAlign = "center";
			main_div.style.height = "auto";
			if( classname == "" ) {
				main_div.className = "";
				classname = "hidden";
			} else {
				main_div.className = classname;
			}
			// Image
			var src = json_lang_translate[lang]["home_tutorial_image_"+i];
			var img = document.createElement("img");
			img.id = 'home_tutorial_image_'+i;
			img.src = "img/tutorial/"+src;
			img.style.maxHeight = "500px";
			img.style.maxWidth = "100%";
			img.style.margin = "40px auto 20px auto";
			img.style.display = "block";
			main_div.appendChild(img);
			tutorial_items.appendChild(main_div);
		}
	}

	// tutorial prev button
	var tutorial_prev = document.createElement("div");
	tutorial_prev.id = "tutorial_prev";
	tutorial_prev.style.visibility = "hidden";
	tutorial_prev.style.float = "left";
	tutorial_prev.style.padding = "";
	tutorial_prev.style.fontSize = "50px";
	tutorial_prev.innerHTML = '<div class="quiz-move-left"><img src="img/quiz/left.png" /></div>';
	tutorial_prev.addEventListener( 'click', function() {
		tutorial_toggle_items( "-1" );
	});

	// tutorial next button
	var tutorial_next = document.createElement("div");
	tutorial_next.id = "tutorial_next";
	tutorial_next.style.float = "right";
	tutorial_next.style.padding = "";
	tutorial_next.style.fontSize = "50px";
	tutorial_next.innerHTML = '<div class="quiz-move-right"><img src="img/quiz/right.png" /></div>';
	tutorial_next.addEventListener( 'click', function() {
		tutorial_toggle_items( "1" );
	});

	// tutorial full carrousel
	var tutorial_all = document.createElement("div");
	tutorial_all.id = "tutorial_all";
	tutorial_all.style.overflow = "hidden";
	tutorial_all.appendChild(tutorial_prev);
	tutorial_all.appendChild(tutorial_items);
	tutorial_all.appendChild(tutorial_next);

	tutorial_tab.appendChild(tutorial_all);
}

var quiz_current_index = 1;

function quiz_toggle_items( index )
{
	var idx = parseInt( index );
	var lst = 0;
	if( idx > 0 ) {
		if( quiz_current_index + idx <= config_quiz_max_items ) {
			for( var i = 1; i <= config_quiz_max_items; i++ ) {
				if( document.getElementById("quiz_item_"+i) ) {
					lst = i;
					if( i == quiz_current_index + idx ) {
						document.getElementById("quiz_item_"+i).className = "";
					} else {
						document.getElementById("quiz_item_"+i).className = "hidden";
					}
				}
			}
			quiz_current_index+= idx;
		}
	}
	if( idx < 0 ) {
		if( quiz_current_index + idx >= 1 ) {
			for( var i = 1; i <= config_quiz_max_items; i++ ) {
				if( document.getElementById("quiz_item_"+i) ) {
					lst = i;
					if( i == quiz_current_index + idx ) {
						document.getElementById("quiz_item_"+i).className = "";
					} else {
						document.getElementById("quiz_item_"+i).className = "hidden";
					}
				}
			}
			quiz_current_index+= idx;
		}
	}

	if( quiz_current_index == 1 ) document.getElementById("quiz_prev").style.visibility = "hidden";
	else document.getElementById("quiz_prev").style.visibility = "visible";
	if( quiz_current_index == lst ) document.getElementById("quiz_next").style.visibility = "hidden";
	else document.getElementById("quiz_next").style.visibility = "visible";
}

var tutorial_current_index = 1;

function tutorial_toggle_items( index )
{
	var idx = parseInt( index );
	var lst = 0;
	if( idx > 0 ) {
		if( tutorial_current_index + idx <= 5 ) {
			for( var i = 1; i <= 5; i++ ) {
				if( document.getElementById("tutorial_item_"+i) ) {
					lst = i;
					if( i == tutorial_current_index + idx ) {
						document.getElementById("tutorial_item_"+i).className = "";
					} else {
						document.getElementById("tutorial_item_"+i).className = "hidden";
					}
				}
			}
			tutorial_current_index+= idx;
		}
	}
	if( idx < 0 ) {
		if( tutorial_current_index + idx >= 1 ) {
			for( var i = 1; i <= 5; i++ ) {
				if( document.getElementById("tutorial_item_"+i) ) {
					lst = i;
					if( i == tutorial_current_index + idx ) {
						document.getElementById("tutorial_item_"+i).className = "";
					} else {
						document.getElementById("tutorial_item_"+i).className = "hidden";
					}
				}
			}
			tutorial_current_index+= idx;
		}
	}

	if( tutorial_current_index == 1 ) document.getElementById("tutorial_prev").style.visibility = "hidden";
	else document.getElementById("tutorial_prev").style.visibility = "visible";
	if( tutorial_current_index == lst ) document.getElementById("tutorial_next").style.visibility = "hidden";
	else document.getElementById("tutorial_next").style.visibility = "visible";
}
