import { generateEssidHistogramQuery, generateWordCloud, generateCloudQuery, generateURLArray, getTweets, generateTweetCount } from './call-elastic.js';
import "../js/d3.js"
import "../js/html2canvas/dist/html2canvas.js"

export function getNbTweets(param, givenFrom, givenUntil) {
    generateTweetCount(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], givenFrom, givenUntil).then(res => {
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

function showEssidHistogram(param, givenFrom, givenUntil) {
    generateEssidHistogramQuery(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], false, param["query"]["from"], param["query"]["until"], givenFrom, givenUntil).then(plotlyJson => {
        var layout = {
            title: "<b>Propagation Timeline</b> - " + param["query"]["search"]["search"] + " " + param["query"]["from"] + " " + param["query"]["until"],
            automargin: true,
            xaxis: {
                range: [givenFrom, givenUntil],
                rangeslider: { range: [param["query"]["from"], param["query"]["until"]] },
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

var stopwords = {
    "glob": ["undefined", "rt"],
    "fr": [ "le", "la", "bonjour", "vient", "été", "jour", "nest", "jamais", "aucune", "sera", "toujours", "voir", "sous", "fois", "madame", "monsieur", "cela", "surtout", "quelle", "sert", "avez", "nom", "comment", "voilà", "parler", "mettre", "demain", "vos", "peu", "pendant", "très", "peut", "t", "veut", "avant", "toutes", "toute", "soit", "lui", "depuis", "soir", "entre", "aura", "hui", "aujourd", "cette", "êtes", "ceux", "veulent", "où", "déjà", "", "beaucoup", "là", "quoi", "ces", "aucun", "ça", "nos", "sans", "dites", "www", "après", "cest", "leurs", "leur", "ly", "tout", "quand", "être", "dire", "donc", "rien", "dit", "aussi", "les", "mais", "y", "pas", "qui", "contre", "par", "plus", "qu", "si", "va", "avec", "se", "faire", "faire", "pourquoi", "aux", "s", "faut", "fait", "comme", "j", "ont", "même", "tous", "doit", "trop", "du", "au", "que", "twitter", "c", "dans", "on", "sur", "ne", "non", "oui", "encore", "n", ".", "!", "?", ":", "suis", "es", "est", "a", "ai", "un", "une", "des", "à", "avoir", "ce", "alors", "en", "mes", "ses", "tes", "mon", "ma", "mes", "ta", "sa", "son", "pour", "ou", "et", "d", "de", "l", "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "notre", "votre", "sont"],
    "en": ["see", "much", "like", "didn", "must", "ever", "never", "got", "see", "would", "call", "many", "big", "also", "another", "really", "always", "i", "me", "my", "myself", "we", "our", "bit", "re", "ours", "even", "already", "need", "ourselves", "you", "want", "your", 'yours', "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by","for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "could", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don","should", "now", "said", "say"]
}
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
    var treatedTweet = tweet.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')
                            //.replace(/https.*(\ |\Z)/g, '')
                            .replace(/pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
        //Remove ponctuation & numbers
        treatedTweet = treatedTweet.replace(/[\.\(\)0-9\!\?\'\’\‘\"\:\,\_\/\\\%\>\<\«\»\'\#\ \;\-\&\|]+/g, " ")
        //Remove emoticones
        .replace(/\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g, '');
        if (treatedTweet === "")
            return [];
            
    var counts = treatedTweet
        .split(' ') //=> Array of words
        //Put the tweet in lower case
        .map(word => {return word.toLowerCase();})
        //Remove the stop words
        .filter(word => !stopwords[(isEnglish(treatedTweet))?"en":"fr"].includes(word) && !stopwords["glob"].includes(word))
        //Count the number of occurence of each word & return the associated map
        .reduce(function (map, word) {
            map[word] = (map[word] || 0) + 1;
            return map;
        }, Object.create(null));

    return counts
}

function getnMax(map, n) {
    const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    return (new Map([...mapSort.entries()].splice(0, n)));

}

function mostUsedWordsCloud(param, givenFrom, givenUntil) {
    stopwords["glob"].push(param["query"]["search"]["search"]);

    stopwords["glob"].push(param["query"]["search"]["and"]);
    var words_map = new Map();
    generateWordCloud(param["session"], givenFrom, givenUntil).then(json => {
        Array.from(json.hits.hits).forEach(hit => {
            var map = getOccurences(hit._source.tweet);
            for (var word in map) {

                if(word.length > 1)
                    words_map.set(word, (words_map.get(word)|| 0) + map[word]);
            }

        });

        var final_map = getnMax(words_map, 100);

        var words_arr = Array.from(final_map.keys());
         var val_arr = Array.from(final_map.values());

        var layout = d3.layout.cloud()
            .size([500, 500])
            .words(
                words_arr.map(word => {
                    return { text: word, size: final_map.get(word), color: (word[0] === '@') ? '#2874A6' : '#A63D28' };
                }))
            /*[
            "Hello", "world", "normally", "you", "want", "more", "words",
            "than", "this"]*/

            .padding(5)
            .rotate(function () { return (~~(Math.random() * 6) - 3) * 15; })
            .spiral("archimedean")
            .font("Impact")
            .fontSize(function (d) { return (final_map.get(d.text) / val_arr[0]) * 140 + 10; })
            .on("end", draw);

        layout.start();
        console.log((final_map.get("") /val_arr[0]) * (150 - 10) + 10)
        function fillColor(d) {
            return d.color;
        }
        function draw(words) {
            document.getElementById("top_words_cloud_chart").innerHTML = "";
            d3.select("#top_words_cloud_chart").append("svg")
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
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; })
                .style("fill", fillColor)
                .style("cursor", "default")
                .on("click", function (d) { displayTweetsOfWord(d.text, "tweets_word_arr_place", "top_words_tweets_toggle_visibility") })
                .append("svg:title")
                .text(function (d) {return ("Used " +final_map.get(d.text) + " times"); });
                   
        }

        function exportCloud() {
          
        }
    });


}

export function mostRetweetPie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], "nretweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title: "<b>Most retweeted users</b><br>" + param["query"]["search"]["search"] + " " + param["query"]["from"] + " " + param["query"]["until"],
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
            modeBarButtons: [["toImage"]], displaylogo: false
        };


        var plot = document.getElementById("retweets_cloud_chart");
        Plotly.react('retweets_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_retweet_place', 'most_retweeted_tweets_toggle_visibility', "retweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

export function mostLikePie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], "nlikes", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most liked users</b><br>" + param["query"]["search"]["search"] + " " + param["query"]["from"] + " " + param["query"]["until"],
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
            modeBarButtons: [["toImage"]], displaylogo: false
        };

        let plot = document.getElementById("likes_cloud_chart");
        Plotly.react('likes_cloud_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, 'tweets_arr_like_place', 'most_liked_tweets_toggle_visibility', "likes");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

export function mostTweetPie(param, givenFrom, givenUntil) {
    //Utilisateurs les actifs
    generateCloudQuery(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], "ntweets", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        var cloudlayout = {
            title: "<b>Most active users</b><br>" + param["query"]["search"]["search"] + " " + param["query"]["from"] + " " + param["query"]["until"],
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
            modeBarButtons: [["toImage"]], displaylogo: false
        };


        var plot = document.getElementById("top_users_pie_chart");
        Plotly.react('top_users_pie_chart', plotlyJson, cloudlayout, config);

        if (firstHisto)
            displayTweetsOfUser(plot, "tweets_arr_place", "top_users_tweets_toggle_visibility", "tweets");

        Array.from(document.getElementsByClassName("g-gtitle")).forEach(title => title.style = "display: none");
        unrotateMainHashtag(param["query"]["search"]["search"]);
    });
}

var firstTopUsers = true;
export function topHashtagPie(param, givenFrom, givenUntil) {
    generateCloudQuery(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], "hashtags", givenFrom, givenUntil, param["query"]["search"]["search"]).then(plotlyJson => {
        let cloudlayout = {
            title: "<b>Most associated hashtags</b><br>" + param["query"]["search"]["search"] + " " + param["query"]["from"] + " " + param["query"]["until"],
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
        unrotateMainHashtag(param["query"]["search"]["search"]);

    });


}

export function urlArray(param, givenFrom, givenUntil) {
    generateURLArray(param["session"], (param["query"]["search"]["and"] === undefined)?null:param["query"]["search"]["and"], givenFrom, givenUntil).then(arrayStr => {
        document.getElementById('url_array').innerHTML = arrayStr;
    });
}

var firstHisto = true;
export function setFirstHisto(first) {
    firstHisto = first
}
export function generateGraphs(param) {
    let givenFrom = document.getElementById("twitterStats-from-date").value;
    let givenUntil = document.getElementById("twitterStats-to-date").value;

    showEssidHistogram(param, givenFrom, givenUntil);
    getNbTweets(param, givenFrom, givenUntil);
    mostRetweetPie(param, givenFrom, givenUntil);
    mostLikePie(param, givenFrom, givenUntil);
    mostTweetPie(param, givenFrom, givenUntil);
    topHashtagPie(param, givenFrom, givenUntil);
    urlArray(param, givenFrom, givenUntil);
    if (firstHisto)
        mostUsedWordsCloud(param, givenFrom, givenUntil);
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
            var tweetArr = '<table id="tweet_view_' + nb_type + '" class="table" cellspacing="0" style="width: 100%">' /*+
                '<colgroup>' +
                '<col span=1 class="date_col" />' +
                '<col span=1 class="tweet_col" />' +
                '<col span=1 class="nb_tweet_col" />';

            if (nb_type === 'tweets')
                tweetArr += '<col span=1 class="nb_tweet_col" />';

            tweetArr += '</colgroup>';*/

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

    var tweetArr = '<table id="tweet_view_histo" class="table" cellspacing="0" style="width: 100%">' 

    tweetArr += '<thead><tr><th class="tweet_arr_users">Username</th><th class="tweet_arr_date">Date</th><th class="tweet_arr_tweets">Tweet</th><th class="tweet_arr">Nb of retweets</th><th scope="col">Nb of likes</th></tr></thead><tbody>';

    json.hits.hits.forEach(tweetObj => {
        if (tweetObj._source.tweet.match(new RegExp('(.)*[\.\(\)0-9\!\?\'\’\‘\"\:\,\_\/\\\%\>\<\«\»\ ^#]' + word + '[\.\(\)\!\?\'\’\‘\"\:\,\_\/\>\<\«\»\ ](.)*', "i"))) {
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


    $('#tweet_view_histo').DataTable({
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
