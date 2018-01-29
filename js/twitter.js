//convert date into epoch time
function convertToEpoch(date){
	var epoch = new Date(date);
	if (document.getElementById('gmt').checked) {
		epoch = new Date(Date.UTC(
			epoch.getFullYear(),
			epoch.getMonth(),
			epoch.getDate(),
			epoch.getHours(),
			epoch.getMinutes()
			));
	}
	epoch = epoch.getTime()/1000;
	return epoch;

}

//Replace all occurence of find String by replace String in str String
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//Create the url
function create_url(term, account, filter, lang, geocode, near, within, from_date, to_date){
	var twitter_url = "https://twitter.com/search?f=tweets&q="
	twitter_url = twitter_url +  replaceAll(term, "#", "%23");
	if (account != ""){
		twitter_url += "%20from:" + account;
	}
	if (filter != ""){
		twitter_url += "%20filter:" + filter;
	}
	if (lang != ""){
		twitter_url += "%20lang:" + lang;
	}
	if (geocode != ""){
		twitter_url +=  "%20geocode:" + geocode;
	}
	if (near != ""){
		twitter_url += "%20near:" + near;
		if (within != "") {
			twitter_url += "%20within:" + within;
		}
	}
	if (from_date != ""){
		var epoch = convertToEpoch(from_date);
		twitter_url += "%20since%3A" + epoch;
	}
	if (to_date) {
		var epoch = convertToEpoch(to_date);
		twitter_url += "%20until%3A" + epoch;
	}
	//twitter_url = twitter_url + "&src=typd"
	return twitter_url;
}

function submit_form(){
	var term = document.getElementById("termbox").value;
	var account = document.getElementById("tw-account").value;
	var filter = document.getElementById("filter").value;
	var lang = document.getElementById("lang").value;
	var geocode = document.getElementById("geocode").value;
	var near = document.getElementById("near").value;
	var within = document.getElementById("within").value;
	var from_date = document.getElementById("from-date").value;
	var to_date = document.getElementById("to-date").value;
	if (!(term==""&&account==""&&filter==""&&lang==""&&geocode==""&&near==""&&from_date==""&&to_date=="")) {
		var url = create_url(term, account, filter, lang, geocode, near, within, from_date, to_date);
		ga('send', 'event', 'Url_provided', 'submit', url);
		openTab(url);
	}
}

var form = document.getElementById("twitter_form");
if (form.addEventListener){
	form.addEventListener("submit", submit_form, false);
}

form.addEventListener("submit", function(e){
	e.preventDefault();
});

$(document).ready(function(){
	$( "#from-date" ).datetimepicker();
});

$(document).ready(function(){
	$( "#to-date" ).datetimepicker();
});
