/**
* Javascript used by keyframes service
*/

// @user_key for keyframes api
var user_key = config_keyframes_user_key;

// @base_url_keyframes where to send all get or post requests
var base_url_keyframes = config_keyframes_base_url;

// variables to stop or continue video status getting when two videos are POST to base_url_keyframes
// @is_analysing true if process of getting get request for a video is on, otherwise false
var is_analysing = false;
// @ask_analyse true if {{is_analysing is true and another video has been submitted}}, otherwise false
var ask_analyse = false;

/**
* @func get the url from the text input and gets back informations needed for display
*/
function submit_form() 
{
	let url = $("[name=keyframes_url]").val();
	url = url.replace("?rel=0", "");
	if( url != "" ) {
		// send video and wait for processed status
		send_keyframe_video(url);
	}
}

/**
* @func set the error message field to the corresponding message error
* @status error tag as string
*/
function error_message(status) 
{
	// hide wait status display
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
function update_wait(data, video_id) 
{
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
			wait_field.innerHTML = json_lang["keyframes_wait_STARTED"] + data["step"] + " (" + data["process"] + ") " + (data["progress"] == "N/A" ? "" : data["progress"]);
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
function parse_response(data, url, video_id) 
{
	// if other video requested, stop asking
	if (ask_analyse) {
		ask_analyse = false;
		is_analysing = false;
		return;
	}
	// set analysing status to true
	is_analysing = true;
	// send get requests every 2s to verify status of video process
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
function display_result(data, video_id) 
{
	document.getElementById("keyframes-content").style.display = "block";
	document.getElementById("error-keyframes").style.display = "none";
	document.getElementById("loader-keyframes").style.display = "none";
	document.getElementById("keyframes-wait").style.display = "none";

	// display of scene keyframes
	let row = document.createElement("div");
	row.setAttribute("class", "row");

	// clean precedent display

	document.getElementById("Keyframe_simple_content").innerHTML = "";
	document.getElementById("Keyframe_datailed_content").innerHTML = "";

	console.log (data.scenes + " et " + data.subshots )

	if( data.scenes && data.scenes.length > 0 )
		segmentation_results(data);

	if (data.subshots && data.subshots.length > 0)
		subshots_results(data);

	// call to @api.js function (l.140)
	// activeThumbnail("keyframes-place");
	// activeThumbnail("keyframes-place2");

	// add the download to download .zip file buttons
	// subshots button
	var shots = document.getElementById("subshots-download");
	shots.href = "http://multimedia2.iti.gr/video_analysis/keyframes/" + video_id + "/Subshots";
}

function subshots_results (data) {
	let scene_keyframe = document.createElement("div");
	scene_keyframe.setAttribute("id", "scene_keyframe");
	scene_keyframe.setAttribute("class", "row");

	let scene_detailed = document.createElement("div");
	scene_detailed.setAttribute("id", "scene_detailed");
	scene_detailed.setAttribute("class", "row");


	for(subshot in data.subshots)
	{
		for (image in data.subshots[subshot].keyframes) {
			let column = document.createElement("div");
			column.setAttribute("class", "column");
			let a = document.createElement("a");
			a.class = "mouse-preview";

			let img = document.createElement("img");
			img.src = data.subshots[subshot].keyframes[image].url + "?dl=0";
			img.style = "width: 100%; height: auto; cursor:pointer; ";
			img.onclick = function () {
				// window.location.href = "/"+page_name+"?img="+this.src;
				reverseImgSearch('google', this.src);
			};
			a.appendChild(img);
			column.appendChild(a);
			scene_detailed.appendChild(column);

			if (image % 2 === 0)
				scene_keyframe.appendChild(column);
		}
	}
	document.getElementById("Keyframe_simple_content").appendChild(scene_detailed);
	document.getElementById("Keyframe_datailed_content").appendChild(scene_keyframe);

}

function segmentation_results (data) {
	let scene_count = data.scenes.length;
	for(scene in data.scenes)
	{
		let scene_keyframe = document.createElement("div");
		scene_keyframe.setAttribute("id", "scene_keyframe");
		scene_keyframe.setAttribute("class", "row");

		let scene_numer = Number(scene) + 1;

		if (scene_count > 1) {
			let scene_title = document.createElement("a");
			scene_title.setAttribute("class", "btn btn-default disabled btn-lg btn-block")
			let title_text = document.createTextNode(json_lang_translate[global_language]["scene_title"] + scene_numer.toString());
			scene_title.appendChild(title_text);
			scene_keyframe.appendChild(scene_title);
		}


		// Keyframes of each scenes
		for(shot in data.scenes[scene].shots) {
			for (image in data.scenes[scene].shots[shot].keyframes) {
				let column = document.createElement("div");
				column.setAttribute("class", "column");
				let a = document.createElement("a");
				a.class = "mouse-preview";

				let img = document.createElement("img");
				img.src = data.scenes[scene].shots[shot].keyframes[image].url + "?dl=0";
				img.style = "width: 100%; height: auto; cursor:pointer; ";
				img.onclick = function () {
					// window.location.href = "/"+page_name+"?img="+this.src;
					reverseImgSearch('google', this.src);
				};
				a.appendChild(img);
				column.appendChild(a);
				scene_keyframe.appendChild(column);
			}
		}
		document.getElementById("Keyframe_simple_content").appendChild(scene_keyframe);

		// shots of each scenes
		let scene_detailed = document.createElement("div");
		scene_detailed.setAttribute("id", "scene_detailed");
		scene_detailed.setAttribute("class", "row");

		if (scene_count > 1) {
			let scene_title2 = document.createElement("a");
			scene_title2.setAttribute("class", "btn btn-default disabled btn-lg btn-block");
			let title_text2 = document.createTextNode(json_lang_translate[global_language]["scene_title"] + scene_numer.toString());
			scene_title2.appendChild(title_text2);
			scene_detailed.appendChild(scene_title2);
			scene_detailed.appendChild(document.createElement("br"));
		}

		for (shot in data.scenes[scene].shots) {
			for (subshot in data.scenes[scene].shots[shot].subshots) {
				for (image in data.scenes[scene].shots[shot].subshots[subshot].keyframes) {
					let column = document.createElement("div");
					column.setAttribute("class", "column");
					let a = document.createElement("a");
					a.class = "mouse-preview";
					let img = document.createElement("img");
					img.src = data.scenes[scene].shots[shot].subshots[subshot].keyframes[image].url + "?dl=0";
					img.style = "width: 100%; height: auto; cursor:pointer; ";
					img.onclick = function () {
						// window.location.href = "/"+page_name+"?img="+this.src;
						reverseImgSearch('google', this.src);
					};
					a.appendChild(img);
					column.appendChild(a);
					scene_detailed.appendChild(column);
				}
			}
		}
		document.getElementById("Keyframe_datailed_content").appendChild(scene_detailed);
	}
}

/**
* @func send post and get request to keyframes server to process a video
* @video_url the url of the video to process
*/
function send_keyframe_video(video_url) 
{
	// post request to send video
	// wait until status change, wait for error
	// if no error translate every info
	// then display

	// hide precedent result keyframes
	document.getElementById("keyframes-content").style.display = "none";
	// hide the precedent error message if there was one
	document.getElementById("error-keyframes").setAttribute("style", "display: none");
	// create url to send video
	let post_url = base_url_keyframes + "subshot";

	// display wait message status
	document.getElementById("keyframes-wait").setAttribute("style", "display: block");
	// show loader display
	document.getElementById("loader-keyframes").style.display = "block";
	// send video and wait for response
	$.post(post_url, JSON.stringify({"video_url": video_url, "user_key": user_key, "overwrite": 0}), function (data) {
	    let video_id = data["video_id"];
		// verify if video not already done process
		$.getJSON(base_url_keyframes + "result/" + video_id + "_json", function(data) {
			// if yes stop process if one and display already computed results
			if (is_analysing) ask_analyse = true;
			setTimeout(function() {
			display_result(data, video_id);
			}, 1100);
		})
		.fail( function(jqxhr, textStatus, error) {
			// else it will throw 404 error Not Found, then ask for video status
			if (error == "Not Found") {
				$.getJSON(base_url_keyframes + "status/" + video_id, function(data) {
				if (is_analysing) ask_analyse = true;
				setTimeout(function() {
					parse_response(data, base_url_keyframes + "status/", video_id);
					}, 1100);
				})
				.fail( function(jqxhr, textStatus, error) {
					console.error("start response : " + post_url);
					console.error(textStatus + ", " + error);
				}); 
			} else {
				console.error("start response : " + post_url);
				console.error(textStatus + ", " + error);
			}
		});
	}, "json")
	.fail( function(jqxhr, textStatus, error) {
		if( textStatus == "error" || error === "Service Unavailable" ) {
			console.error("start response : " + post_url);
			console.error(textStatus + ", " + error);
			error_message("Service Unavailable");
		} else {
			var json_res = jqxhr.responseJSON;
			if( is_analysing ) ask_analyse = true;
			setTimeout(function() {
				parse_response(json_res, base_url_keyframes + "status/", json_res.video_id);
			}, 1100);
		}
	});
}

// add submit function to submit button of the page
var form = document.getElementById("keyframes");
if (form.addEventListener) {
  form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e) {
  e.preventDefault();
});

// add button function for iframe
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

/**
* @func used when we want to call keyframes from url
*/
function callKeyframes(url) 
{
	document.getElementById("keyframes_input").value = url;
	document.getElementById("keyframe_submit").click();
}


/**
 * Toggle detail/Minimal view
 */
$(document).ready(function() {
	$("#Keyframe_title").click(function () {
		if ($("#Keyframe_datailed_content").is(":visible")) {
			$("#Keyframe_datailed_content").hide();
			$("#Keyframe_simple_content").show();
			setInnerHtml("Keyframe_title", json_lang_translate[global_language]["keyframe_title_get_detail"]);
		}
		else {
			$("#Keyframe_simple_content").hide();
			$("#Keyframe_datailed_content").show();
			setInnerHtml("Keyframe_title", json_lang_translate[global_language]["keyframe_title_get_simple"]);
		}
	});
});