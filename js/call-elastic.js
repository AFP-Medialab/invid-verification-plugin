
//var sessid = "sess-080f5dae-f7f1-499f-abba-7c34cb7b63dc"
export function generatePieChartQuery(sessid) {
  const userAction = async () => {
    const response = await fetch('http:localhost:9200/twinttweets/_search', {
      method: 'POST',
      body:
        JSON.stringify({
          "aggs": {
            "2": {
              "terms": {
                "field": "username",
                "order": {
                  "_count": "desc"
                },
                "size": 10
              }
            }
          },
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
                  "match_all": {}
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
                      "gte": "2018-09-18T11:30:24.961Z",
                      "lte": "2019-09-18T11:30:24.961Z"
                    }
                  }
                }
              ],
              "filter": [],
              "should": [],
              "must_not": []
            }
          }
        }),
      headers: {
        'Content-Type': 'application/json'
      } //*/
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
    console.log(myJson["aggregations"]["2"]["buckets"]);

    let vals = [];
    let keys = [];
    let buckets = myJson["aggregations"]["2"]["buckets"];
    buckets.forEach(elt => {
      vals.push(elt["doc_count"]);
      keys.push(elt["key"]);
    });

    let plotlyJson = [{
      values: vals,
      labels: keys,
      type: 'pie'
    }];
    return plotlyJson;
  }
  return (userAction());
}

export function generateHistogramQuery(sessid, hashtag) {
  let matchPhrase = {}
  if (sessid !== null && hashtag === null)
    matchPhrase = 
      { 
        "match_phrase": 
        {
          "essid": {
            "query": sessid
          }
        }
      }
  else if (hashtag !== null && sessid === null)
    matchPhrase = 
        { 
          "match_phrase": 
          {
            "hashtags": {
              "query": hashtag
            }
          }
        }
    else if (hashtag !== null && sessid !== null)
      matchPhrase = 
          { 
            "match_phrase": 
            {
              "hashtags": {
                "query": hashtag
              },
              "essid": {
                "query": sessid
              }
            }
          }

  const userAction = async () => {
    const response = await fetch('http:localhost:9200/twinttweets/_search', {
      method: 'POST',
      body:
        JSON.stringify({
          "aggs": {
            "2": {
              "date_histogram": {
                "field": "date",
                "calendar_interval": "1w",
                "time_zone": "Europe/Paris",
                "min_doc_count": 1
              },
              "aggs": {
                "3": {
                  "terms": {
                    "field": "user_id",
                    "order": {
                      "_count": "desc"
                    },
                    "size": 5
                  }
                }
              }
            }
          },
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
                matchPhrase,
                {
                  "range": {
                    "date": {
                      "format": "strict_date_optional_time",
                      "gte": "2018-09-18T14:37:51.469Z",
                      "lte": "2019-09-18T14:37:51.469Z"
                    }
                  }
                }
              ],
              "filter": [],
              "should": [],
              "must_not": []
            }
          }
        }),
      headers: {
        'Content-Type': 'application/json'
      } //*/
    });
    const myJson = await response.json();

    let dates = myJson["aggregations"]["2"]["buckets"];

    var infos = [];

    dates.forEach(dateObj => {

      if (sessid !== null)
        dateObj["3"]["buckets"].forEach(elt => {
          infos.push({
            date: dateObj['key_as_string'],
            key: elt["key"],
            nb: elt["doc_count"]
          })
        })
      else if (hashtag !== null)
      infos.push({
        date: dateObj['key_as_string'],
        key: hashtag,
        nb: dateObj["doc_count"]
      })
    });
    var lines = [];
    while (infos.length != 0) {
      let info = infos.pop();
      let date = info.date;
      let nb = info.nb;
      let plotlyInfo = {
        type: "scatter",
        mode: "lines",
        line: {color: getRandomColor()},
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
      console.log(plotlyInfo);
      console.log(infos);
      lines.push(plotlyInfo);
    }
    return lines;

  }
  return userAction();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

   // generateQuery().then((json) => responseJson = json);
