var url_csv = "https://docs.google.com/spreadsheets/d/1LjKcRb6JfN7PUC0PBLvB4t-cq6qem5RnmuR81oR1dpg/export?format=csv&id=1LjKcRb6JfN7PUC0PBLvB4t-cq6qem5RnmuR81oR1dpg&gid=0"

var lang_array = [];

function array_to_json(array) {
  var json = {};
  for (var i = 1; i < array[0].length; ++i) {
    var lang = array[0][i].replace("\r", "");
    json[lang] = {};
    for (var j = 1; j < array.length; ++j) {
      json[lang][array[j][0]] = array[j][i].replace("\r", "");
    }
  }
  return json;
}

function csv_to_array(csv) {
  rows = csv.split("\n");

  return rows.map(function (row) {
    return row.split(",");
  });
}

function translate_csv(path) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", url_csv, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        lang_array = csv_to_array(allText);
      }
    }
  }
  rawFile.send(null);
}

translate_csv("/translate.csv");
var json_test = array_to_json(lang_array);