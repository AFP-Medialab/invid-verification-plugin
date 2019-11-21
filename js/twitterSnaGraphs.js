
import { generateEssidHistogramPlotlyJson, generateWordCloudPlotlyJson, generateDonutPlotlyJson, generateURLArrayHTML, getTweets, generateTweetCountPlotlyJson } from './call-elastic.js';
import "../js/d3.js"
import "../js/html2canvas/dist/html2canvas.js"
import "../js/FileSaver.js"
import * as data from '../js/stopwords.js'

var stopwords = data.default;
var tweetIE_URL = 'http://185.249.140.38/weverify-twitie/process?annotations=:Person,:UserID,:Location,:Organization'; //'https://cloud-api.gate.ac.uk/process-document/annie-named-entity-recognizer?annotations=:Person,:UserID,:Location,:Organization'//


//For words cloud generation loader
var nb_treated, nb_tweets;



//Call all the graph generation handling the display
export function generateGraphs(param) {
    let givenFrom = param["query"]["from"];
    let givenUntil = param["query"]["until"];

    var entries = {
        from: document.getElementById("twitterStats-from-date").value,
        until: document.getElementById("twitterStats-to-date").value,
        search: {
            search: document.getElementById("twitterStats-search").value,
            and : document.getElementById("twitterStats-search-and").value.split(' ')
        },
        user_list: document.getElementById("twitterStats-user").value.split(" "),
        session: param.session
    }
    
    return getNbTweets(entries).then(() => {

        if (nb_tweets === 0)
        {
            document.getElementById("retweets_chart_content").style.display = "none";
            document.getElementById("likes_chart_content").style.display = "none";
            document.getElementById("top_users_chart_content").style.display = "none";
            document.getElementById("hashtags_chart_content").style.display = "none";
            document.getElementById("top_words_chart_content").style.display = "none";
            document.getElementById("user_time_chart_content").style.display = "none";
            document.getElementById("tweetCounter_div").style.display = "none";
            document.getElementById("url_array").style.display = "none";
            if (firstHisto)
            document.getElementById("noTweets").style.display = "block";
            $("#exportButton").css("display", "none"); $("#tweets_export").css("display", "none");
            
        }
        else
        {
            document.getElementById("noTweets").style.display = "none";
            $("#exportButton").css("display", "block"); $("#tweets_export").css("display", "block");
            
            if (document.getElementById("twitterStats-user").value === "")
            {
            
                document.getElementById("retweets_chart_content").style.display = "block";
                document.getElementById("likes_chart_content").style.display = "block";
                document.getElementById("top_users_chart_content").style.display = "block"; 
                document.getElementById("hashtags_chart_content").style.display = "block";
                document.getElementById("top_words_chart_content").style.display = "block";
                document.getElementById("user_time_chart_content").style.display = "block";
                document.getElementById("tweetCounter_div").style.display = "block";
                document.getElementById("url_array").style.display = "block";
            }
            else
            {
                document.getElementById("retweets_chart_content").style.display = "none";
                document.getElementById("likes_chart_content").style.display = "none";
                document.getElementById("top_users_chart_content").style.display = "none"; 
                document.getElementById("hashtags_chart_content").style.display = "block";
                document.getElementById("top_words_chart_content").style.display = "block";
                document.getElementById("user_time_chart_content").style.display = "block";
                document.getElementById("tweetCounter_div").style.display = "block";
                document.getElementById("url_array").style.display = "block";
            }

                mostRetweetPie(entries);
                mostLikePie(entries);
                mostTweetPie(entries);
            topHashtagPie(entries);
            urlArray(entries);
            if (firstHisto)
                mostUsedWordsCloud(entries);
              
            return showEssidHistogram(entries, givenFrom, givenUntil);
        }
    })

}


//Functions building the charts

    //Timeline Chart
