
import { generateEssidHistogramQuery, generateWordCloud, generateDonutQuery, generateURLArray, getTweets, generateTweetCount } from './call-elastic.js';
import "../js/d3.js"
import "../js/html2canvas/dist/html2canvas.js"
import "../js/FileSaver.js"
import "../js/canvas-toBlob.js"
import * as data from '../js/stopwords.js'

var stopwords = data.default;
var tweetIE_URL = 'http://185.249.140.38/weverify-twitie/process?annotations=:Person,:UserID,:Location,:Organization'; //'https://cloud-api.gate.ac.uk/process-document/annie-named-entity-recognizer?annotations=:Person,:UserID,:Location,:Organization'//

export function getNbTweets(param, givenFrom, givenUntil) {
    generateTweetCount(param, givenFrom, givenUntil).then(res => {
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

function showEssidHistogram(param, givenFrom, givenUntil) {
    generateEssidHistogramQuery(param, false, givenFrom, givenUntil).then(plotlyJson => {
        var layout = {
            title: "<b>Propagation Timeline</b> - " + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            xaxis: {
                range: [ param["from"], param["until"]],
                rangeslider: { range: [givenFrom, givenUntil] },
            },
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
            displayTweetsOfDate(plot, "tweets_arr_user_time_place", "user_time_tweets_toggle_visibility");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");

    });
}

/*var stopwords = {
    "glob": ["undefined", "rt", "twitter"],
    "fr": [ "le", "la", "bonjour", "vient", "été", "jour", "nest", "jamais", "aucune", "sera", "toujours", "voir", "sous", "fois", "madame", "monsieur", "cela", "surtout", "quelle", "sert", "avez", "nom", "comment", "voilà", "parler", "mettre", "demain", "vos", "peu", "pendant", "très", "peut", "t", "veut", "avant", "toutes", "toute", "soit", "lui", "depuis", "soir", "entre", "aura", "hui", "aujourd", "cette", "êtes", "ceux", "veulent", "où", "déjà", "", "beaucoup", "là", "quoi", "ces", "aucun", "ça", "nos", "sans", "dites", "www", "après", "cest", "leurs", "leur", "ly", "tout", "quand", "être", "dire", "donc", "rien", "dit", "aussi", "les", "mais", "y", "pas", "qui", "contre", "par", "plus", "qu", "si", "va", "avec", "se", "faire", "faire", "pourquoi", "aux", "s", "faut", "fait", "comme", "j", "ont", "même", "tous", "doit", "trop", "du", "au", "que", "twitter", "c", "dans", "on", "sur", "ne", "non", "oui", "encore", "n", ".", "!", "?", ":", "suis", "es", "est", "a", "ai", "un", "une", "des", "à", "avoir", "ce", "alors", "en", "mes", "ses", "tes", "mon", "ma", "mes", "ta", "sa", "son", "pour", "ou", "et", "d", "de", "l", "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "notre", "votre", "sont"],
    "en": ["see", "time", "going", "much", "may", "yet", "back", "way", "best", "doesn","put", "make", "made", "gone", "use", "get", "like", "didn", "must", "ever", "never", "got", "see", "would", "call", "many", "big", "also", "another", "really", "always", "i", "me", "my", "myself", "we", "our", "bit", "re", "ours", "even", "already", "need", "ourselves", "you", "want", "your", 'yours', "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by","for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "could", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don","should", "now", "said", "say"]
}*/

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
function getOccurences(tweet) {
        //remove URLS
    var treatedTweet = tweet.text;
    treatedTweet = treatedTweet.toLowerCase().replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')
                            //.replace(/https.*(\ |\Z)/g, '')
        //Remove ponctuation & numbers
        treatedTweet = treatedTweet.replace(/[\.\(\)0-9\!\?\'\’\‘\"\:\,\/\\\%\>\<\«\»\'\#\ \;\-\&\|]+|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g, " ")
        //Remove emoticones
        if (treatedTweet === "")
            return [];
            
    var counts = treatedTweet
        .split(' ') //=> Array of words
        //Put the tweet in lower case
       // .map(word => {return word.toLowerCase();})
        //Remove the stop words
       // .filter(word => !stopwords[(isEnglish(treatedTweet))?"en":"fr"].includes(word) && !stopwords["glob"].includes(word))
        //Count the number of occurence of each word & return the associated map
     counts = counts.reduce(function (map, word) {
         if (!stopwords[(isEnglish(treatedTweet))?"en":"fr"].includes(word) && !stopwords["glob"].includes(word))
            map[word] = (map[word] || 0) + 1;
            
        return map;
        }, Object.create(null));

    return counts;
}

function getnMax(map, n) {
    const mapSort = new Map([...map.entries()].filter(elt => elt[1] > 1).sort((a, b) => b[1] - a[1]));
    let res_map = new Map([...mapSort.entries()].splice(0, n));
    return (res_map);

}

var nb_treated, nb_tweets;
function call_tweetIE(tweet) {

    document.getElementById('progress_state_place').innerHTML = nb_treated + '/' + nb_tweets;
    const tweetIEcall = async () => {
        const response = await fetch(tweetIE_URL, {
            method: 'POST',
            body:
                tweet.text,
            headers: {
                'Content-Type': 'text/plain'
            } //*/
        })
            var resp = await response.json();
            if (!response.ok) {
                return {
                   error: response.statusText
                }
            }
            const tweetIE_JSON1 = resp;
           
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
   //console.log(res)
   // return res;
}

function getColor(word, tokens_JSON)
{
    if (tokens_JSON.persons.includes(word)) return '8242BB';
    if (tokens_JSON.organisations.includes(word)) return 'BB424F';
    if (tokens_JSON.userIDs.includes(word)) return '42BB9E';
    if (tokens_JSON.locations.includes(word)) return 'BB7042';
    
    return '35347B';
}

async function mostUsedWordsCloud(param) {
    stopwords["glob"] = [...stopwords["glob"], ...param["search"]["search"].split(' ').map(word => word.replace('#', ""))];

    if (param["search"]["and"] !== undefined)
        stopwords["glob"] = [...stopwords["glob"], ...param["search"]["and"]];
    var words_map = new Map();
    
    generateWordCloud(param).then(json => {
        
        $('.top_words_loader').css('display', "block");
        nb_treated = 0;
        var tokens_JSON = {
            locations: [],
            organisations: [],
            userIDs: [],
            persons: [],
        }

        var tweetIE = {text: ""};

        var serverDown = false;
        const forLoop = async () => {
            var hits = Array.from(json.hits.hits);
            for (var i = 0; i < hits.length; i++) {
                tweetIE.text = hits[i]._source.tweet;
                nb_treated++;
                if (!serverDown)
                {
                    const json = await call_tweetIE(tweetIE)

                    if (json.error !== undefined)
                    {
                        serverDown = true;
                    }
                    else
                    {
                        tokens_JSON.locations = [...tokens_JSON.locations, ...json.locations];
                        tokens_JSON.persons = [...tokens_JSON.persons, ...json.persons];
                        tokens_JSON.organisations = [...tokens_JSON.organisations, ...json.organisations];
                        tokens_JSON.userIDs = [...tokens_JSON.userIDs, ...json.userIDs];
                    }
            }
                var map = getOccurences(tweetIE);
                for (var word in map) {

                    if(word.length > 1)
                        words_map.set(word, (words_map.get(word)|| 0) + map[word]);
                }
            
    
            };

        }
        forLoop().then(() => {
               
            var final_map = getnMax(words_map, 100);
            var words_arr = Array.from(final_map.keys());
            var val_arr = Array.from(final_map.values());
            var words =  words_arr.map(word => {
                let obj = { text: word, size: final_map.get(word), color: getColor(word, tokens_JSON) }; 
                return obj;
            });
            var minSize = d3.min(words, d => d.size);
            var maxSize = d3.max(words, d => d.size);
            var fontScale = d3.scaleLinear().range([20, 120])
                                            .domain([minSize, maxSize]);
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
                document.getElementById("top_words_cloud_chart").innerHTML = "";
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
                            .on("click", d => displayTweetsOfWord(d.text, "tweets_word_arr_place", "top_words_tweets_toggle_visibility"))
                            .append("svg:title")
                            .text(d => "Used " + final_map.get(d.text) + " times");

                var width = 300, height = 300;

                $('.top_words_loader').css('display', "none");
                document.getElementById('progress_state_place').innerHTML = "";


                d3  .select('#exportWordsCloudJpg')
                    .on('click', 
                        () => {
                            
                            svgString2Image(svg._parents[0].parentNode, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback
                    
                            console.log(param)
                            function save(dataBlob, filesize) {
                                saveAs(dataBlob, 'WordCloud_' + param.search.search.replace(" ", "") + "_" + param.from + "_" + param.until + '.png'); // FileSaver.js function
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

    image.onerror = error => {console.log(error); return alert("IMG ERROR: " + error);}
 
  }

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
export function mostRetweetPie(param) {
    generateDonutQuery(param, "nretweets").then(plotlyJson => {
        var cloudlayout = {
            title: "<b>Most retweeted users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Retweets",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [["toImage"]], displaylogo: false
        };


        var plot = document.getElementById("retweets_cloud_chart");
        Plotly.react('retweets_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility', "retweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);
    });
}

export function mostLikePie(param) {
    generateDonutQuery(param, "nlikes").then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most liked users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Likes",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [["toImage"]], displaylogo: false
        };

        let plot = document.getElementById("likes_cloud_chart");
        Plotly.react('likes_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility', "likes");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);
    });
}

export function mostTweetPie(param) {
    //Utilisateurs les actifs
    generateDonutQuery(param, "ntweets").then(plotlyJson => {
        var cloudlayout = {
            title: "<b>Most active users</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Tweets",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [["toImage"]], displaylogo: false
        };


        var plot = document.getElementById("top_users_pie_chart");
        Plotly.react('top_users_pie_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility", "tweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);
    });
}


export function topHashtagPie(param) {
    generateDonutQuery(param, "hashtags").then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most associated hashtags</b><br>" + param["search"]["search"] + " " + param["from"] + " " + param["until"],
            automargin: true,
            width: 500,
            height: 500,
        };

        var config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: param["search"]["search"] + "_" + param["from"] + "_" + param["until"] + "_Hashtags",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtons: [["toImage"]], displaylogo: false
        };

        let plot = document.getElementById("hashtag_cloud_chart");
        Plotly.react('hashtag_cloud_chart', plotlyJson, cloudlayout, config);
        if (firstHisto)
            plot.on('plotly_click', data => {
                //  document.getElementById("twitterStats-search").value = data.points[0].label;
                // document.getElementById("twitterStats-Graphs").style.display = "none";
                //  Array.from(document.getElementsByClassName("toggleVisibility")).forEach(elt => elt.style.display = "none")
                let win = window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');

                firstTopUsers = false;
            });



        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["search"]["search"]);

    });


}

export function urlArray(param) {
    generateURLArray(param).then(arrayStr => {
        document.getElementById('url_array').innerHTML = arrayStr;
    });
}

var firstHisto = true;
export function setFirstHisto(first) {
    firstHisto = first
}

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
   // console.log(entries);
   // var param2 = param.query;
   // param2["session"] = param["session"];
    if (firstHisto)
        mostUsedWordsCloud(entries);

    showEssidHistogram(entries, givenFrom, givenUntil);
    getNbTweets(entries);
    if (entries.user_list[0] === "")
    {
        mostRetweetPie(entries);
        mostLikePie(entries);
        mostTweetPie(entries);
    }
    topHashtagPie(entries);
    urlArray(entries);
}

function displayTweetsOfDate(plot, place, button) {
    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);

        plot.on('plotly_click', data => {
            var json = getTweets();

            var tweetArr = '<table id="tweet_view_histo" class="table" cellspacing="0" style="width: 100%">' /* +
            '<colgroup>' +
                '<col width="20%"/>' +
                '<col width="15%" />' +
                '<col width="45%"/>' +
                '<col  width="10%" />' +
            '</colgroup>';*/

            tweetArr += '<thead><tr><th class="tweet_arr_users">Username</th><th class="tweet_arr_date">Date</th><th class="tweet_arr_tweets">Tweet</th><th class="tweet_arr">Nb of retweets</th></tr></thead><tbody>';

            let isDays = (((new Date(data.points[0].data.x[0])).getDate() - (new Date(data.points[0].data.x[1])).getDate()) !== 0);

            data.points.forEach(point => {
                json.hits.hits.forEach(tweetObj => {
                    if (tweetObj._source.username === point.data.name) {
                        var pointDate = new Date(point.x);
                        var objDate = new Date(tweetObj._source.date);
                        if (isInRange(pointDate, objDate, isDays)) {
                            let date = new Date(tweetObj._source.date);
                            tweetArr += '<tr><td class="tweet_arr tweet_arr_users"><a  href="https://twitter.com/' + point.data.name + '" target="_blank">' + point.data.name + '</a></td>' +
                                '<td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '<br /> ' +
                                date.getHours() + 'h' + date.getMinutes() + '</td>' +
                                '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                                '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td></tr>';
                        }
                    }
                });
            });
            tweetArr += "</tbody><tfoot></tfoot></table>"
            tweetPlace.innerHTML = tweetArr;
            tweetPlace.style.display = "block";
            visibilityButton.style.display = "block";


            $('#tweet_view_histo').DataTable({
                autoWidth: false,
                fixedColumns: true,
                "columnDefs": [
                    { "orderable": false, "targets": 2 },
                ],

            }).columns.adjust();
            $('.dataTables_length').addClass('bs-select');

            //   });

        })

    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
    }
}

function displayTweetsOfUser(plot, place, button, nb_type) {

    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);
        plot.on('plotly_click', data => {
            var json = getTweets();

            var tweetArr = '<table id="tweet_view_' + nb_type + '" class="table" cellspacing="0" style="width: 100%">'

            tweetArr += '<thead><tr><th scope="col">Date</th><th scope="col">Tweet</th>';
            if (nb_type !== "retweets")
                tweetArr += '<th scope="col">Nb of likes</th>';
            if (nb_type !== "likes")
                tweetArr += '<th scope="col">Nb of retweets</th>';

            tweetArr += '</tr></thead><tbody>';
            json.hits.hits.forEach(tweetObj => {
                if (tweetObj._source.username === data.points[0].label) {
                    let nb;
                    if (nb_type === "retweets")
                        nb = tweetObj._source.nretweets;
                    else
                        nb = tweetObj._source.nlikes;
                    let date = new Date(tweetObj._source.date[0]);
                    tweetArr += '<tr><td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' ' +
                        date.getHours() + 'h' + date.getMinutes() + '</td>' +
                        '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                        '<td class="tweet_arr tweet_arr_nretweet">' + nb + '</td>';
                    if (nb_type === "tweets")
                        tweetArr += '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td>';

                    tweetArr += '</tr>';

                }
            });

            tweetArr += "</tbody><tfoot></tfoot></table>";
            tweetPlace.innerHTML = 'Tweets of <a  href="https://twitter.com/' + data.points[0].label + '" target="_blank">'
                + data.points[0].label + "</a><br><br>" + tweetArr;
            tweetPlace.style.display = "block";
            visibilityButton.style.display = "block";
            //   plotlyJson.labels.array.forEach(label => {

            // });

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
    }
}


function displayTweetsOfWord(word, place, button) {
    var visibilityButton = document.getElementById(button);
    var tweetPlace = document.getElementById(place);

    var json = getTweets();

    var tweetArr = '<table id="tweet_view_wordcloud" class="table" cellspacing="0" style="width: 100%">' 

    tweetArr += '<thead><tr><th class="tweet_arr_users">Username</th><th class="tweet_arr_date">Date</th><th class="tweet_arr_tweets">Tweet</th><th class="tweet_arr">Nb of retweets</th><th scope="col">Nb of likes</th></tr></thead><tbody>';

    json.hits.hits.forEach(tweetObj => {
        if (tweetObj._source.tweet.match(new RegExp('(.)*[\.\(\)0-9\!\?\'\’\‘\"\:\,\/\\\%\>\<\«\»\ ^#]' + word + '[\.\(\)\!\?\'\’\‘\"\:\,\/\>\<\«\»\ ](.)*', "i"))) {
            var date = new Date(tweetObj._source.date);
          
                tweetArr += '<tr><td class="tweet_arr tweet_arr_users"><a  href="https://twitter.com/' + tweetObj._source.username + '" target="_blank">' + tweetObj._source.username + '</a></td>' +
                    '<td class="tweet_arr tweet_arr_date">' + date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + '<br /> ' +
                    date.getHours() + 'h' + date.getMinutes() + '</td>' +
                    '<td class="tweet_arr tweet_arr_tweets">' + tweetObj._source.tweet + '</td>' +
                    '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nretweets + '</td>' +
                    '<td class="tweet_arr tweet_arr_nretweet">' + tweetObj._source.nlikes + '</td></tr>';
            }
    });
    tweetArr += "</tbody><tfoot></tfoot></table>"
    tweetPlace.innerHTML = "Tweets containing : <b>" + word + "</b><br />" + tweetArr;
    tweetPlace.style.display = "block";
    visibilityButton.style.display = "block";


    $('#tweet_view_wordcloud').DataTable({
        autoWidth: false,
        fixedColumns: true,
        "columnDefs": [
            { "orderable": false, "targets": 2 },
        ],

    }).columns.adjust();
    $('.dataTables_length').addClass('bs-select');


    firstHisto = false


    visibilityButton.onclick = e => {
        tweetPlace.style.display = "none";
        visibilityButton.style.display = 'none';
    }
}

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
