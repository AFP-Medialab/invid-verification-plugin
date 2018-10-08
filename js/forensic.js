//@base_url where to send all get or post requests
var base_url = "http://reveal-mklab.iti.gr/";

var json_lang_trans = {
  "en": {
    "error": {
      "unsupported_file": "The submitted URL is an unsupported image file, e.g. gif image or video",
      "image_url_error": "The submitted URL is an image file but it could not be downloaded, it may be due to network problem or download restrictions",
      "url_error": "The submitted URL could not be downloaded, it may be due to network problem, download restrictions or corrupted URL path",
      "hash_not_found": "An unknown issue occured. Please check the URL and try again",
      "empty_parameter": "An unknown issue occured. Please check the URL and try again",
      "missing_image_report": "The image was not submitted. Please check the URL and try again",
      "analysis_not_triggered": "The analysis has not been triggered for this image. Please check the URL and try again"
    }
  },
  "fr": {
    "error": {
      "unsupported_file": "L'URL soumise est un fichier image non pris en charge, par exemple une image gif ou une vidéo",
      "image_url_error": "L'URL soumise est un fichier image, mais il n'a pas pu être téléchargé. Cela peut être dû à un problème de réseau ou à des restrictions de téléchargement",
      "url_error": "L'URL soumise n'a pas pu être téléchargée, cela peut être dû à un problème de réseau, aux restrictions de téléchargement ou a un chemin corrompu de l'URL",
      "hash_not_found": "Un problème inconnu s'est produit. Veuillez vérifier l'URL et réessayer",
      "empty_parameter": "Un problème inconnu s'est produit. Veuillez vérifier l'URL et réessayer",
      "missing_image_report": "L'image n'a pas été soumise. Veuillez vérifier l'URL et réessayer",
      "analysis_not_triggered": "L'analyse n'a pas été déclenchée pour cette image. Veuillez vérifier l'URL et réessayer"
    }
  }
};

/**
* @func create card that flips, image on front and description on back
* @img to put on front
* @desc to put on back, describes img
* @return var containing div with card, to appendchild where needed
*/
function create_card(img, desc) {
  return null;
}

/**
* @func request loop to get status until process done
* @hash used to retrieve the video reports
*/
function request_status(hash) {
  $.getJSON(base_url + "imageforensicsv3/generatereport?hash=" + hash, function (data) {
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
          console.error("start response : " + base_url + "imageforensicsv3/generatereport?hash=" + hash);
          console.error(textStatus + ", " + error);
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

  var error_msg = json_lang_trans[global_language]["error"][data.status] != undefined ?
    json_lang_trans[global_language]["error"][data.status] : json_lang_trans[global_language]["error"]["empty_parameter"];
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
  $.getJSON(base_url + "imageforensicsv3/getreport?hash=" + hash, function (data) {
    if (data.status === "completed") {
      //display all datas with images in cards
      var datas = ["dqReport", "dwNoiseReport", "elaReport", "blockingReport"];
      //display 3 images by row
      var row = document.createElement("div");
      row.setAttribute("class", "row");
      for (var i = 0; i < datas.length; ++i) {
        var column = document.createElement("div");
        column.setAttribute("class", "column");
        column.id = datas[i];
        var img = document.createElement("img");
        img.src = data[datas[i]]["map"];
        img.style = "width: 100%; height: auto;";
        column.appendChild(img);
        row.appendChild(column);
      }
      document.getElementById("forensic-place").appendChild(row);
      document.getElementById("forensic-content").style.display = "block";
      document.getElementById("forensic-image").style.display = "block";
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + base_url + "imageforensicsv3/getreport?hash=" + hash);
          console.error(textStatus + ", " + error);
        });
}

/**
* @func send get request to forensic server to process an image
* @video_url the url of the video to process
*/
function send_forensic_video(video_url) {
  //hide precedent result keyframes
  document.getElementById("forensic-content").style.display = "none";
  //hide the precedent error message if there was one
  document.getElementById("error-forensic").style.display ="none";
  //hide the precedent image preview
  document.getElementById("forensic-image").style.display = "none";
  //create url to send video
  var forensic_url = base_url + "imageforensicsv3/addurl?url=" + encodeURIComponent(video_url);
  //start loader
  document.getElementById("loader-forensic").style.display = "block";

  $.getJSON(forensic_url, function(data) {
    if (data.status === "downloaded") {
      document.getElementById("forensic-image").innerHTML = '<img src="' + video_url +
        '" style="width:40%;height:auto;margin:auto;">';
      request_status(data.hash);
    } else if (data.status === "exist") {
      document.getElementById("forensic-image").innerHTML = '<img src="' + video_url +
        '" style="width:40%;height:auto;margin:auto;">';
      display_forensic(data.hash);
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + forensic_url);
          console.error(textStatus + ", " + error);
        });
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