async function showEssidHistogram(param, givenFrom, givenUntil) {
    var plotlyJson = await generateEssidHistogramPlotlyJson(param, false, givenFrom, givenUntil)//.then(plotlyJson => {

        var layout = {
            title: "<b>Propagation Timeline</b> - " + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            xaxis: {
                range: [ param["from"], param["until"]],
                rangeslider: { range: [givenFrom, givenUntil] },
            },
            annotations: [{
                xref: 'paper',
                yref: 'paper',
                x: 1.2,
                xanchor: 'right',
                y: -0.4,
                yanchor: 'top',
                text: 'we-verify.eu',
                showarrow: false
              }],
            autosize: true
        };

        var config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Timeline",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },

            responsive: true,
            modeBarButtons: [["toImage"]],
            displaylogo: false
        };

        let plot = document.getElementById("user_time_chart");
        if (plotlyJson.length !== 0)
            Plotly.newPlot('user_time_chart', plotlyJson, layout, config);

        if (firstHisto)
            displayTweetsOfDate(plot, "tweets_arr_user_time_place", "user_time_tweets_toggle_visibility", param["search"]["search"].replace(" ", '&').replace(/#/g, ""));

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        Array.from(document.getElementsByClassName("annotation")).forEach(title => title.style = "display: none");
        return plotlyJson;
   // });
}

    //Tweets Count
function getNbTweets(param, givenFrom, givenUntil) {
    return generateTweetCountPlotlyJson(param, givenFrom, givenUntil).then(res => {
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
        nb_tweets = res.value;
    })
}

    //Most retweeted users chart
function mostRetweetPie(param) {
    generateDonutPlotlyJson(param, "nretweets").then(plotlyJson => {
        
        var cloudlayout = generateLayout("<b>Most retweeted users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"]);
        var config = generateConfig(param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Retweets");

        var plot = document.getElementById("retweets_cloud_chart");
        Plotly.react('retweets_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility', "retweets", param["search"]["search"].replace(/ /g, "&"));

            Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
            Array.from(document.getElementsByClassName("annotation")).forEach(title => title.style = "display: none");
        
        unrotateMainHashtag(param["search"]["search"]);
    });
}


    //Most liked user chart
function mostLikePie(param) {
    generateDonutPlotlyJson(param, "nlikes").then(plotlyJson => {
        let cloudlayout = generateLayout("<b>Most liked users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"])
           
        var config = generateConfig(param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Likes");

        let plot = document.getElementById("likes_cloud_chart");
        Plotly.react('likes_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility', "likes", param["search"]["search"].replace(/ /g, "&"));

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        Array.from(document.getElementsByClassName("annotation")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);
    });
}

    //Most activ users chart
function mostTweetPie(param) {
    //Utilisateurs les actifs
    generateDonutPlotlyJson(param, "ntweets").then(plotlyJson => {
        var cloudlayout = generateLayout("<b>Most active users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"]);

        var config = generateConfig(param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Tweets");

        var plot = document.getElementById("top_users_pie_chart");
        Plotly.react('top_users_pie_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility", "tweets", param["search"]["search"].replace(/ /g, "&"));

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        Array.from(document.getElementsByClassName("annotation")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);
    });
}

    //Most used hashtags chart
function topHashtagPie(param) {
    generateDonutPlotlyJson(param, "hashtags").then(plotlyJson => {

        let cloudlayout = generateLayout("<b>Most associated hashtags</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"]);

        var config = generateConfig(param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Hashtags");

        let plot = document.getElementById("hashtag_cloud_chart");
        Plotly.react('hashtag_cloud_chart', plotlyJson, cloudlayout, config);

       // document.getElementById("hashtag_cloud_chart").firstChild.firstChild.firstChild.append('');
        if (firstHisto)
            plot.on('plotly_click', data => {
                let win = window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');

                firstTopUsers = false;
            });



        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        Array.from(document.getElementsByClassName("annotation")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);

    });


}

    //Most used words in tweets chart
var serverDown = false;
async function mostUsedWordsCloud(param) {
    let mainArr = param["search"]["search"].split(' ').map(word => word.replace('#', ""));
    let mainWord = param["search"]["search"].replace(/ /g, "_");
    stopwords["glob"] = [...stopwords["glob"], ...mainArr, mainWord];

    if (param["search"]["and"] !== undefined)
        stopwords["glob"] = [...stopwords["glob"], ...param["search"]["and"]];
    var words_map = new Map();
    
    generateWordCloudPlotlyJson(param).then(json => {
        $('.top_words_loader').css('display', "block");
        nb_treated = 0;
        var tokens_JSON = {
            locations: [],
            organisations: [],
            userIDs: [],
            persons: [],
        }

        var tweetIE = {text: ""};

        const forLoop = async () => {
            var hits = Array.from(json.hits.hits);
            for (var i = 0; i < hits.length; i++) {
                tweetIE.text = hits[i]._source.tweet;
                nb_treated++;
                if (!serverDown)
                {
                    const tweetie_json = await buildTweetieJson(tweetIE)

                    if (tweetie_json.error !== undefined)
                    {
                        if (tweetie_json.error > 500)
                            serverDown = true;
                    }
                    else
                    {
                        tokens_JSON.locations = [...tokens_JSON.locations, ...tweetie_json.locations];
                        tokens_JSON.persons = [...tokens_JSON.persons, ...tweetie_json.persons];
                        tokens_JSON.organisations = [...tokens_JSON.organisations, ...tweetie_json.organisations];
                        tokens_JSON.userIDs = [...tokens_JSON.userIDs, ...tweetie_json.userIDs];
                    }
                }
                var map = getOccurences(tweetIE);

                document.getElementById('progress_state_place').innerHTML = nb_treated + '/' + nb_tweets;
                for (var word in map) {

                    if(word.length > 1)
                        words_map.set(word, (words_map.get(word)|| 0) + map[word]);
                }
    
            };

        }
        forLoop().then(() => {
               
            var final_map = getnMax(words_map, 100);
            var words_arr = Array.from(final_map.keys());
            var words =  words_arr.map(word => {
                let obj = { text: word, size: final_map.get(word), color: getColor(word, tokens_JSON) }; 
                return obj;
            });

            var fontScale = d3.scaleLinear()
                                    .domain([0, d3.max(words, function(d) { return d.size} )])
                                    .range([10, 95]);
            
            var layout = d3.layout  .cloud()
                                    .size([500, 500])
                                    .words(words)

                                    .padding(5)
                                    .rotate(function () { return (~~(Math.random() * 6) - 3) * 15; })
                                    .font("Impact")
                                    .fontSize(d => fontScale(d.size))
                                    .on("end", draw);
            
                    
            layout.start();


            function fillColor(d) {
                return d.color;
            }
            function draw(words) {
                if (!serverDown)
                    document.getElementById("top_words_cloud_chart").innerHTML = "";
                else
                  document.getElementById("top_words_cloud_chart").innerHTML = '<p style="color: red">We were unable to fetch named entities</p>';

                var svg = d3.select("#top_words_cloud_chart").append("svg")
                            .attr("width", layout.size()[0])
                            .attr("height", layout.size()[1])
                            .append("g")
                            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function (d) { return d.size + "px"; })
                            .style("font-family", "Impact")
                            .attr("text-anchor", "middle")
                            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                            .text(function (d) { return d.text; })
                            .style("fill", fillColor)
                            .style("cursor", "default")
                            .on("click", d => displayTweetsOfWord(d.text, "tweets_word_arr_place", "top_words_tweets_toggle_visibility", param["search"]["search"].replace(/ /g, "&").replace(/#/g, "")))
                            .append("svg:title")
                            .text(d => "Used " + final_map.get(d.text) + " times");

                var width = 300, height = 300;

                $('.top_words_loader').css('display', "none");
                document.getElementById('progress_state_place').innerHTML = "";


                d3  .select('#exportWordsCloudJpg')
                    .on('click', 
                        () => {
                            
                            svgString2Image(svg._parents[0].parentNode, 2 * width, 2 * height, 'png', save);
                    
                            function save(dataBlob, filesize) {
                                saveAs(dataBlob, 'WordCloud_' + param.search.search.replace(" ", "") + "_" + param.from + "_" + param.until + '.png');
                            }
                    });
                d3  .select('#exportWordsCloudSvg')
                    .on('click', 
                        () => {
                            var svgEl = document.getElementById("top_words_cloud_chart").children[0];
                            svgDownload(svgEl, 'WordCloud_' + param.search.search.replace(" ", "") + "_" + param.from + "_" + param.until + '.svg');

                        })
                    
            }
        });
    })
}
    //URL array
function urlArray(param) {
    generateURLArrayHTML(param).then(arrayStr => {
        document.getElementById('url_array').innerHTML = arrayStr;
    });
}



// Functions building plots needed

    //Generate the layouts
function generateLayout(title)
{
    return {
        title: title,
        automargin: true,
        width: 500,
        height: 500,
        annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 1,
            xanchor: 'bottom',
            y: 0,
            yanchor: 'right',
            text: 'we-verify.eu',
            showarrow: false
          }]
        
    }
}

    //Generate config
function generateConfig(title)
{
    return {
        toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: title,
            scale: 0.8 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtons: [["toImage"]], displaylogo: false
    };
}

//Function helping building words cloud

    //Check if a tweet is English or French (May change for language detection allowing other languages)
function isEnglish(text)
{
    var percentEnglish = 0.00;
    var percentFrench = 0.00;
    var englishLenght = stopwords["en"].length;
    var frenchLenght = stopwords["fr"].length;

    stopwords["en"].forEach(stopword => {
        if (text.includes(" " + stopword + " "))
            percentEnglish += 1;
    })
    stopwords["fr"].forEach(stopword => {
        if (text.includes(" " + stopword + " "))
            percentFrench += 1;
    })

    percentEnglish = percentEnglish / englishLenght * 100;
    percentFrench = percentFrench / frenchLenght * 100;

    return (percentEnglish > percentFrench);
}

    //Count the number of occurence of each word in a tweet
function getOccurences(tweet) {

    var treatedTweet = tweet.text;

                               //Put the tweet in lower case
    treatedTweet = treatedTweet.toLowerCase()
                               //Remove URLS
                               .replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')
                               //Remove ponctuation, numbers & emoticones
                               .replace(/[\.\(\)0-9\!\?\'\’\‘\"\:\,\/\\\%\>\<\«\»\'\#\ \;\-\&\|]+|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g, " ")

    if (treatedTweet === "")
        return [];
            
    var counts = treatedTweet.split(' ') //=> Array of words
                            //Count the number of occurence of each word (except stopwords cf. js/stopwords.js) & return the associated map
                             .reduce(function (map, word) {
                                if (!stopwords[(isEnglish(treatedTweet))?"en":"fr"].includes(word) && !stopwords["glob"].includes(word))
                                {
                                    map[word] = (map[word] || 0) + 1;
                                    if (word.includes('_'))
                                    {
                                        word.split('_').forEach(w => { 
                                            if (!stopwords[(isEnglish(treatedTweet))?"en":"fr"].includes(w) && !stopwords["glob"].includes(w))
                                                map[w] = (map[w] || 0) + 1; 
                                        })
                                    }
                                    
                                }
                                return map;
                            }, Object.create(null));

    return counts;
}

    //Get the n element which have the greatest values in a map
function getnMax(map, n) {
    const mapSort = new Map([...map.entries()].filter(elt => elt[1] > 1).sort((a, b) => b[1] - a[1]));
    let res_map = new Map([...mapSort.entries()].splice(0, n));
    return (res_map);

}

    //Call tweetie and build a json with named entities
async function buildTweetieJson(tweet) {
    const tweetIEcall = async () => {
        const response = await fetch(tweetIE_URL, {
            method: 'POST',
            body:
                tweet.text,
            headers: {
                'Content-Type': 'text/plain'
            } 
        })

            if (!response.ok) {
                return {
                   error: response.status
                }
            }
            const tweetIE_JSON1 = await response.json();
           
            let tweet_tmp = tweet.text;

            const tweetIE_JSON = tweetIE_JSON1['response']['annotations'];
            var persons = [];
            var organisations = [];
            var userIDs = [];
            var locations = []

            if (tweetIE_JSON[':Location'] !== undefined)
            tweetIE_JSON[':Location'].forEach(location => {
                let loc = tweet_tmp.substring(location.start, location.end);
                let loc_ = loc.replace(/ /g, '_').toLowerCase();
                tweet.text = tweet.text.replace(loc, loc_);
                if (!locations.includes(loc.toLowerCase()))
                    locations = [...locations, loc_];
            })

            if (tweetIE_JSON[':Organization'] !== undefined)
            tweetIE_JSON[':Organization'].forEach(organisation => {
                let orga = tweet_tmp.substring(organisation.start, organisation.end);
                let orga_ = orga.replace(/ /g, '_').toLowerCase();
                tweet.text = tweet.text.replace(orga, orga_);
                if (!organisations.includes(orga.toLowerCase()))
                    organisations = [...organisations, orga_];
            })

            if (tweetIE_JSON[':Person'] !== undefined)
            tweetIE_JSON[':Person'].forEach(person => {
                let firstname = person['features'].firstName;
                let lastname = person['features'].surname;

                if (firstname !== undefined && lastname !== undefined)
                {
                    let fullname = firstname.toLowerCase() + '_' + lastname.toLowerCase();
                    
                    tweet.text = tweet.text.replace(firstname + ' ' + lastname, fullname);
                    if (!persons.includes(fullname))
                        persons = [...persons, fullname, lastname.toLowerCase()];
                }
                else if (firstname !== undefined)
                    persons = [...persons, firstname.toLowerCase()];
                else if (lastname !== undefined)
                    persons = [...persons, lastname.toLowerCase()];
            })

            if (tweetIE_JSON[':UserID'] !== undefined)
            tweetIE_JSON[':UserID'].forEach(user => {
                userIDs.push(tweet.text.substring(user.start -1, user.end).toLowerCase());
            })

            const tokens_JSON = {
                locations: locations,
                organisations: organisations,
                userIDs: userIDs,
                persons: persons,
            }
            return tokens_JSON;
        }
    return tweetIEcall().then(res => res);
}

    //Get the color associated with the named entities
function getColor(word, tokens_JSON)
{
    if (tokens_JSON.persons.includes(word)) return '8242BB';
    if (tokens_JSON.organisations.includes(word)) return 'BB424F';
    if (tokens_JSON.userIDs.includes(word)) return '42BB9E';
    if (tokens_JSON.locations.includes(word)) return 'BB7042';
    
    return '35347B';
}

// For donuts query when central hashtag is too big prevent from being vertical
function unrotateMainHashtag(search) {
    Array.from(document.getElementsByClassName("slicetext")).forEach(slice => {
        if (slice.dataset.unformatted === search) {
            var transform = slice.getAttribute("transform");

            let translates = transform.split(/rotate\(...\)/);
            let newTransform = "";
            translates.forEach(translate => newTransform += translate);
            slice.setAttribute("transform", newTransform);
        }
    })
}


//Download functions

    //Download as PNG
function svgString2Image(svg, width, height, format, callback) {
var format = format ? format : 'png';

svg.style.backgroundColor = "white";
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svg);

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

var DOMURL = self.URL || self.webkitURL || self;

var svg = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8'
});

var url = DOMURL.createObjectURL(svg);
var image = new Image();
image.addEventListener('load', function() {  
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob(function(blob) {
        var filesize = Math.round(blob.length / 1024) + ' KB';
        if (callback) callback(blob, filesize);
    });
});

image.setAttribute("src", url);

image.onerror = error => {return alert("IMG ERROR: " + error);}

}

    //Download as SVG
function svgDownload(svgEl, name)
{

    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    downloadLink.click();
}

    //Download tweets ad CSV
export function exportTweets(search, start, end)
{
    var csvArr =  "";
    var json = getTweets();
    csvArr += "Username,Date,Tweet,Nb of retweets, Nb of likes\n";

    json.hits.hits.forEach(tweetObj => 
    {        
        var date = new Date(tweetObj._source.date);

        csvArr += tweetObj._source.username  + ',' + 
        date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
        tweetObj._source.tweet + '",' + tweetObj._source.nretweets + ',' + tweetObj._source.nlikes + '\n';
    })  
    
    var blob = new Blob([csvArr], { type: 'text/csv;charset=utf-8;' });

       // var encodedUri = encodeURI(csvArr);
       var url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "tweets_" + search.replace(/ /g, "&").replace(/#/g, "") + '_' + start.getDate() + '-' + (start.getMonth()+1) + '-' + start.getFullYear() + '_' + start.getHours() + 'h' + start.getMinutes() + '_' + end.getDate() + '-' + (end.getMonth()+1) + '-' + end.getFullYear() + '_' + end.getHours() + 'h' + end.getMinutes() + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


}

var firstHisto = true;
export function setFirstHisto(first) {
    firstHisto = first
}




// When a chart is clicked: To display the tweets of each chart

    //For TimeLine Chart
function displayTweetsOfDate(plot, place, button, search) {
    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);
    var exportButton = document.getElementById("user_time_tweets_export");
    var csvArr = "data:text/csv;charset=utf-8,";
    var fullDate = "";
    var json = getTweets();
    var maxDate;
    var minDate;
        plot.on('plotly_click', data => {

            var tweetArr = '<table id="tweet_view_histo" class="table" cellspacing="0" style="width: 100%">';

            tweetArr += '<thead><tr><th class="tweet_arr_users">Username</th><th class="tweet_arr_date">Date</th><th class="tweet_arr_tweets">Tweet</th><th class="tweet_arr">Nb of retweets</th></tr></thead><tbody>';
            csvArr += "Username,Date,Tweet,Nb of retweets\n";
            let isDays = (((new Date(data.points[0].data.x[0])).getDate() - (new Date(data.points[0].data.x[1])).getDate()) !== 0);
            let i = 0;
            data.points.forEach(point => {
                var pointDate = new Date(point.x);
                json.hits.hits.forEach(tweetObj => {
                    if (tweetObj._source.username === point.data.name) {
                        var objDate = new Date(tweetObj._source.date);
                        if (isInRange(pointDate, objDate, isDays)) {
                            if (minDate === undefined)
                                minDate = objDate;
                            if (maxDate === undefined)
                                maxDate = objDate;
                            let date = new Date(tweetObj._source.date);
                            tweetArr += '<tr><td class="tweet_arr tweet_arr_users"><a  href="https://twitter.com/' + point.data.name + '" target="_blank">' + point.data.name + '</a></td>' +
                                '<td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '<br /> ' +
                                date.getHours() + 'h' + date.getMinutes() + '</td>' +
                                '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                                '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td></tr>';
                            csvArr += point.data.name + ',' + 
                                      date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
                                      tweetObj._source.tweet + '",' + tweetObj._source.nretweets + '\n';
                        
                            if (minDate > objDate)
                            {
                                minDate = objDate
                            }
                            if (maxDate < objDate)
                            {
                                maxDate = objDate;
                            }
                           
                        }
                    }  
                });
                i++;
            });
            if (minDate !== undefined)
            {
            fullDate = minDate.getDate() + '.' + (minDate.getMonth()+1) + '.' + minDate.getFullYear() + '_' + minDate.getHours() + 'h' + minDate.getMinutes() + '_' +
                       maxDate.getDate() + '.' + (maxDate.getMonth()+1) + '.' + maxDate.getFullYear() + '_' + maxDate.getHours() + 'h' + maxDate.getMinutes()
            }
            
            
            tweetArr += "</tbody><tfoot></tfoot></table>"
            tweetPlace.innerHTML = tweetArr;
            tweetPlace.style.display = "block";
            visibilityButton.style.display = "block";
            exportButton.style.display = "block";

            $('#tweet_view_histo').DataTable({
                autoWidth: false,
                fixedColumns: true,
                "columnDefs": [
                    { "orderable": false, "targets": 2 },
                ],

            }).columns.adjust();
            $('.dataTables_length').addClass('bs-select');
        })

    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
        exportButton.style.display = "none";
    }
    exportButton.onclick = e => {
        var encodedUri = encodeURI(csvArr);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tweets_" + fullDate + "_" + search + ".csv");
        document.body.appendChild(link); 
        link.click();
    }
}

    //For most retweeted/most liked/most active users charts
