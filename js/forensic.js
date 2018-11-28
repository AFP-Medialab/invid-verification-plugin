//@base_url_forensic where to send all get or post requests
var base_url_forensic = "http://reveal-mklab.iti.gr/";

//@datas order of analysis type to display, depending on image width or height
var datas;
var datas_height = ["dqReport", "elaReport", "medianNoiseReport", "gridsReport",
        "gridsInversedReport", "dwNoiseReport", "blockingReport"];

var datas_width = ["dqReport", "elaReport", "blockingReport", "gridsReport",
        "gridsInversedReport", "medianNoiseReport", "dwNoiseReport"];

/**
* @func create card that flips, image on front and description on back
* @title text at the top front of the card
* @img to put on front
* @desc to put on back, describes img
* @return var containing div with card, to appendchild where needed
*/
function create_card(title, img, desc) {
  //create all elements for card
  var scene = document.createElement("div");
  scene.setAttribute("class", "scene");
  var card = document.createElement("div");
  card.setAttribute("class", "card");
  var front = document.createElement("div");
  front.setAttribute("class", "card__face card__face--front");
  var back = document.createElement("div");
  back.setAttribute("class", "card__face card__face--back");
  var title_card = document.createElement("h2");
  title_card.innerHTML = title;
  var img_front = document.createElement("img");
  img_front.setAttribute("class", "img__front");
  img_front.src = img;
  var descrip_img = document.createElement("div");
  descrip_img.setAttribute("class", "descrip__img");
  descrip_img.innerHTML = desc;
  var info = document.createElement("div");
  info.setAttribute("class", "card__info");
  info.innerHTML = json_lang_translate[global_language]["forensic_card_info"];

  //create js for card (on click flip)
  img_front.addEventListener('click', function() {
      card.classList.toggle('is-flipped');
    });
  info.addEventListener('click', function() {
      card.classList.toggle('is-flipped');
    });

  //to resize the scene when img is loaded
  img_front.onload = function () {
    scene.style.height = (this.height + 70) + "px";
  };

  //appendchild to create the card
  back.appendChild(descrip_img);
  back.appendChild(info);
  front.appendChild(title_card);
  front.appendChild(img_front);
  card.appendChild(front);
  card.appendChild(back);
  scene.appendChild(card);

  return scene;
}

/**
* @func used for card slider only, to add onclick effect for radio button
* @title used to get back images id
* @nb used to get the image id we want to show
* @length number of image in the card
*/
function change_image(title, nb, length) {
  for (var j = 0; j < length; ++j) {
    var img = document.getElementById("img_" + title + "_" + j);
    if (j === nb)
      img.style.display = "";
    else
      img.style.display = "none";
  }
}

