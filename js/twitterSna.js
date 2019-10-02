import { generateGraphs, showEssidHistogram, getNbTweets, mostRetweetPie, mostLikePie, mostTweetPie, topHashtagPie, urlArray } from "./twitterSnaGraphs.js";


//import "html2pdf"
/**
 * Javascript used by twitter service
 */
//import {customSlideToggle} from './html-generate.js'


/**
 * @func Date is valid
 */
function dateIsValide(d) {
    return d instanceof Date && isFinite(d);
}

/**
 * @func Dates are valid
 */
function datesAreValid(from, until) {
    let fromDate = new Date(from);
    let untilDate = new Date(until);
    if (!dateIsValide(fromDate) || !dateIsValide(untilDate))
        return false;
    return fromDate < untilDate;
}

/**
 *
 * @func Make the json string from fields
 *
 */
function formToJsonCollectRequest() {

    document.getElementById("tweetCounter_contents").innerHTML = "";
    document.getElementById("tweets_arr_like_place").innerHTML = "";
    document.getElementById('tweets_arr_place').innerHTML = "";
    document.getElementById('tweets_arr_retweet_place').innerHTML = "";
    document.getElementById('tweets_arr_user_time_place').innerHTML = "";

    let search = document.getElementById("twitterStats-search").value;
    let search_and = document.getElementById("twitterStats-search-and").value;
    let search_or = document.getElementById("twitterStats-search-or").value;
    let search_not = document.getElementById("twitterStats-search-not").value;

    let formLang = document.getElementById("twitterStats-lang").value;
    let user = document.getElementById("twitterStats-user").value;
    let from = document.getElementById("twitterStats-from-date").value;
    let until = document.getElementById("twitterStats-to-date").value;

    let verified = document.getElementById("twitterStats-radio_yes").checked;
    let media = getMediaValue;

    let retweetsHandling = null;

    if (search == "" || from == "" || until == "") {
        alert(json_lang_translate[global_language]["twitterStatsErrorMessage"]);
        return null;
    }

    if (!datesAreValid(from, until)) {
        alert(json_lang_translate[global_language]["DatesAreWrong"]);
        return null;
    }


    let and_list, or_list, not_list = null;

    if (search_and !== "")
        and_list = search_and.trim().split(" ");
    if (search_or !== "")
        or_list = search_or.trim().split(" ");
    if (search_not !== "")
        not_list = search_not.trim().split(" ");

    let searchObj = {
        "search": search,
        "and": and_list,
        "or": or_list,
        "not": not_list
    };

    let CollectRequest = {
        "search": searchObj,
        "lang": formLang,
        "user": user,
        "from": from,
        "until": until,
        "verified": verified,
        "media": media,
        "retweetsHandling": retweetsHandling
    };
    let res = JSON.stringify(CollectRequest, (key, value) => {
        if (value !== null && value !== "")
            return value
    });
    return res;
}

/**
 *
 *  @func Get media value
 *
 * */
function getMediaValue() {
    if (document.getElementById("twitterStats-radio_none").checked)
        return null;
    else if (document.getElementById('twitterStats-radio-image').checked)
        return "image";
    else if (document.getElementById('twitterStats-radio-videos').checked)
        return "video";
    else
        return "both";
}

/**
 * @func Submit search form
 */
function submit_sna_form() {

    let jsonCollectRequest = formToJsonCollectRequest();
    if (jsonCollectRequest == null)
        return;

    $("#twitterStats-loader").css("display", "block");

    let url = "http://185.249.140.38/twitter-gateway/collect";

    let response = postRequest(jsonCollectRequest, url);
    if (response == null)
        alert("Bad request");

    response().then((jsonResponse) => {

        waitStatusDone(jsonResponse["session"])
            .then((param) => {
                // document.getElementById('exportButton').addEventListener('click', () => exportPDF(param["query"]["search"]["search"] + '_' + param["query"]["from"] + '_' + param["query"]["until"] + '.pdf', 'l'));

                if (param == null) {
                    console.log("error : timeout, or invalid request");
                    alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                    $("#twitterStats-loading").css("display", "none");
                    return;
                }
                else if (param["status"] === "Error") {
                    alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                    $("#twitterStats-loading").css("display", "none");
                    return;
                }
                else {
                    console.log("Finished successfully")
                }

                $("#twitterStats-loader").css("display", "none");
                $("#twitterStats-Graphs").css("display", "block");


                generateGraphs(param);
                let givenFrom = document.getElementById("twitterStats-from-date").value;
                let givenUntil = document.getElementById("twitterStats-to-date").value;
                getNbTweets(param, givenFrom, givenUntil);
                if (document.getElementById("twitterStats-user").value != "") {
                    $("#retweets_chart_content").hide();
                    $("#likes_chart_content").hide();
                    $("#top_users_chart_content").hide();
                }
            });
    });

}

