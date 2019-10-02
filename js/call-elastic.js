var json = {};

//var sessid = "sess-080f5dae-f7f1-499f-abba-7c34cb7b63dc"
export function generatePieChartQuery(sessid, startDate, endDate) {
    let chartInfo = {
        "terms": {
            "field": "username",
            "order": {
                "_count": "desc"
            },
            "size": 10
        }
    };

    let matchPhrase = {
        "match_phrase": {
            "essid": {
                "query": sessid
            }
        }
    };

    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body:
                JSON.stringify(getQuery(matchPhrase, chartInfo, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            } //*/
        });
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson

        let vals = [];
        let keys = [];
        let buckets = myJson["aggregations"]["2"]["buckets"];
        var i = 0;
        var tot = 0;
        buckets.forEach(elt => {

            if (i++ < 10) {
                vals.push(elt["doc_count"]);
                keys.push(elt["key"]);
            } else
                tot += elt["doc_count"];
        });
        vals.push(tot);
        keys.push("OTHERS");

        let plotlyJson = [{
            values: vals,
            labels: keys,
            type: 'pie'
        }];
        return plotlyJson;
    }
    return (userAction());
}

export function generateEssidHistogramQuery(sessid, retweets, startDate, endDate, colors) {

    let matchPhrase =
        {
            "match_phrase":
                {
                    "essid": {
                        "query": sessid
                    }
                }
        }

    let fieldInfo =
        {
            "date_histogram": {
                "field": "date",
                "calendar_interval": "1h",
                "time_zone": "Europe/Paris",
                "min_doc_count": 1
            },
            "aggs": {
                "3": {
                    "terms": {
                        "field": "username",
                        "order": {
                            "1": "desc"
                        },
                        "size": 5
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "nretweets"
                            }
                        }
                    }
                },
                "1": {
                    "sum": {
                        "field": "nretweets"
                    }
                }
            }
        }

    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body:
                JSON.stringify(getQuery(matchPhrase, fieldInfo, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            } //*/
        });
        const myJson = await response.json();

        if (myJson !== null)
            if (retweets)
                return getPlotlyJsonHisto(myJson, retweetsGet);
            else
                return getPlotlyJsonHisto(myJson, usersGet);

    }
    return userAction();
}


export function generateHashtagHistogramQuery(hashtag, retweets, startDate, endDate) {

    let matchPhrase =
        {
            "match_phrase":
                {
                    "hashtags": {
                        "query": hashtag
                    }
                }
        }

    let fieldInfo =
        {
            "date_histogram": {
                "field": "date",
                "calendar_interval": "1d",
                "time_zone": "Europe/Paris",
                "min_doc_count": 1
            },
            "aggs": {
                "3": {
                    "terms": {
                        "field": "username",
                        "order": {
                            "_count": "desc"
                        },
                        "size": 5
                    }
                },
                "1": {
                    "sum": {
                        "field": "nretweets"
                    }

                }
            }
        }

    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body:
                JSON.stringify(getQuery(matchPhrase, fieldInfo, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            } //*/
        });
        const myJson = await response.json();

        if (myJson != null)
            if (retweets)
                return getPlotlyJsonHisto(myJson, retweetsGet);
            else
                return getPlotlyJsonHisto(myJson, usersGet);
    }
    return userAction();
}

export function generateCloudQuery(sessid, field, startDate, endDate, mainKey) {
    let matchPhrase =
        {
            "match_phrase":
                {
                    "essid": {
                        "query": sessid
                    }
                }
        }

    let fieldInfo =
        (field === "hashtags") ?
            {
                "terms": {
                    "field": field,
                    "order": {
                        "_count": "desc"
                    },
                    "size": 14
                },
            } :
            (field === "nretweets" || field === "nlikes") ? {
                    "terms": {
                        "field": "username",
                        "order": {
                            "1": "desc"
                        },
                        "size": 14
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": field
                            }
                        }
                    }
                } :
                {
                    "terms": {
                        "field": "username",
                        "order": {
                            "_count": "desc"
                        },
                        "size": 14
                    }
                };

    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body:
                JSON.stringify(getQuery(matchPhrase, fieldInfo, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            } //*/
        });
        const myJson = await response.json();
        json = myJson;
        if (field === "hashtags") {
            return getPlotlyJsonCloud(myJson, hashtagsGet, mainKey);
        } else if (field === "nretweets" || field == "nlikes")
            return getPlotlyJsonCloud(myJson, mostRetweetGet, mainKey);
        else
            return getPlotlyJsonCloud(myJson, mostTweetsGet, mainKey);

    }
    return userAction();
}

function getNbTweets(sessid, startDate, endDate) {
    return {
        "aggs": {},
        "size": 0,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "docvalue_fields": [
            {
                "field": "date",
                "format": "date_time"
            }
        ],
        "query": {
            "bool": {
                "must": [
                    {
                        "query_string": {
                            "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
                            "analyze_wildcard": true,
                            "time_zone": "Europe/Paris"
                        }
                    },
                    {
                        "match_all": {}
                    },
                    {
                        "match_phrase": {
                            "essid": {
                                "query": sessid
                            }
                        }
                    },
                    {
                        "range": {
                            "date": {
                                "format": "strict_date_optional_time",
                                "gte": startDate,
                                "lte": endDate
                            }
                        }
                    }
                ],
                "filter": [],
                "should": [],
                "must_not": []
            }
        }
    };
}