/**
* @func create card that flips, image on front and description on back
* @title text at the top front of the card, must be unique (used as identifier)
* @img list of images to put in front (ordered)
* @desc to put on back, describes img
* @return var containing div with card slider, to appendchild where needed
*/
function create_card_slider(title, imgs, desc) {
  //create all elements for card
  var scene = document.createElement("div");
  scene.setAttribute("class", "scene");
  var card = document.createElement("div");
  card.setAttribute("class", "card");
  var front = document.createElement("div");
  front.setAttribute("class", "card__face card__face--front");
  var back = document.createElement("div");
  back.setAttribute("class", "card__face card__face--back");
  var title_card = document.createElement("h2");
  title_card.innerHTML = title;
  var descrip_img = document.createElement("div");
  descrip_img.setAttribute("class", "descrip__img");
  descrip_img.innerHTML = desc;
  var info = document.createElement("div");
  info.setAttribute("class", "card__info");
  info.innerHTML = json_lang_translate[global_language]["forensic_card_info"];

  //create all imgs
  var imgs_front = document.createElement("div");
  for (var i = 0; i < imgs.length; ++i) {
    var img_front = document.createElement("img");
    img_front.setAttribute("class", "img__front");
    img_front.src = imgs[i];
    img_front.id = "img_" + title + "_" + i;
    if (i == 0) {
      img_front.style.display = "";
      //to resize scene on imgload
      img_front.onload = function () {
        scene.style.height = (this.height + 90) + "px";
      };
    }
    else
      img_front.style.display = "none";

    //add js to flip card on click
    img_front.addEventListener('click', function() {
        card.classList.toggle('is-flipped');
      });
    imgs_front.appendChild(img_front);
  }

  //create radio buttons to select images
  var div_radio = document.createElement("div");
  for (var k = 0; k < imgs.length; ++k) {
    (function () {
      var id = k;
      var but = document.createElement("input");
      but.type = "radio";
      but.id = title + "_" + id;
      if (id == 0)
        but.checked = true;
      but.name = title;
      but.addEventListener('click', function () { change_image(title, id, imgs.length); });
      div_radio.appendChild(but);
    }());
  }

  //create js for card (on click flip)
  info.addEventListener('click', function() {
      card.classList.toggle('is-flipped');
    });

  //appendchild to create the card
  back.appendChild(descrip_img);
  back.appendChild(info);
  front.appendChild(title_card);
  front.appendChild(imgs_front);
  front.appendChild(div_radio);
  card.appendChild(front);
  card.appendChild(back);
  scene.appendChild(card);

  return scene;
}

/**
* @func request loop to get status until process done
* @hash used to retrieve the video reports
*/
function request_status(hash) {
  $.getJSON(base_url_forensic + "imageforensicsv3/generatereport?hash=" + hash, function (data) {
    if (data.status === "processing") {
      setTimeout(function () {
        request_status(hash);
      }, 2000);
    } else if (data.status === "completed") {
      display_forensic(hash);
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + base_url_forensic + "imageforensicsv3/generatereport?hash=" + hash);
          console.error(textStatus + ", " + error);
          display_error(error);
        });
}

/**
* @func displays on the error field the corresponding error message
* @data json answered after get, contains status field
*/
function display_error(data) {
  cleanElement("error-forensic");
  document.getElementById("forensic-image").style.display = "none";
  document.getElementById("loader-forensic").style.display = "none";

  var error_msg = json_lang_translate[global_language]["forensic_error_" + data.status] != undefined ?
    json_lang_translate[global_language]["forensic_error_" + data.status] : json_lang_translate[global_language]["forensic_error_empty_parameter"];
  document.getElementById("error-forensic").innerHTML = error_msg;
  document.getElementById("error-forensic").style.display = "block";
}

/**
* @func display the results of forensic api
* @hash used to retrieve the video reports
*/
function display_forensic(hash) {
  cleanElement("forensic-place");
  document.getElementById("loader-forensic").style.display = "none";

  //get request for report
  $.getJSON(base_url_forensic + "imageforensicsv3/getreport?hash=" + hash, function (data) {
    if (data.status === "completed") {
      //display all datas with images in cards
      //display 3 images by row
      var row = document.createElement("div");
      row.setAttribute("class", "row");
      for (var i = 0; i < datas.length; ++i) {
        var column = document.createElement("div");
        column.setAttribute("class", "column");
        column.id = datas[i];
        var card = create_card(json_lang_translate[global_language]["forensic_title_" + datas[i]], data[datas[i]]["map"],
          json_lang_translate[global_language]["forensic_card_" + datas[i]]);
        column.appendChild(card);
        row.appendChild(column);
      }
      //ghostreport display
      var column = document.createElement("div");
      column.setAttribute("class", "column");
      column.id = "ghostReport";
      var card = create_card_slider(json_lang_translate[global_language]["forensic_title_ghostReport"], data["ghostReport"]["maps"],
        json_lang_translate[global_language]["forensic_card_ghostReport"]);
      column.appendChild(card);
      row.appendChild(column);
      document.getElementById("forensic-place").appendChild(row);
      document.getElementById("forensic-content").style.display = "block";
      document.getElementById("forensic-image").style.display = "block";
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + base_url_forensic + "imageforensicsv3/getreport?hash=" + hash);
          console.error(textStatus + ", " + error);
          display_error(error);
        });
}

