/**
* Javascript used by ANALYSIS service
*/

var video_thumbnails_lst = [];
var twitter_url = "https://twitter.com/search";
var tw_json = "";
var google_reverse_search_urls = [];
var yandex_reverse_search_urls = [];
var error_type = "";

/**
* @func Detect http link and make hyperlink 
*/
function urlify(text)
{
    if (text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        })
    }
    return "";
}

/**
* @func Create a title in the div argument 
*/
function makeTitle(title, div)
{
    h3 = document.createElement("h3");
    h3.innerHTML = title;
    div.appendChild(h3);
}

/**
* @func Create table: left column: name, column: key value from json file 
*/
function make_table(json, key_lst, name_lst)
{
    var table = document.createElement("table");
    for (var index in key_lst){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        th.innerHTML = name_lst[index];
        var content = json[key_lst[index]];
        content = (Array.isArray(content)) ? content.join("\n") : String(content);
        td.innerHTML = urlify(content);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    return table
}

/**
* @func Update table created by the previous function 
*/
function updateTable(json, key_lst, table)
{
    var list = table.getElementsByTagName("td");
    for (var index = 0; index < list.length; index++) {
        if (json[key_lst[index]]) {
            var content = json[key_lst[index]];
            content = (Array.isArray(content)) ? content.join("\n") : String(content);
            list[index].innerHTML = urlify(content);
        }
    }
}

/**
* @func Create a time row
*/
function createTimeRow(title, time)
{
    var regex = /(.*), (.*) \(?UTC\)?/;
    var row = makeRowTable(title, time);
    if (regex.test(time)) {
        var date_and_time = time.match(regex);
        var url = "http://www.timeanddate.com/worldclock/converter.html?iso=";
        var query = url + date_and_time[1].replace(/-/g, "") + "T" + date_and_time[2].replace(/:/g, "");
        var td = row.lastElementChild;
        appendLink(td, query, "<br>Convert to local time");
        td.lastElementChild.setAttribute("target", "_blank");
    }
    return row;
}

/**
* @func Update a time row
*/
function updateTimeRow(table, nb, val) 
{
    var row = table.getElementsByTagName("tr")[nb];
    if (row.lastElementChild.innerHTML == "") {
        $(row).replaceWith(createTimeRow(row.firstElementChild.innerHTML, val));
    }
}

/**
* @func Diplay buttons "verification comments" and "maps"
*/
function displayButtons(verif_number, locations, not_yt)
{
    var verif = document.getElementById("verif-content");
    var maps = document.getElementById("maps-content");
    var google = document.getElementById("google_search_btn");
    var yandex = document.getElementById("yandex_search_btn");
    var tineye = document.getElementById("tineye_search_btn")
    //var timeline = document.getElementById("twitter-shares-content");
    var twitter = document.getElementById("twitter_search_btn");
    if (verif_number == "0"){
        verif.setAttribute("style", "display: none;");
    } else {
        verif.setAttribute("style", "display: block;");
    }
    if (!locations || locations.length == 0){
        maps.setAttribute("style", "display: none;");
    } else {
        maps.setAttribute("style", "display: block;");
    }
    if (not_yt)
        twitter.setAttribute("style", "display: none;");
    //timeline.setAttribute("style", "");
    google.setAttribute("style", "");
    yandex.setAttribute("style", "");
    tineye.setAttribute("style", "");
}

/**
* @func Hide buttons
*/
function hideButtons() 
{
    var buttons_id = [ "verif-content", "maps-content", "google_search_btn", "yandex_search_btn",
        /*"twitter-shares-content",*/ "twitter_search_btn", "tineye_search_btn"
    ]
    for (id of buttons_id) {
        document.getElementById(id).setAttribute("style", "display: none");
    }
}

/**
* @func Place verification comments 
*/
function placeComments(analysis_json)
{
    cleanElement("place-comments");
    var div = document.getElementById("place-comments");
    var video_comments = analysis_json.video_comments;
    var video_author_comments = analysis_json.video_author_comments;
    var video_author_url_comments = analysis_json.video_author_url_comments
    var video_publishedAt_comments = analysis_json.video_publishedAt_comments;
    var verification_comments = analysis_json.verification_comments;
    for(var count in video_comments) {
        index = verification_comments.indexOf(video_comments[count]);
        if (index != -1){
            var elem = document.createElement("p");
            elem.setAttribute("class", "comment");
            var author_head = '<a href="'+ (video_author_url_comments !== undefined ? video_author_url_comments[count] : "Unknown") +
            	'"><strong>' + (video_author_comments !== undefined ? video_author_comments[count] : "Unknown") + '</strong></a>' + " at <strong>" +
            	(video_publishedAt_comments !== undefined ? video_publishedAt_comments[count] : "Unknown") +"</strong>:<br>";
            elem.innerHTML = author_head + video_comments[count];
            div.appendChild(elem);
        }
    }
}

/**
* @func Send a thumbnails clickable to magnifier tab 
*/
function activeThumbnail( thumbnails_id )
{
    /* Change to magnifier tab */
    $( '#'+ thumbnails_id ).on( 'click', 'a', function(e) {
        e.preventDefault();
		var $tab = $( this );
		var href = $tab.attr( 'href' );
        $('.active').removeClass( ACTIVE_CLASS );
        $( '#api_tab a' ).addClass( ACTIVE_CLASS );
		$("#left_menu div a").each(function(){
			$(this).removeClass( ACTIVE_CLASS );
		});
		$("#magnifier_menu_tab").addClass( ACTIVE_CLASS );
        $('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
        $(href).removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
        var url_img = $tab.children()[0].src;
        callMagnifier(url_img);
    });
}

/**
* @func Create Carousel html
*/
function buildCarousel(carousel_id, thumbnails_id)
{
    var div = document.getElementById(carousel_id);
    div.style.display = "block";
    var jssor1 = document.createElement("div");
    jssor1.setAttribute("id", "jssor_1");
    jssor1.setAttribute("style", "position:relative;margin:0 auto;top:0px;left:0px;width:800px;height:200px;overflow:hidden;visibility:hidden;background-color: #000000;");
    /* Loading div */
    var loading = document.createElement("div");
    loading.setAttribute("data-u", "loading");
    loading.setAttribute("style", "position:absolute;top:0px;left:0px;background-color:rgba(0,0,0,0.7);");
    var loading1 = document.createElement("div");
    loading1.setAttribute("style", "filter: alpha(opacity=70); opacity: 0.7; position: absolute; display: block; top: 0px; left: 0px; width: 100%; height: 100%;");
    var loading2 = document.createElement("div");
    loading2.setAttribute("style", "position:absolute;display:block;background:url('img/loading.gif') no-repeat center center;top:0px;left:0px;width:100%;height:100%;");
    loading.appendChild(loading1);
    loading.appendChild(loading2);
    jssor1.appendChild(loading);
    /* Thumbnails div */
    var thumb_div = document.createElement("div");
    thumb_div.setAttribute("id", thumbnails_id);
    thumb_div.setAttribute("data-u", "slides");
    thumb_div.setAttribute("style", "cursor:default;position:relative;top:25px;left:100px;width:600px;height:150px;overflow:hidden");
    jssor1.appendChild(thumb_div);
    /* Bullet Navigator */
    var b_navigator = document.createElement("div");
    b_navigator.setAttribute("data-u", "navigator");
    b_navigator.setAttribute("class", "jssorb03");
    b_navigator.setAttribute("style", "bottom:10px;right:10px;");
    var b_navigator1 = document.createElement("div");
    b_navigator1.setAttribute("data-u", "prototype");
    b_navigator1.setAttribute("style", "width:21px;height:21px;");
    var b_navigator2 = document.createElement("div");
    b_navigator2.setAttribute("data-u", "numbertemplate");
    b_navigator1.appendChild(b_navigator2);
    b_navigator.appendChild(b_navigator1);
    jssor1.appendChild(b_navigator);
    /*Arrow Navigator */
    var arrowleft = document.createElement("span");
    arrowleft.setAttribute("data-u", "arrowleft");
    arrowleft.setAttribute("class", "jssora03l");
    arrowleft.setAttribute("style", "top:0px;left:8px;width:55px;height:55px;");
    arrowleft.setAttribute("data-autocenter", "2");
    var arrowright = document.createElement("span");
    arrowright.setAttribute("data-u", "arrowright");
    arrowright.setAttribute("class", "jssora03r");
    arrowright.setAttribute("style", "top:0px;right:8px;width:55px;height:55px;");
    arrowright.setAttribute("data-autocenter", "2");
    jssor1.appendChild(arrowleft);
    jssor1.appendChild(arrowright);
    div.appendChild(jssor1);
}

/**
* @func Display or hide real size Thumbnail image 
*/
function activePreview()
{
    $(".mouse-preview").on( {
        mouseenter: function() {
            var id = $(this).attr("name");
            var img = document.getElementById(id);
            img.style.display = "";
        },
        mouseleave: function() {
            var id = $(this).attr("name");
            var img = document.getElementById(id);
            img.style.display = "none";
        }
    });
}

/**
* @func Place Thumbnails in the carousel 
*/
function placeImages(carousel_id, thumbnails_id, preview_id, img_list)
{
    cleanElement(carousel_id);
    cleanElement(preview_id);
    buildCarousel(carousel_id, thumbnails_id);
    var prev = document.getElementById(preview_id);
    var div = document.getElementById(thumbnails_id);
    for (var count in img_list){
        //if (img_list[count].match(/https:\/\/i\.ytimg\.com\/*/) && !img_list[count].match(/maxresdefault\.jpg$/))
        //    continue;
        var id = "thumb-" + count;
        var div1 = document.createElement("div");
        var a = document.createElement("a");
        a.setAttribute("href", "#magnifier");
        a.setAttribute("name", id);
        a.setAttribute("class", "mouse-preview");
        var elem = document.createElement("img");
        elem.setAttribute("src", img_list[count]);
        elem.setAttribute("style", "max-height: 150px; max-width: 200px;");
        a.appendChild(elem);
        div1.appendChild(a);
        div.appendChild(div1);
        /*Add img preview*/
        var img = document.createElement("img");
        img.setAttribute("id", id);
        img.setAttribute("src", img_list[count]);
        img.setAttribute("style", "display: none; position: fixed; top: 0%; right: 0%; max-height: 250px; z-index: 1000;");
        prev.appendChild(img);
    }
    /* Thumbnails onclick */
    activeThumbnail(thumbnails_id);
    /* Preview onmouseover */
    activePreview();
    /* Active carousel */
    jssor_1_slider_init();
}

/**
* @func Create the google maps and and search Box
*/
function createGoogleMaps()
{
	return;
/*
    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map( document.getElementById("map"), mapOptions );

    // get Current Location if possible
	if( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
		});
	}

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var submit = document.getElementById("pac-button");
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(submit);
	submit.addEventListener("click", function() {
		if(searchBox) {
			searchBox.focus();
			google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
		}
	});

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) return;
		// Clear out the old markers.
		markers.forEach( function(marker) {
			marker.setMap(null);
		});
		markers = [];
		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach( function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};
			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));
			if( place.geometry.viewport ) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
*/
}

/**
* @func Change SearchBox value and submit it to the google map 
*/
function updateMap( places, city, country )
{
	var u = "https://nominatim.openstreetmap.org/search?format=json";
	var q = "";
	if( ! city && ! country ) {
		for( var i = 0; i < places.length; i++ ) {
			q+= ( q != "" ? ", " : "" ) + places[i];
		}
		u+= "&q="+q.replace(", ", "+");
	} else if( ! country && city ) {
		q = "&city="+city.replace(" ","+");
		u+= q;
		// u+= "&limit=3";
	} else if( country && city ) {
		q = "&city="+city.replace(" ","+");
		q+= "&country="+country.replace(" ","+");
		u+= q;
		// u+= "&limit=1";
	}
	u+= "&json_callback=positionOpenStreetMapMarker";
	console.log(u);
	// $("#osm_url").html(u);
	$.get(u).done( function(resp) {
		if( resp != "" ) {
			eval( resp );
		}
	});

	var searchBox = document.getElementById("pac-input");
	if( searchBox && ! city && ! country ) {
		searchBox.value = q;
		searchBox.focus();
	}

	/* if( places != [] ) {
        var searchBox = document.getElementById("pac-input");
        if(searchBox){
            searchBox.value =places;
            searchBox.focus();
            google.maps.event.trigger(searchBox, 'keydown', { keyCode: 13 });
        }
    } */
}

/**
* @func Place geolocalisation markers on open street map
*/
function positionOpenStreetMapMarker( markers )
{
	// Remove previous markers
	if( osm_markers && osm_markers.length ) {
		for( var i = 0; i < osm_markers.length; i++ ) {
			osm_map.removeLayer( osm_markers[i] );
		}
	}
	osm_markers = [];
	if( markers.length > 0 ) {
		// Add "place" markers
		var found = false;
		if( ! found ) {
			for( var i = 0; i < markers.length; i++ ) {
				if( markers[i].class == "place" || markers[i].class == "capital" || markers[i].class == "capital_city" || markers[i].class == "natural" || markers[i].class == "boundary" ) {
					var m = L.marker([markers[i].lat, markers[i].lon]).addTo(osm_map);
					var p = '<div style="width:200px;height:auto;">';
					p+= '<b>'+markers[i].class.toUpperCase()+' : </b>'+markers[i].display_name;
					p+= '</div>';
					m.bindPopup(p);
					osm_markers.push( m );
					if( ! found ) {
						centerLeafletMapOnMarker(osm_map, m);
						found = true;
						break;
					}
				}
			}
		}
		if( ! found ) {
			// Try some other markers if nothing found
			for( var i = 0; i < markers.length; i++ ) {
				if( markers[i].class != "amenity" && markers[i].class != "shop" && markers[i].class != "tourism" && markers[i].class != "building" && markers[i].class != "highway" ) {
					var m = L.marker([markers[i].lat, markers[i].lon]).addTo(osm_map);
					var p = '<div style="width:200px;height:auto;">';
					p+= '<b>'+markers[i].class.toUpperCase()+' : </b>'+markers[i].display_name;
					p+= '</div>';
					m.bindPopup(p);
					osm_markers.push( m );
					if( ! found ) {
						centerLeafletMapOnMarker(osm_map, m);
						found = true;
					}
				}
			}
		}
		if( ! found ) {
			// Finaly, add all markers if nothing found
			for( var i = 0; i < markers.length; i++ ) {
				var m = L.marker([markers[i].lat, markers[i].lon]).addTo(osm_map);
				var p = '<div style="width:200px;height:auto;">';
				p+= '<b>'+markers[i].class.toUpperCase()+' : </b>'+markers[i].display_name;
				p+= '</div>';
				m.bindPopup(p);
				osm_markers.push( m );
				if( ! found ) {
					centerLeafletMapOnMarker(osm_map, m);
					found = true;
				}
			}
		}
		osm_map.setZoom( 6 );
    }
}

/**
* @func Center the osm map on a marker
*/
function centerLeafletMapOnMarker(map, marker) 
{
	var latLngs = [ marker.getLatLng() ];
	var markerBounds = L.latLngBounds( latLngs );
	map.fitBounds( markerBounds );
}

/**
* @func Center the osm map on a group of markers
*/
function centerLeafletMapOnMarkersGroup(map, markers) 
{
	var markerBounds = [];
	for( var i = 0; i < markers.length; i++ ) {
		var latLngs = [ markers[i].getLatLng() ];
		markerBounds.push( L.latLngBounds( latLngs ) );
	}
	map.fitBounds( markerBounds );
}

/**
* @func Update the map with current search box value (correct display none bug)
*/
function triggerMap()
{
    var searchBox = document.getElementById("pac-input");
    if( searchBox ) {
        searchBox.focus();
        google.maps.event.trigger(searchBox, 'keydown', { keyCode: 13 });
    }
}

var analysisType = "";

/**
* @func Parse the YouTube json 
*/
function parseYTJson(json)
{
    /* bool value */
    var hasPlaceComments;
    var hasUpdateMap;
    var hasPlaceImages;
    var hasDisplayButtons;

    /* List of indexes */
    var key_list_video_a = ["video_title", "video_description"];
    var key_list_video_b = ["video_view_count", "video_like_count", "video_dislike_count", "video_duration", "video_licensed_content", "video_description_mentioned_locations", "video_recording_location_description"];
    var key_list_channel = ["channel_description", "channel_created_time", "channel_view_count", "channel_url", "channel_location"];
    var key_list_comment = ["video_comment_count", "num_verification_comments"];
    var jsonName = json_lang_translate[global_language]; //jsonTitleTableApi["youtube"][global_language];

    function start(json) 
	{
    	/* isDebunked field */
    	/*if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
            document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else
        	document.getElementById("place-debunked").style.display = "none";*/
        /* Video Infos*/
        var div = document.getElementById("place-table");
        /*Video table*/
        makeTitle(jsonName["youtube_video_title"], div);
        var table = make_table(json, key_list_video_a, list_from_json(jsonName, "youtube_video_name1_"));
        div.appendChild(table);
        div.appendChild(document.createElement("br"));
        table = make_table(json, key_list_video_b, list_from_json(jsonName, "youtube_video_name2_"));
        var index = key_list_video_b.length;
        var rowTime = createTimeRow(list_from_json(jsonName, "youtube_video_name2_")[index++], json["video_upload_time"]);
        table.appendChild(rowTime);
        div.appendChild(table);
        /*Channel table*/
        makeTitle(jsonName["youtube_channel_title"], div);
        table = make_table(json, key_list_channel, list_from_json(jsonName, "youtube_channel_name_"));
        div.appendChild(table);
        /* Comments*/
        makeTitle(jsonName["youtube_comment_title"], div);
        table = make_table(json, key_list_comment, list_from_json(jsonName, "youtube_comment_name_"));
        div.appendChild(table);

        /* Init variable */
        hasPlaceComments = false;
        hasUpdateMap = false;
        hasPlaceImages = false;
        video_thumbnails_lst = [];
        google_reverse_search_urls = [];
        yandex_reverse_search_urls = [];
        twitter_url = "";
        document.getElementById("twitter_search_btn").setAttribute("style", "display: none;");
        hasDisplayButtons = false;
    }

    function update(json) 
	{
    	/* isDebunked field */
    	/* if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
        	document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else
        	document.getElementById("place-debunked").style.display = "none";*/
        var tables = document.getElementById("place-table").getElementsByTagName("table");
        /* Video table */
        updateTable(json, key_list_video_a, tables[0]);
        updateTable(json, key_list_video_b, tables[1]);
        var index = key_list_video_b.length;
        updateTimeRow(tables[1], index++, json["video_upload_time"]);
        /* Channel table */
        updateTable(json, key_list_channel, tables[2]);
        /* Comments*/
        updateTable(json, key_list_comment, tables[3]);
    }

    if( !document.getElementById("place-table").hasChildNodes() ) {
        start(json);
    } else {
        update(json);
	}

    /* Place verification comments */
    if( ! hasPlaceComments && json.processing_status == "done" ) {
        placeComments(json);
        hasPlaceComments = true;
    }
    /* Update map*/
    if( !hasUpdateMap && json.video_description_mentioned_locations ) {
        updateMap( json.video_description_mentioned_locations, "", "" );
        hasUpdateMap = true;
    }

    if( ! hasPlaceImages && json.video_thumbnails ) {
        /* Place thumbnails */
        placeImages("place-carousel", "place-thumbnails", "place-preview", json.video_thumbnails);
        hasPlaceImages = true;
        /* Update reverse search button */
        video_thumbnails_lst = json.video_thumbnails;
        google_reverse_search_urls = json.reverse_image_thumbnails_search_url_google;
        yandex_reverse_search_urls = json.reverse_image_thumbnails_search_url_yandex;
    }
    /* Update Twitter search button */
    if (json.twitter_search_url && twitter_url == "") {
        twitter_url = json.twitter_search_url;
        document.getElementById("twitter_search_btn").setAttribute("style", "");
    }
    /* Display buttons*/
    if( ! hasDisplayButtons && (json.processing_status == "done" || (json.num_verification_comments && json.video_description_mentioned_locations) ) ) {
        displayButtons(json.num_verification_comments, json.video_description_mentioned_locations, false);
        hasDisplayButtons = true;
    }
}

/**
* @func Parse the Facebook Json 
*/
function parseFBJson(json)
{
    /* booleans values */
    var hasPlaceImages;
    var hasPlaceComments;
    var hasDisplayButtons;
    var hasUpdateMap;

    /* List of indexes */
    var key_list_video = ["video_id", "title", "length", "content_category", "content_tags", "video_description", "video_likes"];
    var key_list_details = ["from", "video_description_mentioned_locations", "privacy", "embeddable", "facebook_type"];
    var key_list_count = ["total_comment_count", "num_verification_comments"];
    var arrayTitle = json_lang_translate[global_language];//jsonTitleTableApi["facebook"][global_language];

    function start(json) 
	{
    	/* isDebunked field */
    	/* if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
        	document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else {
        	document.getElementById("place-debunked").style.display = "none";
		} */
        /* Video Infos*/
        var div = document.getElementById("place-table")
        /*Video table*/
        makeTitle(arrayTitle["facebook_video_title"], div);
        var table = make_table(json, key_list_video, list_from_json(arrayTitle, "facebook_video_name_"));
        var index = key_list_video.length;
        var rowTime = createTimeRow(list_from_json(arrayTitle, "facebook_video_name_")[index++], json["updated_time"]);
        table.appendChild(rowTime);
        rowTime = createTimeRow(list_from_json(arrayTitle, "facebook_video_name_")[index++], json["created_time"]);
        table.appendChild(rowTime);
        div.appendChild(table);
        /*Page table*/
        makeTitle(arrayTitle["facebook_page_title"], div);
        table = make_table(json, key_list_details, list_from_json(arrayTitle, "facebook_page_name_"));
        div.appendChild(table);
        /* Comments */
        makeTitle(arrayTitle["facebook_comment_title"], div);
        table = make_table(json, key_list_count, list_from_json(arrayTitle, "facebook_comment_name_"));
        div.appendChild(table);
        hasPlaceImages = false;
        hasPlaceComments = false;
        hasDisplayButtons = false;
        hasUpdateMap = false;
        google_reverse_search_urls = [];
        yandex_reverse_search_urls = [];
    }

    function update(json)
	{
    	/* isDebunked field */
    	/*if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
        	document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else {
        	document.getElementById("place-debunked").style.display = "none";
		} */
        var tables = document.getElementById("place-table").getElementsByTagName("table");
        /*Video table*/
        updateTable(json, key_list_video, tables[0]);
        var index = key_list_video.length;
        updateTimeRow(tables[0], index++, json["updated_time"]);
        updateTimeRow(tables[0], index++, json["created_time"]);
        /*Page table*/
        updateTable(json, key_list_details, tables[1]);
        /* Comments */
        updateTable(json, key_list_count, tables[2]);
    }

    if (!document.getElementById("place-table").hasChildNodes()) {
        start(json);
    } else {
        update(json);
	}

    /* Place thumbnails */
    if( ! hasPlaceImages && json.video_thumbnails ) {
        placeImages("place-carousel", "place-thumbnails", "place-preview", json.video_thumbnails);
        hasPlaceImages = true;
    }
    /* Place verification comments */
    if( ! hasPlaceComments && json.processing_status == "done" ) {
        placeComments(json);
        hasPlaceComments = true;
    }
    /* Update reverse search buttons */
    video_thumbnails_lst = json.video_thumbnails;
    google_reverse_search_urls = json.reverse_image_thumbnails_search_url_google;
    yandex_reverse_search_urls = json.reverse_image_thumbnails_search_url_yandex;
    /* Display buttons */
    if( ! hasDisplayButtons && ( json.processing_status == 'done' || (json.num_verification_comments && json.video_description_mentioned_locations) ) ) {
        displayButtons(json.num_verification_comments, json.video_description_mentioned_locations, true);
        hasDisplayButtons = true;
    }
    /* Update map*/
    if( ! hasUpdateMap && json.video_description_mentioned_locations ) {
        updateMap( json.video_description_mentioned_locations, "", "" );
        hasUpdateMap = true;
    }
}

/**
* @func Parse the Twitter Json 
*/
function parseTWJson(json)
{
    /* booleans values */
    var hasPlaceImages;
    // var hasPlaceComments; when verified comments added by iti
    var hasDisplayButtons;
    var hasUpdateMapText;
    var hasUpdateMapDesc;

    /* List of indexes */
    var key_list_video = ["id_str", "full_text", "source",  "favorite_count", "retweet_count", "hashtags", "urls", "user_mentions", "lang", "media_url", "video_info_aspect_ratio", "video_info_duration", "tweet_text_mentioned_locations", "embedded_youtube"];
    var key_list_user = ["user_name", "user_screen_name", "user_location", "user_url", "user_description", "user_protected", "user_verified", "user_followers_count", "user_friends_count", "user_listed_count", "user_favourites_count", "user_statuses_count", "user_created_at", "user_lang", "user_description_mentioned_locations"];
    /*var key_list_comment = ["retweet_count"];*/
    var arrayTitle = json_lang_translate[global_language];//jsonTitleTableApi["twitter"][global_language];

    function chooseVideoUrl(urls)
	{
        var max = 0;
        var res = urls[0];
        for (var url of urls) {
            var regex = /\/([0-9])+x([0-9])+/;
            if (regex.test(url)) {
                var matches = url.match(regex);
                var current = matches[1] * matches[2];
                if (current > max) {
                    max = current
                    td.innerHTML = url;
                }
            }
        }
        return res;
    }

    function start(json) 
	{
    	/* isDebunked field */
    	/* if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
        	document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else {
        	document.getElementById("place-debunked").style.display = "none";*/
        /* Video Infos*/
        var div = document.getElementById("place-table")
        /* Video table */
        makeTitle(arrayTitle["twitter_video_title"], div);
        var table = make_table(json, key_list_video, list_from_json(arrayTitle, "twitter_video_name_"));
        var index = key_list_video.length;
        var rowTime = createTimeRow(list_from_json(arrayTitle, "twitter_video_name_")[index++], json["created_at"]);
        table.appendChild(rowTime);
        var urls = json["video_info_url"];
        var row = makeRowTable(list_from_json(arrayTitle, "twitter_video_name_")[index++], urlify(chooseVideoUrl(urls)));
        table.appendChild(row);
        div.appendChild(table);
        /* Page table */
        makeTitle(arrayTitle["twitter_user_title"], div);
        table = make_table(json, key_list_user, list_from_json(arrayTitle, "twitter_user_name_"));
        div.appendChild(table);
        /* Comments */
        /* makeTitle("Retweets:", div);
        table = make_table(json, key_list_comment, name_list_comment); when verified comments added by iti
        div.appendChild(table); */
        hasPlaceImages = false;
        google_reverse_search_urls = [];
        yandex_reverse_search_urls = [];
        // hasPlaceComments = false; when verified comments added by iti
        hasDisplayButtons = false;
        hasUpdateMapText = false;
        hasUpdateMapDesc = false;
    }

    function update(json) 
	{
    	/* isDebunked field */
    	/*if (json["isDebunked"] !== "") {
    		document.getElementById("place-debunked").style.display = "block";
        	document.getElementById("place-debunked").innerHTML = json["isDebunked"];
    	}
        else {
        	document.getElementById("place-debunked").style.display = "none"; 
		} */
        var tables = document.getElementById("place-table").getElementsByTagName("table");
        /* Video table */
        updateTable(json, key_list_video, tables[0]);
        var index = key_list_video.length;
        updateTimeRow(tables[0], index++, json["created_at"]);
        /* Page table */
        updateTable(json, key_list_user, tables[1]);
        /* Comments */
        // updateTable(json, key_list_comment, tables[2]); when verified comments added by iti
    }

	if( ! document.getElementById("place-table").hasChildNodes() ) {
        start(json);
    } else {
        update(json);
	}
    /* Place thumbnails */
    if (!hasPlaceImages && json.media_url) {
        placeImages("place-carousel", "place-thumbnails", "place-preview", [json.media_url]);
        hasPlaceImages = true;
    }
    /* Update reverse search buttons */
    video_thumbnails_lst = json.media_url;
    google_reverse_search_urls = json.reverse_image_thumbnails_search_url_google;
    yandex_reverse_search_urls = json.reverse_image_thumbnails_search_url_yandex;

    /* Display buttons */
    if( ! hasDisplayButtons && ( json.processing_status == 'done' || (json.tweet_text_mentioned_locations.length && json.user_description_mentioned_locations.length) ) ) {
        var tmp = [];
        if (json.user_description_mentioned_locations.length || json.tweet_text_mentioned_locations.length) {
			tmp.push("");
		}
        displayButtons(0 /*json.num_verification_comments when added by iti*/, tmp, true);
        hasDisplayButtons = true;
    }

    /* Update map*/
    if( ( ! hasUpdateMapText && json.tweet_text_mentioned_locations.length ) || ( ! hasUpdateMapDesc && json.user_description_mentioned_locations.length ) ) {
        var tmp = [];
        if (json.tweet_text_mentioned_locations) {
            tmp = tmp.concat(json.tweet_text_mentioned_locations);
            hasUpdateMapText = true;
        }
        if (json.user_description_mentioned_locations) {
            tmp = tmp.concat(json.user_description_mentioned_locations);
            hasUpdateMapDesc = true;
        }
        updateMap(tmp, "", "");
        hasUpdateMap = true;
    }
    // when verified comments added by iti
    // /* Place verification comments */
    // if (!hasPlaceComments && json.processing_status == "done") {
    //     placeComments(json);
    //     hasPlaceComments = true;
    // }
}

/**
* @func request fail callback
*/
function request_fail(msg) 
{
    document.getElementById("api-content").style.display = "none";
    //document.getElementById("place-debunked").style.display = "none";
    document.getElementById("loader").style.display = "none";
    //document.getElementById("loader_tw").style.display = "none";
    var errorElement = document.getElementById("error-content");
    errorElement.innerHTML = msg;
    errorElement.style.display = "block";
}

var analysisUrls = {};

/**
* @func Send requests for video analysis
*/
function video_api_analysis(video_url, isProcess)
{
    cleanElement("fb-content");
    document.getElementById("fb-content").style.display = "none";
    // Video verification V2
    // var analysis_url = "http://caa.iti.gr/verify_videoV2?url=" + video_url;

    //encode video to avoid & problem arguments
    video_url = video_url.replace("&", "%26");

	// to check if it's a facebook video url
	var tmp = video_url.split("facebook.com");
	var is_facebook = ( tmp.length == 2 ? true : false );

    // Video verification V3
    var analysis_url = "https://caa.iti.gr/verify_videoV3?url=" + video_url + "&twtimeline=0";
    if (isProcess) analysis_url += "&reprocess=1";
	if( is_facebook ) analysis_url+= "&fb_access_token="+fb_access_token;
    loaded_tw = false;
    document.getElementById("loader").style.display = "block";
    document.getElementById("api-content").style.display = "none";
    //document.getElementById("place-debunked").style.display = "none";
    document.getElementById("place-carousel").style.display = "none";
    var response_done = false;
    /* return the error message for the error which occur */
    /* function get_error_message(err) {
        switch (err) {
            case "ERROR3":
            case "ERROR4":
                if (global_language == "en")
                    return "Sorry but we cannot process this video link";
                else if (global_language == "fr")
                    return "Pardon, nous ne pouvons pas traiter ce lien vidéo";
            case "ERROR2":
                if (global_language == "en")
                    return "This is a wrong url. Please check it and try again.";
                else if (global_language == "fr")
                    return "Cet url est invalide. Veuillez verifier le lien et réessayer."
            case "share":
                return "";
            case "ERROR5":
                if (global_language == "en")
                    return "No video found in this tweet";
                else if (global_language == "fr")
                    return "Aucune vidéo trouvée dans ce tweet"
            default:
                if (global_language == "en")
                    return "There were an error while trying to process this video. Please check the link and try again.";
                else if (global_language == "fr")
                    return "Une erreur est apparue lors du traitement des la vidéo. Veuillez verifier le lien et réessayer.";
        }
    } */
    /* Get response every 2 second until process done */
    function parse_response(data, url, callback)
	{
        if (analysisUrls.response != url) return;
        callback(data);
        if( data["processing_status"] !== "done" && ! response_done ) {
            $.getJSON(url, function(data) {
                setTimeout(function() {
                    parse_response(data, url, callback)
                }, 2000);
            }).fail(function( jqxhr, textStatus, error ) {
                console.error("parse_response : " + url);
                console.error(textStatus + ", " + error);
                error_type = "default";
                request_fail(json_lang_translate[global_language]["table_error_default"]);
            });
        }
        else {
            response_done = true;
            document.getElementById("loader").style.display = "none";
        }
    }

    function share_fail(msg) 
	{
        document.getElementById("loader_tw").style.display = "none";
        document.getElementById("verif-content").style.display = "none";
        document.getElementById("twitter-shares-content").style.display = "none";
        var errorElement = document.getElementById("error-content-share");
        errorElement.innerHTML = msg;
        errorElement.style.display = "block";
    }

    /* Start Analysis */
    analysisUrls.submit = analysis_url;
    $.getJSON(analysis_url, function(data) 
	{
        document.getElementById("api-content").style.display = "block";
        /* Error Gestion */
        if (json_lang_translate[global_language]["table_error_" + data["status"]] !== undefined)
        {
            console.error("error return : " + analysis_url);
            console.error(data["message"]);
            error_type = data["status"];
            request_fail(json_lang_translate[global_language]["table_error_" + data["status"]]);
            return;
        }
        $.getJSON(analysis_url, function(data) {
            /* Analysis Response */
            var url;
            var callback;
            if (data["youtube_response"] !== null)
            { // YouTube
                url = data["youtube_response"];
                callback = parseYTJson;
                analysisType = "youtube";
            }
            else if (data["facebook_response"] !== null)
            { // Facebook
                url = data["facebook_response"];
                callback = parseFBJson;
                analysisType = "facebook";
            }
            else 
            { // Twitter
                url = data["twitter_response"];
                callback = parseTWJson;
                analysisType = "twitter";
            }
			var is_facebook = false;
            if (url) {
                url = url.replace("&", "%26");	// encode & character to avoid error of arguments
            }
            analysisUrls.response = url;
            $.getJSON(url, function(data) {
                parse_response(data, url, callback);
            }).fail(function(jqxhr, textStatus, error) {
                // console.error("start response : " + url);
                // console.error(textStatus + ", " + error);
                error_type = "default";
				fb_access_token = "";
                request_fail(json_lang_translate[global_language]["table_error_default"]);
            })
            /* Twitter Part response */
            var url_twitter = data["twitter_shares"];
            analysisUrls.tweets = url_twitter;
            /* $.getJSON(url_twitter, function parse_tw(data) {
                if (analysisUrls.tweets != url_twitter)
                    return;
                tw_json = makeJSON(data);
                if (data["processing_status"] != "done") {
                    $.getJSON(url_twitter, function(data) {
                        setTimeout(function() {
                            parse_tw(data);
                        }, 2000);
                    }).fail(function (jqxhr, textStatus, error) {
                        console.error("parse share : " + url_twitter);
                        console.error(textStatus + ", " + error);
                        share_fail(table_error_message[global_language]["default"]);
                    });
                }
                else {
                    loaded_tw = true;
                    loadTimeline();
                    document.getElementById("loader_tw").style.display = "none";
                }
            }).fail(function( jqxhr, textStatus, error ) {
                console.error("start share : " + url_twitter);
                console.error(textStatus + ", " + error);
                share_fail(table_error_message[global_language]["default"]);
            }); */
        }).fail(function(jqxhr, textStatus, error) {
            console.error("get urls : " + analysis_url);
            console.error(textStatus + ", " + error);
            error_type = "default";
            request_fail(json_lang_translate[global_language]["table_error_default"]);
        });
    }).fail(function( jqxhr, textStatus, error ) {
        console.error("start analysis : " + analysis_url);
        console.error(textStatus + ", " + error);
        error_type = "default";
        request_fail(json_lang_translate[global_language]["table_error_default"]);
    });
}

/**
* @func Get the video url and start youtube or facebook analysis 
*/
function submit_form()
{
    //var youtube_url = "https://www.youtube.com/watch?v=";
    var facebook_url = "https://www.facebook.com";
    var twitter_url = "https://twitter.com"
	var url = $("[name=video_url2]").val();
    var reprocessChecked = document.getElementById("api_reprocess").checked;
    document.getElementById("error-content").style.display = "none";
    //document.getElementById("error-content-share").style.display = "none";
    hideButtons();
	if (url != "") {
        cleanElement("place-table");
        //cleanElement("place-debunked");
        if (isYtUrl(url) || url.startsWith(facebook_url) || url.startsWith(twitter_url)) {
            video_api_analysis(url, reprocessChecked);
        }
        else {
            document.getElementById("api-content").style.display = "none";
            //document.getElementById("place-debunked").style.display = "none";
            var errorElement = document.getElementById("error-content");
            errorElement.innerHTML = "Please enter a Youtube, Facebook or Twitter URL";
            errorElement.style.display = "block";
        }
    }
}

var form = document.getElementById("api");
if (form.addEventListener){
	form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e){
	e.preventDefault();
});

/* Google button : thumbnails reverse search */
document.getElementById("google_search_btn").onclick = function() {
    openTab(google_reverse_search_urls);
}

/* Yandex button : thumbnails reverse search */
document.getElementById("yandex_search_btn").onclick = function() {
    openTab(yandex_reverse_search_urls);
};


/* Tineye button : thumbnails reverse search */
document.getElementById("tineye_search_btn").onclick = function() {
    reverseImgSearch("tineye", video_thumbnails_lst);
};

/* Twitter button : search video in twitter */
document.getElementById("twitter_search_btn").onclick = function() {
  openTab(twitter_url);
};

/**
* @func Twitter timeline 
*/
function convertDate(date)
{
    var new_date = new Object();
    lst = String(date).split(" ");
    var new_month = "";
    var new_day = "";
    if (lst[2] !== undefined && lst[2].charAt(0) == "0") {
        new_day = lst[2].replace("0", "");
    }
    else {
        new_day = lst[2];
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var index in months){
        if(lst[1] == months[index])
            new_month = parseInt(index) + 1;
    }
    new_date.month = new_month;
    new_date.day = new_day;
    new_date.year = lst[5];
    if (lst[3] !== undefined) {
    	var hour = lst[3].split(":");
    	new_date.hour = hour[0];
    	new_date.minute = hour[1];
    	new_date.second = hour[2];
	}
    return new_date;
}

/**
* @func Parse the json from twitter api and make json for the timeline 
*/
function makeJSON(data)
{
    var json = "";
    var obj = new Object();
    obj.title = new Object();
    obj.title.media = new Object();
    obj.title.media.url = "img/invid_logo.png";
    obj.title.text = new Object();
    obj.title.text.headline = "Twitter timeline";
    obj.events = [];
    for (var index in data.tweets) {
        obj_ex = new Object();
        obj_ex.media = new Object();
        obj_ex.media.thumbnail = "img/twitter_logo.png";
        obj_ex.start_date = convertDate(data.tweets[index].created_at);
        obj_ex.text = new Object();
        var user =  data.tweets[index].user.screen_name;
        var user_name = data.tweets[index].user.name;
        var user_img = '<img src="' + data.tweets[index].user.profile_image_url_normal + '" />';
        obj_ex.text.headline = user_name + '<a href="https://twitter.com/'+ user + '" target="_blank"> @' + user + "</a>" + " " + user_img;
        obj_ex.text.text = data.tweets[index].text;
        obj.events.push(obj_ex);
    }
    json = obj;
    return json;
}

var loaded_tw = false;

/**
* @func Display timeline (correct display none bug timeline js) 
*/
function loadTimeline()
{
    return;
    /* cleanElement("place-timeline");
    var div = document.getElementById("place-timeline");
    var loader = document.createElement("div");
    loader.setAttribute("id", "loader_tw");
    loader.setAttribute("class", "loader");
    var tl = document.createElement("div");
    tl.setAttribute("id", "timeline-embed");
    tl.setAttribute("style", "width: 100%; height: 600px");
    if (loaded_tw) {
        loader.setAttribute("style", "display: none;");*/
        /* timeline disable */
        /*document.getElementById("twitter-shares-content").setAttribute("style", "display: none");*/
        /*
        if (tw_json.events.length)
            document.getElementById("twitter-shares-content").setAttribute("style", "");
        else
            document.getElementById("twitter-shares-content").setAttribute("style", "display: none");*/
    /*} else {
        loader.setAttribute("style", "display: block;");
        tl.setAttribute("style", "width: 100%; height: 600px; display: none;");
    }
    div.appendChild(loader);
    div.appendChild(tl);
    timeline = new TL.Timeline('timeline-embed', tw_json); */
}

/**
* @func Used for contextual menu 
*/
function callApi(url)
{
    document.getElementById("apibox").value = url;
    submit_form();
}

var video_thumbnails_lst = [];
var twitter_url = "https://twitter.com/search";
var tw_json = "";

/**
* @func Update table language analysis
*/
function updateTableLanguageAnalysis(lang) 
{
    if (document.getElementById("error-content").style.display !== "none") {
        request_fail(json_lang_translate[global_language]["table_error_" + error_type]);
    }
    if (!document.getElementById("place-table").hasChildNodes())
        return;
    var partNames = [];
    var titles = [];
    switch( analysisType ) {
        case "youtube":
            var jsonName = json_lang_translate[lang];
            partNames = [jsonName["youtube_video_title"], jsonName["youtube_channel_title"], jsonName["youtube_comment_title"]]
            titles = titles.concat(list_from_json(jsonName, "youtube_video_name1_"));
            titles = titles.concat(list_from_json(jsonName, "youtube_video_name2_"));
            titles = titles.concat(list_from_json(jsonName, "youtube_channel_name_"));
            titles = titles.concat(list_from_json(jsonName, "youtube_comment_name_"));
            break;
        case "facebook":
            var jsonName = json_lang_translate[lang];
            partNames = [jsonName["facebook_video_title"], jsonName["facebook_page_title"], jsonName["facebook_comment_title"]]
            titles = titles.concat(list_from_json(jsonName, "facebook_video_name_"));
            titles = titles.concat(list_from_json(jsonName, "facebook_page_name_"));
            titles = titles.concat(list_from_json(jsonName, "facebook_comment_name_"));
            break;
        case "twitter":
            var jsonName = json_lang_translate[lang];
            partNames = [jsonName["twitter_video_title"], jsonName["twitter_user_title"]]
            titles = titles.concat(list_from_json(jsonName, "twitter_video_name_"));
            titles = titles.concat(list_from_json(jsonName, "twitter_user_name_"));
            break;
        default:
            return;
    }
    $("#place-table").find("h3").html(function (index) {
        return partNames[index];
    });
    updateTitleTable("place-table", titles);
}
