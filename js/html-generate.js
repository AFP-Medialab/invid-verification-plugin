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
  setInnerHtml("navbar_tuto",				addSpan(json_lang_translate[lang]["navbar_tuto"]));
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
  setTitle("menu_api_dsc",					json_lang_translate[lang]["api_title"]);
  setTitle("menu_key_dsc",					json_lang_translate[lang]["keyframes_title"]);
  setTitle("menu_thu_dsc",					json_lang_translate[lang]["youtube_title"]);
  setTitle("menu_twi_dsc",					json_lang_translate[lang]["twitter_title"]);
  setTitle("menu_mag_dsc",					json_lang_translate[lang]["magnifier_title"]);
  setTitle("menu_met_dsc",					json_lang_translate[lang]["metadata_title"]);
  setTitle("menu_vid_dsc",					json_lang_translate[lang]["copyright_title"]);
  setTitle("menu_for_dsc",					json_lang_translate[lang]["forensic_title"]);
}

/**
* @func update the content of the tools menu in function of language
* @lang actual lang to display
*/
function update_third_parties_menu(lang) 
{
  setInnerHtml("third_parties_title",		json_lang_translate[lang]["third_parties_title"]);
  setInnerHtml("menu_cro_tit",				json_lang_translate[lang]["menu_cro_tit"]);
  setInnerHtml("menu_cml_tit",				json_lang_translate[lang]["menu_cml_tit"]);
  setTitle("menu_cro_dsc",					json_lang_translate[lang]["menu_cro_dsc"]);
  setTitle("menu_cml_dsc",					json_lang_translate[lang]["menu_cml_dsc"]);
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
  setInnerHtml("api_map",					addSpan(json_lang_translate[lang]["api_map"]));
  setInnerHtml("pac-button",				json_lang_translate[lang]["button_submit"]);
  setInnerHtml("google_search_btn",			json_lang_translate[lang]["button_reverse_google"]);
  setInnerHtml("yandex_search_btn",			json_lang_translate[lang]["button_reverse_yandex"]);
  setInnerHtml("tineye_search_btn",			json_lang_translate[lang]["button_reverse_tineye"]);
  setInnerHtml("twitter_search_btn",		json_lang_translate[lang]["button_reverse_twitter"]);
  setInnerHtml("footer_analysis",			json_lang_translate[lang]["footer_analysis"]);
  setPlaceholder("apibox",					json_lang_translate[lang]["api_input"]);
  setPlaceholder("pac-input",				json_lang_translate[lang]["api_searchbox"]);
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
  setInnerHtml("keyframes_content_acco",		json_lang_translate[lang]["keyframes_content_acco"]);
  setInnerHtml("keyframes_iframe_back",			addSpan(json_lang_translate[lang]["forensic_card_back"]));
  setInnerHtml("keyframes_download",			json_lang_translate[lang]["keyframes_download"]);
  setInnerHtml("keyframes_download_subshots",	json_lang_translate[lang]["keyframes_download_subshots"]);
  setInnerHtml("footer_keyframes",				json_lang_translate[lang]["footer_keyframes"]);
  setPlaceholder("keyframes_input",				json_lang_translate[lang]["keyframes_input"]);
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
  setPlaceholder("youtube_input",			json_lang_translate[lang]["youtube_input"]);
}

/**
* @func update the translations of twitter search tab in function of language
* @lang actual lang to display
*/
function update_twitter(lang) 
{
  // add translations to item needed
  setInnerHtml("twitter_title",				"<h1>" + json_lang_translate[lang]["twitter_title"] + "</h1>");
  setInnerHtml("twitter_local_time",		json_lang_translate[lang]["twitter_local_time"]);
  setInnerHtml("twitter_gmt",				json_lang_translate[lang]["twitter_gmt"]);
  setInnerHtml("footer_twitter",			json_lang_translate[lang]["footer_twitter"]);
  setPlaceholder("termbox",					json_lang_translate[lang]["twitter_termbox"]);
  setPlaceholder("tw-account",				json_lang_translate[lang]["twitter_tw-account"]);
  setPlaceholder("filter",					json_lang_translate[lang]["twitter_filter"]);
  setPlaceholder("lang",					json_lang_translate[lang]["twitter_lang"]);
  setPlaceholder("geocode",					json_lang_translate[lang]["twitter_geocode"]);
  setPlaceholder("near",					json_lang_translate[lang]["twitter_near"]);
  setPlaceholder("within",					json_lang_translate[lang]["twitter_within"]);
  setPlaceholder("from-date",				json_lang_translate[lang]["twitter_from-date"]);
  setPlaceholder("to-date",					json_lang_translate[lang]["twitter_to-date"]);
}

