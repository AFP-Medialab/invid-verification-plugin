var json = {};

var elasticSearch_url = 'http://185.249.140.38/elk/twinttweets/_search';

let dev = false;
if (dev) {
    elasticSearch_url = 'http://localhost:9200/twinttweets/_search';
}


function constructMatchPhrase(param, startDate, endDate)
{
    if (startDate === undefined)
    {
        startDate = param["from"];
        endDate = param["until"];
    }
    var andArgs = (param["search"]["and"] === undefined || param["search"]["and"][0] === "")? [] : param["search"]["and"];
    
    var match_phrases = JSON.stringify({
        "query_string": {
            "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
            "analyze_wildcard": true,
            "time_zone": "Europe/Paris"
        }
    },
    {
        "match_all": {}
    }) 

    // SESSID MATCH
    match_phrases += ",{" +
                '"match_phrase": {' +
                    '"essid": {' +
                        '"query":"' + param["session"] + '"' + 
                    '}' +
                '}' +
            '}';


    // AND ARGS MATCH
    andArgs.forEach(arg => {
        if (arg[0] === '#')
        {
            match_phrases +=  ',{'+
                '"match_phrase": {' +
                    '"hashtags": {' +
                        '"query":"' + arg + '"' +
                    '}' +
                '}' +
            '}'
        }
        else
        {
            match_phrases +=  ',{' +
                '"match_phrase": {' +
                '"tweet": {' +
                  '"query":"' + arg + '"' +
                '}' +
              '}' +
            '}';
        }
    });

    // USERNAME MATCH
    if (param["user_list"] !== undefined)
    {
        param["user_list"].forEach(user => {
            if (user !== "")
            {
                match_phrases += ',{' + 
                    '"match_phrase": {' +
                        '"username": {' + 
                        '"query":"' + user + '"' +
                        '}' +
                    '}' +
                '}';
            }
        })
    }
    // RANGE SETUP
    match_phrases += "," + JSON.stringify({
        "range": {
            "date": {
                "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis",
                "gte": startDate,
                "lte": endDate
            }
        }
    });

    return match_phrases
   

}

