//@user_key for keyframes api
var user_key = "2gzvbfUVUdATyf4ujcnZ8eurEEy8xA2n";

//@base_url where to send all get or post requests
var base_url = "http://multimedia3.iti.gr:8080/";

//@json_table_lang json format of needed translation for display
var  json_table_lang = {
  "error" : {
    "en": {
      "VIDEO_DOWNLOAD_FAILED" : "Video download failed. Try with another video.",
      "VIDEO_DOWNLOAD_TIMEOUT" : "Video download failed. The video download has timed out.",
      "VIDEO_SEGMENTATION_FAILED" : "Video segmentation analysis failed.",
      "VIDEO_SEGMENTATION_ANNOTATION_FAILED" : "Video segmentation analysis failed.",
      "PROCESS_INTERRUPTED" : "Video analysis interrupted due to unknown cause. Please re-submit the video.",
      "ANALYSIS_STOPPED_CORRUPTED_VIDEO_FILE" : "Video analysis quitted due to corrupted video file.",
      "ANALYSIS_STOPPED_UNSUPPORTED_FILE_EXTENSION" : "Video analysis quitted due to unsupported file extension."
    },
    "fr": {
      "VIDEO_DOWNLOAD_FAILED" : "Le téléchargement de la vidéo à échoué. Veuillez essayer avec une autre vidéo.",
      "VIDEO_DOWNLOAD_TIMEOUT" : "Le téléchargement de la vidéo à échoué. La vidéo a mis trop de temps à télécharger.",
      "VIDEO_SEGMENTATION_FAILED" : "L'analyse de segmentation vidéo à échoué.",
      "VIDEO_SEGMENTATION_ANNOTATION_FAILED" : "L'analyse de segmentation vidéo à échoué.",
      "PROCESS_INTERRUPTED" : "L'analyse de la vidéo à été interrompue dû à une cause inconnue. Veuillez ré-envoyer la vidéo.",
      "ANALYSIS_STOPPED_CORRUPTED_VIDEO_FILE" : "L'analyse de la vidéo s'est arrêté dû à des fichiers vidéos corrompus.",
      "ANALYSIS_STOPPED_UNSUPPORTED_FILE_EXTENSION" : "L'analyse de la vidéo s'est arrêté dû à un format vidéo non supporté."
    }
  },
  "wait" : {
    "en" : {
      "VIDEO_WAITING_IN_QUEUE" : "Video in queue for analysis. The analysis of your video will start immediately after all preceding videos in the queue have been processed.",
      "VIDEO_DOWNLOAD_STARTED" : "The video is being downloaded before its analysis.",
      "STARTED" : "Video analysis running. Step "
    },
    "fr" : {
      "VIDEO_WAITING_IN_QUEUE" : "Vidéo en file d'attente pour analyse. L'analyse de votre vidéo commencera immédiatement après que toutes les vidéos précédentes de la file d'attente auront été traitées.",
      "VIDEO_DOWNLOAD_STARTED" : "La vidéo est en train d'être téléchargé avant analyse.",
      "STARTED" : "Analyse de la vidéo en cours. Etape "
    }
  }
}

/**
* @func get the url from the text input and gets back informations needed for display
*/
function submit_form() {
  var url = $("[name=keyframes_url]").val();
  if (url != "") {
    //send video and wait for processed status
    send_keyframe_video(url);
  }
}

/**
* @func set the error message field to the corresponding message error
* @status error tag as string
*/
function error_message(status) {
  //hide wait status display
  document.getElementById("keyframes-wait").setAttribute("style", "display: none");
  document.getElementById("loader-keyframes").style.display = "none";
  //set error messga eand display error field
  var err_field = document.getElementById("error-keyframes");
  err_field.setAttribute("style", "display: block; color: red");
  if (json_table_lang["error"][global_language][status] !== undefined) {
    err_field.innerHTML = json_table_lang["error"][global_language][status];
  } else {
    err_field.innerHTML = "Unknown error occured. Please try again later or with another video.";
  }
}

