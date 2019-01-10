/* 
* Set here your own Tracking ID 
* See config.js !
*/
var trackingID = config_google_analytics_key;

window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#edece8",
        "text": "#000000"
      },
      "button": {
        "background": "#136899",
        "text": "#ffffff"
      }
    },
    "position" : "top",
    "type": "opt-in",
    "revokable": true,
    "law.regionalLaw": false,
    "content": {
      "message": "Please, let us use cookies to improve the plugin by collecting anonymized usage data.",
      "dismiss": "Keep Disabled",
      "allow": "OK"
    },
    onInitialise: function (status) {
      if (status === "allow") {
        enableTracking();
        ga('send', 'pageview');
      }
    },
    onStatusChange: function(status, chosenBefore) {
      if (status === "allow") {
        enableTracking();
        ga('send', 'pageview');
      } else {
        disableTracking();
      }
    },
    onRevokeChoice: function() {
      disableTracking();
    }
  })}
  );

function enableTracking() {
  window['ga-disable-'+trackingID] = false;
}

function disableTracking() {
  window['ga-disable-'+trackingID] = true;
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','js/analytic-local.js','ga');

window['ga-disable-'+trackingID] = true;
ga('create', trackingID, 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('set', 'page', page_name);
ga('set', 'anonymizeIp', true);
