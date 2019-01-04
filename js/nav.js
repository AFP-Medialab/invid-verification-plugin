// menu items classes
var SHOW_CLASS = 'show';
var HIDE_CLASS = 'hide';
var ACTIVE_CLASS = 'active';

/**
* @func Maps google analytics tags from wanted service
*/
function id_to_name(id) 
{
	switch( id ) {
		case "api":
			return "analysis";
		case "keyframes":
			return "keyframes";
		case "video":
			return "thumbnails";
		case "twitter":
			return "twitter";
		case "magnifier":
			return "magnifier";
		case "metadata":
			return "metadata";
		case "copyright-tab":
			return "copyright";
		case "forensic":
			return "forensic";
		case "about":
			return "about";
		case "survey":
			return "survey";
		case "tutorial":
			return "tutorial";
		case "classroom":
			return "classroom";
		default :
			return "";
	}
}

/**
* @func Manages top menu links
*/
function manage_top_menu_item( item ) 
{
	var tab = $( item );
	var href = tab.attr('href');

	ga('set', 'page', "/invid.html#" + id_to_name(href.split("#").pop()));
	ga('send', 'pageview');

	$('.active').removeClass( ACTIVE_CLASS );
	tab.addClass( ACTIVE_CLASS );

	if( href == "invid.html" || href == "#tools" ) {
		toggle_left_menu( false, href );
	} else {
		toggle_left_menu( true, href );
	}

	$('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
	$(href).removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
}

/**
* @func Manages tools menu links
*/
function manage_tools_menu_item( item, toggle ) 
{
	var tab = $(item);
	var href = tab.attr('href');

	ga('set', 'page', "/invid.html#" + id_to_name(href.split("#").pop()));
	ga('send', 'pageview');

	$("#myNavBar li a").each(function(){
		$(this).removeClass(ACTIVE_CLASS);
	});
	$("#api_tab a").addClass(ACTIVE_CLASS);

	$("#left_menu div a").each(function(){
		$(this).removeClass(ACTIVE_CLASS);
	});
	$(".home-menu div a").each(function(){
		$(this).removeClass(ACTIVE_CLASS);
	});
	tab.addClass(ACTIVE_CLASS);

	if( toggle ) {
		if( href == "invid.html" || href == "#tools" ) {
			toggle_left_menu( false, href );
		} else {
			toggle_left_menu( true, href );
		}
	}

	$('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
	$(href).removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
}

/**
* @func Display or hide left menu of services
*/
function toggle_left_menu( visible, href )
{
	if( visible && href != "#tutorial" && href != "#about" && href != "#survey" && href != "#classroom" ) {
		$("#left_menu").html( $("#home_menu" ).html() );
		$("#left_menu div").each( function() {
			$(this).removeClass("col-md-2 col-sm-3 col-xs-6");
			$(this).addClass("col-sm-12 col-xs-12");
			$(this).css("padding-left", 0);
			$(this).css("padding-right", 0);
		});
		$('#left_menu a').on('click', function(e){
			e.preventDefault();
			manage_tools_menu_item( this, false );
		});
		$("#left_menu").show();
	} else {
		$("#left_menu").hide();
	}
	if( href == "invid.html" || href == "#tools" ) {
		$("#home").show();
	} else {
		$("#home").hide();
	}
}

$('.navbar').on('click', 'li a', function(e) {
	e.preventDefault();
	manage_top_menu_item( this );
});

$('.home-menu a').on('click', function(e){
	e.preventDefault();
	manage_tools_menu_item( this, true );
});

/* Accordion element */
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
            /* Correct Google maps display none bug */
            google.maps.event.trigger(map, 'resize');
            triggerMap();
            loadTimeline();
        }
    }
}

/* Toogle Button */
var toogle = document.getElementById("toogle");
toogle.onclick = function(){
	if (toogle.checked) {
		document.getElementById("place-lens").style.display = "none";
		document.getElementById("place-inner").style.display = "";
		/* Correct display bug */
		refreshTest();
	}
	else {
		document.getElementById("place-inner").style.display = "none";
		document.getElementById("place-lens").style.display = "";
		/* Correct display bug */
		refreshTest2();
	}
}

/* InVID Logo */
document.getElementById("invid-logo").onclick = function(){
    window.open('invid.html','_self',false);
}

/* We Verify Logo */
/* document.getElementById("we-verify-logo").onclick = function(){
    window.open('invid.html','_self',false);
} */

/**
* @func Check tools params 
*/
function checkParam()
{
	var url = String( document.URL );
	if( url.includes("?img=") || url.includes("?video=") || url.includes("?imgforen=") )
	{
		$('.active').removeClass( ACTIVE_CLASS );
		$('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
		if( url.includes("?img=") ) 
		{
			$('#magnifier').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#magnifier_tab").addClass( ACTIVE_CLASS );
			callMagnifier(url.split("?img=")[1]);
		} 
		else if( url.includes("?imgforen=") ) 
		{
			$('#forensic').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#forensic_tab").addClass( ACTIVE_CLASS );
			callForensic(url.split("?imgforen=")[1]);
		} 
		else 
		{
			$('#api').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#api_tab").addClass( ACTIVE_CLASS );
			callApi(String(url.split("?video=")[1]));
		} 
	}
}
checkParam();

/* Correct jquery error 'msie undefined' */
jQuery.browser = { msie: false, version: 0 };
if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
	jQuery.browser.msie = true;
	jQuery.browser.version = RegExp.$1;
}
