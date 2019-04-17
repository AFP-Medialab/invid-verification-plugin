//@user_key for keyframes api
var user_key = "2gzvbfUVUdATyf4ujcnZ8eurEEy8xA2n";

//@base_url_keyframes where to send all get or post requests
var base_url_keyframes = "http://multimedia2.iti.gr/video_analysis/";

//variables to stop or continue video status getting when two videos are POST to base_url_keyframes
//@is_analysing true if process of getting get request for a video is on, otherwise false
var is_analysing = false;
//@ask_analyse true if {{is_analysing is true and another video has been submitted}}, otherwise false
var ask_analyse = false;

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
  if (json_lang_translate[global_language]["keyframes_error_" + status] !== undefined) {
    err_field.innerHTML = json_lang_translate[global_language]["keyframes_error_" + status];
  } else {
    err_field.innerHTML = json_lang_translate[global_language]["keyframes_error_default"];
  }
}

/**
* @func update the wait message of the html page
* @data the json containing the status, type of process and percentage of work done
* @video_id the id given from base_url_keyframes json answer
*/
function update_wait(data, video_id) {
  var wait_field = document.getElementById("keyframes-wait");
  var loader_key = document.getElementById("loader-keyframes");
  var json_lang = json_lang_translate[global_language];
  loader_key.style.display = "block";

  if (data["status"] !== undefined) {
    if (json_lang["keyframes_wait_" + data["status"]] !== undefined) {
      wait_field.setAttribute("style", "display: block;");
      wait_field.innerHTML = json_lang["keyframes_wait_" + data["status"]];
    } else if (data["status"].endsWith("STARTED")) {
      wait_field.setAttribute("style", "display: block;");
      wait_field.innerHTML = json_lang["keyframes_wait_STARTED"] + data["step"] + " (" + data["process"] + ") " +
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
    $.getJSON(base_url_keyframes + "result/" + video_id + "_json", function(data) {
      update_wait(data, video_id)
      display_result(data, video_id);
      is_analysing = false;
    }).fail(function(jqxhr, textStatus, error) {
      console.error("start response : " + base_url_keyframes + "result/" + video_id);
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
  //display or hide elements we need
  document.getElementById("keyframes-content").style.display = "block";
  var key_cont = document.getElementById("keyframes-place");
  var panel_shot = document.getElementById("panel-shots");
  document.getElementById("error-keyframes").style.display = "none";
  document.getElementById("loader-keyframes").style.display = "none";
  document.getElementById("keyframes-wait").style.display = "none";
  key_cont.style.display = "block";
  //clear precedent display
  key_cont.innerHTML = "";
  panel_shot.innerHTML = "";

  //creation of rows and columns (css style) to display 3 images by row
  //display of scene keyframes
  var row = document.createElement("div");
  row.setAttribute("class", "row");

  for (sc in data.subshots) {
    var column = document.createElement("div");
    column.setAttribute("class", "column");
    var a = document.createElement("a");
    a.class = "mouse-preview";
    var img = document.createElement("img");
    img.src = data.subshots[sc].keyframes[1].url + "?dl=0";
    img.style = "width: 100%; height: auto; cursor: pointer;";
    img.onclick = function () {
      reverseImgSearch('google', this.src);
    };

    a.appendChild(img);
    column.appendChild(a);
    row.appendChild(column);
    key_cont.appendChild(row);
  }

  //load and put every shots under accordion
  var row2 = document.createElement("div");
  row2.setAttribute("class", "row");

  for (sc in data.subshots) {
    for (kf in data.subshots[sc].keyframes) {
      if (kf != 1) {
        var column2 = document.createElement("div");
        column2.setAttribute("class", "column");
        var a = document.createElement("a");
        a.class = "mouse-preview";
        var img = document.createElement("img");
        img.src = data.subshots[sc].keyframes[kf].url + "?dl=0";
        img.style = "width: 100%; height: auto; cursor: pointer;"
        img.onclick = function () {
          reverseImgSearch('google', this.src);
        };

        a.appendChild(img);
        column2.appendChild(a);
        row2.appendChild(column2);
        panel_shot.appendChild(row2);
      }
    }
  }

  //add the download to download .zip file buttons
  //subshots button
  var shots = document.getElementById("subshots-download");
  shots.href = "http://multimedia2.iti.gr/video_analysis/keyframes/" + video_id + "/Subshots";
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
  var post_url = base_url_keyframes + "subshot";

  //display wait message status
  document.getElementById("keyframes-wait").setAttribute("style", "display: block");
  //show loader display
  document.getElementById("loader-keyframes").style.display = "block";
  //send video and wait for response
  $.post(post_url, JSON.stringify({"video_url": video_url, "user_key": user_key, "overwrite": 0}), function (data) {
    var video_id = data["video_id"];
    //verify if video not already done process
    $.getJSON(base_url_keyframes + "result/" + video_id + "_json", function(data) {
      //if yes stop process if one and display already computed results
      if (is_analysing) {
        ask_analyse = true;
      }
      setTimeout(function() {
        display_result(data, video_id);
      }, 1100);
    }).fail(function(jqxhr, textStatus, error) {
      //else it will throw 404 error Not Found, then ask for video status
      if (error == "Not Found") {
        $.getJSON(base_url_keyframes + "status/" + video_id, function(data) {
          if (is_analysing) {
            ask_analyse = true;
          }
          setTimeout(function() {
            parse_response(data, base_url_keyframes + "status/", video_id);
          }, 1100);
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
                  if (error === "Service Unavailable") {
                    console.error("start response : " + post_url);
                    console.error(textStatus + ", " + error);
                    error_message("unavailable");
                  } else {
                    var json_res = jqxhr.responseJSON;
                    if (is_analysing) {
                      ask_analyse = true;
                    }
                    setTimeout(function() {
                      parse_response(json_res, base_url_keyframes + "status/", json_res.video_id);
                    }, 1100);
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