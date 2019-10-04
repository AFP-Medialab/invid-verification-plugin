import {generateEssidHistogramQuery, generateCloudQuery, generateURLArray, getTweets, generateTweetCount} from './call-elastic.js';


export function getNbTweets(param, givenFrom, givenUntil){
    generateTweetCount(param["session"], givenFrom,givenUntil).then(res => {
        document.getElementById("tweetCounter_contents").innerHTML = "";
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
    generateEssidHistogramQuery(param["session"], false, param["query"]["from"], param["query"]["until"], givenFrom, givenUntil).then(plotlyJson => {
        var layout = {
            title: "<b>Propagation Timeline</b> - " + param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
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

            responsive: true,
            modeBarButtons: [[ "toImage" ]],
            displaylogo: false
          };

          let plot = document.getElementById("user_time_chart");
          if (plotlyJson.length !== 0)
                Plotly.newPlot('user_time_chart', plotlyJson,  layout, config);
               
          displayTweetsOfDate(plot, "tweets_arr_user_time_place", "user_time_tweets_toggle_visibility");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");

    });
}


export function mostRetweetPie(param, givenFrom, givenUntil){
    generateCloudQuery(param["session"], "nretweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title: "<b>Most retweeted users</b><br>" + param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
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
        Plotly.react('retweets_cloud_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility', "retweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

export function mostLikePie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], "nlikes", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most liked users</b><br>" + param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
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
        Plotly.react('likes_cloud_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility', "likes");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

export function mostTweetPie(param, givenFrom, givenUntil){
    //Utilisateurs les actifs
    generateCloudQuery(param["session"], "ntweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title:"<b>Most active users</b><br>" + param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
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
        Plotly.react('top_users_pie_chart', plotlyJson, cloudlayout, config);
        displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility", "tweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

var firstTopUsers = true;
export function topHashtagPie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], "hashtags", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most associated hashtags</b><br>" + param["query"]["search"]["search"] + " " +  param["query"]["from"] + " " +  param["query"]["until"],
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
        Plotly.react('hashtag_cloud_chart', plotlyJson, cloudlayout, config);
        if (firstTopUsers)
            plot.on('plotly_click', data => {
                //  document.getElementById("twitterStats-search").value = data.points[0].label;
                // document.getElementById("twitterStats-Graphs").style.display = "none";
                //  Array.from(document.getElementsByClassName("toggleVisibility")).forEach(elt => elt.style.display = "none")
                let win = window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');

                firstTopUsers = false;
            });



        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);

    });


}

export function urlArray(param, givenFrom, givenUntil){
    generateURLArray(param["session"], givenFrom, givenUntil).then(arrayStr => {
        document.getElementById('url_array').innerHTML = arrayStr;
    });
}

var firstHisto = true;
export function setFirstHisto(first)
{
    firstHisto = first
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

    if (firstHisto)
    plot.on('plotly_click', data =>
    {
        var json = getTweets();

        var tweetArr ='<table id="tweet_view_histo" class="table" cellspacing="0" style="width: 100%">' +
            '<colgroup>' +
                '<col span=1 class="username_col" />' +
                '<col span=1 class="date_col" />' +
                '<col span=1 class="tweet_col" />' +
                '<col span=1 class="nb_tweet_col" />' +
            '</colgroup>';

        tweetArr += '<thead><tr><th>Username</th><th>Date</th><th>Tweet</th><th>Nb of retweets</th></tr></thead><tbody>';

        let isDays = (((new Date(data.points[0].data.x[0])).getDate() - (new Date(data.points[0].data.x[1])).getDate()) !== 0);
       
        data.points.forEach(point => {
        json.hits.hits.forEach(tweetObj => {
            if (tweetObj._source.username === point.data.name)
            {
                var pointDate = new Date(point.x);
                var objDate = new Date(tweetObj._source.date);
                if (isInRange(pointDate, objDate, isDays))
                {
                    let date = new Date(tweetObj._source.date);
                    tweetArr += '<tr><td><a  href="https://twitter.com/' + point.data.name + '" target="_blank">' + point.data.name + '</a></td>' + 
                    '<td>' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' +
                        date.getHours() + 'h' + date.getMinutes() + '</td>' +
                        '<td>' + tweetObj._source.tweet + '</td>' +
                        '<td>' + tweetObj._source.nretweets + '</td></tr>';
                }
            }
        });
    });
        tweetArr += "</tbody><tfoot></tfoot></table>"
        tweetPlace.innerHTML = tweetArr;
        tweetPlace.style.display = "block";
        visibilityButton.style.display = "block";
       
           
     //   $(document).ready(function () {
            $('#tweet_view_histo').DataTable({
                "columnDefs": [
            { "orderable": false, "targets": 2 }
            ]
              });
            $('.dataTables_length').addClass('bs-select');
     //   });

        firstHisto = false
    })

    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
    }
}
var firstUser = true;
function displayTweetsOfUser(plot, place, button, nb_type)
{

    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);
    if (firstUser)
    plot.on('plotly_click', data => {
        var json = getTweets();
        var tweetArr = '<table class="tweet_view">' +
        '<colgroup>' +
            '<col span=1 class="date_col" />' +
            '<col span=1 class="tweet_col" />' +
            '<col span=1 class="nb_tweet_col" />';
             
            if (nb_type === 'tweets')
                tweetArr += '<col span=1 class="nb_tweet_col" />';

        tweetArr += '</colgroup>';

        tweetArr += '<tr><th scope="col">Date</th><th scope="col">Tweet</th>';
        if (nb_type !== "retweets")
            tweetArr += '<th scope="col">Nb of likes</th>';
        if (nb_type !== "likes")
            tweetArr += '<th scope="col">Nb of retweets</th>';

        tweetArr += '</tr><tbody>';
        json.hits.hits.forEach(tweetObj => {
            if (tweetObj._source.username === data.points[0].label)
            {
                let nb;
                if (nb_type === "retweets")
                    nb = tweetObj._source.nretweets;
                else
                    nb = tweetObj._source.nlikes;
                let date = new Date(tweetObj._source.date[0]);
                tweetArr += '<tr><td>' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' +
                    date.getHours() + 'h' + date.getMinutes() + '</td>' +
                    '<td>' + tweetObj._source.tweet + '</td>' +
                    '<td>' + nb + '</td>';
                if (nb_type === "tweets")
                    tweetArr += '<td>' + tweetObj._source.nretweets + '</td>';

                tweetArr += '</tr>';

            }
        });

        tweetArr += "</tbody></table>";
        tweetPlace.innerHTML = 'Tweets of <a  href="https://twitter.com/' + data.points[0].label + '" target="_blank">'
            + data.points[0].label+ "</a><br><br>" +  tweetArr;
        tweetPlace.style.display = "block";
        visibilityButton.style.display = "block";
        //   plotlyJson.labels.array.forEach(label => {

        // });

        firstUser = false;
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

function isInRange(pointDate, objDate, isDays)
{
    if (!isDays)
        return ((((pointDate.getDate() === objDate.getDate()
                && (pointDate.getHours() >= objDate.getHours() -2 && pointDate.getHours() <= objDate.getHours() +2)))
                || (pointDate.getDate() === objDate.getDate() +1 && objDate.getHours() >= 22 && pointDate.getHours() <= 2))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear())
    else
        return (pointDate.getDate() === objDate.getDate() 
            &&  pointDate.getMonth() === objDate.getMonth()
            &&  pointDate.getFullYear() === objDate.getFullYear());
}
