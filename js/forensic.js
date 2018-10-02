//@base_url where to send all get or post requests
var base_url = "http://reveal-mklab.iti.gr/";

/**
* @func request loop to get status until process done
* @hash used to retrieve the video reports
*/
function request_status(hash) {
  $.getJSON(base_url + "imageforensicsv2/generatereport?hash=" + hash, function (data) {
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
          console.error("start response : " + post_url);
          console.error(textStatus + ", " + error);
        });
}

/**
* @func displays on the error field the corresponding error message
* @data json answered after get, contains status field
*/
function display_error(data) {

}

/**
* @func display the results of forensic api
* @hash used to retrieve the video reports
*/
function display_forensic(hash) {

}

/**
* @func send get request to forensic server to process a video
* @video_url the url of the video to process
*/
function send_forensic_video(video_url) {
  //hide precedent result keyframes
  document.getElementById("forensic-content").style.display = "none";
  //hide the precedent error message if there was one
  document.getElementById("error-forensic").setAttribute("style", "display: none");
  //create url to send video
  var forensic_url = base_url + "imageforensicsv2/addurl?url=" + encodeURIComponent(video_url);
  console.log(forensic_url);
  $.getJSON(forensic_url, function(data) {
    if (data.status === "downloaded") {
      request_status(data.hash);
    } else if (data.status === "exist") {
      display_forensic(data.hash);
    } else {
      display_error(data);
    }
  }).fail(function(jqxhr, textStatus, error) {
          console.error("start response : " + post_url);
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