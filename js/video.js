/* Clean element by id */
function cleanElement(id){
	var div = document.getElementById(id);
	/* Clear content*/
	while(div.hasChildNodes()){
		div.removeChild(div.firstChild);
	}
}

function get_images(url){
	var video_id = getYtIdFromUrlString(url);
	var img_url = "http://img.youtube.com/vi/%s/%d.jpg";
	var img_arr = [];
	for (count = 0; count < 4; count++){
		img_arr.push(img_url.replace("%s", video_id).replace("%d", count));
	}
	return img_arr;
}

var thumbnail_engine = "google";

$("#video_form").find("[name='engine']").on("change", function(event) {
	thumbnail_engine = $(this).attr("id").replace("_engine", "");
})

function clickThumbnails(){
	$(".yt_thumbnail").on( 'click', function(e){
		e.preventDefault();
		var url = $( this ).attr('href');
		reverseImgSearch(thumbnail_engine, url);
	});
}

function add_thumbnails(lst_url){
	cleanElement("place-video-thumbnails");
	var div = document.getElementById("place-video-thumbnails");
	for (img_url of lst_url){
		var img = document.createElement("img");
		var a = document.createElement("a");
		a.setAttribute("href", img_url);
		a.setAttribute("class", "yt_thumbnail");
		img.setAttribute("src", img_url);
		a.appendChild(img);
		a.appendChild(document.createElement("br"));
		div.appendChild(a);
	}
}

function submit_form(){
	var url = $("[name=video_url]").val();
	if (url != "" && isYtUrl(url)) {
		var lst = get_images(url);
		add_thumbnails(lst);
		clickThumbnails();
		reverseImgSearch(thumbnail_engine, lst);
	}
}

var form = document.getElementById("video_form");
if (form.addEventListener){
	form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e){
	e.preventDefault();
});
