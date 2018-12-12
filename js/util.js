/* Open the list of image provided with the good engine in new tabs */
/* The value for type are the fields of the urls object */
function reverseImgSearch(type, imgUrls) {
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
	if (typeof imgUrls === "string")
		imgUrls = [imgUrls];
	var begin = urls[type].search;
	var end = (urls[type].end !== undefined) ? urls[type].end : "";
	var tabs = []
	for (var image_url of imgUrls)
		tabs.push(begin + image_url + end);
	openTab(tabs);
}

/* open a tab with compatibility between different browser */
/* If backgroud is true, open tab whitout redirected the user to it */
function openTab(urls, backgroud) {
	if (typeof urls === "string")
		urls = [urls];
	for (var query of urls) {
		if (window.chrome !== undefined && chrome.tabs !== undefined)
			chrome.tabs.create({url: query});
		else if (window.safari !== undefined && safari.self.tab !== undefined) {
			safari.self.tab.dispatchMessage("openTabs", urls, backgroud);
			break;
		}
		else
			window.open(query);
	}
}

/* Format the youtube url to https://www.youtube.com/watch?v=ID */
/* If the url is invalid or the id is not present return "" */
function getYtUrl(url) {
	const yt_result = "https://www.youtube.com/watch?v=";
	var urlObject = null;
	try {
		urlObject = new URL(url);
	}
	catch (e) {
		return "";
	}
	var id = getYtIdFromURLObject(urlObject);
	if (id == "")
		return "";
	return yt_result + id;
}

function getYtIdFromURLObject(urlObject) {
	var id = "";
	switch (urlObject.hostname) { 
		case "www.youtube.com":
			var pathname = urlObject.pathname;
			if (pathname == "/watch")
			{
				if (urlObject.searchParams)
					id = urlObject.searchParams.get('v');
				else
				{
					var params = urlObject.search.substring(1).split('&');
					for (var param of params)
					{
						var key_value = param.split("=");
						if (key_value[0] == "v")
						{
							id = key_value[1];
							break;
						}
					}
				}
			}
			else if (pathname.match(/\/v\/*/))
				id = pathname.substring(3);
			else if (pathname.match(/embed\/*/))
				id = pathname.substring("/embed/".length);
			break;
		case "youtu.be":
			id = urlObject.pathname.substring(1);
			break;
	}
	return id;
}

function getYtIdFromUrlString(url) {
	var id = "";
	var start_url = "https://www.youtube.com";
	var start_url_short = "https://youtu.be";
	if (url.startsWith(start_url))
	{
		path = url.substring(start_url.length);
		if (path.match(/\/watch\?/))
			id = url.match(/v=([^&]+)/)[1];
		else if (path.match(/\/v\//) || url.match(/\/embed\/(.*)/))
			id = url.substring(url.lastIndexOf("/") + 1);
	}
	else if (url.startsWith(start_url_short))
		id = url.substring(url.lastIndexOf("/") + 1);
	return id;
}

function isYtUrl(url) {
	var start_url = "https://www.youtube.com/";
	var start_url_short = "https://youtu.be/";
	return url.startsWith(start_url) || url.startsWith(start_url_short);
}

/* Build the url for the image from the url given :
/* - drive.google.com/file/d/(.*)/view?usp=sharing
/* - www.dropbox.com/* 
/* return the url given if no pattern match*/
function get_real_url_img(url)
{
	var regex_drive = /https:\/\/drive\.google\.com\/file\/d\/(.*)\/view\?usp=sharing/i;
	if (regex_drive.test(url))
		url = "https://drive.google.com/uc?id=" + regex_drive.exec(url)[1];
	else if (/^https:\/\/www.dropbox.com\//i.test(url))
		url = url.replace(/:\/\/www./, "://dl.");
	return url;
}

/* Update the title of a table */
function updateTitleTable(tableId, titles) {
	var listTitle = $("#" + tableId).find("th");
	for (var i = 0; i < listTitle.length; i++) {
		listTitle[i].innerHTML = titles[i];
	}
}

/**
* @func create span of html given
* @html given html (string)
*/
function addSpan(html) {
	return "<span>" + html + "</span>";
}

/* Clean element by id */
function cleanElement(id){
    var div = document.getElementById(id);
    if (!div)
    	return;
    /* Clear content*/
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
}

/**
* @func clean whole element of given id
* @id given id
*/
function cleanId(id) {
	var div = document.getElementById(id);
	div.innerHTML = "";
}

/* Add a link to the dom element */
/* If content is null, url is used */
function appendLink(dom, url, content) {
	var a = document.createElement("a");
	a.setAttribute("href", url);
	if (!content)
		content = url;
	a.innerHTML = content;
	dom.appendChild(a);
}

/* Simulate Ctrl+C */
function copyText(text) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    textarea.style.rows = "1";
    textarea.style.cols = "1";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

/* Get source content of a page synchronously */
function get_page(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	return xhr.responseText;
};

/* Create a row for a html5 table*/
function makeRowTable(header, content) {
	var tr = document.createElement("tr");
	var th = document.createElement("th");
	var td = document.createElement("td");
	th.innerHTML = header;
	td.innerHTML = content;
	tr.appendChild(th);
	tr.appendChild(td);
	return tr;
}

function getXml(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	return xhr.responseXML;
}