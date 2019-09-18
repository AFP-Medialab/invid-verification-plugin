

      var sessid = "sess-080f5dae-f7f1-499f-abba-7c34cb7b63dc"
export default function generateQuery()
{
        var str = " {\"query\":" +
        " { \"bool\":" +
          " { \"must\": [" +
            
          " { \"match_phrase\":" + 
              " { \"essid\":" + 
                " { \"query\": \"" +  sessid + "\"" + 
                " }" + 
              " }" +
           " }," +
         " ]}" +
       " }," +
     "\"size\": 15" +
     "}"
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
        return myJson["aggregations"]["2"]["buckets"];
      }
      return(userAction());
    }

   // generateQuery().then((json) => responseJson = json);