/**
* @func send get request to forensic server to process an image
* @image_url the url of the image to process
*/
function send_forensic_video(image_url) {
  //hide precedent result keyframes
  document.getElementById("forensic-content").style.display = "none";
  //hide the precedent error message if there was one
  document.getElementById("error-forensic").style.display ="none";
  //hide the precedent image preview
  document.getElementById("forensic-image").style.display = "none";
  //create url to send video
  var forensic_url = base_url_forensic + "imageforensicsv3/addurl?url=" + encodeURIComponent(image_url);
  //start loader
  document.getElementById("loader-forensic").style.display = "block";

  document.getElementById("forensic-image").innerHTML = '<img src="' + image_url +
        '" style="width:40%;height:auto;margin:auto;">';
  document.getElementById("forensic-image").childNodes[0].onload = function() {
    if (this.height > this.width)
      datas = datas_height;
    else
      datas = datas_width;
  };

  $.getJSON(forensic_url, function(data) {
    if (data.status === "downloaded") {
      request_status(data.hash);
    } else if (data.status === "exist") {
      display_forensic(data.hash);
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + forensic_url);
          console.error(textStatus + ", " + error);
          display_error(error);
        });
}

/**
* @func update language of forensic result table
* @lang the language to translate to
*/
function updateTableLanguageForensic(lang) {
  //check is something is displayed, if not do nothing
  if (document.getElementById("forensic-content").style.display === "block") {
    //if datas undefined content display fail
    if (datas === undefined)
      return
    for (var k = 0; k < datas.length; ++k) {
      //get the card element
      var el = document.getElementById(datas[k])
                        .childNodes[0]
                        .childNodes[0];
      //title from card__face--front
      el.childNodes[0].childNodes[0].innerHTML = json_lang_translate[lang]["forensic_title_" + datas[k]];
      //text from card__face--back
      el.childNodes[1].childNodes[0].innerHTML = json_lang_translate[lang]["forensic_card_" + datas[k]];
      //info from card__face--back
      el.childNodes[1].childNodes[1].innerHTML = json_lang_translate[lang]["forensic_card_info"];
    }
    //do the translation for ghostReport
    //get the card element
    var el = document.getElementById("ghostReport")
                      .childNodes[0]
                      .childNodes[0];
    //title from card__face--front
    el.childNodes[0].childNodes[0].innerHTML = json_lang_translate[lang]["forensic_title_ghostReport"];
    //text from card__face--back
    el.childNodes[1].childNodes[0].innerHTML = json_lang_translate[lang]["forensic_card_ghostReport"];
    //info from card__face--back
    el.childNodes[1].childNodes[1].innerHTML = json_lang_translate[lang]["forensic_card_info"];
  }
}

/**
* @func used when we want to call forensic from url
*/
function callForensic(url) {
  document.getElementById("forensic_input").value = url;
}

/**
* @func get the url from the text input and gets back informations needed for display
*/
function submit_form() {
  var url = $("[name=forensic_url]").val();
  if (url != "") {
    //send video and wait for processed status
    send_forensic_video(url);
  }
}

//add submit function to submit button of the page
var form = document.getElementById("forensic");
if (form.addEventListener) {
  form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e) {
  e.preventDefault();
});

//add button function for iframe
var but_iframe = document.getElementById("keyframes_localfile");
var but_back = document.getElementById("keyframes_iframe_back");
but_iframe.onclick = function() {
  document.getElementById("keyframes_iframe").style.display = "";
  document.getElementById("keyframes_base").style.display = "none";
}
but_back.onclick = function() {
  document.getElementById("keyframes_iframe").style.display = "none";
  document.getElementById("keyframes_base").style.display = "";
}