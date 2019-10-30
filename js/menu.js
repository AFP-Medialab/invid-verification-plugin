/* 
* Set here your own Tracking ID 
*/
var trackingID = "UA-XXXXXXXX-Y";
// var page_name = 'invid.html';
var page_name = 'we-verify.html';

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','js/analytic-local.js','ga');

ga('create', trackingID, 'auto');
// Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('set', 'checkProtocolTask', function(){});
ga('set', 'page', '/'+page_name+'#analysis');
ga('set', 'anonymizeIp', true);

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

karmadecaySearch = function(word){
	// from User JavaScript @https://static.karmadecay.com/js/karma-decay.user.js
	var search_url = "http://karmadecay.com/search?kdtoolver=b1&q=";
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({ url: search_url + url});
		//Google analytics
		ga("send", "event", "Contextual Menu - Reddit", "click", url);
	}	
}

thumbnailsSearch = function(word){
	var checkLink = "https://www.youtube.com/watch?v="
	var url = word.linkUrl;
	if (url != "") {
		var lst = get_images(url);
		for (index in lst){
			chrome.tabs.create({url:lst[index]});
		}
		// Google analytics
		ga("send", "event", "ContextualMenu - ThumbnailYouTube", "click", url);
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
		chrome.tabs.create({url:page_name+"?video=" + url});
		// Google analytics
		ga("send", "event", "ContextualMenu - AnalysisVideo", "click", url);
	}
};

imageMagnifier = function(word){
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({url:page_name+"?img=" + url});
		// Google analytics
		ga("send", "event", "ContextualMenu - Magnifier", "click", url);
	}
};

imageReverseSearch = function(word){
	var search_url = "https://www.google.com/searchbyimage?image_url=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url});
		// Google analytics
		ga("send", "event", "ContextualMenu - Google", "click", url);
	}
};

imageForensic = function(word){
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:page_name+"?imgforen=" + url});
		// Google analytics
		ga("send", "event", "ContextualMenu - Forensic", "click", url);
	}
};

imageReverseSearchBaidu = function(word){
	var search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url + "&fm=index&uptype=urlsearch"});
		// Google analytics
		ga("send", "event", "ContextualMenu - Baidu", "click", url);
	}
};

imageReverseSearchYandex = function(word){
	var search_url = "https://yandex.com/images/search?url=";
	var url = getUrlImg(word);
	if (url != ""){
		chrome.tabs.create({url:search_url + url + "&rpt=imageview"});
		// Google analytics
		ga("send", "event", "ContextualMenu - Yandex", "click", url);
	}
};

imageReverseSearchTineye = function(word){
	var search_url = "https://www.tineye.com/search?url=";
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({url:search_url + url});	
		// Google analytics
		ga("send", "event", "ContextualMenu - Tineye", "click", url);
	}
};

imageReverseSearchBing = function(word){
	var search_url = "https://www.bing.com/images/search?q=imgurl:";
	var url = getUrlImg(word);
	if (url != "") {
		chrome.tabs.create({url:search_url + url + "&view=detailv2&iss=sbi"});
		// Google analytics
		ga("send", "event", "ContextualMenu - Bing", "click", url);
	}
};

imageReverseSearchAll = function(word){
	imageReverseSearch(word);
	imageReverseSearchBaidu(word);
	imageReverseSearchBing(word);
	imageReverseSearchTineye(word);
	imageReverseSearchYandex(word);
};

chrome.contextMenus.create({
 title: "Youtube thumbnails reverse search",
 contexts:["link", "video"], 
 onclick: thumbnailsSearch, 
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*"]
});

chrome.contextMenus.create({
 title: "Video contextual analysis",
 contexts:["link", "video"], 
 onclick: analysisVideo,
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*/videos/*", "https://www.facebook.com/*", "https://twitter.com/*"] 
});

/*chrome.contextMenus.create({
 title: "Video contextual analysis",
 contexts:["video"],  
 onclick: analysisVideo, 
 targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*", "https://twitter.com/*"] 
});*/


chrome.contextMenus.create({
 title: "Image Magnifier",
 contexts:["image", "link"],  
 onclick: imageMagnifier,
// targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//,	// "*://*/*.png*"]																			// "*://*/*.png*"]
});

chrome.contextMenus.create({
	title: "Image Forensic",
	contexts:["image"],
	onclick: imageForensic,
});

chrome.contextMenus.create({
	title: "Image Reverse Search - All",
	contexts:["image", "link"],
	onclick: imageReverseSearchAll,
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Google",
 contexts:["image", "link"],
 onclick: imageReverseSearch,
//targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, // "*://*/*.png*"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Baidu",
 contexts:["image", "link"],  
 onclick: imageReverseSearchBaidu,
// targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, // "*://*/*.png"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Yandex",
 contexts:["image", "link"],
 onclick: imageReverseSearchYandex,
//targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, // "*://*/*.png"]
});

chrome.contextMenus.create({
 title: "Image Reverse Search - Tineye",
 contexts:["image", "link"],
 onclick: imageReverseSearchTineye,
// targetUrlPatterns: ["*://*/*.jpg*", "*://*/*.jpg:large", "*://*/*.jpeg*"]//, // "*://*/*.png"]
});

chrome.contextMenus.create({
	title: "Image Reverse Search - Bing",
	contexts:["image"],
	onclick: imageReverseSearchBing,
});

chrome.contextMenus.create({
	title: "Image Reverse Search - Reddit",
	contexts:["image"],
	onclick: karmadecaySearch,
});
