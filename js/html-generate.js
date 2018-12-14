//js to generate tuto and about page from translation on spreadsheet

/**
* @func update the content of the navbar in function of language
* @lang actual lang to display
*/
function update_navbar(lang) {
  //clean navabar text
  cleanId("navbar_analysis");
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

  //add translation to each tool
  document.getElementById("navbar_analysis").innerHTML = addSpan(json_lang_translate[lang]["navbar_analysis"]);
  document.getElementById("navbar_keyframes").innerHTML = addSpan(json_lang_translate[lang]["navbar_keyframes"]);
  document.getElementById("navbar_thumbnails").innerHTML = addSpan(json_lang_translate[lang]["navbar_thumbnails"]);
  document.getElementById("navbar_twitter").innerHTML = addSpan(json_lang_translate[lang]["navbar_twitter"]);
  document.getElementById("navbar_magnifier").innerHTML = addSpan(json_lang_translate[lang]["navbar_magnifier"]);
  document.getElementById("navbar_metadata").innerHTML = addSpan(json_lang_translate[lang]["navbar_metadata"]);
  document.getElementById("navbar_rights").innerHTML = addSpan(json_lang_translate[lang]["navbar_rights"]);
  document.getElementById("navbar_forensic").innerHTML = addSpan(json_lang_translate[lang]["navbar_forensic"]);
  document.getElementById("navbar_about").innerHTML = addSpan(json_lang_translate[lang]["navbar_about"]);
  document.getElementById("navbar_survey").innerHTML = addSpan(json_lang_translate[lang]["navbar_survey"]);
  document.getElementById("navbar_tuto").innerHTML = addSpan(json_lang_translate[lang]["navbar_tuto"]);
}

/**
* @func update the content of the api tab in function of language
* @lang actual lang to display
*/
function update_api(lang) {
  //add translation to items needed from api tab
  document.getElementById("api_title").innerHTML = "<h1>" + json_lang_translate[lang]["api_title"] + "</h1>";
  document.getElementById("apibox").placeholder = json_lang_translate[lang]["api_input"];
  document.getElementById("api_repro").innerHTML = json_lang_translate[lang]["api_repro"];
  document.getElementById("api_comments").innerHTML = addSpan(json_lang_translate[lang]["api_comments"]);
  document.getElementById("api_map").innerHTML = addSpan(json_lang_translate[lang]["api_map"]);
  document.getElementById("pac-input").placeholder = json_lang_translate[lang]["api_searchbox"];
  document.getElementById("pac-button").innerHTML = json_lang_translate[lang]["button_submit"];
  document.getElementById("google_search_btn").innerHTML = json_lang_translate[lang]["button_reverse_google"];
  document.getElementById("yandex_search_btn").innerHTML = json_lang_translate[lang]["button_reverse_yandex"];
  document.getElementById("tineye_search_btn").innerHTML = json_lang_translate[lang]["button_reverse_tineye"];
  document.getElementById("twitter_search_btn").innerHTML = json_lang_translate[lang]["button_reverse_twitter"];
  document.getElementById("footer_analysis").innerHTML = json_lang_translate[lang]["footer_analysis"];
}

/**
* @func update the translations of submit buttons in function of language
* @lang actual lang to display
*/
function update_submit(lang) {
  //find all button class
  var butts = document.getElementsByClassName("button");

  //foreach submit button add corresponding translation
  Array.prototype.forEach.call(butts, function(el) {
    if (el.type == "submit") {
      if (el.id != "apply_button")
        el.value = json_lang_translate[lang]["button_submit"];
      else
        el.value = json_lang_translate[lang]["button_apply"];
    }
  });
}

/**
* @func update the translations of keyframes tab in function of language
* @lang actual lang to display
*/
function update_keyframes(lang) {
  //add translations to item needed
  document.getElementById("keyframes_title").innerHTML = "<h1>" + json_lang_translate[lang]["keyframes_title"] + "</h1>";
  document.getElementById("keyframes_input").placeholder = json_lang_translate[lang]["keyframes_input"];
  document.getElementById("keyframes_localfile").innerHTML = addSpan(json_lang_translate[lang]["button_localfile"]);
  document.getElementById("keyframes_content_title").innerHTML = "<h3>" + json_lang_translate[lang]["keyframes_content_title"] + "</h3>";
  document.getElementById("keyframes_content_acco").innerHTML = json_lang_translate[lang]["keyframes_content_acco"];
  document.getElementById("keyframes_iframe_back").innerHTML = addSpan(json_lang_translate[lang]["forensic_card_back"]);
  document.getElementById("keyframes_download").innerHTML = json_lang_translate[lang]["keyframes_download"];
  document.getElementById("keyframes_download_subshots").innerHTML = json_lang_translate[lang]["keyframes_download_subshots"];
  document.getElementById("footer_keyframes").innerHTML = json_lang_translate[lang]["footer_keyframes"];
}

