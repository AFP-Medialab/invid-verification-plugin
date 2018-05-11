$(document).ready(function() {

  var RIGHTS_API = "https://rights-api.dev.rhizomik.net/";
  var RIGHTS_APP = "https://rights.dev.rhizomik.net/";
  var YOUTUBE_VIDEOS = ["https://www.youtube.com/watch?v=", "https://youtu.be/"];

  $("#copyright-form_submit").click(function(event) {
    event.preventDefault();
    var videoURL = $("#copyright-video_url").val();
    $("#copyright-loader").css("display", "block");
    $("#copyright-error").css("display", "none");
    $("#copyright-content").css("display", "none");
    $("#copyright-summary").empty();

    if (YOUTUBE_VIDEOS.some(function(prefix){return videoURL.startsWith(prefix);})) {
      $.ajax(RIGHTS_API+'youTubeVideos', {
        data: JSON.stringify({"url": videoURL}),
        contentType: 'application/json',
        type: 'POST',
        dataType: "json",
        success: function (data) {
          $.get(data._links.user.href, function (channel) {
            data.channel = channel;
            $.get(data._links.reuseTerms.href, function (terms) {
              data.terms = terms._embedded.defaultReuseTerms;
              data.RIGHTS_APP = RIGHTS_APP;
              $.get("copyright.thtml", function (template) {
                var applyTemplate = _.template(template);
                $("#copyright-summary").html(applyTemplate(data));
                $("#copyright-loader").css("display", "none");
                $("#copyright-content").css("display", "block");
              });
            });
          });
        },
        error: function (response, status, error) {
          $("#copyright-error").html(status + ": " + response.responseJSON.message);
          $("#copyright-loader").css("display", "none");
          $("#copyright-error").css("display", "block");
        }
      });
    } else {
      $("#copyright-error").html("Please enter a valid Youtube video URL");
      $("#copyright-loader").css("display", "none");
      $("#copyright-error").css("display", "block");
    }
  });

});