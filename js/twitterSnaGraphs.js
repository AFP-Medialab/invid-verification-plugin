import {generatePieChartQuery, generateEssidHistogramQuery, generateHashtagHistogramQuery, generateCloudQuery, generateURLArray, getTweets, generateTweetCount} from './call-elastic.js';


function getNbTweets(param, givenFrom, givenUntil){
    generateTweetCount(param["session"], givenFrom,givenUntil).then(res => {
        let counter = document.createElement("div");
        counter.setAttribute("id", "counter_number");
        let nb_text = document.createTextNode(res.value);
        counter.appendChild(nb_text);

        let tweetDiv = document.createElement("div");
        let tweetText = document.createTextNode("Tweets");
        tweetDiv.appendChild(tweetText);


        document.getElementById("tweetCounter_contents").appendChild(counter);
        document.getElementById("tweetCounter_contents").appendChild(tweetDiv);
        
    })
}


function showEssidHistogram(param, givenFrom, givenUntil){
    generateEssidHistogramQuery(param["session"], false, param["query"]["from"], param["query"]["until"]).then(plotlyJson => {
        var layout = {
            title: param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
            automargin: true,
            xaxis: {
                range: [givenFrom, givenUntil],
                rangeslider: {range: [param["query"]["from"],  param["query"]["until"]]},
            },
            autosize: true
        };

        var config = {
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: param["query"]["search"]["search"] + "_" + param["query"]["from"] + "_" + param["query"]["until"] + "_Timeline",
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [[ "toImage" ]], displaylogo: false
          };

        let plot = document.getElementById("user_time_chart");
        Plotly.newPlot('user_time_chart', plotlyJson,  layout, config);
        displayTweetsOfDate(plot, "tweets_arr_user_time_place", "user_time_tweets_toggle_visibility");

        Array.from(document.getElementsByClassName("infolayer")).forEach(title => title.style = "display: none");
    });
}


function mostRetweetPie(param, givenFrom, givenUntil){
    generateCloudQuery(param["session"], "nretweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title: param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: param["query"]["search"]["search"] + "_" + param["query"]["from"] + "_" + param["query"]["until"] + "_Retweets",
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [[ "toImage" ]], displaylogo: false
          };


        var plot = document.getElementById("retweets_cloud_chart");
        Plotly.newPlot('retweets_cloud_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility');

        Array.from(document.getElementsByClassName("infolayer")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

function mostLikePie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], "nlikes", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: param["query"]["search"]["search"] + "_" + param["query"]["from"] + "_" + param["query"]["until"] + "_Likes",
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [[ "toImage" ]], displaylogo: false
          };

        let plot = document.getElementById("likes_cloud_chart");
        Plotly.newPlot('likes_cloud_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility');

        Array.from(document.getElementsByClassName("infolayer")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

function mostTweetPie(param, givenFrom, givenUntil){
    //Utilisateurs les actifs
    generateCloudQuery(param["session"], "ntweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title: param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: param["query"]["search"]["search"] + "_" + param["query"]["from"] + "_" + param["query"]["until"] + "_Tweets",
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [[ "toImage" ]], displaylogo: false
          };


        var plot = document.getElementById("top_users_pie_chart");
        Plotly.newPlot('top_users_pie_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility");

        Array.from(document.getElementsByClassName("infolayer")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

function topHashtagPie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], "hashtags", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: param["query"]["search"]["search"] + "_" + param["query"]["from"] + "_" + param["query"]["until"] + "_Hashtags",
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [[ "toImage" ]], displaylogo: false
          };

        let plot = document.getElementById("hashtag_cloud_chart");
        Plotly.newPlot('hashtag_cloud_chart', plotlyJson, cloudlayout, config);
        plot.on('plotly_click', data => {
            //  document.getElementById("twitterStats-search").value = data.points[0].label;
            // document.getElementById("twitterStats-Graphs").style.display = "none";
            //  Array.from(document.getElementsByClassName("toggleVisibility")).forEach(elt => elt.style.display = "none")
            let win = window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');

        });


        Array.from(document.getElementsByClassName("infolayer")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);

    });


}

function urlArray(param, givenFrom, givenUntil){
    generateURLArray(param["session"], givenFrom, givenUntil).then(arrayStr => {
        document.getElementById('url_array').innerHTML = arrayStr;
    });
}


export function generateGraphs(param){
    let givenFrom = document.getElementById("twitterStats-from-date").value;
    let givenUntil = document.getElementById("twitterStats-to-date").value;

    showEssidHistogram(param, givenFrom, givenUntil);
    getNbTweets(param, givenFrom, givenUntil);
    mostRetweetPie(param, givenFrom, givenUntil);
    mostLikePie(param, givenFrom, givenUntil);
    mostTweetPie(param, givenFrom, givenUntil);
    topHashtagPie(param, givenFrom, givenUntil);
    urlArray(param, givenFrom, givenUntil);
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
                    console.log(pointDate);
                    console.log(objDate);
                    if ((((pointDate.getDate() === objDate.getDate()
                        && (pointDate.getHours() >= objDate.getHours() -2 && pointDate.getHours() <= objDate.getHours() +2)))
                        || (pointDate.getDate() === objDate.getDate() +1 && objDate.getHours() >= 22 && pointDate.getHours() <= 2))
                        && pointDate.getMonth() === objDate.getMonth()
                        && pointDate.getFullYear() === objDate.getFullYear())
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
    });

    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
    }
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
