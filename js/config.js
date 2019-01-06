/**
* Javascript code used to configure the plugin
*/

// Whether plugin is running in production mode or not
var production = false;

/**
* Values of parameters depending of environment
*/
if( production )
{
	// PRODUCTION Params

	// URL where to send feedback data
	var config_feedback_hook_url = "to-do";

	// Google map api key
	var config_google_map_api_key = "to-do";

	// Google analytics key
	var config_google_analytics_key = "to-do";

	// URL of tsv file holding translation strings
	var config_url_csv = "https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/master/InVIDTraductions.tsv"
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
	var config_url_csv = "http://invid.laurent-lacroix.com/InVIDTraductions.tsv";
	// var config_url_csv = "https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/redesign/InVIDTraductions.tsv"
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
