function get_images(url){
	var video_id = url.split('v=')[1].split('&')[0];
	var img_url = "http://img.youtube.com/vi/%s/%d.jpg";
	var search_url = "https://www.google.com/searchbyimage?&image_url="
	var img_arr = ["","","",""];
	for (count = 0; count < 4; count++){
		img_arr[count] = search_url + img_url.replace("%s", video_id).replace("%d", count);
		img_url = "http://img.youtube.com/vi/%s/%d.jpg";
	}
	return img_arr;
}

thumbnailsSearch = function(word){
	var checkLink = "https://www.youtube.com/watch?v="
	var url = word.linkUrl;
	if (url != "") {
		var lst = get_images(url);
		for (index in lst){
			chrome.tabs.create({url:lst[index]});
		}
	}
};

function getUrlImg(word) {
	if (word.srcUrl)
		return String(word.srcUrl);
	return String(word.linkUrl);
}

analysisVideo = function(word){
	var url = word.linkUrl;
	if (url != "") {
		chrome.tabs.create({url:"invid.html?video=" + url});
	}
};

imageMagnifier = function(word){
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({url:"invid.html?img=" + url});
	}
};

imageReverseSearch = function(word){
	var search_url = "https://www.google.com/searchbyimage?image_url=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url});
	}
};

imageReverseSearchBaidu = function(word){
	var search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url + "&fm=index&uptype=urlsearch"});
	}
};

imageReverseSearchYandex = function(word){
	var search_url = "https://yandex.com/images/search?url=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url + "&rpt=imageview"});
	}
};

imageReverseSearchTineye = function(word){
	var search_url = "https://www.tineye.com/search?url=";
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({url:search_url + url});
	}
};

chrome.contextMenus.create({
 title: "Youtube thumbnails reverse search",
 contexts:["link", "video"], 
 onclick: thumbnailsSearch, 
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*"]
});

chrome.contextMenus.create({
 title: "Video contextual analysis",
 contexts:["link"], 
 onclick: analysisVideo,
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*/videos/*"] 
});

chrome.contextMenus.create({
 title: "Video contextual analysis",
 contexts:["video"],  
 onclick: analysisVideo, 
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*", "https://twitter.com/*"] 
});


chrome.contextMenus.create({
 title: "Image Magnifier",
 contexts:["image"],  
 onclick: imageMagnifier
});

chrome.contextMenus.create({
	title: "Image Magnifier",
	contexts: ["link"],
	onclick: imageMagnifier,
	targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, "*://*/*.png*"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Google",
 contexts:["image"],
 onclick: imageReverseSearch
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Google",
 contexts:["link"], 
 onclick: imageReverseSearch,
 targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, "*://*/*.png*"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Baidu",
 contexts:["image"],  
 onclick: imageReverseSearchBaidu 
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Baidu",
 contexts:["link"],
 onclick: imageReverseSearchBaidu,
 targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, "*://*/*.png"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Yandex",
 contexts:["image"],
 onclick: imageReverseSearchYandex
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Yandex",
 contexts:["link"],
 onclick: imageReverseSearchYandex,
 targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, "*://*/*.png"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Tineye",
 contexts:["image"],
 onclick: imageReverseSearchTineye
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Tineye",
 contexts:["link"],
 onclick: imageReverseSearchTineye,
 targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, "*://*/*.png"]
});