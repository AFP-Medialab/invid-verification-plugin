import { generateGraphs, exportTweets, setFirstHisto } from "./twitterSnaGraphs.js";

var collect_url = "http://185.249.140.38/twint-wrapper/collect";
var status_url = "http://185.249.140.38/twint-wrapper/status/";

let dev = false;
if (dev) {
    collect_url = "http://localhost:8080/twint-wrapper/collect";
    status_url = "http://localhost:8080/twint-wrapper/status/"
}

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

function stringToList(string) {
    let newStr = string.replace(/@/g, " ");
    let res = newStr.split(" ");
    let res2 = res.filter(function (el) {
        return el != "";
    });
    return res2;

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
        "user_list": stringToList(user),
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
var isFirst = true;
/**
 * @func Submit search form
 */
function submit_sna_form() {
    document.getElementById("top_words_cloud_chart").innerHTML = "";
    let jsonCollectRequest = formToJsonCollectRequest();
    if (jsonCollectRequest == null)
        return;

    $("#twitterStats-loader").css("display", "block");
    

    let response = postRequest(jsonCollectRequest, collect_url);
    if (response == null)
        alert("Bad request");
    response().then((jsonResponse) => {

        if (jsonResponse !== null) {
            waitStatusDone(jsonResponse["session"])

                .then((param) => {
                    function export_all() {
                        exportPDF(document.getElementById("twitterStats-user").value !== "");
                    }
                    function export_tweets() {
                        exportTweets(param["query"]["search"]["search"], new Date(document.getElementById("twitterStats-from-date").value), new Date(document.getElementById("twitterStats-to-date").value));
                    }
                    setFirstHisto(true);
                    if (document.getElementById('exportButton').style.display === 'none')
                     {   
                         document.getElementById('exportButton').addEventListener('click', export_all); 
                        document.getElementById('tweets_export').addEventListener('click', export_tweets);
                    }

                    if (param == null) {
                        console.log("error : timeout, or invalid request");
                        $("#twitterStats-loader").css("display", "none");
                        alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                        return;
                    }
                    else if (param["status"] === "Error") {
                        $("#twitterStats-loader").css("display", "none");
                        alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                        return;
                    }
                    else {
                        console.log("Finished successfully")
                    }

                    $("#twitterStats-Graphs").css("display", "block");


                    
                      
                    (async () => { await generateGraphs(param);  
                     
                    $("#twitterStats-loader").css("display", "none");})();
                });
        }
        else
            window.alert("There was a problem with Twint");
    });

}



var cache_user_time_style = document.getElementById("user_time").style;
var cache_user_chart_width = $("#user_time_chart").width;
async function exportPDF(hasUser) {

    var v = Array.from(document.getElementsByClassName("toggleVisibility"));
    v.forEach(elt => elt.style.display = "none");
    console.log(v);
    
    Array.from(document.getElementsByClassName("export-icon")).forEach(icon => icon.style.display = "none");
    $("#tweets_export").css("display", "none");
    $("#submitSna").css("visibility", "hidden");
    $("#twitterStats-loader").css("display", "block");
    $("#user_time").css("margin-left", -120);

    Plotly.relayout('user_time_chart', { width: 1000});
    var buttons = document.getElementsByClassName("modebar-group");
    Array.from(buttons).forEach(button => button.style = "display: none");

    for (var i = 0; i < 30; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("twitterStats-radios-time").appendChild(br);
    }
    var contents = document.getElementsByClassName("chart_content");
    if (!$("#user_time").is(":visible"))
        $("#user_time").slideToggle();
    $("#user_time").css("padding", 0);

    for (var i = 0; i < 4; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("user_time_chart_content").appendChild(br);
    }
    if (!$("#tweetCounter_contents").is(":visible"))
        $("#tweetCounter_contents").slideToggle();

    for (var i = 0; i < 30; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("tweetCounter_contents").appendChild(br);
    }
    if (!$("#most_retweeted").is(":visible"))
        $("#most_retweeted").slideToggle();

    if (!$("#most_liked").is(":visible"))
        $("#most_liked").slideToggle();

    for (var i = 0; i < 17; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("most_liked").appendChild(br);
    }

    var max = 40;
    if (hasUser)
        max = 17;

    for (var i = 0; i < max; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("top_words_content").appendChild(br);
    }

    if (!$("#hashtag_cloud_chart_content").is(":visible"))
        $("#hashtag_cloud_chart_content").slideToggle();

    if (!$("#top_users_content").is(":visible"))
        $("#top_users_content").slideToggle();


    if (!$("#top_words_content").is(":visible"))
        $("#top_words_content").slideToggle();


    for (var i = 0; i < 20; i++) {
        let br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("top_users_content").appendChild(br);
    }

    /*if (!hasUser)
    for (var i = 0; i < ; i++) {
        var br = document.createElement("br");
        br.className = "toRemove";
        document.getElementById("top_words_chart_content").appendChild(br);
    }*/

    $("#url_array").css("margin-left", -100);
    await ctrlP()//.finally(() => {
        document.getElementById("user_time").style = cache_user_time_style;
        Plotly.relayout('user_time_chart', { width: cache_user_chart_width });

        Array.from(document.getElementsByClassName("toRemove")).forEach(br => br.remove());
        $("#submitSna").css("visibility", "visible");

        $("#exportButton").css("display", "block");
        $("#tweets_export").css("display", "block");
        $("#url_array").css("margin-left", 0);

        Array.from(document.getElementsByClassName("export-icon")).forEach(icon => icon.style.display = "block");
   // });

    async function ctrlP() {
        await delay(500);
        $("#twitterStats-loader").css("display", "none");

        window.print();
    }

};


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
    
    let url = status_url + session;
    let res = null;
    let cpt = 2100;
    while (cpt > 0) {
        const response = getRequest(url);
        await response().then(json => {
            if (json == null)
            {
                return null;
            }
          else if (json["status"] === "Done" || json["status"] === "Error")
                res = json;
            else {

                $("#twitterStats-Graphs").css("display", "block");
                generateGraphs(json);

                setFirstHisto(false);
            }
        });
        if (res !== null)
        {
            return res;
        }
        await delay(10000);
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
    dateFormat: "yy-mm-dd",
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
/*
    if ( div_to_toggle_id === "top_words_content")
        document.getElementById("exportWordsClous").style.display = "block";*/
}

$(document).ready(customSlideToggle("user_time_chart_title", "user_time", global_language));
$(document).ready(customSlideToggle("tweetCounter_title", "tweetCounter_contents", global_language));
$(document).ready(customSlideToggle("retweets_cloud_chart_title", "most_retweeted", global_language));
$(document).ready(customSlideToggle("likes_cloud_chart_title", "most_liked", global_language));
$(document).ready(customSlideToggle("hashtag_cloud_chart_title", "hashtag_cloud_chart_content", global_language));
$(document).ready(customSlideToggle("top_users_pie_chart_title", "top_users_content", global_language));
$(document).ready(customSlideToggle("top_words_cloud_chart_title", "top_words_content", global_language));


