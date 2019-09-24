/**
 * Javascript used by twitter service
 */
import {generatePieChartQuery, generateEssidHistogramQuery, generateHashtagHistogramQuery, generateCloudQuery, generateURLArray, getTweets} from './call-elastic.js';

/**
 *
 * @func Make the json string from fields
 *
 */
function formToJsonCollectRequest(search, search_and, search_or, search_not, user, lang, from, until, media, verified, retweetsHandling) {

    let and_list, or_list, not_list = null;

    if (search_and !== "")
        and_list = search_and.trim().split(" ");
    if (search_or !== "")
        or_list = search_or.trim().split(" ");
    if (search_not !== "")
        not_list = search_not.trim().split(" ");

    let searchObj = {
        "search": search,
        "and" : and_list,
        "or" : or_list,
        "not" : not_list
    }

    let CollectRequest = {
        "search": searchObj,
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
    let search_and  = document.getElementById("twitterStats-search-and").value;
    let search_or  = document.getElementById("twitterStats-search-or").value;
    let search_not = document.getElementById("twitterStats-search-not").value;

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

    let jsonCollectRequest = formToJsonCollectRequest(search, search_and, search_or, search_not,  user,formlang, from, until, media, verified , retweetsHandling);

    let url = "http://localhost:8080/twitter-gateway/collect";

    let response = postRequest(jsonCollectRequest, url);
    if (response == null)
        alert("Bad request");
    response().then((jsonResponse) => {

        waitStatusDone(jsonResponse["session"]).then((param) =>
        {
            if (param == null) {
                console.log("error : timeout, or invalid request");
                alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                return;
            }
            else if (param["statsu"] === "Error"){
                alert(json_lang_translate[global_language]["twitterSnaErrorMessage"]);
                return;
            }
            else{
                console.log("Finished successfully")
            }
            $("#twitterStats-loader").css("display", "none");
            $("#twitterStats-Graphs").css("display", "block");

            generateEssidHistogramQuery(param["session"], false, param["query"]["from"], param["query"]["until"]).then(plotlyJson => {
                var layout = {
                    overflow: "visible",
                    margin: {l: 0, r: 0, b: 50, t: 50},
                    xaxis: {
                      range: [from, until],
                      rangeslider: {range: [param["query"]["from"],  param["query"]["until"]]},
                     },
                  };
                Plotly.newPlot('user_time_chart', plotlyJson, layout, {displayModeBar: false});
            }); 

            generateCloudQuery(param["session"], "nretweets", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 700,
                    height: 700,
                };
                Plotly.newPlot('retweets_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
            });
            generateCloudQuery(param["session"], "nlikes", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 700,
                    height: 700,
                };
                Plotly.newPlot('likes_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
            });
            //Utilisateurs les actifs
            generateCloudQuery(param["session"], "ntweets", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = {
                    automargin: true,
                    width: 700,
                    height: 700,
                };

                var plot = document.getElementById("top_users_pie_chart");
                  
             

                Plotly.newPlot('top_users_pie_chart', plotlyJson, cloudlayout, {displayModeBar: false});
                displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility");
                
             


            });
          
            generateCloudQuery(param["session"], "hashtags", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 700,
                    height: 700,
                };
                Plotly.newPlot('hashtag_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
            });
          

            generateURLArray(param["session"], from, until).then(arrayStr => {
                document.getElementById('url_array').innerHTML = arrayStr;
            });

        });
    });
}

function displayTweetsOfUser(plot, place, button)
{

    var visibilityButton = document.getElementById(button);
    plot.on('plotly_click', data => {
        var json = getTweets();
        console.log(data);
        var tweetArr ='<table>' +
                '<tr>' +
                    '<td>Date</td>' +
                    '<td>Tweet</td>' +
                    '<td>Nb of retweets</td>' +
                '</tr>';
        json.hits.hits.forEach(tweetObj => {
            if (tweetObj._source.username === data.points[0].label)
            {
                let date = new Date(tweetObj.fields.date[0]);
                    tweetArr += '<tr><td>' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' +
                                            date.getHours() + 'h' + date.getMinutes() + '</td>' + 
                                     '<td>' + tweetObj._source.tweet + '</td>' +
                    '<td>' + tweetObj._source.nretweets + '</td></tr>';
                
            }
        });
        var tweetPlace = document.getElementById(place);

        tweetPlace.innerHTML = "Tweets of " + data.points[0].label+ "<br><br>" +  tweetArr;
        tweetPlace.style.display = "block";
        visibilityButton.style.display = "block";
       console.log(json);
     //   plotlyJson.labels.array.forEach(label => {
            
       // });
    })
    
    visibilityButton.onclick = e => {
           var elt = document.getElementById("tweets_arr_place");
           elt.style.display = "none";
           visibilityButton.style.display = 'none';
    }
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
function getRequest(url)
{
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

async function waitStatusDone(session){
    let url = "http://localhost:8080/twitter-gateway/status/" + session;
    let res = null;
    let cpt = 2100;
    while (cpt > 0)
    {
        const response = getRequest(url);
        response().then(json => {
            if (json["status"] === "Done" || json["status"] === "Error")
                res = json;
            else if(json == null)
                return null;
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