export function generateTweetCount(session, startDate, endDate) {
    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body: JSON.stringify(getNbTweets(session, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        return myJson["hits"]["total"];
    };
    return userAction();
}

export function getTweets() {
    return json
}

export function generateURLArray(sessid, startDate, endDate) {
    let matchPhrase =
        {
            "match_phrase":
                {
                    "essid": {
                        "query": sessid
                    }
                }
        };
    let chartInfo = {
        "terms": {
            "field": "urls",
            "order": {
                "_count": "desc"
            },
            "size": 10
        }
    };

    const userAction = async () => {
        const response = await fetch('http://185.249.140.38/elk/twinttweets/_search', {
            method: 'POST',
            body:
                JSON.stringify(getQuery(matchPhrase, chartInfo, startDate, endDate)),
            headers: {
                'Content-Type': 'application/json'
            } //*/
        });
        const myJson = await response.json();


        let array = getURLArray(myJson);

        let arrayStr = '<table>' +
            '<tr>' +
            '<td>url</td>' +
            '<td>count</td>' +
            '</tr>';

        array.forEach(row => {
            arrayStr += '<tr>' +
                '<td><a href="' + row.url + '">' + row.url + '</a></td>' +
                '<td>' + row.count + '</td></tr>';
        });
        arrayStr += '</table>';
        return arrayStr;
    };
    return userAction();
}

function getQuery(matchPhrase, chartInfo, startDate, endDate) {
    return {
        "aggs": {
            "2":
            chartInfo
        },
        "size": 10000,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "docvalue_fields": [
            {
                "field": "date",
                "format": "date_time"
            }
        ],
        "query": {
            "bool": {
                "must": [
                    {
                        "query_string": {
                            "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
                            "analyze_wildcard": true,
                            "time_zone": "Europe/Paris"
                        }
                    },
                    {
                        "match_all": {}
                    },
                    matchPhrase,
                    {
                        "range": {
                            "date": {
                                "format": "strict_date_optional_time",
                                "gte": startDate,
                                "lte": endDate
                            }
                        }
                    }
                ],
                "filter": [],
                "should": [],
                "must_not": []
            }
        }
    }
}


function mostTweetsGet(key, values, labels, parents, mainKey) {
    if (key["doc_count"] > 0) {
        values.push(key["doc_count"]);
        labels.push(key["key"]);
        parents.push(mainKey);
    }
}

function getURLArray(json) {
    var urlArray = [];
    var buckets = json["aggregations"]["2"]["buckets"];

    buckets.forEach(bucket => {
        urlArray.push({url: bucket["key"], count: bucket["doc_count"]});
    });
    return urlArray;
}

function usersGet(dateObj, infos) {

    dateObj["3"]["buckets"].forEach(obj => {
        if (obj["1"]["value"] > 5) {
            infos.push({
                date: dateObj['key_as_string'],
                key: obj["key"],
                nb: obj["1"]["value"]
            })
        }
    });

    return infos;
}

function retweetsGet(dateObj, infos) {
    infos.push({
        date: dateObj['key_as_string'],
        key: "Retweets",
        nb: dateObj["1"].value
    });
    return infos;
}

function mostRetweetGet(key, values, labels, parents, mainKey) {
    if (key["1"]["value"] > 10) {
        values.push(key["1"]["value"]);
        labels.push(key["key"]);
        parents.push(mainKey);
    }
}

function hashtagsGet(key, values, labels, parents, mainKey) {
    values.push(key["doc_count"]);
    labels.push(key["key"]);
    parents.push(mainKey["key"]);
}

function getPlotlyJsonCloud(json, specificGet, hashTagKey) {
    var labels = [];
    var parents = [];
    var value = [];

    let keys = json["aggregations"]["2"]["buckets"];

    let mainKey = keys[0];

    if (mainKey["key"].charAt(0) === '#') {
        labels.push(mainKey["key"]);
        keys.shift();
    } else {
        mainKey = hashTagKey;
        labels.push(hashTagKey);
    }

    parents.push("");
    value.push(0);

    keys.forEach(key => {
        specificGet(key, value, labels, parents, mainKey);
    })
    var obj = [{
        type: "sunburst",
        labels: labels,
        parents: parents,
        values: value,
        outsidetextfont: {size: 20, color: "#377eb8"},
        //   leaf: { opacity: 0.4 }
    }];
    return obj;
}

function getPlotlyJsonHisto(json, specificGet) {
    let dates = json["aggregations"]["2"]["buckets"];

    var infos = [];

    dates.forEach(dateObj => {
        specificGet(dateObj, infos);
        infos.push({
            date: dateObj['key_as_string'],
            key: "Tweets",
            nb: dateObj["doc_count"],
        });
        infos.push({
            date: dateObj['key_as_string'],
            key: "Retweets",
            nb: dateObj["1"]["value"]
        });
    });
    var lines = [];
    var i = 0;
    while (infos.length !== 0) {

        //  var color = getRandomColor(colors, i++);
        let info = infos.pop();
        let date = info.date;
        let nb = info.nb;
        var type = "markers";
        if (info.key === "Tweets" || info.key === "Retweets")
            type = 'lines';
        let plotlyInfo = {
            mode: type,
            name: info.key,
            x: [],
            y: []
        }

        for (let i = 0; i < infos.length; ++i) {
            if (infos[i].key === info.key) {
                plotlyInfo.x.push(infos[i].date);
                plotlyInfo.y.push(infos[i].nb);
                infos.splice(i, 1);
                i--;
            }
        }
        plotlyInfo.x.push(date);
        plotlyInfo.y.push(nb);
        lines.push(plotlyInfo);
    }
    return lines;
}

function getRandomColor(colors, index) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    if (colors != null && index > colors.size)
        return colors[index];
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/*
            else if (hashtag !== null)

   // generateQuery().then((json) => responseJson = json);*/
