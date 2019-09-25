/**
 * Javascript used by twitter service
 */
import {generatePieChartQuery, generateEssidHistogramQuery, generateHashtagHistogramQuery, generateCloudQuery, generateURLArray, getTweets} from './call-elastic.js';
//import {customSlideToggle} from './html-generate.js'
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

    document.getElementById("tweets_arr_like_place").innerHTML = "";
    document.getElementById('tweets_arr_place').innerHTML = "";
    document.getElementById('tweets_arr_retweet_place').innerHTML = "";
    document.getElementById('tweets_arr_user_time_place').innerHTML = "";
    
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

        waitStatusDone(jsonResponse["session"])
        .then((param) =>
        {
            document.getElementById('exportButton').addEventListener('click', () => exportPDF('twitterStats-Graphs', search + '_' + from + '_' + until + '.pdf', 'l'));
       
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
                    automargin: true,
                   // margin: {l: 0, r: 0, b: 50, t: 50},
                    xaxis: {
                      range: [from, until],
                      rangeslider: {range: [param["query"]["from"],  param["query"]["until"]]},
                     },
                    // height: 390,
                  };
                  console.log($("#user_time").is(":visible"));
                  
                
                var plot = document.getElementById("user_time_chart");
                Plotly.newPlot('user_time_chart', plotlyJson, layout, {displayModeBar: false});
                displayTweetsOfDate(plot, "tweets_arr_user_time_place", "user_time_tweets_toggle_visibility");
            }); 

            generateCloudQuery(param["session"], "nretweets", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 500,
                    height: 500,
                };


                
                var plot = document.getElementById("retweets_cloud_chart");
                Plotly.newPlot('retweets_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
                displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility');

                unrotateMainHashtag(search);
            });
            generateCloudQuery(param["session"], "nlikes", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 500,
                    height: 500,
                };
               
               
                var plot = document.getElementById("likes_cloud_chart");
                Plotly.newPlot('likes_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
                displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility');

                unrotateMainHashtag(search);
            });
            //Utilisateurs les actifs
            generateCloudQuery(param["session"], "ntweets", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = {
                    automargin: true,
                    width: 500,
                    height: 500,
                }; 
                
                var plot = document.getElementById("top_users_pie_chart");
                Plotly.newPlot('top_users_pie_chart', plotlyJson, cloudlayout, {displayModeBar: false});
                displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility");

                unrotateMainHashtag(search);
            });
          
            generateCloudQuery(param["session"], "hashtags", from, until, param["query"]["search"]["search"]).then(plotlyJson => {
                var cloudlayout = { 
                    automargin: true,
                    width: 500,
                    height: 500,
                };
                
                
                var plot = document.getElementById("hashtag_cloud_chart");
                Plotly.newPlot('hashtag_cloud_chart', plotlyJson, cloudlayout, {displayModeBar: false});
                plot.on('plotly_click', data => {
                  //  document.getElementById("twitterStats-search").value = data.points[0].label;
                   // document.getElementById("twitterStats-Graphs").style.display = "none";
                  //  Array.from(document.getElementsByClassName("toggleVisibility")).forEach(elt => elt.style.display = "none")
                    var win = window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');
                   
                });

                unrotateMainHashtag(search);
                
                    
            });
            
            generateURLArray(param["session"], from, until).then(arrayStr => {
                document.getElementById('url_array').innerHTML = arrayStr;
            });

        })

        

    })
        
}

function exportPDF(div, name)
{	

    document.getElementById("user_time_chart_content").style.height = "297mm";
   
    if(!$("#user_time").is(":visible"))
        $("#user_time").slideToggle();

   
    document.getElementById("hashtags_chart_content").style.height = "297mm";
    if(!$("#hashtag_cloud_chart_content").is(":visible"))
        $("#hashtag_cloud_chart_content").slideToggle();

   
    document.getElementById("likes_chart_content").style.height = "297mm";
    if(!$("#most_liked").is(":visible"))
        $("#most_liked").slideToggle();

    
    document.getElementById("retweets_chart_content").style.height = "297mm";
    if(!$("#most_retweeted").is(":visible"))
        $("#most_retweeted").slideToggle();
  
    document.getElementById("retweets_chart_content").style.height = "297mm";
    if(!$("#top_users_content").is(":visible"))
        $("#top_users_content").slideToggle();

    let elt = document.getElementById(div);
    var opt = {
        filename:     name,
        image:        { type: 'jpeg', quality: 1 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'p'}
      };
    html2pdf().set(opt).from(elt).save();
}

function unrotateMainHashtag(search)
{
    Array.from(document.getElementsByClassName("slicetext")).forEach(slice => {
        if (slice.dataset.unformatted === search)
        {
            var transform = slice.getAttribute("transform");

            let translates = transform.split(/rotate\(...\)/);
            let newTransform = "";
            translates.forEach(translate => newTransform += translate);
            slice.setAttribute("transform", newTransform);
            
        }
    })
}

function displayTweetsOfDate(plot, place, button)
{
    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);
    plot.on('plotly_click', data =>
                {

                    var json = getTweets();
                    var tweetArr ='<table>' +
                    '<tr>' +
                        '<td>Username</td>' +
                        '<td>Date</td>' +
                        '<td>Tweet</td>' +
                        '<td>Nb of retweets</td>' +
                    '</tr>';
                    data.points.forEach(point => {
                        json.hits.hits.forEach(tweetObj => {
                            if (tweetObj._source.username === point.data.name)
                            {
                                var pointDate = new Date(point.x);
                                var objDate = new Date(tweetObj._source.date);
                                if (pointDate.getDate() === objDate.getDate() 
                                && pointDate.getMonth() === objDate.getMonth() 
                                && pointDate.getFullYear() === objDate.getFullYear() 
                                && (pointDate.getHours() >= objDate.getHours() -2 && (pointDate.getHours() <= objDate.getHours() +1 || (pointDate.getHours() <= objDate.getHours() +2 && objDate.getMinutes() > 30))))
                                {
                                    let date = new Date(tweetObj.fields.date[0]);
                                    tweetArr += '<tr><td><a  href="https://twitter.com/' + point.data.name + '" target="_blank">' + point.data.name + '</a></td><td>' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' +
                                                            date.getHours() + 'h' + date.getMinutes() + '</td>' + 
                                                     '<td>' + tweetObj._source.tweet + '</td>' +
                                    '<td>' + tweetObj._source.nretweets + '</td></tr>';
                                }
                            }
                        });
                    });
                    tweetPlace.innerHTML = tweetArr;
                    tweetPlace.style.display = "block";
                    visibilityButton.style.display = "block";
                 
                })

                visibilityButton.onclick = e => {
                    tweetPlace.style.display = "none";
                    visibilityButton.style.display = 'none';
                }
}

function displayTweetsOfUser(plot, place, button)
{

    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);
    plot.on('plotly_click', data => {
        var json = getTweets();
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

        tweetPlace.innerHTML = 'Tweets of <a  href="https://twitter.com/' + data.points[0].label + '" target="_blank">' 
             + data.points[0].label+ "</a><br><br>" +  tweetArr;
        tweetPlace.style.display = "block";
        visibilityButton.style.display = "block";
     //   plotlyJson.labels.array.forEach(label => {
            
       // });
    })
    
    visibilityButton.onclick = e => {
           tweetPlace.style.display = "none";
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
    console.log("waitStatusDone start");
    let cpt = 2100;
    while (cpt > 0)
    {
        const response = getRequest(url);
        await response().then(json => {
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
