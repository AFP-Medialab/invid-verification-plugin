/**
 * Javascript used by twitter service
 */
import {generatePieChartQuery, generateEssidHistogramQuery, generateHashtagHistogramQuery, generateHashtagCloudQuery} from './call-elastic.js';

/**
 *
 * @func Make the json string from fields
 *
 */
function formToJsonCollectRequest(search, user, lang, from, until, media, verified, retweetsHandling) {
    var CollectRequest = {
        "search": search,
        "lang": lang,
        "user": user,
        "from": from,
        "until": until,
        "verified": verified,
        "media": media,
        "retweetsHandling": retweetsHandling
    };
    let res =  JSON.stringify(CollectRequest, (key, value) => {
        if (value !== null && value !== "")
            return value
    });
    console.log(res);
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

    let search = document.getElementById("twitterStats-search").value;
    let formlang = document.getElementById("twitterStats-lang").value;
    let user = document.getElementById("twitterStats-user").value;
    let from = document.getElementById("twitterStats-from-date").value;
    let until = document.getElementById("twitterStats-to-date").value;

    let verified = document.getElementById("twitterStats-radio_yes").checked;
    let media = getMediaValue;

    let retweetsHandling = null;


    if (search == "" || from == "" || until == "") {
        alert(json_lang_translate[global_language]["twitterStatsErrorMessage"]);
        return;
    }

    $("#twitterStats-loader").css("display", "block");

    let jsonCollectRequest = formToJsonCollectRequest(search, user,formlang, from, until, media, verified , retweetsHandling);

    let url = "http://localhost:8080/twitter-gateway/collect";

    let response = postRequest(jsonCollectRequest, url);

    response().then((jsonResponse) => {

        waitStatusDone(jsonResponse["session"]).then((param) =>
        {
            if (param == null) {
                console.log("error : timeout");
            }
            else {
                console.log("finished " + param["session"] + "status " + param["status"]);
            }
            $("#twitterStats-loader").css("display", "none");
            
            var cloudlayout = { 
                margin: {l: 0, r: 0, b: 0, t: 0},
                width: 500,
                height: 500
              
            };

            console.log(from);

            var layout = {
                title: 'TimeLine',
                xaxis: {
                  range: [from, until],
                  rangeslider: {range: [param["query"]["from"],  param["query"]["until"]]},
                 },
              };
            generatePieChartQuery(param["session"], param["query"]["from"], param["query"]["until"]).then(plotlyJson => {

                Plotly.newPlot('top_users_pie_chart', plotlyJson);
            });
            generateEssidHistogramQuery(param["session"], true, param["query"]["from"], param["query"]["until"]).then(plotlyJson => {

                Plotly.newPlot('retweet_time_chart', plotlyJson, layout);
            });
            generateEssidHistogramQuery(param["session"], false, param["query"]["from"], param["query"]["until"]).then(plotlyJson => {

                Plotly.newPlot('user_time_chart', plotlyJson, layout);
            }); 
            generateHashtagCloudQuery(param["session"], param["query"]["from"], param["query"]["until"]).then(plotlyJson => {

                Plotly.newPlot('hashtag_cloud_chart', plotlyJson, cloudlayout);
            });//*/

        });
    });
}

/**
 *
 * @function make a Post request and wait for result
 *
 * */
function postRequest(jsonRequest, url)
{
    return async () => {
        const response = await
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonRequest
            });
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
function getRequest(url)
{
    return async () => {
        const response = await
            fetch(url, {
                method: 'GET',
            });
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        return myJson;
    };
}

async function waitStatusDone(session){
    let url = "http://localhost:8080/twitter-gateway/status/" + session;
    let res = null;
    let cpt = 20;
    while (cpt > 0)
    {
        const response = getRequest(url)
        response().then(json => {
            if (json["status"] === "Done" || json["status"] === "Error")
                res = json;
        });
        if (res !== null)
            return res;
        await delay(5000);
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
$(document).ready(function () {
    $("#twitterStats-from-date").datepicker({ dateFormat: 'yy-mm-dd' });
    $("#twitterStats-to-date").datepicker({ dateFormat: 'yy-mm-dd' });
});
