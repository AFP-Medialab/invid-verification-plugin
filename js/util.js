/**
* Javascript defining some global tools functions
*/

/**
* @func Open the list of image provided with the good engine in new tabs. The value for type are the fields of the urls object 
*/
function reverseImgSearch(type, imgUrls) 
{
	var urls = {
		baidu: {
			search: "https://image.baidu.com/n/pc_search?queryImageUrl="
		},
		bing: {
			search: "https://www.bing.com/images/search?q=imgurl:",
			end: "&view=detailv2&iss=sbi"
		},
		google: {
			search: "https://www.google.com/searchbyimage?image_url="
		},
		tineye: {
			search: "https://www.tineye.com/search?url="
		},
		yandex: {
			search: "https://yandex.com/images/search?url=",
			end: "&rpt=imageview"
		}
	}
	if( typeof imgUrls === "string" ) imgUrls = [imgUrls];
	var begin = urls[type].search;
	var end = ( urls[type].end !== undefined ? urls[type].end : "" );
	var tabs = []
	for( var image_url of imgUrls ) {
		tabs.push( begin + image_url + end );
	}
	openTab( tabs );
}

/**
* @func Open a tab with compatibility between different browser. If backgroud is true, open tab whitout redirected the user to it 
*/
function openTab(urls, backgroud) 
{
	if (typeof urls === "string") urls = [urls];
	for( var query of urls ) {
		if( window.chrome !== undefined && chrome.tabs !== undefined ) {
			chrome.tabs.create( {url: query} );
		} else if( window.safari !== undefined && safari.self.tab !== undefined ) {
			safari.self.tab.dispatchMessage( "openTabs", urls, backgroud );
			break;
		} else {
			window.open( query );
		}
	}
}

/**
* @func Format the youtube url to https://www.youtube.com/watch?v=ID. If the url is invalid or the id is not present return "" 
*/
function getYtUrl(url) 
{
	const yt_result = "https://www.youtube.com/watch?v=";
	var urlObject = null;
	try {
		urlObject = new URL(url);
	} catch (e) {
		return "";
	}
	var id = getYtIdFromURLObject(urlObject);
	if (id == "") return "";
	return yt_result + id;
}

/**
* @func getYtIdFromURLObject
*/
function getYtIdFromURLObject(urlObject) 
{
	var id = "";
	switch (urlObject.hostname) { 
		case "www.youtube.com":
			var pathname = urlObject.pathname;
			if (pathname == "/watch") {
				if (urlObject.searchParams) {
					id = urlObject.searchParams.get('v');
				} else {
					var params = urlObject.search.substring(1).split('&');
					for( var param of params ) {
						var key_value = param.split("=");
						if (key_value[0] == "v") {
							id = key_value[1];
							break;
						}
					}
				}
			} else if( pathname.match(/\/v\/*/) ) {
				id = pathname.substring(3);
			} else if( pathname.match(/embed\/*/) ) {
				id = pathname.substring("/embed/".length);
			}
			break;
		case "youtu.be":
			id = urlObject.pathname.substring(1);
			break;
	}
	return id;
}

