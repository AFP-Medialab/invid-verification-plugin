//@user_key for keyframes api
var user_key = "2gzvbfUVUdATyf4ujcnZ8eurEEy8xA2n";

//@base_url where to send all get or post requests
var base_url = "http://multimedia3.iti.gr:8080/";

//variables to stop or continue video status getting when two videos are POST to base_url
//@is_analysing true if process of getting get request for a video is on, otherwise false
var is_analysing = false;
//@ask_analyse true if {{is_analysing is true and another video has been submitted}}, otherwise false
var ask_analyse = false;

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
      "ANALYSIS_STOPPED_UNSUPPORTED_FILE_EXTENSION" : "Video analysis quitted due to unsupported file extension.",
      "CONFLICT" : "The video is already being processed by this user."
    },
    "fr": {
      "VIDEO_DOWNLOAD_FAILED" : "Le téléchargement de la vidéo à échoué. Veuillez essayer avec une autre vidéo.",
      "VIDEO_DOWNLOAD_TIMEOUT" : "Le téléchargement de la vidéo à échoué. La vidéo a mis trop de temps à télécharger.",
      "VIDEO_SEGMENTATION_FAILED" : "L'analyse de segmentation vidéo à échoué.",
      "VIDEO_SEGMENTATION_ANNOTATION_FAILED" : "L'analyse de segmentation vidéo à échoué.",
      "PROCESS_INTERRUPTED" : "L'analyse de la vidéo à été interrompue dû à une cause inconnue. Veuillez ré-envoyer la vidéo.",
      "ANALYSIS_STOPPED_CORRUPTED_VIDEO_FILE" : "L'analyse de la vidéo s'est arrêté dû à des fichiers vidéos corrompus.",
      "ANALYSIS_STOPPED_UNSUPPORTED_FILE_EXTENSION" : "L'analyse de la vidéo s'est arrêté dû à un format vidéo non supporté.",
      "CONFLICT" : "La vidéo est déjà en analyse par cet utilisateur."
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
* @video_id the given identifier for the video given through json answered
*/
function parse_response(data, url, video_id) {
  //if other video requested, stop asking
  if (ask_analyse) {
    ask_analyse = false;
    is_analysing = false;
    return;
  }
  //set analysing status to true
  is_analysing = true;
  //send get requests every 2s to verify status of video process
  if (data["status"].endsWith("COMPLETED")) {
    $.getJSON(base_url + "result/" + video_id + "_json", function(data) {
      update_wait(data, video_id)
      display_result(data, video_id);
      is_analysing = false;
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
* @video_id the given identifier for the video given through json answered
*/
function display_result(data, video_id) {
  console.log(data);
  //display or hide elements we need
  document.getElementById("keyframes-content").style.display = "block";
  var key_cont = document.getElementById("keyframes-place");
  var key_cont2 = document.getElementById("keyframes-place2");
  document.getElementById("error-keyframes").style.display = "none";
  key_cont.style.display = "block";
  key_cont2.style.display = "block";
  //clear precedent display
  key_cont.innerHTML = "";
  key_cont2.innerHTML = "";

  //creation of rows and columns (css style) to display 3 images by row
  var row = document.createElement("div");
  row.setAttribute("class", "row");

  //display of thumbnails
  for (el in data.thumbnails) {  
    var column = document.createElement("div");
    column.setAttribute("class", "column");
    var a = document.createElement("a");
    //to redirect to magnifier on click (for activeThumbnail function)
    a.href = "#magnifier";
    a.class = "mouse-preview";
    var img = document.createElement("img");
    img.src = data.thumbnails[el].url;
    img.style = "width: 100%; height: auto;";
    a.appendChild(img);
    column.appendChild(a);
    row.appendChild(column);
  }
  key_cont.appendChild(row);

  //display of scene keyframes
  var row2 = document.createElement("div");
  //TODO

  //call to @api.js function (l.140)
  activeThumbnail("keyframes-place");
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
    //verify if video not already done process
    $.getJSON(base_url + "result/" + video_id + "_json", function(data) {
      //if yes display already computed results
      display_result(data, video_id);
    }).fail(function(jqxhr, textStatus, error) {
      //else it will throw 404 error Not Found, then ask for video status
      if (error == "Not Found") {
        $.getJSON(base_url + "status/" + video_id, function(data) {
          if (!is_analysing) {
            parse_response(data, base_url + "status/", video_id);
          } else {
            ask_analyse = true;
            setTimeout(function() {
              parse_response(data, base_url + "status/", video_id);
            }, 1100);
          }
        }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + post_url);
          console.error(textStatus + ", " + error);
        }); 
      } else {
        console.error("start response : " + post_url);
        console.error(textStatus + ", " + error);
      }
    });
    }, "json").fail(function(jqxhr, textStatus, error) {
                  if (error !== "Conflict") {
                    console.error("start response : " + post_url);
                    console.error(textStatus + ", " + error);
                  } else {
                    error_message("CONFLICT");
                  }
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