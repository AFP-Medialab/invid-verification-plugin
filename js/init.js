// Menu items classes
var SHOW_CLASS = 'show';
var HIDE_CLASS = 'hide';
var ACTIVE_CLASS = 'active';

/**
* Javascript runned when all is ready
*/
$(document).ready( function() {

	// Init translations
	translate_csv( url_csv );

	// Popup of home menu on help spans
	$(".home-menu figcaption img, .third-parties-menu figcaption img").on( "click", function() 
	{
		// Modal prefix
		var prefix = $(this).attr("data-prefix");
		
		// Modal title
		var title = $(this).prev().html();
		$("#modal_title").html(title);
		
		// Modal description
		var description = $(this).attr("title");
		$("#modal_description").html(description);
		
		// Modal video
		var video = json_lang_translate[global_language][prefix+"_help_video"]
		if( video != "" ) {
			$("#modal_iframe").prop("src", video );
			$("#modal_iframe").show();
		} else {
			$("#modal_iframe").hide();
		}

		// Modal content
		var content = json_lang_translate[global_language][prefix+"_help_content"];
		if( content != "" ) {
			$("#modal_content").html(content);
			$("#modal_content").show();
		} else {
			$("#modal_content").hide();
		}

		// Modal close button
		$("#modal_close").html(json_lang_translate[global_language]["close"]);
	});

	// Add callback on top menu items
	$('.navbar').on('click', 'li a', function(e) {
		e.preventDefault();
		manage_top_menu_item( this );
	});

	// Add callback on home menu items
	$('.home-menu a').on('click', function(e){
		e.preventDefault();
		manage_tools_menu_item( this, true );
	});

	// Add callback on accordion element
	var acc = document.getElementsByClassName("accordion");
	for( var i = 0; i < acc.length; i++ ) {
		acc[i].onclick = function(){
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
				// Correct Google maps display none bug
				google.maps.event.trigger(map, 'resize');
				triggerMap();
				loadTimeline();
			}
		}
	}

	// Add callback on toogle buttons
	var toogle = document.getElementById("toogle");
	toogle.onclick = function(){
		if( toogle.checked ) {
			document.getElementById("place-lens").style.display = "none";
			document.getElementById("place-inner").style.display = "";
			// Correct display bug
			refreshTest();
		}
		else {
			document.getElementById("place-inner").style.display = "none";
			document.getElementById("place-lens").style.display = "";
			// Correct display bug
			refreshTest2();
		}
	}

	// Add callback on InVID Logo
	document.getElementById("invid-logo").onclick = function(){
		window.open('invid.html','_self',false);
	}

	// Add callback on We Verify Logo
	/* document.getElementById("we-verify-logo").onclick = function(){
		window.open('invid.html','_self',false);
	} */

	// Manages params received in url for right button menu accesses
	checkParam();

	// Correct jquery error 'msie undefined'
	jQuery.browser = { msie: false, version: 0 };
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
});