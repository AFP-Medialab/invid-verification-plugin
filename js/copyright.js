$(document).ready(function() {
  var RIGHTS_API = "https://rights-api.invid.udl.cat";
  var RIGHTS_APP = "https://rights.invid.udl.cat";
  var UGV_URLS = {
    "YouTube": ["youtube.com", "youtu.be"],
    "Facebook": ["facebook.com"],
    "Twitter": ["twitter.com"]
  };
  var ENDPOINTS = {
    "YouTube": { API: "youTubeVideos", APP: "youtube" },
    "Facebook": { API: "facebookVideos", APP: "facebook" },
    "Twitter": { API: "twitterVideos", APP: "twitter" }
  };

  $("#copyright-form_submit").click(function(event) {
    event.preventDefault();
    showSpinner();
    var videoURL = $("#copyright-video_url").val();

    var ugvKind = _.keys(UGV_URLS).filter(function(kind) {
      return UGV_URLS[kind].some(function(prefix) {
        return videoURL.indexOf(prefix)>=0;
      })
    });

    if (ugvKind.length > 0) {
      $.ajax(RIGHTS_API + "/" + ENDPOINTS[ugvKind[0]].API, {
        data: JSON.stringify({"url": videoURL}),
        contentType: "application/json",
        type: "POST",
        dataType: "json",
        success: function (data) {
          data.ugvKind = ugvKind;
          data.RIGHTS_APP = RIGHTS_APP + "/" + ENDPOINTS[ugvKind[0]].APP;
          $.when(
            $.get(data._links.reuseTerms.href),
            $.get(data._links.user.href)).then(function (terms, user) {
              data.terms = terms[0]._embedded.defaultReuseTerms;
              data.user = user[0];
              renderCopyrightTemplate(data);
            });
        },
        error: function (response, status, error) {
          displayErrorMessage(status + ": " + ((response.responseJSON != undefined) ? response.responseJSON.message : "servor not responding. Try again later."));
        }
      });
    } else {
      displayErrorMessage(
          "Please enter a valid Youtube, Twitter or Facebook video URL");
    }
  });

  function renderCopyrightTemplate(data) {
    $.get("copyright.html", function (template) {
      var applyTemplate = _.template(template);
      $("#copyright-summary").html(applyTemplate(data));
      $("#copyright-loader").css("display", "none");
      $("#copyright-content").css("display", "block");
    });
  }

  function showSpinner() {
    $("#copyright-loader").css("display", "block");
    $("#copyright-error").css("display", "none");
    $("#copyright-content").css("display", "none");
    $("#copyright-summary").empty();
  }

  function displayErrorMessage(message) {
    $("#copyright-error").html(message);
    $("#copyright-loader").css("display", "none");
    $("#copyright-error").css("display", "block");
  }

});