/**
* @func update the wait message of the html page
* @data the json containing the status, type of process and percentage of work done
* @video_id the id given from base_url json answer
*/
function update_wait(data, video_id) {
  var wait_field = document.getElementById("keyframes-wait");
  var loader_key = document.getElementById("loader-keyframes");
  var json_table_wait = json_table_lang["wait"][global_language];
  loader_key.style.display = "block";
//TODO
  if (data["status"] !== undefined) {
    if (json_table_wait[data["status"]] !== undefined) {
      wait_field.setAttribute("style", "display: block;");
      wait_field.innerHTML = json_table_wait[data["status"]];
    } else if (data["status"].endsWith("STARTED")) {
      wait_field.setAttribute("style", "display: block;");
      wait_field.innerHTML = json_table_wait["STARTED"] + data["step"] + " (" + data["process"] + ") " +
        (data["progress"] == "N/A" ? "" : data["progress"]);
    } 
  } else {
    wait_field.setAttribute("style", "display: none;");
    wait_field.innerHTML = "";
    document.getElementById("loader-keyframes").style.display = "none";
  }
}

/**
* @func parse the response of the get request and send it again every 2s while either process fails or is done
* @data data of the precedent get request
* @url at what adress to send our request
*/
function parse_response(data, url, video_id) {
  //send get requests every 2s to verify status of video process
  if (data["status"].endsWith("COMPLETED")) {
    $.getJSON(base_url + "result/" + video_id + "_json", function(data) {
      update_wait(data, video_id)
      display_result(data);
    }).fail(function(jqxhr, textStatus, error) {
      console.error("start response : " + base_url + "result/" + video_id);
      console.error(textStatus + ", " + error);
    });
  } else if (data["status"].endsWith("QUEUE") || data["status"].endsWith("STARTED")) {
    $.getJSON(url + video_id, function (data) {
      setTimeout(function() {
        update_wait(data, video_id);
        parse_response(data, url, video_id);
      }, 1000);
    }).fail(function(jqxhr, textStatus, error) {
      console.error("start response : " + url + video_id);
      console.error(textStatus + ", " + error);
    });
  } else {
    update_wait(data, video_id)
    error_message(data["status"]);
  }
}

/**
* @func pretty display of results used in data to html page
* @data the json containing all informations needed (including link to thumbnails/keyframes)
*/
function display_result(data) {
  document.getElementById("keyframes-content").style.display = "block";
  var thumbnails_list = [];
  var data_th = data.thumbnails;
  for (var el in data_th) {
    thumbnails_list.push(data_th[el].url);
  }
  //@api.js call to function creating and filling carrousel
  placeImages("keyframes-carrousel", "keyframes-thumbnails", "keyframes-preview", JSON.parse(JSON.stringify(thumbnails_list)));
}

/**
* @func send post and get request to keyframes server to process a video
* @video_url the url of the video to process
*/
function send_keyframe_video(video_url) {
  //post request to send video
  //wait until status change, wait for error
  //if no error translate every info
  //display

  //hide precedent result keyframes
  document.getElementById("keyframes-content").style.display = "none";
  //hide the precedent error message if there was one
  document.getElementById("error-keyframes").setAttribute("style", "display: none");
  //create url to send video
  var annotation_check = document.getElementById("annotation_checkbox").checked;
  var post_url = base_url + "segmentation";
  if (annotation_check)
    post_url += "-annotation";

  //display wait message status
  document.getElementById("keyframes-wait").setAttribute("style", "display: block");
  document.getElementById("loader-keyframes").style.display = "none";
  //send video and wait for response
  $.post(post_url, JSON.stringify({"video_url": video_url, "user_key": user_key}), function (data) {
    var video_id = data["video_id"];
    $.getJSON(base_url + "status/" + video_id, function(data) {
      parse_response(data, base_url + "status/", video_id);
    }).fail(function(jqxhr, textStatus, error) {
      console.error("start response : " + post_url);
      console.error(textStatus + ", " + error);
    });

  }, "json").fail(function(jqxhr, textStatus, error) {
                console.error("start response : " + post_url);
                console.error(textStatus + ", " + error);
            });
}

//add submit function to submit button of the page
var form = document.getElementById("keyframes");
if (form.addEventListener) {
  form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e) {
  e.preventDefault();
});