/**
* @func update the translations of magnifier tab in function of language
* @lang actual lang to display
*/
function update_magnifier(lang) 
{
  // add translations to item needed
  setInnerHtml("magnifier_title",			"<h1>" + json_lang_translate[lang]["magnifier_title"] + "</h1>");
  setInnerHtml("local_file",				addSpan(json_lang_translate[lang]["button_localfile"]));
  setInnerHtml("magnifier_accor",			json_lang_translate[lang]["magnifier_accor"]);
  setInnerHtml("magnifier_radio_1",			json_lang_translate[lang]["magnifier_radio_1"]);
  setInnerHtml("magnifier_radio_2",			json_lang_translate[lang]["magnifier_radio_2"]);
  setInnerHtml("magnifier_radio_3",			json_lang_translate[lang]["magnifier_radio_3"]);
  setInnerHtml("magnifier_radio_4",			json_lang_translate[lang]["magnifier_radio_4"]);
  setInnerHtml("magnifier_radio_5",			json_lang_translate[lang]["magnifier_radio_5"]);
  setInnerHtml("magnifier_scale",			json_lang_translate[lang]["magnifier_scale"]);
  setInnerHtml("button_undo",				json_lang_translate[lang]["button_undo"]);
  setInnerHtml("button_redo",				json_lang_translate[lang]["button_redo"]);
  setInnerHtml("magnifier_switch",			"<h3>" + json_lang_translate[lang]["magnifier_switch"] + "</h3>");
  setInnerHtml("button_downloads",			json_lang_translate[lang]["button_download"]);
  setInnerHtml("img_rev_search_btn",		addSpan(json_lang_translate[lang]["magnifier_google"]));
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
  setInnerHtml("metadata_content_title",	"<h1>" + json_lang_translate[lang]["metadata_content_title"] + "</h1>");
  setInnerHtml("metadata_localfile",		addSpan(json_lang_translate[lang]["button_localfile"]));
  setInnerHtml("metadata_radio_image",		json_lang_translate[lang]["metadata_radio_image"]);
  setInnerHtml("metadata_radio_video",		json_lang_translate[lang]["metadata_radio_video"]);
  setInnerHtml("footer_metadata",			json_lang_translate[lang]["footer_metadata"]);
  setPlaceholder("url-metadata",			json_lang_translate[lang]["metadata_content_input"]);
}

