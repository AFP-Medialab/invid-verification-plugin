/* actual possible value are en, fr */
var global_language = "en";
var cookieLang = getCookieLang()
if (cookieLang != "") {
	$(document).ready(updateLanguageText(cookieLang));
}

//add all possible languages
var lang_div = document.getElementById("select-lang");
var keys = Object.keys(json_lang_translate);
for (var i = 0; i < keys.length; ++i) {
	var new_opt = document.createElement("option");
	new_opt.value = keys[i];
	new_opt.text = json_lang_translate[keys[i]]["name"];
	lang_div.add(new_opt);
}

//select current used language
$("#select-lang option[value='" + global_language + "']").attr("selected", "selected");

function updateLanguageText(language) {
	/* update text in html */
	$("[lang='" + global_language + "']").attr("hidden", "hidden");
	$("[lang='" + language + "']").removeAttr("hidden");

	/* update placeholder text */
	for (var input of $("input[placeholder][data-text]")){
		var text = JSON.parse(input.dataset.text);
		input.placeholder = (text[language]) ? text[language] : text["en"];
	}
	/*(function () {
		var textSubmitButton = {
			en: "Submit",
			fr: "Soumettre"
		};
		for (var input of $("input[type='submit']")) {
			var text = JSON.parse(input.dataset.text);
			input.value = (text[language]) ? text[language] : text["en"];
		}
	}).call();*/

	
	global_language = language;
}

$("[name='language']").on("change", function(event) {
	var language = $(this).val();
	if (language != global_language)
	{
		/* update HTML text */
		updateLanguageText(language);
		/* update Analysis table */
		updateTableLanguageAnalysis(language);
		/* update metadata table */
		updateTableLanguageMetadata(language);
		setCookieLang(language);
	}
});

function setCookieLang(lang) {
	var date = new Date();
	date.setTime(date.getTime() + (365 * 24 * 60 * 60 *1000));
	var expires = "expires=" + date.toUTCString();
	document.cookie = "language=" + lang + ";" + expires + ";path=/";
}

function getCookieLang() {
	var cookieString = decodeURIComponent(document.cookie);
	var array = cookieString.split(";");
	for (var cookie of array) {
		var cookieElt = cookie.split("=")
		var index = 0;
		while (cookieElt[0][index] == ' ')
			index++;
		var name = (index > 0) ? cookieElt[0].substring(index) : cookieElt[0];
		if (name == "language")
			return cookieElt[1];
	}
	return "";
}