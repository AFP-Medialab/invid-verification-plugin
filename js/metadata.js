/*Create Title*/
function makeTitle(title, div){
    h3 = document.createElement("h3");
    h3.innerHTML = title;
    div.appendChild(h3);
}

/*Create table for video metadata*/
function makeTableMetadata(json, indexJson, names, lst_desc){
    var table = document.createElement("table");
    for (var index in indexJson){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        th.innerHTML = names[index];
        th.title = lst_desc[index];
        td.innerHTML = json[indexJson[index]];
        //createPopUp(th, lst_desc[index]);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    return table;
}

/**
* @func translate ascii decimal representation of str and gives a string of character
* @arr ascii decimal representation to translate
* @return string containing the translated str
*/
function translateASCII(arr) {
    var res = "";
    for (var i = 0; i < arr.length; ++i) {
        res += String.fromCharCode(parseInt(arr[i], 10));
    }
    return res;
}

var jsonLastImg = "{}";

/*Create table for image metadata*/
function imgTable(json_str, lang){
    jsonLastImg = json_str;
    cleanElement("place-metadata");
    cleanElement("error-metadata");
    document.getElementById("error-metadata").style.display = "none";
    var topics = ["software", "general", "gps"];
    var soft_keys = ["Make", "Model", "Orientation", "XResolution", "YResolution", "ResolutionUnit", "HostComputer", "Software", "ModifyDate",
        "YCbCrPositioning", "Copyright"];
    var gene_keys = ["Artist", "DocumentName", "PageName", "ExposureTime", "FNumber", "ExposureProgram", "ExifVersion", "DateTimeOriginal",
        "DateTimeDigitized", "ComponentsConfiguration", "CompressedBitsPerPixel", "ExposureBias", "MaxApertureValue", "MeteringMode",
        "Flash", "FocalLength", "UserComment", "ImageDescription", "MakerNote", "SubjectDistance", "FlashpixVersion", "ColorSpace", "PixelXDimension", "PixelYDimension", "FileSource"];
    var gps_keys = ["GPSLatitudeRef", "GPSLatitude", "GPSLongitudeRef", "GPSLongitude", "GPSTimeStamp"];
    var all_keys = [soft_keys, gene_keys, gps_keys];
    var json = JSON.parse(json_str);
    var jsonLang = json_lang_translate[lang];

    var meta_place = document.getElementById("place-metadata");

    for (var i = 0; i < topics.length; ++i) {
        var arr_keys = all_keys[i];
        var fields = list_from_json(jsonLang, "metadata_img_" + topics[i] + "_fields_");
        var desc = list_from_json(jsonLang, "metadata_img_" + topics[i] + "_desc_");
        var table = document.createElement("table");
        table.id = "imgTable_" + topics[i];

        for (var j = 0; j < arr_keys.length; ++j) {
            if (json[arr_keys[j]] !== undefined) {
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                var td = document.createElement("td");
                th.innerHTML = fields[j];
                th.title = desc[j];
                if (jsonLang["metadata_img_key_" + arr_keys[j] + "_" + json[arr_keys[j]]] !== undefined) {
                    td.innerHTML = jsonLang["metadata_img_key_" + arr_keys[j] + "_" + json[arr_keys[j]]];
                } else if (arr_keys[j] === "UserComment" ||
                    arr_keys[j] === "MakerNote") {
                    td.innerHTML = translateASCII(json[arr_keys[j]]);
                } else {
                    td.innerHTML = json[arr_keys[j]];
                }
                tr.appendChild(th);
                tr.appendChild(td);
                table.appendChild(tr);
            }
        }
        if (table.hasChildNodes()) {
            makeTitle(jsonLang["metadata_img_" + topics[i] + "_title"], meta_place);
            meta_place.appendChild(table);
        }
    }
    if(json_str == "{}") {
        table = document.createElement("div");
        table.innerHTML = jsonLang["metadata_img_error_exif"];
        meta_place.appendChild(table);
    }
}

/* get Exif Metadata */
var jsonTitleImageMetadata = {
    en: "Image Metadata",
    fr: "Métadonnées de l'image"
};

/* exif metadata translations */

function getExif(img) {
    cleanElement("place-metadata");
    cleanElement("error-metadata");
    document.getElementById("error-metadata").style.display = "none";
    EXIF.getData(img, function() {
        var allMetaData = EXIF.getAllTags(this);
        var json_str = JSON.stringify(allMetaData, null, "\t");
        imgTable(json_str, global_language);
        if (json_str != "{}")
            getLocation();
    });
}

var jsonTitleTableMetadata = {
    index: {
        metadata: ["hasMoov", "duration", "timescale", "isFragmented", "fragment_duration", "isProgressive", "hasIOD",
            "brands", "created", "modified"],
        track: ["id", "references", "created", "modified", "movie_duration", "layer", "alternate_group", "volume",
            "track_width","track_height", "timescale", "duration", "codec", "language", "nb_samples", "size", "bitrate"],
        audio: ["id", "references", "created", "modified", "movie_duration", "layer", "alternate_group", "volume",
            "track_width","track_height", "timescale", "duration", "codec", "language", "nb_samples", "size", "bitrate"]  
    }
}

/* get Mp4 Metadata */
function getMp4(vid) {
    cleanElement("place-metadata");
    cleanElement("error-metadata");
    document.getElementById("error-metadata").style.display = "none";

    var allMetaDataSpan = document.getElementById("place-metadata");

    var mp4box = new MP4Box();
    mp4box.onError = function(e) {
        cleanElement("error-metadata");
        document.getElementById("error-metadata").innerHTML = json_lang_translate[global_language]["metadata_table_error"];
        document.getElementById("place-metadata").style.display = "none";
        document.getElementById("error-metadata").style.display = "block";
    };
    /* display metadata info when mp4box parsing isfinished */
    mp4box.onReady = function(info) {
        cleanElement("place-metadata");
        cleanElement("error-metadata");
        document.getElementById("error-metadata").style.display = "none";
        var allMetaDataSpan = document.getElementById("place-metadata");
        var json_str = JSON.stringify(info, null, "\t");
        if(json_str == "{}") {
            var divError = document.createElement("div");
            divError.innerHTML = "No Metadata was found.";
            allMetaDataSpan.appendChild(divError);
            return;
        }
        var indexes = jsonTitleTableMetadata["index"];
        var languageText = json_lang_translate[global_language];//jsonTitleTableMetadata[global_language];
        //var metadataText = languageText["metadata"];
        //metadata
        makeTitle(languageText["metadata_title"], allMetaDataSpan);
        var table = makeTableMetadata(info, indexes["metadata"], list_from_json(languageText, "metadata_name_"), list_from_json(languageText, "metadata_desc_"));
        allMetaDataSpan.appendChild(table);
        //video Tracks
        //var trackText = languageText["track"];
        makeTitle(languageText["track_title"], allMetaDataSpan);
        table = makeTableMetadata(info.videoTracks[0], indexes["track"], list_from_json(languageText, "track_name_"), list_from_json(languageText, "track_desc_"));
        allMetaDataSpan.appendChild(table);
        //audio Tracks
        //var audioText = languageText["audio"];
        makeTitle(languageText["audio_title"], allMetaDataSpan);
        json_str = JSON.stringify(info.audioTracks[0], null, "\t");
        table = makeTableMetadata(info.audioTracks[0], indexes["audio"], list_from_json(languageText, "audio_name_"), list_from_json(languageText, "audio_desc_"));
        allMetaDataSpan.appendChild(table);
    };

    var arrayBuffer;
    var fileReader = new FileReader();
    /* send to mp4box when file reading is finished */
    fileReader.onload = function() {
        arrayBuffer = this.result;
        arrayBuffer.fileStart = 0;
        mp4box.appendBuffer(arrayBuffer);
        mp4box.flush();
    };   
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", vid);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function() {
        blob = xhr.response;//xhr.response is now a blob object
        fileReader.readAsArrayBuffer(blob);
    }
    xhr.send();
}

