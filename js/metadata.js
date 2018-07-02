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
    return table
}

/*Create table for image metadata*/
function imgTable(json_str){
    var json = JSON.parse(json_str);
    var table = document.createElement("table");
    table.id = "imgTable";
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
        switch (global_language){
            case "fr":
                table.innerHTML = "Aucune métadonnée EXIF n'a été trouvée. <strong>Note:<strong> Le Format EXIF s'applique uniquement aux images .jpg et .tiff";
                break;
            case "en":
            default:
                table.innerHTML = "No EXIF Metadata was found. <strong>Note:</strong> The EXIF standard applies only to .jpg and .tiff images";
                break;
        }
    }
    return table
}

/* get Exif Metadata */
var jsonTitleImageMetadata = {
    en: "Image Metadata",
    fr: "Metadonnée de l'image"
};
function getExif(img) {
    cleanElement("place-metadata");
    EXIF.getData(img, function() {
        var allMetaData = EXIF.getAllTags(this);
        var allMetaDataSpan = document.getElementById("place-metadata");
        makeTitle(jsonTitleImageMetadata[global_language], allMetaDataSpan);
        var json_str = JSON.stringify(allMetaData, null, "\t");
        var table = imgTable(json_str);
        allMetaDataSpan.appendChild(table);
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
    },
    en: {
        metadata: {
            title: "Video Metadata",
            name: ["Moov", "Duration", "Fragmented", "Duration of fragment", "Progressive", "IOD", "Brands", "Created time", "Modified time"],
            desc: ["", "Number, providing the duration of the movie (unfragmented part) in timescale units",
            "Number, corresponding to the timescale as given in the movie header",
            "boolean, indicating if the file is already fragmented",
            "Number, giving the duration of the fragmented part of the file, in timescale units",
            "boolean, indicating if the file can be played progressively",
            "boolean, indicating if the the file contains an MPEG-4 Initial Object Descriptor",
            "Array of 4CC codes corresponding to the file brands as given in the ftyp box",
            "Date object, indicating the creation date of the file as given in the movie header",
            "Date object, indicating the last modification date of the file as given in the movie header"]
        },
        track: {
            title: "Video Track",
            name: ["Identifier", "References", "Created time", "Modified time", "Movie duration", "Layer", "Alternate group", "Volume", "Width", "Height", "Timescale",
            "Duration", "Codec", "Language", "Samples", "Size", "Bitrate"],
            desc: ["Number, giving track identifier", "", "Date object, indicating the creation date of the file as given in the track header",
            "Date object, indicating the last modification date of the file as given in the track header", "",
            "Number, layer information as indicated in the track header",
            "Number, identifier of the alternate group the track belongs to",
            "", "Number, width of the track as indicated in the track header", "Number, height of the track as indicated in the track header",
            "Number, indicating the track timescale, as given in the track header", "Number, providing the duration of the (unfragmented part of) track, in timescale units",
            "String, giving the MIME codecs parameter for this track (e.g. \"avc1.42c00d\" or \"mp4a.40.2\"), to be used to create SourceBuffer objects with Media Source Extensions",
            "String, giving the 3-letter language code",
            "Number, giving the number of track samples (ie. frames)",
            "", "Number, providing the bitrate of the track in bits per second"]
        },
        audio: {
            title: "Audio track",
            name: ["Identifier", "References", "Created time", "Modified time", "Movie duration", "Layer", "Alternate group",
            "Volume", "Width", "Height", "Timescale", "Duration", "Codec", "Language", "Samples", "Size", "Bitrate"],
            desc: ["Number, giving track identifier", "", "Date object, indicating the creation date of the file as given in the track header",
            "Date object, indicating the last modification date of the file as given in the track header", "",
            "Number, layer information as indicated in the track header",
            "Number, identifier of the alternate group the track belongs to",
            "", "Number, width of the track as indicated in the track header", "Number, height of the track as indicated in the track header",
            "Number, indicating the track timescale, as given in the track header", "Number, providing the duration of the (unfragmented part of) track, in timescale units",
            "String, giving the MIME codecs parameter for this track (e.g. \"avc1.42c00d\" or \"mp4a.40.2\"), to be used to create SourceBuffer objects with Media Source Extensions",
            "String, giving the 3-letter language code",
            "Number, giving the number of track samples (ie. frames)",
            "", "Number, providing the bitrate of the track in bits per second"]
        }   
    },
    fr: {
        metadata: {
            title: "Metadonné de la video",
            name: ["Moov", "Durée", "Unité de temps", "Fragmenté", "Durée d'un fragment", "Progressive", "IOD", "Type", "Date de création", "Date de modification"],
            desc: ["", "Nombre, donnant la durée du film (partie défragmentée) en unité de temps",
            "Nombre, correspondant è l'unité de temps donnée dans l'entête du film",
            "Booléen, indiquant si le film est déjà fragmenté",
            "Number, donnant la durée de la partie fragmentée du film, en unité de temps",
            "Booléen, indiquant si le fichier peut être lu progressivement",
            "Booléen, indiquant si le fichier contient un MPEG-4 Initial Object Descriptor",
            "Tableau de code 4CC correspondant au type de fichier comme donné dans la boite ftyp",
            "Date, indiquant la date de création du fichier comme donné dans l'entête du film",
            "Date, indiquant la date de dernière modification du fichier comme donnée dans l'entête du film"]
        },
        track: {
            title: "Piste vidéo",
            name: ["Identifiant", "Réferences", "Date de création", "Date de modification", "Durée du film", "Couches", "Groupes alternatifs", "Volume", "Largeur", "Hauteur", "Unité de temps",
            "Durée", "Codec", "Langage", "Echantillon", "Taille", "Taux de bit"],
            desc: ["Nombre, Identifiant de la piste", "", "Date, indiquant la date de création du fichier comme donnée dans l'entête de la piste",
            "Date, indiquant la date de dernière modification du fichier comme donnée dans l'entête de la piste", "",
            "Nombre, information de couche indiqué dans l'entête de piste",
            "Nombre, identifiant du groupe alternatif auquel la piste appartient",
            "", "Nombre, largeur de la piste comme indiqué dans l'entête de piste", "Nombre, hauteur de la piste comme indiqué dans l'entête de piste",
            "Nombre, indiquant l'unité de temps de la piste comme donné dans l'entête de la piste", "Nombre, donnant la duréee de la (partie défragmentée de la) piste, en unité de temps",
            "Chaine de charactère, donnant les paramètres codecs MIME pour cette piste (ex. \"avc1.42c00d\" ou \"mp4a.40.2\"), pour être utilisé pour créer un objet SourceBuffer avec Media Source Extensions",
            "Chaine de charactère, donnant le code de langage à 3 lettres",
            "Nombre, donnant le nombre d'échantillons de piste (c-à-d images)",
            "", "Nombre, taux de bits par second de la piste"]
        },
        audio: {
            title: "Piste audio",
            name: ["Identifiant", "Réferences", "Date de création", "Date de modification", "Durée du film", "Couches", "Groupes alternatifs", "Volume", "Largeur", "Hauteur", "Unité de temps",
            "Durée", "Codec", "Langage", "Echantillon", "Taille", "Taux de bit"],
            desc: ["Nombre, Identifiant de la piste", "", "Date, indiquant la date de création du fichier comme donnée dans l'entête de la piste",
            "Date, indiquant la date de dernière modification du fichier comme donnée dans l'entête de la piste", "",
            "Nombre, information de couche indiqué dans l'entête de piste",
            "Nombre, identifiant du groupe alternatif auquel la piste appartient",
            "", "Nombre, largeur de la piste comme indiqué dans l'entête de piste", "Nombre, hauteur de la piste comme indiqué dans l'entête de piste",
            "Nombre, indiquant l'unité de temps de la piste comme donné dans l'entête de la piste", "Nombre, donnant la duréee de la (partie défragmentée de la) piste, en unité de temps",
            "Chaine de charactère, donnant les paramètres codecs MIME pour cette piste (ex. \"avc1.42c00d\" ou \"mp4a.40.2\"), pour être utilisé pour créer un objet SourceBuffer avec Media Source Extensions",
            "Chaine de charactère, donnant le code de langage à 3 lettres",
            "Nombre, donnant le nombre d'échantillon de piste (c-à-d. images)",
            "", "Nombre, taux de bits par seconde de la piste"]
        }  
    }
}

/* get Mp4 Metadata */
function getMp4(vid) {
    cleanElement("place-metadata");

    var allMetaDataSpan = document.getElementById("place-metadata");

    var mp4box = new MP4Box();
    mp4box.onError = function(e) {};
    /* display metadata info when mp4box parsing isfinished */
    mp4box.onReady = function(info) {
        cleanElement("place-metadata");
        var allMetaDataSpan = document.getElementById("place-metadata");
        var json_str = JSON.stringify(info, null, "\t");
        if(json_str == "{}") {
            var divError = document.createElement("div");
            divError.innerHTML = "No Metadata was found.";
            allMetaDataSpan.appendChild(divError);
            return;
        }
        var indexes = jsonTitleTableMetadata["index"];
        var languageText = jsonTitleTableMetadata[global_language];
        var metadataText = languageText["metadata"];
        //metadata
        makeTitle(metadataText["title"], allMetaDataSpan);
        var table = makeTableMetadata(info, indexes["metadata"], metadataText["name"], metadataText["desc"]);
        allMetaDataSpan.appendChild(table);
        //video Tracks
        var trackText = languageText["track"];
        makeTitle(trackText["title"], allMetaDataSpan);
        table = makeTableMetadata(info.videoTracks[0], indexes["track"], trackText["name"], trackText["desc"]);
        allMetaDataSpan.appendChild(table);
        //audio Tracks
        var audioText = languageText["audio"];
        makeTitle(audioText["title"], allMetaDataSpan);
        json_str = JSON.stringify(info.audioTracks[0], null, "\t");
        table = makeTableMetadata(info.audioTracks[0], indexes["audio"], audioText["name"], audioText["desc"]);
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
    cleanElement("preview-metadata")
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
        }
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
    var table = document.getElementById('imgTable');
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
    var GPSLatitudeRef = getTableValue("GPSLatitudeRef");
    var GPSLatitude = getTableValue("GPSLatitude");
    var GPSLongitudeRef = getTableValue("GPSLongitudeRef");
    var GPSLongitude = getTableValue("GPSLongitude");
    if (GPSLatitude != "" && GPSLatitudeRef != "" && GPSLongitude != "" && GPSLongitudeRef != "") {
        var div = document.getElementById("place-metadata");
        var br = document.createElement("br");
        div.appendChild(br);
        var btn = document.createElement("button");
        btn.setAttribute("class","button");
        btn.innerHTML = "View GPS location"
        div.appendChild(btn);
        btn.onclick = function() {
            var mapurl = "http://maps.google.com/maps?q=";
            mapurl += replaceAll(GPSLatitude, ",", "%20") + GPSLatitudeRef + "%20" + replaceAll(GPSLongitude, ",", "%20") + GPSLongitudeRef;
            openTab(mapurl);
        };
    }
}

function updateTableLanguageMetadata(lang) {
    if (!document.getElementById("place-metadata").hasChildNodes())
        return;
    if (document.getElementById("preview-metadata").hasChildNodes()) // image selected
        $("#place-metadata > h3").html(jsonTitleImageMetadata[lang]);
        return;
    var jsonText = jsonTitleTableMetadata[lang];
    var partNames = [];
    var titles = [];
    for (var part of ["metadata", "track", "audio"])
    {
        var text = jsonText[part];
        partNames.push(text["title"]);
        titles = titles.concat(text["name"]);
    }
    $("#place-metadata").find("h3").html(function (index) {
        return partNames[index];
    })
    updateTitleTable("place-metadata", titles);
}
