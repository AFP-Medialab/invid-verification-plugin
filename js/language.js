/**
* Management of current language and update of translated elements
*/

// Determinate current language (en, fr) and init interface texts
var global_language = "en";
var cookieLang = getCookieLang()
if( cookieLang != "" ) {
	$(document).ready( updateLanguageText( cookieLang ) );
}
updateAllTranslations( global_language );

/**
* @func init all interface translations 
* @language wanted language code (fr, en)
*/
function updateAllTranslations( language )
{
	update_navbar(language);
	update_tools_menu(language);
	update_third_parties_menu(language);
	update_submit(language);
	update_api(language);
	update_keyframes(language);
	update_thumbnails(language);
	update_twitter(language);
	update_magnifier(language);
	update_metadata(language);
	update_copyright(language);
	update_forensic(language);
	update_about(language);
	update_tuto(language);
	update_classroom(language);
}

/**
* @func update language texts
* @language wanted language code (fr, en)
*/
function updateLanguageText(language) 
{
	// hides old language elements and shows current language elements
	$("[lang='" + global_language + "']").attr("hidden", "hidden");
	$("[lang='" + language + "']").removeAttr("hidden");
	// update placeholders of elements
	for (var input of $("input[placeholder][data-text]")){
		var text = JSON.parse(input.dataset.text);
		input.placeholder = (text[language]) ? text[language] : text["en"];
	}
	// Store new language in global
	global_language = language;
}

/**
* @func place current language in a cookie
* @lang wanted language code (fr, en)
*/
function setCookieLang(lang) 
{
	var date = new Date();
	date.setTime( date.getTime() + (365 * 24 * 60 * 60 * 1000) );
	var expires = "expires=" + date.toUTCString();
	document.cookie = "language=" + lang + ";" + expires + ";path=/;";
}

/**
* @func return value of the cookie holding current language
*/
function getCookieLang() {
	var cookieString = decodeURIComponent(document.cookie);
	var array = cookieString.split(";");
	for( var cookie of array ) {
		var cookieElt = cookie.split("=")
		var index = 0;
		while( cookieElt[0][index] == ' ' ) index++;
		var name = (index > 0) ? cookieElt[0].substring(index) : cookieElt[0];
		if( name == "language" ) return cookieElt[1];
	}
	return "";
}