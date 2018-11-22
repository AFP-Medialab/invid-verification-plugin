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
  document.getElementById("google_search_btn").innerHTML = addSpan(json_lang_translate[lang]["button_reverse_google"]);
  document.getElementById("yandex_search_btn").innerHTML = addSpan(json_lang_translate[lang]["button_reverse_yandex"]);
  document.getElementById("tineye_search_btn").innerHTML = addSpan(json_lang_translate[lang]["button_reverse_tineye"]);
  document.getElementById("twitter_search_btn").innerHTML = addSpan(json_lang_translate[lang]["button_reverse_twitter"]);
}

/**
* @func update the translations of submit buttons in function of language
* @lang actual lang to display
*/
function update_submit(lang) {
  //find all button class
  var butts = document.getElementsByClassName("button");

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
      /* update metadata table */
      updateTableLanguageMetadata(language);
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

  var img = document.createElement("img");
  img.src = "img/InstagramDemo.png";
  img.width = "100%";
  tuto_tab.appendChild(img);

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
}