/**
* @func update the translations of copyright tab in function of language
* @lang actual lang to display
*/
function update_copyright(lang) 
{
  // add translations to item needed
  setInnerHtml("copyright_title",			"<h1>" + json_lang_translate[lang]["copyright_title"] + "</h1>");
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
  setInnerHtml("forensic_title",			"<h1>" + json_lang_translate[lang]["forensic_title"] + "</h1>");
  setInnerHtml("forensic_localfile",		addSpan(json_lang_translate[lang]["button_localfile"]));
  setInnerHtml("forensic_iframe_back",		addSpan(json_lang_translate[lang]["forensic_card_back"]));
  setInnerHtml("forensic_content_title",	"<h3>" + json_lang_translate[lang]["forensic_content_title"] + "</h3>");
  setInnerHtml("footer_forensic",			json_lang_translate[lang]["footer_forensic"]);
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
	sp.innerHTML = json_lang_translate[lang]["about_lang"];
	about_tab.appendChild(sp);

	var sel = document.createElement("select");
	sel.name = "language";
	var keys = Object.keys(json_lang_translate);
	for (var i = 0; i < keys.length; ++i) {
	var new_opt = document.createElement("option");
	if (keys[i] == global_language)
		new_opt.setAttribute("selected", "selected");
		new_opt.value = keys[i];
		new_opt.text = json_lang_translate[keys[i]]["name"];
		sel.add(new_opt);
	}
	about_tab.appendChild(sel);

	var br = document.createElement("hr");
	about_tab.appendChild(br);

	// set the on function for selector to update language
	$("[name='language']").on("change", function(event) {
		var language = $(this).val();
		if( language != global_language ) {
			updateLanguageText(language);
			updateAllTranslations( language );
			updateTableLanguageAnalysis(language);
			updateTableLanguageMetadata(language);
			updateTableLanguageForensic(language);
			setCookieLang(language);
		}
	});

	for (var i = 0; i < arr_trans.length; ++i) {
		var p = document.createElement("p");
		p.innerHTML = arr_trans[i];
		about_tab.appendChild(p);
	}

	var imgs = document.createElement("p");
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

	imgs.appendChild(img1);
	imgs.appendChild(img2);
	imgs.appendChild(img3);

	about_tab.appendChild(imgs);

	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("name", "human_rights");
	input.setAttribute("id", "checkbox_rights");
	// if cookie, check box
	var arr = (document.cookie).split(';');
	for (var cookie of arr) {
		var both = cookie.split('=');
		if (both[0] == " rights") {
			if (both[1] == "1") {
				input.checked = true;
				document.getElementById("download-content").style.display = "";
			}
			else {
				document.getElementById("download-content").style.display = "none";
			}
		}
	}

	input.addEventListener("change", function () {
		if (this.checked) {
			document.cookie = "rights=1;";
			document.getElementById("download-content").style.display = "";
		} else {
			document.cookie = "rights=0;";
			document.getElementById("download-content").style.display = "none";
		}
	});

	var label = document.createElement("label");
	label.setAttribute("for", "checkbox_rights");
	label.innerHTML = json_lang_translate[lang]["about_human_rights"];

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

	var div = document.createElement("div");
	div.style = "text-align: center";
	var iframe = document.createElement("iframe");
	iframe.width = "640";
	iframe.height = "385";
	iframe.src = "https://www.youtube.com/embed/nmgbFODPiBY";
	iframe.frameborder = "0"
	div.appendChild(iframe);
	tuto_tab.appendChild(div);

	for (var i = 3; i < 8; ++i) {
		var p = document.createElement("p");
		p.innerHTML = arr_trans[i];
		tuto_tab.appendChild(p);
	}

	var div = document.createElement("div");
	div.style = "text-align: center";
	var iframe = document.createElement("iframe");
	iframe.width = "640";
	iframe.height = "385";
	iframe.src = "https://www.youtube.com/embed/8S59OMBvT8w";
	iframe.frameborder = "0"
	div.appendChild(iframe);
	tuto_tab.appendChild(div);

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
  // clean classroom tab
  var classroom_tab = document.getElementById("classroom");
  classroom_tab.innerHTML = "";

  // main title
  var h = document.createElement("h1");
  h.innerHTML = json_lang_translate[lang]["classroom_title"];
  classroom_tab.appendChild(h);

  // adds title and video of 1 to 5 lessons
  for( var i = 1; i <= 5; i++ ) {
	  var title = json_lang_translate[lang]["classroom_title_"+i];
	  var iframe = json_lang_translate[lang]["classroom_video_"+i];
	  if( title != "" && iframe != "" ) {
		  var hr =  document.createElement("hr");
		  classroom_tab.appendChild(hr);
		  var h2 = document.createElement("h2");
		  h2.innerHTML = title;
		  classroom_tab.appendChild(h2);
		  var div = document.createElement("div");
		  div.setAttribute("class", "classroom-video-container");
		  div.innerHTML = iframe;
		  classroom_tab.appendChild(div);
		  var br =  document.createElement("br");
		  classroom_tab.appendChild(br);
	  }
  }

  var div_trans = document.createElement("div");
  div_trans.id = "footer_classroom";
  div_trans.setAttribute("class", "footer");
  div_trans.innerHTML = json_lang_translate[lang]["footer_classroom"];
  classroom_tab.appendChild(div_trans);
}
