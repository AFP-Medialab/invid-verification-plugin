/**
* Javascript code used to configure the plugin
*/

// Whether plugin is running in production mode or not
var production = false;

// Main page name (to be added in manifest.json and menu.js too)
var url_parser = document.createElement("a");
url_parser.href = window.location.href;
var tmp = url_parser.pathname.split("/");
var page_name = tmp[tmp.length-1];

// Number of quiz allowed in TSV file
var config_quiz_max_items = 10;

/**
* Values of parameters depending of environment
*/
if( production )
{
	// PRODUCTION Params

	// URL where to send feedback data
	var config_feedback_hook_url = "to-do";

	// Google map api key
	var config_google_map_api_key = "deprecated";

	// Google analytics key
	var config_google_analytics_key = "to-do";

	// URL of tsv file holding translation strings
	var config_url_csv = "https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/v0.72/InVIDTraductions.tsv"
}
else
{
	// DEVELOPMENT Params

	// URL where to send feedback data
	var config_feedback_hook_url = "#";

	// Google map api key
	var config_google_map_api_key = "";

	// Google analytics key
	var config_google_analytics_key = "UA-XXXXXXXX-Y";

	// URL of tsv file holding translation strings
	var config_url_csv = "../InVIDTraductions.tsv"
}

/**
* Values of parameters fixed whatever environment is running
*/
if( true )
{
	// Keyframes user key
	var config_keyframes_user_key = "2gzvbfUVUdATyf4ujcnZ8eurEEy8xA2n";

	// Keyframes base url
	var config_keyframes_base_url = "http://multimedia2.iti.gr/video_analysis/";
}