function displayTweetsOfUser(plot, place, button, nb_type, search) {

    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);

    var exportButton = document.getElementById(place.replace("place", "export"));
    var csvArr = "data:text/csv;charset=utf-8,";
    var label;

        plot.on('plotly_click', data => {

            var json = getTweets();
            var tweetArr = '<table id="tweet_view_' + nb_type + '" class="table" cellspacing="0" style="width: 100%">'

            tweetArr += '<thead><tr><th scope="col">Date</th><th scope="col">Tweet</th>';
            csvArr += "Date,Tweet";
            if (nb_type !== "retweets") {
                tweetArr += '<th scope="col">Nb of likes</th>';
                csvArr += ',Nb of likes';
            }
            if (nb_type !== "likes") {
                tweetArr += '<th scope="col">Nb of retweets</th>';
                csvArr += ',Nb of retweets';
            }

            tweetArr += '</tr></thead><tbody>';
            csvArr += "\n";

            json.hits.hits.forEach(tweetObj => {
                if (tweetObj._source.username === data.points[0].label) {
                    let nb;
                    if (nb_type === "retweets")
                        nb = tweetObj._source.nretweets;
                    else
                        nb = tweetObj._source.nlikes;
                    let date = new Date(tweetObj._source.date);

                    tweetArr += '<tr><td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' ' +
                        date.getHours() + 'h' + date.getMinutes() + '</td>' +
                        '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                        '<td class="tweet_arr tweet_arr_nretweet">' + nb + '</td>';
                    
                    csvArr += date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
                              tweetObj._source.tweet + '",' + nb;
          
                    if (nb_type === "tweets") {
                        tweetArr += '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td>';
                        csvArr += ',' + tweetObj._source.nretweets;
                    }
                    tweetArr += '</tr>';
                    csvArr += '\n';
                }
            });

            tweetArr += "</tbody><tfoot></tfoot></table>";
            tweetPlace.innerHTML = 'Tweets of <a  href="https://twitter.com/' + data.points[0].label + '" target="_blank">'
                + data.points[0].label + "</a><br><br>" + tweetArr;
            label = data.points[0].label;
            tweetPlace.style.display = "block";
            visibilityButton.style.display = "block";
            exportButton.style.display = "block";

            $('#tweet_view_' + nb_type).DataTable({
                autoWidth: false,
                fixedColumns: true,
                "columnDefs": [
                    { "orderable": false, "targets": 1 },
                ],

            }).columns.adjust();
            $('.dataTables_length').addClass('bs-select');
        });


    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
        exportButton.style.display = "none";
    }

    exportButton.onclick = e => {
        var encodedUri = encodeURI(csvArr);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tweets_" + label + "_" + search.replace(/#/g, '') + ".csv");
        document.body.appendChild(link); 
        link.click();
    }
}

    //For words cloud chart
