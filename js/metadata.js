/*Create Title*/
function makeTitle(title, div){
    h3 = document.createElement("h3");
    h3.innerHTML = title;
    div.appendChild(h3);
}

function makeTable(json, lst, lst_desc){
    var table = document.createElement("table");
    for (var index in lst){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        th.innerHTML = lst[index];
        th.title = lst_desc[index];
        td.innerHTML = json[lst[index]];
        //createPopUp(th, lst_desc[index]);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    return table
}

function imgTable(json_str){
    var json = JSON.parse(json_str);
    var table = document.createElement("table");
    for (var key in json) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        th.innerHTML = key;
        td.innerHTML = json[key];
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    if(json_str == "{}") {
        table = document.createElement("div");
        table.innerHTML = "No EXIF Metadata was found. <strong>Note:</strong> The EXIF standard applies only to .jpg and .tiff images";
    }
    return table
}

/* get Exif Metadata */
function getExif(img) {
    cleanElement("place-metadata");
    EXIF.getData(img, function() {
        var allMetaData = EXIF.getAllTags(this);
        var allMetaDataSpan = document.getElementById("place-metadata");
        makeTitle("Image Metadata", allMetaDataSpan);
        var json_str = JSON.stringify(allMetaData, null, "\t");
        var table = imgTable(json_str);
        allMetaDataSpan.appendChild(table);
    });
}


/* get Mp4 Metadata */
function getMp4(vid) {
    cleanElement("place-metadata");

    var allMetaDataSpan = document.getElementById("place-metadata");
    var d = document.createElement("div");
    d.innerHTML = "No metadata was found.";
    allMetaDataSpan.appendChild(d);

    var mp4box = new MP4Box();
    mp4box.onError = function(e) {};
    /* display metadata info when mp4box parsing isfinished */
    mp4box.onReady = function(info) {
        cleanElement("place-metadata");
        var allMetaDataSpan = document.getElementById("place-metadata");
        makeTitle("Video Metadata", allMetaDataSpan);
        var lst = ["hasMoov", "duration", "timescale", "isFragmented", "fragment_duration", "isProgressive", "hasIOD",
         "brands", "created", "modified"];
        var lst_desc = ["", "Number, providing the duration of the movie (unfragmented part) in timescale units",
         "Number, corresponding to the timescale as given in the movie header",
        "boolean, indicating if the file is already fragmented",
        "Number, giving the duration of the fragmented part of the file, in timescale units",
        "boolean, indicating if the file can be played progressively",
        "boolean, indicating if the the file contains an MPEG-4 Initial Object Descriptor",
        "Array of 4CC codes corresponding to the file brands as given in the ftyp box",
        "Date object, indicating the creation date of the file as given in the movie header",
        "Date object, indicating the last modification date of the file as given in the movie header"]
        var json_str = JSON.stringify(info, null, "\t");
        var table = makeTable(info, lst, lst_desc);
        if(json_str == "{}") {
            table = document.createElement("div");
            table.innerHTML = "No Metadata was found.";
        }
        allMetaDataSpan.appendChild(table);
        if(json_str != "{}"){
        //video Tracks
            makeTitle("Video Track", allMetaDataSpan);
            lst = ["id", "references", "created", "modified", "movie_duration", "layer", "alternate_group", "volume",
             "track_width","track_height", "timescale", "duration", "codec", "language", "nb_samples", "size", "bitrate"];
            lst_desc = ["Number, giving track identifier", "", "Date object, indicating the creation date of the file as given in the track header",
            "Date object, indicating the last modification date of the file as given in the track header", "",
             "Number, layer information as indicated in the track header",
             "Number, identifier of the alternate group the track belongs to",
             "", "Number, width of the track as indicated in the track header", "Number, height of the track as indicated in the track header",
             "Number, indicating the track timescale, as given in the track header", "Number, providing the duration of the (unfragmented part of) track, in timescale units",
             "String, giving the MIME codecs parameter for this track (e.g. \"avc1.42c00d\" or \"mp4a.40.2\"), to be used to create SourceBuffer objects with Media Source Extensions",
             "String, giving the 3-letter language code",
             "Number, giving the number of track samples (ie. frames)",
             "", "Number, providing the bitrate of the track in bits per second"];
            table = makeTable(info.videoTracks[0], lst, lst_desc);
            allMetaDataSpan.appendChild(table);
            //audio Tracks
            makeTitle("Audio Track", allMetaDataSpan);
            json_str = JSON.stringify(info.audioTracks[0], null, "\t");
            lst = ["id", "references", "created", "modified", "movie_duration", "layer", "alternate_group", "volume",
             "track_width","track_height", "timescale", "duration", "codec", "language", "nb_samples", "size", "bitrate"];
             lst_desc = ["Number, giving track identifier", "", "Date object, indicating the creation date of the file as given in the track header",
            "Date object, indicating the last modification date of the file as given in the track header", "",
             "Number, layer information as indicated in the track header",
             "Number, identifier of the alternate group the track belongs to",
             "", "Number, width of the track as indicated in the track header", "Number, height of the track as indicated in the track header",
             "Number, indicating the track timescale, as given in the track header", "Number, providing the duration of the (unfragmented part of) track, in timescale units",
             "String, giving the MIME codecs parameter for this track (e.g. \"avc1.42c00d\" or \"mp4a.40.2\"), to be used to create SourceBuffer objects with Media Source Extensions",
             "String, giving the 3-letter language code",
             "Number, giving the number of track samples (ie. frames)",
             "", "Number, providing the bitrate of the track in bits per second"];
            table = makeTable(info.audioTracks[0], lst, lst_desc);
            allMetaDataSpan.appendChild(table);
        }
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
    var url = document.getElementById("url-metadata").value;
    var img_radio = document.getElementById("img-meta-radio");
    if (img_radio.checked) {
        /* Metadata */
        var img = new Image();
        img.src = url;
        /* No Metadata if img is not loaded */
        img.onload = function(){
            getExif(img);
            //getImgRawData(img.src);
        }
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