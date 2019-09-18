/**
* Javascript used by twitter service
*/
import generateQuery from './call-elastic.js';
/**
* @func Convert date into epoch time
*/
function convertToEpoch(date)
{
	var epoch = new Date(date);
	if( document.getElementById('gmt').checked ) {
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

/**
* @func Replace all occurence of find String by replace String in str String
*/
function replaceAll(str, find, replace) 
{
	return str.replace( new RegExp(find, 'g'), replace );
}

/**
* @func Create the url
*/
function create_url(term, account, filter, lang, geocode, near, within, from_date, to_date)
{
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
	// twitter_url = twitter_url + "&src=typd"
	return twitter_url;
}

/**
* @func Submit search form
*/
function submit_form()
{
	var term = document.getElementById("termbox").value;
	var account = document.getElementById("tw-account").value;
	var filter = document.getElementById("filter").value;
	var lang = document.getElementById("lang").value;
	var geocode = document.getElementById("geocode").value;
	var near = document.getElementById("near").value;
	var within = document.getElementById("within").value;
	var from_date = document.getElementById("from-date").value;
	var to_date = document.getElementById("to-date").value;
	if( ! (term=="" && account=="" && filter=="" && lang=="" && geocode=="" && near=="" && from_date=="" && to_date=="") ) {
		var url = create_url(term, account, filter, lang, geocode, near, within, from_date, to_date);
		ga('send', 'event', 'Url_provided', 'submit', url);
		openTab(url);
	}
}

/* Add form submit listener */
var form = document.getElementById("twitter_form");
if(form){

	form.addEventListener("submit", submit_form, false);
	form.addEventListener("submit", function(e){
		e.preventDefault();
	});
}


/* Details button listener */
function generate_pie_chart(svg_id, json, title, low_color, hight_color)
{
	let svg = d3.select(svg_id),
		width = svg.attr("width"),
		height = svg.attr("height"),
		radius = Math.min(width, height) / 2;

	let g = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	let N = json.length;
	let greenRange = [low_color, hight_color];
	let color = d3.scaleLinear().domain([0, N])
		.range(greenRange);

	var pie = d3.pie().value(function(d) {
		return d.doc_count;
	});

	var path = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var label = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius - 80);

		let data = json;

		let arc = g.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

		arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) {
				let key_nb = 0;
				for (let i = 0; i < json.length; i++)
					if (json[i].key === d.data.key)
						key_nb = N - i;
				return color(key_nb);
			});

		var getAngle = function (d) {
			return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
		};

		arc.append("text")
			.attr("transform", function(d) {
				return "translate(" + path.centroid(d) + ") " +
					"rotate(" + getAngle(d) + ")"; })
			.attr("dy", 5)
			.style("text-anchor", "start")
			.text(function(d) { return d.data.key; })
			.style("fill", "#3a3a3a");

}

let pie_chart_json = [
	{
		key: "webissimo",
		doc_count: 95
	},
	{
		key: "ActuSuisse",
		doc_count: 75
	}
	,
	{
		key: "jeanlg75",
		doc_count: 61
	}
	,
	{
		key: "wixoo_fr",
		doc_count: 56
	}
	,
	{
		key: "alain46551486",
		doc_count: 53
	}
	,
	{
		key: "IkanNews",
		doc_count: 43
	}
	,
	{
		key: "Melinda_B",
		doc_count: 33
	}
	,
	{
		key: "Sissi_Lys",
		doc_count: 27
	}
	,
	{
		key: "bouche_bee",
		doc_count: 24
	}
	,
	{
		key: "kekinladanMcf",
		doc_count: 24
	}
];

//var json = pie_chart_json;
generateQuery("sess-080f5dae-f7f1-499f-abba-7c34cb7b63dc").then((respJson) =>{
let histogram_json

	generate_pie_chart("#top_users_pie_chart", respJson, "Top Users", '#98f6ef', '#6db3ac');
})
/* Add dates picker facility */
$(document).ready( function() {
	$( "#from-date" ).datetimepicker();
	$( "#to-date" ).datetimepicker();
});