/**
* @func update the translations of YouTube thumbnails tab in function of language
* @lang actual lang to display
*/
function update_thumbnails(lang) {
  //add translations to item needed
  document.getElementById("youtube_title").innerHTML = "<h1>" + json_lang_translate[lang]["youtube_title"] + "</h1>";
  document.getElementById("youtube_input").placeholder = json_lang_translate[lang]["youtube_input"];
  document.getElementById("footer_thumbnails").innerHTML = json_lang_translate[lang]["footer_thumbnails"];
}

/**
* @func update the translations of twitter search tab in function of language
* @lang actual lang to display
*/
function update_twitter(lang) {
  //add translations to item needed
  document.getElementById("twitter_title").innerHTML = "<h1>" + json_lang_translate[lang]["twitter_title"] + "</h1>";
  document.getElementById("termbox").placeholder = json_lang_translate[lang]["twitter_termbox"];
  document.getElementById("tw-account").placeholder = json_lang_translate[lang]["twitter_tw-account"];
  document.getElementById("filter").placeholder = json_lang_translate[lang]["twitter_filter"];
  document.getElementById("lang").placeholder = json_lang_translate[lang]["twitter_lang"];
  document.getElementById("geocode").placeholder = json_lang_translate[lang]["twitter_geocode"];
  document.getElementById("near").placeholder = json_lang_translate[lang]["twitter_near"];
  document.getElementById("within").placeholder = json_lang_translate[lang]["twitter_within"];
  document.getElementById("from-date").placeholder = json_lang_translate[lang]["twitter_from-date"];
  document.getElementById("to-date").placeholder = json_lang_translate[lang]["twitter_to-date"];
  document.getElementById("twitter_local_time").innerHTML = json_lang_translate[lang]["twitter_local_time"];
  document.getElementById("twitter_gmt").innerHTML = json_lang_translate[lang]["twitter_gmt"];
  document.getElementById("footer_twitter").innerHTML = json_lang_translate[lang]["footer_twitter"];
}

/**
* @func update the translations of magnifier tab in function of language
* @lang actual lang to display
*/
function update_magnifier(lang) {
  //add translations to item needed
  document.getElementById("magnifier_title").innerHTML = "<h1>" + json_lang_translate[lang]["magnifier_title"] + "</h1>";
  document.getElementById("urlbox").placeholder = json_lang_translate[lang]["magnifier_urlbox"];
  document.getElementById("local_file").innerHTML = addSpan(json_lang_translate[lang]["button_localfile"]);
  document.getElementById("magnifier_accor").innerHTML = json_lang_translate[lang]["magnifier_accor"];
  document.getElementById("magnifier_radio_1").innerHTML = json_lang_translate[lang]["magnifier_radio_1"];
  document.getElementById("magnifier_radio_2").innerHTML = json_lang_translate[lang]["magnifier_radio_2"];
  document.getElementById("magnifier_radio_3").innerHTML = json_lang_translate[lang]["magnifier_radio_3"];
  document.getElementById("magnifier_radio_4").innerHTML = json_lang_translate[lang]["magnifier_radio_4"];
  document.getElementById("magnifier_radio_5").innerHTML = json_lang_translate[lang]["magnifier_radio_5"];
  document.getElementById("magnifier_scale").innerHTML = json_lang_translate[lang]["magnifier_scale"];
  document.getElementById("button_undo").innerHTML = json_lang_translate[lang]["button_undo"];
  document.getElementById("button_redo").innerHTML = json_lang_translate[lang]["button_redo"];
  document.getElementById("magnifier_switch").innerHTML = "<h3>" + json_lang_translate[lang]["magnifier_switch"] + "</h3>";
  document.getElementById("button_downloads").innerHTML = json_lang_translate[lang]["button_download"];
  document.getElementById("img_rev_search_btn").innerHTML = addSpan(json_lang_translate[lang]["magnifier_google"]);
  document.getElementById("baidu_rev_search_btn").innerHTML = addSpan(json_lang_translate[lang]["magnifier_baidu"]);
  document.getElementById("yandex_rev_search_btn").innerHTML = addSpan(json_lang_translate[lang]["magnifier_yandex"]);
  document.getElementById("tineye_rev_search_btn").innerHTML = addSpan(json_lang_translate[lang]["magnifier_tineye"]);
  document.getElementById("img_verif_btn").innerHTML = addSpan(json_lang_translate[lang]["magnifier_forensic"]);
  document.getElementById("footer_magnifier").innerHTML = json_lang_translate[lang]["footer_magnifier"];
}

