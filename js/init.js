// Menu items classes
var SHOW_CLASS = 'show';
var HIDE_CLASS = 'hide';
var ACTIVE_CLASS = 'active';

// Facebook access token
// To do => init with the cookie if available
var fb_access_token = "";

/**
* Javascript runned when all is ready
*/
$(document).ready( function() {

	// Init translations
	translate_csv( url_csv );

	// Add callback on InVID Logo
	$("#invid-logo img").on( "click", function() {
		// window.open("invid.html",'_self',false);
		window.open("we-verify.html",'_self',false);
	});

	// Add callback on We Verify Logo
	$("#we-verify-logo img").on( "click", function() {
		window.open("we-verify.html",'_self',false);
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


	// Popup of home menu on help spans
	$(".home-menu figcaption img, .third-parties-menu figcaption img").on( "click", function() 
	{
		// Modal prefix
		var prefix = $(this).attr("data-prefix");

		// Modal title
		var title = $(this).prev().html();
		$("#help_modal_title").html(title);
		
		// Modal description
		var description = $(this).attr("title");
		$("#help_modal_description").html(description);
		
		// Modal content
		var content = json_lang_translate[global_language][prefix+"_help_content"];
		if( content != "" ) {
			$("#help_modal_text").html(content);
			$("#help_modal_text").show();
		} else {
			$("#help_modal_text").hide();
		}

		// Modal video
		var video = json_lang_translate[global_language][prefix+"_help_video"];
		if( video != "" ) {
			$("#help_modal_iframe").prop("src", video );
			$("#help_modal_iframe").show();
		} else {
			$("#help_modal_iframe").hide();
		}

		// Modal close button
		$("#help_modal_close").html(json_lang_translate[global_language]["close"]);
	});

	// Stop iframe videos on help popup close
	$("#help_modal").on("hidden.bs.modal", function() {
		$("#help_modal_iframe").prop("src", "");
	});

	// Accordion of classroom lessons
	$(".resources-title").on( "click", function() {
		$(".resources-content").hide();
		$(this).next().fadeIn(500);
	});

	// Manages params received in url for right button menu accesses
	checkParam();

	// Correct jquery error 'msie undefined'
	jQuery.browser = { msie: false, version: 0 };
	if( navigator.userAgent.match(/MSIE ([0-9]+)\./) ) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}

	// Facebook connect callback to retrieve token
	window.addEventListener( 'message', function(e) {
		fb_access_token = e.data[1];
//		alert(fb_access_token);
		$('iframe').hide();
	}, false);

	// Select current language
	select_current_language( global_language );
});