function constructAggs(field)
{


    let fieldInfo = '{' +
            '"2":'
    if (field === "hashtags" || field === "urls") {
        fieldInfo += JSON.stringify({
            "terms": {
                "field": field,
                "order": {
                    "_count": "desc"
                },
                "size": 20
            }
        })
    }
    else if (field === "nretweets" || field === "nlikes") {
        fieldInfo += JSON.stringify({
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
        })
    }
    else if (field.includes('1')) {
        fieldInfo += JSON.stringify({
            "date_histogram": {
                "field": "date",
                "calendar_interval": field,
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
        });
    }
    else {
        fieldInfo += JSON.stringify({
                "terms": {
                    "field": "username",
                    "order": {
                        "_count": "desc"
                    },
                    "size": 14
                }
            });
        }

        fieldInfo += '}'
        return fieldInfo;
}

function buildQuery(aggs, must) {
    var query = {
        "aggs": aggs,
        "size": 10000,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "query": {
            "bool": {
                "must": must,
                "filter": [],
                "should": [],
                "must_not": []
            }
        },
        "sort" : [
            { "date" : {"order" : "asc"}}
        ]
    }
    return query;
}

export function generateWordCloud(param) {

    var must = [
        constructMatchPhrase(param)
    ]

    var query = JSON.stringify(buildQuery({}, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
                query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();

        console.log("JSON!!!!!")
        console.log(myJson);
        return myJson;

    }
    return userAction();


}

export function generateEssidHistogramQuery(param, retweets, givenFrom, givenUntil) {
    var queryStart = param["from"];
    var queryEnd = param["until"];

    let dateEndQuery = new Date(queryEnd);
    let dateStartQuery = new Date(queryStart);

    let dateGivenFrom = new Date(givenFrom);
    let dateGivenUntil = new Date(givenUntil);

    var reProcess = false;
    let diff = (dateGivenUntil - dateGivenFrom) / (1000 * 3600 * 24);
    let interval = "";
    if (diff > 14)
    {
        interval = "1d";
        if ((dateEndQuery - dateStartQuery) / (1000 * 3600 * 24) < 14)
            reProcess = true;
    }
    else
        interval = "1h";


    let aggs = constructAggs(interval);
    let must = [constructMatchPhrase(param, givenFrom, givenUntil)]

    const userAction = async (query) => {
        var str_query = JSON.stringify(query).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
                str_query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        if (myJson["error"] === undefined)
        {
            if (retweets)
                return getPlotlyJsonHisto(myJson, retweetsGet);
            else
                return getPlotlyJsonHisto(myJson, usersGet);
        }
        else
            window.alert("There was a problem calling elastic search");
    }
    return userAction(buildQuery(aggs, must)).then(plotlyJSON => {

        if (reProcess) {
            let aggs = constructAggs("1h");
            let must = [constructMatchPhrase(param, queryStart, queryEnd)]
            return (userAction(buildQuery(aggs, must)).then(plotlyJSON2 => {

                        plotlyJSON2.forEach(plot => plotlyJSON.push(plot));
                        return plotlyJSON;
                    }));

            }
            else
                return plotlyJSON;
           
        });
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
        const response = await fetch(elasticSearch_url, {
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

export function generateDonutQuery(param, field) {
    var mainKey = param["search"]["search"];

    let aggs = constructAggs(field);
    let must = [ constructMatchPhrase(param) ];

    var query = JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
                query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        if (field === "hashtags") {
            return getPlotlyJsonCloud(myJson, hashtagsGet, mainKey);
        } else if (field === "nretweets" || field == "nlikes")
            return getPlotlyJsonCloud(myJson, mostRetweetGet, mainKey);
        else
            return getPlotlyJsonCloud(myJson, mostTweetsGet, mainKey);

    }
    return userAction();
}

async function completeJson(aggs, must, myJson)
{
         console.log("COMPLETING REQUEST")
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body: JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}"),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        var arr = Array.from(myJson.hits.hits);
        var id_arr = arr.map(elt => elt._id);
        const myJson2 = await response.json();
        console.log(myJson2.hits.total.value)
        Array.from(myJson2.hits.hits).forEach(hit => {
            if (!id_arr.includes(hit._id))
            {
                arr.push(hit);
            }
            else
                console.log(hit);
        })
        myJson["current_total_hits"] = myJson2.hits.total.value;
        //console.log(arr);
        myJson.hits.hits = arr;
        myJson.hits.total.value = arr.length;
        return myJson;
}

async function getJson(param, aggs, must) {
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    var myJson = await response.json();

    console.log(param["from"]);
    console.log(param["until"]);
  //  const truc = myJson
    //console.log(truc);
    if (myJson["hits"]["total"]["value"] === 10000)
    {
        do
        {
            console.log("CHANGING PARAMS")
            var newparam = param;
           // newparam["from"] = myJson.hits.hits[myJson.hits.hits.length-1]._source.date;
          /*  console.log(param["from"]);
            console.log(param["until"]);
            console.log(myJson.hits.hits)*/
            var must2 = [
                constructMatchPhrase({"from": myJson.hits.hits[myJson.hits.hits.length-1]._source.date, "until": param["until"], "search": param.search, "session": param.session })
            ]
            myJson = await completeJson(aggs, must2, myJson);
        }while(myJson.current_total_hits === 10000)
    }
    json = myJson;
   // console.log(json)
    return myJson;
};

export function generateTweetCount(param) {
    var must = [
        constructMatchPhrase(param)
    ]
    return getJson(param, {}, must).then( json => json["hits"]["total"]);
}

export function generateURLArray(param) {

    let must = [ constructMatchPhrase(param) ]
    let aggs = constructAggs("urls");

    let query = JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
                query, 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();


        let array = getURLArray(myJson);

        let arrayStr = '<table id="url_table">' +
            '<tr>' +
            '<td>url</td>' +
            '<td>count</td>' +
            '</tr>';
        array.forEach(row => {
            arrayStr += '<tr>' +
                '<td><a href="' + row.url + '" target="_blank">' + row.url + '</a></td>' +
                '<td>' + row.count + '</td></tr>';
        });
        arrayStr += '</table>';
        return arrayStr;
    };
    return userAction();
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

    if (keys.length === 0)
        return null;
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
        outsidetextfont: { size: 20, color: "#377eb8" },
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

export function getTweets() {
    return json
}
