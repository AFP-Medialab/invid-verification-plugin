/**
* Javascript used to launch magnification of an image
*/

/**
* @func callback added to div of id test
*/
function refreshTest() 
{
	$('#test').elevateZoom({
		scrollZoom : true,
		zoomType: "inner",
		cursor: "crosshair",
		zoomWindowFadeIn: 500,
		zoomWindowFadeOut: 750
	}); 
}

/**
* @func callback added to div of id test2
*/
function refreshTest2()
{
	$("#test2").elevateZoom({
		scrollZoom : true,
		zoomType : "lens",
		lensShape : "round",
		lensSize : 200
	});
}