/* let elt = document.getElementById(div).innerHTML;
 var opt = {
     filename:     name,
     image:        { type: 'jpeg', quality: 1 },
     jsPDF:        { unit: 'in', format: 'a4', orientation: 'p'}
   };
*/
var
    form = $('#twitterStats-Graphs'),
    cache_width = document.getElementById("user_time_chart_content").style.width,
    a4 = [595.28, 841.89]; // for a4 size paper width and height  

function exportPDF(name) {

    //  $('#exportButton').on('click', function () {  
    //document.getElementById("user_time_chart_content").style.height = a4[1];

    //sdocument.getElementById("user_time_chart_content").style.width = a4[0];
    if (!$("#user_time").is(":visible"))
        $("#user_time").slideToggle();

    // document.getElementById("hashtags_chart_content").style.height = "297mm";
    // if(!$("#hashtag_cloud_chart_content").is(":visible"))
    $("#hashtag_cloud_chart_content").slideToggle();


    //document.getElementById("likes_chart_content").style.height = "297mm";
    if (!$("#most_liked").is(":visible"))
        $("#most_liked").slideToggle();


    //  document.getElementById("retweets_chart_content").style.height = "297mm";
    if (!$("#most_retweeted").is(":visible"))
        $("#most_retweeted").slideToggle();

    //  document.getElementById("retweets_chart_content").style.height = "297mm";
    if (!$("#top_users_content").is(":visible"))
        $("#top_users_content").slideToggle();

    $('body').scrollTop(0);
    createPDF([$('#user_time_chart_content'), $("#retweets_chart_content")]);
    //  });  
    //create pdf  
    function createPDF(forms) {
        var doc = new jsPDF({
            unit: 'px',
            format: 'a4'
        });
        var i = 0;
        getCanvas(forms[0]).then(function (canvas) {
            var
                img = canvas.toDataURL("image/png"),
                img2;
            getCanvas(forms[1]).then(canva => {
                img2 = canva.toDataURL("image/png");

                doc.addImage(img, 'JPEG', 20, 20);
                doc.addPage();
                doc.addImage(img2, 'JPEG', 20, 20);

                doc.save(name);
            })
            // form.width(cache_width);  
        });

    }

    // create canvas object  
    function getCanvas(form) {
        return html2canvas(form, {
            imageTimeout: 2000,
            removeContainer: true
        });
    }

};
(function ($) {
    $.fn.html2canvas = function (options) {
        var date = new Date(),
            $message = null,
            timeoutTimer = false,
            timer = date.getTime();
        html2canvas.logging = options && options.logging;
        html2canvas.preload(this[0], $.extend({
            complete: function (images) {
                var queue = html2canvas.Parse(this[0], images, options),
                    $canvas = $(html2canvas.Renderer(queue, options)),
                    finishTime = new Date();

                $canvas.css({ position: 'absolute', left: 0, top: 0 }).appendTo(document.body);
                $canvas.siblings().toggle();

                $(window).click(function () {
                    if (!$canvas.is(':visible')) {
                        $canvas.toggle().siblings().toggle();
                        throwMessage("Canvas Render visible");
                    } else {
                        $canvas.siblings().toggle();
                        $canvas.toggle();
                        throwMessage("Canvas Render hidden");
                    }
                });
                throwMessage('Screenshot created in ' + ((finishTime.getTime() - timer) / 1000) + " seconds<br />", 4000);
            }
        }, options));

        function throwMessage(msg, duration) {
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function () {
                $message.fadeOut(function () {
                    $message.remove();
                });
            }, duration || 2000);
            if ($message)
                $message.remove();
            $message = $('<div ></div>').html(msg).css({
                margin: 0,
                padding: 10,
                background: "#000",
                opacity: 0.7,
                position: "fixed",
                top: 10,
                right: 10,
                fontFamily: 'Tahoma',
                color: '#fff',
                fontSize: 12,
                borderRadius: 12,
                width: 'auto',
                height: 'auto',
                textAlign: 'center',
                textDecoration: 'none'
            }).hide().fadeIn().appendTo('body');
        }
    };
})(jQuery);
//   printJS('user_time_chart', 'image');



