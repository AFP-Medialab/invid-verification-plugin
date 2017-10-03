/* Navigation bar*/
(function( $ ) {
  // constants
  var SHOW_CLASS = 'show',
      HIDE_CLASS = 'hide',
      ACTIVE_CLASS = 'active';
  
  $( '.navbar' ).on( 'click', 'li a', function(e){
    e.preventDefault();
    var $tab = $( this ),
         href = $tab.attr( 'href' );
  
     $( '.active' ).removeClass( ACTIVE_CLASS );
     $tab.addClass( ACTIVE_CLASS );
  
     $( '.show' )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        .removeClass( SHOW_CLASS )
        .addClass( HIDE_CLASS )
        .hide();
    
      $(href)
        .removeClass( HIDE_CLASS )
        .addClass( SHOW_CLASS )
        .hide()
        .fadeIn( 550 );
  });
})( jQuery );


/* Accordion element */
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
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

function checkParam(){
  var url = String(document.URL);
  if (url.includes("?img=") || url.includes("?video=")){
    var SHOW_CLASS = 'show',
    HIDE_CLASS = 'hide',
    ACTIVE_CLASS = 'active';

    $( '.active' ).removeClass( ACTIVE_CLASS );

    $( '.show' )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    .removeClass( SHOW_CLASS )
    .addClass( HIDE_CLASS )
    .hide();
    
    if (url.includes("?img=")){
      $('#magnifier')
      .removeClass( HIDE_CLASS )
      .addClass( SHOW_CLASS )
      .hide()
      .fadeIn( 550 );
      $tab = $("#magnifier_tab")
      $tab.addClass( ACTIVE_CLASS );

      callMagnifier(url.split("?img=")[1]);
    } else {
      $('#api')
      .removeClass( HIDE_CLASS )
      .addClass( SHOW_CLASS )
      .hide()
      .fadeIn( 550 );
      $tab = $("#api_tab")
      $tab.addClass( ACTIVE_CLASS );

      callApi(String(url.split("?video=")[1]));
    }
  }
}
checkParam();

/*Correct jquery error 'msie undefined'*/
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();