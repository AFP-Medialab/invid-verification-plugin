//@base_url where to send all get or post requests
var base_url = "http://reveal-mklab.iti.gr/";

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