/**
 *
 * @function make a Post request and wait for result
 *
 * */
function postRequest(jsonRequest, url) {
    return async () => {
        const response = await
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonRequest
            });
        if (!response.ok)
            return null;
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        return myJson;
    };
}

/**
 *
 * @function make a Get request and wait for result
 *
 * */
function getRequest(url) {
    return async () => {
        const response = await
            fetch(url, {
                method: 'GET',
            });
        if (!response.ok)
            return null;
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        return myJson;
    };
}

async function waitStatusDone(session) {
    let url = "http://185.249.140.38/twitter-gateway/status/" + session;
    let res = null;
    let cpt = 2100;
    while (cpt > 0) {
        const response = getRequest(url);
        await response().then(json => {
            if (json == null)
                return null;
            else if (json["status"] === "Done" || json["status"] === "Error")
                res = json;
            else {

                $("#twitterStats-Graphs").css("display", "block");
                generateGraphs(json);
                document.getElementById("tweetCounter_contents").innerHTML = "<br><br><b>Please wait while you request isn't finished"

            }
        });
        if (res !== null)
            return res;
        await delay(2000);
        cpt--;
    }
    return null;
}
/*
 * simple wait function
 */
const delay = ms => new Promise(res => setTimeout(res, ms));

/* Add form submit listener */
var form = document.getElementById("twitterStats_form");
if (form) {
    form.addEventListener("submit", submit_sna_form, false);
    form.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}

/* Add dates picker facility */
/*
$(document).ready(function () {
    $("#twitterStats-from-date").datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (dateText, inst) {
            let untilInput = document.getElementById("twitterStats-to-date");
            let untilDate = new Date(untilInput.value);
            let newDate = new Date(dateText);
            if (untilInput.value != "" && newDate < untilDate)
                return;
            newDate.setDate(newDate.getDate() + 1);
            untilInput.value = newDate.toISOString().slice(0, 10);
        }
    });
    $("#twitterStats-to-date").datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (dateText, inst) {
            let fromInput = document.getElementById("twitterStats-from-date");
            let fromDate = new Date(fromInput.value);
            let newDate = new Date(dateText);
            if (fromInput.value != "" && newDate > fromDate)
                return;
            newDate.setDate(newDate.getDate() - 1);
            fromInput.value = newDate.toISOString().slice(0, 10);
        }
    });
});
*/
let datetimePicker_format = {
    dateFormat:"yy-mm-dd",
    timeFormat: "HH:mm:ss"

}

$("#twitterStats-from-date").datetimepicker(datetimePicker_format);
$("#twitterStats-to-date").datetimepicker(datetimePicker_format);


/**
 *
 * Toggle functions for twitter sna features
 */
function customSlideToggle(button_id, div_to_toggle_id, lang) {
    $("#" + button_id).click(function () {
        if ($("#" + div_to_toggle_id).is(":visible"))
            setInnerHtml(button_id, "▼ " + json_lang_translate[lang][button_id]);
        else
            setInnerHtml(button_id, "▲ " + json_lang_translate[lang][button_id]);
        $("#" + div_to_toggle_id).slideToggle(250);
    });
}

$(document).ready(customSlideToggle("user_time_chart_title", "user_time", global_language));
$(document).ready(customSlideToggle("tweetCounter_title", "tweetCounter_contents", global_language));
$(document).ready(customSlideToggle("retweets_cloud_chart_title", "most_retweeted", global_language));
$(document).ready(customSlideToggle("likes_cloud_chart_title", "most_liked", global_language));
$(document).ready(customSlideToggle("hashtag_cloud_chart_title", "hashtag_cloud_chart_content", global_language));
$(document).ready(customSlideToggle("top_users_pie_chart_title", "top_users_content", global_language));