function displayTweetsOfWord(word, place, button, search) {
    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);

    var json = getTweets();

    var exportButton = document.getElementById(place.replace("place", "export"));
    var csvArr = "data:text/csv;charset=utf-8,";
    
    word = word.replace(/_/g, " ");
    var tweetArr = '<table id="tweet_view_wordcloud" class="table" cellspacing="0" style="width: 100%">' 

    tweetArr += '<thead><tr><th class="tweet_arr_users">Username</th><th class="tweet_arr_date">Date</th><th class="tweet_arr_tweets">Tweet</th><th class="tweet_arr">Nb of retweets</th><th scope="col">Nb of likes</th></tr></thead><tbody>';
    csvArr += "Username,Date,Tweet,Nb of retweets, Nb of likes\n";
    json.hits.hits.forEach(tweetObj => {
        if (tweetObj._source.tweet.match(new RegExp('(.)*[\.\(\)0-9\!\?\'\’\‘\"\:\,\/\\\%\>\<\«\»\ ^#]' + word + '[\.\(\)\!\?\'\’\‘\"\:\,\/\>\<\«\»\ ](.)*', "i"))) {
            var date = new Date(tweetObj._source.date);
          
                tweetArr += '<tr><td class="tweet_arr tweet_arr_users"><a  href="https://twitter.com/' + tweetObj._source.username + '" target="_blank">' + tweetObj._source.username + '</a></td>' +
                    '<td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '<br /> ' +
                    date.getHours() + 'h' + date.getMinutes() + '</td>' +
                    '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                    '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td>' +
                    '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nlikes + '</td></tr>';
                csvArr += tweetObj._source.username  + ',' + 
                            date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
                            tweetObj._source.tweet + '",' + tweetObj._source.nretweets + ',' + tweetObj._source.nlikes + '\n';
            }
    });
    tweetArr += "</tbody><tfoot></tfoot></table>"
    tweetPlace.innerHTML = "Tweets containing : <b>" + word + "</b><br />" + tweetArr;
    tweetPlace.style.display = "block";
    visibilityButton.style.display = "block";
    exportButton.style.display = "block";



    $('#tweet_view_wordcloud').DataTable({
        autoWidth: false,
        fixedColumns: true,
        "columnDefs": [
            { "orderable": false, "targets": 2 },
        ],

    }).columns.adjust();
    $('.dataTables_length').addClass('bs-select');

    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
        exportButton.style.display = "none";
    }
    exportButton.onclick = e => {
        var encodedUri = encodeURI(csvArr);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tweets_" + word + "_" + search + ".csv");
        document.body.appendChild(link); 
        link.click();
    }
}

    //Check if a tweet is in a range of date depending on the time scale in timeline chart