function submit_metadata(){
    cleanElement("preview-metadata");
    cleanElement("error-metadata");
    var url = document.getElementById("url-metadata").value;
    url = get_real_url_img(url);
    var img_radio = document.getElementById("img-meta-radio");
    if (img_radio.checked) {
        /* Metadata */
        var img = new Image();
        img.src = url;
        /* No Metadata if img is not loaded */
        img.onload = function(){
            var scale = Math.max(img.width/600, img.height/600);
            if (scale > 1)
            {
                img.width = Math.round(img.width/scale);
                img.height = Math.round(img.height/scale);
            }
            getExif(img);
            //getImgRawData(img.src);
        };
        /* If error display error message */
        img.onerror = function() {
            cleanElement("error-metadata");
            document.getElementById("error-metadata").innerHTML = json_lang_translate[global_language]["metadata_img_error"];
            document.getElementById("place-metadata").style.display = "none";
            document.getElementById("error-metadata").style.display = "block";
        };
        $("#preview-metadata").append(img);
    }
    else {
        getMp4(url);
    }
    var place = document.getElementById("place-metadata");
    place.setAttribute("style", "display: block;");
}

/* Get local file path */
$('#local-metadata').change( function(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    document.getElementById("url-metadata").value = tmppath;
    submit_metadata();
});

