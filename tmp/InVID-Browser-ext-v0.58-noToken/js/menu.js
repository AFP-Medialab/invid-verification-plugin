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

searchVideo = function(word){
	var checkLink = "https://www.youtube.com/watch?v="
	var url = String(word.linkUrl);
	if (url != "") {
		var lst = get_images(url);
		for (index in lst){
			chrome.tabs.create({url:lst[index]});
		}
	}
};	

imageMagnifier = function(word){
	var url = String(word.srcUrl);
	if (url != "") {
		chrome.tabs.create({url:"invid.html?img="+url});
	}
};

verifVideo = function(word){
	var url = String(word.linkUrl);
	if (url != "") {
		chrome.tabs.create({url:"invid.html?video="+url});
	}
};

imageReverseSearch = function(word){
	var search_url = "https://www.google.com/searchbyimage?&image_url=";
	var url = String(word.srcUrl);
	if (url != ""){
		chrome.tabs.create({url:search_url+url});
	}
};

imageReverseSearchBaidu = function(word){
	var search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
	var url = String(word.srcUrl);
	if (url != ""){
		chrome.tabs.create({url:search_url+url+"&fm=index&uptype=urlsearch"});
	}
};

imageReverseSearchYandex = function(word){
	var search_url = "https://yandex.com/images/search?url=";
	var url = String(word.srcUrl);
	if (url != ""){
		chrome.tabs.create({url:search_url+url+"&rpt=imageview"});
	}
};

chrome.contextMenus.create({
 title: "Youtube thumbnails reverse search",
 contexts:["link"],  // ContextType
 onclick: searchVideo // A callback function
});

chrome.contextMenus.create({
 title: "Video contextual analysis",
 contexts:["link"],  // ContextType
 onclick: verifVideo // A callback function
});

chrome.contextMenus.create({
 title: "Youtube thumbnails reverse search",
 contexts:["video"],  // ContextType
 onclick: searchVideo // A callback function
});

chrome.contextMenus.create({
 title: "Youtube contextual verification",
 contexts:["video"],  // ContextType
 onclick: verifVideo // A callback function
});

chrome.contextMenus.create({
 title: "Image Magnifier",
 contexts:["image"],  // ContextType
 onclick: imageMagnifier // A callback function
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Google",
 contexts:["image"],  // ContextType
 onclick: imageReverseSearch // A callback function
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Baidu",
 contexts:["image"],  // ContextType
 onclick: imageReverseSearchBaidu // A callback function
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Yandex",
 contexts:["image"],  // ContextType
 onclick: imageReverseSearchYandex // A callback function
});