function isInRange(pointDate, objDate, isDays) {
    if (!isDays)
        return ((((pointDate.getDate() === objDate.getDate()
            && (pointDate.getHours() >= objDate.getHours() - 2 && pointDate.getHours() <= objDate.getHours() + 2)))
            || (pointDate.getDate() === objDate.getDate() + 1 && objDate.getHours() >= 22 && pointDate.getHours() <= 2))
            && pointDate.getMonth() === objDate.getMonth()
            && pointDate.getFullYear() === objDate.getFullYear())
    else
        return (pointDate.getDate() === objDate.getDate()
            && pointDate.getMonth() === objDate.getMonth()
            && pointDate.getFullYear() === objDate.getFullYear());
}

//Export icon for wordCloud event handler

$("#top_words_content").on("mouseenter", event => {
    $(".export-icon").css({"opacity": 0.33});
})

$("#top_words_content").on("mouseleave", event => {
    $(".export-icon").css({"opacity": 0, "cursor": "normal"});
})
$("#exportWordsCloudJpg").on("mouseenter", event => {
    $("#exportWordsCloudJpg").css({"opacity": 0.66, "cursor": "pointer"});
});

$("#exportWordsCloudJpg").on("mouseleave", event => {
    $("#exportWordsCloudJpg").css({"opacity": 0.33});
});
$("#exportWordsCloudSvg").on("mouseenter", event => {
    $("#exportWordsCloudSvg").css({"opacity": 0.66, "cursor": "pointer"});
});
$("#exportWordsCloudJpg").on("mouseleave", event => {
    $("#exportWordsCloudSvg").css({"opacity": 0.33});
});