var form = document.getElementById("metadata_form");
if (form.addEventListener){
    form.addEventListener("submit", submit_metadata, false);
}
form.addEventListener("submit", function(e){
    e.preventDefault();
});

function placeRawData(data){
    var div = document.getElementById("place-metadata");
    var h3 = document.createElement("h3");
    h3.innerHTML = "Image Binary Data";
    var raw = document.createElement("div");
    raw.setAttribute("id", "raw-data");
    raw.innerHTML = data;
    div.appendChild(h3);
    div.appendChild(raw);
}

function getImgRawData(img){
    var reader = new FileReader();
    reader.onload = function(e) {
        var rawData = reader.result;
        placeRawData(rawData);
    }
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", img);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function() {
        blob = xhr.response;//xhr.response is now a blob object
        reader.readAsBinaryString(blob);
    }
    xhr.send();
}

function getDataUri(url) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        var data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
        placeRawData(data);
    };
    image.src = url;
}

/*GPS coordinates*/
function getTableValue(thValue){
    var table = document.getElementById('imgTable_gps');
    var thcells = table.getElementsByTagName('th');
    var tdcells = table.getElementsByTagName('td');
    for (var i=0; i<thcells.length; i++){  
        if (thcells[i].innerHTML == thValue) {
            return tdcells[i].innerHTML
        }
    }
    return "";
}

function getLocation(){
    var jsonGpsImg = list_from_json(json_lang_translate[global_language], "metadata_img_gps_fields_");
    var GPSLatitudeRef = getTableValue(jsonGpsImg[0]);
    var GPSLatitude = getTableValue(jsonGpsImg[1]);
    var GPSLongitudeRef = getTableValue(jsonGpsImg[2]);
    var GPSLongitude = getTableValue(jsonGpsImg[3]);
    if (GPSLatitude != "" && GPSLatitudeRef != "" && GPSLongitude != "" && GPSLongitudeRef != "") {
        var div = document.getElementById("place-metadata");
        var br = document.createElement("br");
        div.appendChild(br);
        var btn = document.createElement("button");
        btn.setAttribute("class","button");
        btn.innerHTML = json_lang_translate[global_language]['metadata_gps_button'];
        div.appendChild(btn);
        btn.onclick = function() {
            var mapurl = "http://maps.google.com/maps?q=";
            var arr_lat = GPSLatitude.split(",");
            var arr_long = GPSLongitude.split(",");
            mapurl += arr_lat[0] + "° " + arr_lat[1] + "' " + (arr_lat[2] != "0" ? arr_lat[2] + '" ' : "") + GPSLatitudeRef + " " +
                arr_long[0] + "° " + arr_long[1] + "' " + (arr_long[2] != "0" ? arr_long[2] + '" ' : "") + GPSLongitudeRef;
            openTab(mapurl);
        };
    }
}

/**
* @func sets the titles and descriptions of each 'th' element in a table
* @tableId string, the id of the table to update
* @titles array of strings containing, ordered, titles for the table
* @descs array of strings containing, ordered, descriptions for the titles of the table
*/
function updateTitleTableMetadata(tableId, titles, descs) {
    var listTitle = $("#" + tableId).find("th");
    for (var i = 0; i < listTitle.length; i++) {
        listTitle[i].innerHTML = titles[i];
        listTitle[i].title = descs[i];
    }
}

function updateTableLanguageMetadata(lang) {
    if (document.getElementById("error-metadata").style.display !== "none") { // if error
        cleanElement("error-metadata");
        document.getElementById("error-metadata").innerHTML = json_lang_translate[lang]["metadata_img_error"];
        document.getElementById("place-metadata").style.display = "none";
        document.getElementById("error-metadata").style.display = "block";
        return;
    }

    if (document.getElementById("preview-metadata").hasChildNodes()) { // image selected
        cleanElement("place-metadata");
        cleanElement("error-metadata");
        document.getElementById("error-metadata").style.display = "none";
        document.getElementById("place-metadata").style.display = "block";
        imgTable(jsonLastImg, lang);
        getLocation();
        return;
    } else {
        var jsonText = json_lang_translate[lang];
        var partNames = [];
        var titles = [];
        var descs = [];
        for (var part of ["metadata", "track", "audio"])
        {
            partNames.push(jsonText[part + "_title"]);
            titles = titles.concat(list_from_json(jsonText, part + "_name_"));
            descs = descs.concat(list_from_json(jsonText, part + "_desc_"));
        }
        $("#place-metadata").find("h3").html(function (index) {
            return partNames[index];
        })
        updateTitleTableMetadata("place-metadata", titles, descs);
    }
}