/**
* @func update the translations of metadata tab in function of language
* @lang actual lang to display
*/
function update_metadata(lang) {
  //add translations to item needed
  document.getElementById("metadata_content_title").innerHTML = "<h1>" + json_lang_translate[lang]["metadata_content_title"] + "</h1>";
  document.getElementById("url-metadata").placeholder = json_lang_translate[lang]["metadata_content_input"];
  document.getElementById("metadata_localfile").innerHTML = addSpan(json_lang_translate[lang]["button_localfile"]);
  document.getElementById("metadata_radio_image").innerHTML = json_lang_translate[lang]["metadata_radio_image"];
  document.getElementById("metadata_radio_video").innerHTML = json_lang_translate[lang]["metadata_radio_video"];
  document.getElementById("footer_metadata").innerHTML = json_lang_translate[lang]["footer_metadata"];
}

/**
* @func update the translations of copyright tab in function of language
* @lang actual lang to display
*/
function update_copyright(lang) {
  //add translations to item needed
  document.getElementById("copyright_title").innerHTML = "<h1>" + json_lang_translate[lang]["copyright_title"] + "</h1>";
  document.getElementById("copyright-video_url").placeholder = json_lang_translate[lang]["copyright_input"];
  document.getElementById("footer_rights").innerHTML = json_lang_translate[lang]["footer_rights"];
}

/**
* @func update the translations of forensic tab in function of language
* @lang actual lang to display
*/
function update_forensic(lang) {
  //add translations to item needed
  document.getElementById("forensic_title").innerHTML = "<h1>" + json_lang_translate[lang]["forensic_title"] + "</h1>";
  document.getElementById("forensic_input").placeholder = json_lang_translate[lang]["forensic_input"];
  document.getElementById("forensic_localfile").innerHTML = addSpan(json_lang_translate[lang]["button_localfile"]);
  document.getElementById("forensic_iframe_back").innerHTML = addSpan(json_lang_translate[lang]["forensic_card_back"]);
  document.getElementById("forensic_content_title").innerHTML = "<h3>" + json_lang_translate[lang]["forensic_content_title"] + "</h3>";
  document.getElementById("footer_forensic").innerHTML = json_lang_translate[lang]["footer_forensic"];
}

/**
* @func update the content of about tab in function of language
* @lang actual language to display
*/
function update_about(lang) {
  //clean about tab
  var about_tab = document.getElementById("about");
  about_tab.innerHTML = "";

  //get all translations for about tab
  var arr_trans = list_from_json(json_lang_translate[lang], "about_");

  //place them along with images and buttons, etc
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

  //set the on function for selector to update language
  $("[name='language']").on("change", function(event) {
    var language = $(this).val();
    if (language != global_language)
    {
      /* update HTML text */
      updateLanguageText(language);
      /* update navbar */
      update_navbar(language);
      /* update buttons */
      update_submit(language);
      /* update Analysis tab*/
      update_api(language);
      /* update Analysis table */
      updateTableLanguageAnalysis(language);
      /* update keyframes tab */
      update_keyframes(language);
      /* update YouTube thumbnails tab */
      update_thumbnails(language);
      /* update Twitter Search tab */
      update_twitter(language);
      /* update magnifier tab */
      update_magnifier(language);
      /* update metadata tab */
      update_metadata(language);
      /* update metadata table */
      updateTableLanguageMetadata(language);
      /* update copyright tab */
      update_copyright(language);
      /* update forensic tab */
      update_forensic(language);
      /* update forensic table */
      updateTableLanguageForensic(language);
      /* update about tab */
      update_about(language);
      /* update tuto tab */
      update_tuto(language);
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
  //if cookie, check box
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
    }
    else {
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
function update_tuto(lang) {
  //clean about tab
  var tuto_tab = document.getElementById("tutorial");
  tuto_tab.innerHTML = "";

  //get all translations for about tab
  var arr_trans = list_from_json(json_lang_translate[lang], "tuto_");

  //place them along with images and buttons, etc
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