/**
* @func getYtIdFromUrlString
*/
function getYtIdFromUrlString(url) 
{
	var id = "";
	var start_url = "https://www.youtube.com";
	var start_url_short = "https://youtu.be";
	if( url.startsWith(start_url) ) {
		path = url.substring(start_url.length);
		if( path.match(/\/watch\?/) ) {
			id = url.match(/v=([^&]+)/)[1];
		} else if( path.match(/\/v\//) || url.match(/\/embed\/(.*)/) ) {
			id = url.substring(url.lastIndexOf("/") + 1);
		}
	}
	else if( url.startsWith(start_url_short) ) {
		id = url.substring(url.lastIndexOf("/") + 1);
	}
	return id;
}

/**
* @func isYtUrl
*/
function isYtUrl(url) 
{
	var start_url = "https://www.youtube.com/";
	var start_url_short = "https://youtu.be/";
	return url.startsWith( start_url ) || url.startsWith( start_url_short );
}

/**
* @func Build the url for the image from the url given :
*	- drive.google.com/file/d/(.*)/view?usp=sharing
*	- www.dropbox.com
* @return Url given if no pattern match
*/
function get_real_url_img(url)
{
	var regex_drive = /https:\/\/drive\.google\.com\/file\/d\/(.*)\/view\?usp=sharing/i;
	if( regex_drive.test(url) ) {
		url = "https://drive.google.com/uc?id=" + regex_drive.exec(url)[1];
	} else if( /^https:\/\/www.dropbox.com\//i.test(url) ) {
		url = url.replace(/:\/\/www./, "://dl.");
	}
	return url;
}

/**
* @func update the titles of a table (th)
* @tableId id of table
* @titles titles to set
*/
function updateTitleTable(tableId, titles) 
{
	var listTitle = $("#" + tableId).find("th");
	for( var i = 0; i < listTitle.length; i++ ) {
		listTitle[i].innerHTML = titles[i];
	}
}

/**
* @func create span of html given
* @html given html (string)
*/
function addSpan(html) 
{
	return "<span>" + html + "</span>";
}


/**
* @func clean element by id 
* @id given id
*/
function cleanElement(id)
{
    var div = document.getElementById(id);
    if( ! div ) return;
    while( div.hasChildNodes() ) {
        div.removeChild( div.firstChild );
    }
}

/**
* @func clean whole element of given existing id
* @id given id
*/
function cleanId(id) 
{
	setInnerHtml( id, "" );
}

/**
* @func fill a div with some html, if the id correspond to a valid div
* @id div id
* @html div content
*/
function setInnerHtml( id, html ) 
{
	var div = document.getElementById(id);
	if( ! div ) return;
	div.innerHTML = html;
}

/**
* @func set the placeholder of a div with a content, if the id correspond to a valid div
* @id div id
* @placeholder div placeholder
*/
function setPlaceholder( id, placeholder ) 
{
	var div = document.getElementById(id);
	if( ! div ) return;
	div.placeholder = placeholder;
}

/**
* @func set the title of an element with a text, if the id correspond to a valid div
* @id div id
* @title div title
*/
function setTitle( id, title ) 
{
	var div = document.getElementById(id);
	if( ! div ) return;
	div.title = title;
}

/**
* @func set the value of a data-* attribute of an element
* @id div id
* @attr attribute to set
* @title attribute value
*/
function setAttribute( id, attr, value ) 
{
	var elt = document.getElementById(id);
	if( ! elt ) return;
	if( attr == "" || value == undefined ) return;
	elt.setAttribute( "data-"+attr, value );
}

/**
* @func Add a link to the dom element. If content is null, url is used 
*/
function appendLink(dom, url, content) 
{
	var a = document.createElement("a");
	a.setAttribute("href", url);
	if ( ! content ) content = url;
	a.innerHTML = content;
	dom.appendChild(a);
}

/**
* @func Simulate Ctrl+C 
*/
function copyText(text) 
{
    var textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    textarea.style.rows = "1";
    textarea.style.cols = "1";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

/**
* @func Get source content of a page synchronously 
*/
function get_page(url) 
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	return xhr.responseText;
};

/**
* @func Create a row for a html5 table 
*/
function makeRowTable(header, content) 
{
	var tr = document.createElement("tr");
	var th = document.createElement("th");
	var td = document.createElement("td");
	th.innerHTML = header;
	td.innerHTML = content;
	tr.appendChild(th);
	tr.appendChild(td);
	return tr;
}

/**
* @func Get and url returning an xml content 
*/
function getXml(url) 
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	return xhr.responseXML;
}

/**
* @func Calculate the height ratio of a 100% width iframe using its original width and height
*/
function calculateIFrameHeightRatio( iframe )
{
	if( iframe == "" ) return 0;
	var l = "", r = "", w = 0, h = 0;
	// Retrieve width
	l = iframe.split('width="');
	r = l[1].split('"');
	w = r[0];
	// Retrieve height
	l = iframe.split('height="');
	r = l[1].split('"');
	h = r[0];
	// Calculate ratio
	if( w == 0 ) return 0;
	return 100 * h / w;
}
