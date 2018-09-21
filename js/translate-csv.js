/* @url_csv link to download google spreadsheet as csv or to the csv file directly */
var url_csv = "https://docs.google.com/spreadsheets/d/1LjKcRb6JfN7PUC0PBLvB4t-cq6qem5RnmuR81oR1dpg/export?format=csv&id=1LjKcRb6JfN7PUC0PBLvB4t-cq6qem5RnmuR81oR1dpg&gid=0"

/* @lang_array_csv variable containing csv as array, used to save result from translate_csv */
var lang_array_csv = [];
 
/**
* @func transform array in json representation of translation (access this way: json[global_language][id_translate])
* @array the array representation of the csv
* @return the json representation of the csv
*/
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

/**
* @func transform csv string to its array representation
* @csv csv string
* @return array representation of csv string
*/
function csv_to_array(csv) {
  rows = csv.split("\n");

  return rows.map(function (row) {
    return row.split(",");
  });
}

/**
* @func get the google spreadsheet or csv file localy and stores its content as an array in lang_array_csv
* @path url to google spreadsheet or path to csv local file
*/
function translate_csv(path) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", path, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        lang_array_csv = csv_to_array(allText);
      }
    }
  }
  rawFile.send(null);
}

//call to create global variable containing json representation of translations
translate_csv(url_csv);

/* @json_lang_translate json representation of translations found at url_csv */
var json_lang_translate = array_to_json(lang_array_csv);