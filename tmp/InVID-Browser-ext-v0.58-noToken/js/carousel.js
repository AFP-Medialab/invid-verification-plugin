jssor_1_slider_init = function() {

  var jssor_1_options = {
    $AutoPlay: false,
    $AutoPlaySteps: 4,
    $SlideDuration: 160,
    $SlideWidth: 200,
    $SlideSpacing: 3,
    $Cols: 4,
    $ArrowNavigatorOptions: {
      $Class: $JssorArrowNavigator$,
      $Steps: 3
    },
    $BulletNavigatorOptions: {
      $Class: $JssorBulletNavigator$,
      $SpacingX: 1,
      $SpacingY: 1
    }
  };

  var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
};