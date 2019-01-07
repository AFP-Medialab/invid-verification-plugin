/**
* Javascript used to manage navigation actions
*/

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
	update_tools_menu( global_language );

	$('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
	$(href).removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
}

/**
* @func Manages tools menu links
*/
function manage_tools_menu_item( item, toggle, wanted_tab ) 
{
	if( wanted_tab ) {
		var tab = wanted_tab;
	} else {
		var tab = $(item);
	}
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

	// move_activ_left_menu_item_to_first_position();
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
		$("#left_menu").html("");
		$("#left_menu").hide();
	}
	if( href == "invid.html" || href == "#tools" ) {
		$("#home").show();
	} else {
		$("#home").hide();
	}
}

/**
* @func Move the activ left menu item on first position
*/
function move_activ_left_menu_item_to_first_position()
{
	var current = null;
	$("#left_menu div figure a.active").each( function() {
		current = $(this).parent().parent();
	});
	if( current != null ) {
		var item = current.html();
		current.remove();
		var items = $("#left_menu").html();
		items = '<div class="col-sm-12 col-xs-12" style="padding-left: 0px; padding-right: 0px;">' + item + '</div>' + items;
		$("#left_menu").html( items );
	}
	// To do : re-add callbacks on items !!!
}

/**
* @func Check tools params 
*/
function checkParam()
{
	var url = String( document.URL );
	var item = "";
	if( url.includes("?img=") || url.includes("?video=") || url.includes("?imgforen=") )
	{
		$('.active').removeClass( ACTIVE_CLASS );
		$('.show').removeClass( SHOW_CLASS ).addClass( HIDE_CLASS ).hide();
		if( url.includes("?img=") ) 
		{
			$('#magnifier').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#magnifier_menu_tab").addClass( ACTIVE_CLASS );
			item = $("#magnifier_menu_tab");
			callMagnifier( url.split("?img=")[1] );
		} 
		else if( url.includes("?imgforen=") ) 
		{
			$('#forensic').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#forensic_menu_tab").addClass( ACTIVE_CLASS );
			item = $("#forensic_menu_tab");
			callForensic (url.split("?imgforen=")[1] );
		} 
		else 
		{
			$('#api').removeClass( HIDE_CLASS ).addClass( SHOW_CLASS ).hide().fadeIn( 550 );
			$("#api_menu_tab").addClass( ACTIVE_CLASS );
			item = $("#api_menu_tab");
			callApi( String( url.split("?video=")[1] ) );
		}
		manage_tools_menu_item( "", true, item );
	}
}
