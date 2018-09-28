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

var json_translate_img = {
    "en": {
        "software": {
            "title": "Software infos",
            "fields": ["Make", "Model", "Orientation", "X Resolution", "Y Resolution", "Resolution Unit", "Software", "Modify Date",
                "YCbCr Positioning", "Copyright"],
            "desc": ["", "", "", "", "", "", "", "Timestamp for when you might alter the image or it's metadata",
                "Specifies the positioning of subsampled chrominance components relative to luminance samples. Field value 1 (centered) must be specified for compatibility with industry standards such as PostScript Level 2 and QuickTime. Field value 2 (cosited) must be specified for compatibility with most digital video standards, such as CCIR Recommendation 601-1",
                ""]
        },
        "general": {
            "title": "General EXIF infos",
            "fields": ["Exposure Time", "F-Number", "Exposure Program", "Exif Version", "Date Time Original",
                "Date Time Digitized", "Components Configuration", "Compressed Bits Per Pixel", "Exposure Bias", "Max Aperture Value", "Metering Mode",
                "Flash", "Focal Length", "User Comment", "Flashpix Version", "Color Space", "Pixel X Dimension", "Pixel Y Dimension", "File Source"],
            "desc": ["The length of time when the film or digital sensor inside the camera is exposed to light",
                "The ratio of the system's focal length to the diameter of the entrance pupil",
                "The program used by the camera to set exposure when the picture is taken",
                "", "The date and time when the original image data was generated",
                "The date and time when the image was stored as digital data",
                "Provided for cases when compressed data uses components other than Y, Cb, and Cr and to enable support of other sequences",
                "", "Adjustment to either underexpose or overexpose the image", "The smallest F number of the lens",
                "", "", "The actual focal length of the lens, in mm", "Keywords or comments on the image, as decimal ASCII representation",
                "", "Normally sRGB (=1) is used to define the color space based on the PC monitor conditions and environment. If a color space other than sRGB is used, Uncalibrated (=65535) is set",
                "", "", ""]
        },
        "gps": {
            "title": "GPS Informations",
            "fields": ["GPS Latitude Ref.", "GPS Latitude", "GPS Longitude Ref.", "GPS Longitude", "GPS Time Stamp"],
            "desc": ["", "", "", "", ""]
        },
        "error": "Image failed loading. Check the URL and try again"
    },
    "fr": {
        "software": {
            "title": "Informations logicielles",
            "fields": ["Marque", "Modèle", "Orientation", "Résolution X", "Résolution Y", "Unité de résolution", "Logiciel", "Date modifcation",
                 "Positionnement YCbCr", "Droits d'auteurs"],
            "desc": ["", "", "", "", "", "", "", "Horodatage de la possibilité de modification de l'image ou de ses métadonnées",
                "Spécifie le positionnement des composants de chrominance sous-échantillonnés par rapport aux échantillons de luminance. La valeur de champ 1 (center) doit être spécifiée pour la compatibilité avec les normes de l'industrie telles que PostScript Level 2 et QuickTime. La valeur de champ 2 (cosited) doit être spécifiée pour la compatibilité avec la plupart des normes vidéo numériques, telles que la Recommandation 601-1 du CCIR",
                ""]
        },
        "general": {
            "title": "Informations EXIF",
            "fields": ["Temps d'exposition", "Nombre F", "Programme d'exposition", "Version Exif", "Horodatage d'origine",
                 "Horodatage numérisée", "Configuration des composants", "Bits compressés par pixel", "Biais d'exposition", "Valeur d'ouverture maximale", "Mode de mesure",
                 "Flash", "Longueur focale", "Commentaire utilisateur", "Version Flashpix", "Espace colorimétrique", "Dimension Pixel X", "Dimension Pixel Y", "Source du fichier"],
            "desc": ["La durée pendant laquelle le film ou le capteur numérique à l'intérieur de l'appareil photo est exposé à la lumière",
                "Le rapport entre la distance focale du système et le diamètre de la pupille d'entrée",
                "Le programme utilisé par l'appareil photo pour définir l'exposition lorsque la photo est prise",
                "", "La date et l'heure auxquelles les données de l'image d'origine ont été générées",
                "La date et l'heure à laquelle l'image a été stockée sous forme de données numériques",
                "Fourni pour les cas où des données compressées utilisent des composants autres que Y, Cb et Cr et pour permettre la prise en charge d'autres séquences",
                "", "Réglage pour sous-exposer ou surexposer l'image", "Le plus petit nombre F de l'objectif",
                "", "", "La distance focale réelle de l'objectif, en mm", "Mots-clés ou commentaires sur l'image, sous forme de représentation ASCII décimale",
                "", "Normalement, sRGB (= 1) est utilisé pour définir l’espace colorimétrique en fonction des conditions et de l’environnement du moniteur. Si un espace colorimétrique autre que sRGB est utilisé, le paramètre 'Uncalibrated' (= 65535) est défini",
                "", "", ""]
        },
        "gps": {
            "title": "Informations GPS",
            "fields": ["Ref. Latitude GPS", "Latitude GPS", "Ref. Longitude GPS", "Longitude GPS", "Horodatage GPS"],
            "desc": ["", "", "", "", ""]
        },
        "error": "Image impossible à charger. Veuillez verifier l'URL et réessayer"
    }
};

var jsonLastImg = "{}";

/*Create table for image metadata*/
function imgTable(json_str, lang){
    jsonLastImg = json_str;
    cleanElement("place-metadata");
    cleanElement("error-metadata");
    document.getElementById("error-metadata").style.display = "none";
    var topics = ["software", "general", "gps"];
    var soft_keys = ["Make", "Model", "Orientation", "XResolution", "YResolution", "ResolutionUnit", "Software", "ModifyDate",
        "YCbCrPositioning", "Copyright"];
    var gene_keys = ["ExposureTime", "FNumber", "ExposureProgram", "ExifVersion", "DateTimeOriginal",
        "DateTimeDigitized", "ComponentsConfiguration", "CompressedBitsPerPixel", "ExposureBias", "MaxApertureValue", "MeteringMode",
        "Flash", "FocalLength", "UserComment", "FlashpixVersion", "ColorSpace", "PixelXDimension", "PixelYDimension", "FileSource"];
    var gps_keys = ["GPSLatitudeRef", "GPSLatitude", "GPSLongitudeRef", "GPSLongitude", "GPSTimeStamp"];
    var all_keys = [soft_keys, gene_keys, gps_keys];
    var json = JSON.parse(json_str);
    var jsonLang = json_translate_img[lang];

    var meta_place = document.getElementById("place-metadata");

    for (var i = 0; i < topics.length; ++i) {
        var arr_keys = all_keys[i];
        var jsonTable = jsonLang[topics[i]];
        var table = document.createElement("table");
        table.id = "imgTable_" + topics[i];

        for (var j = 0; j < arr_keys.length; ++j) {
            if (json[arr_keys[j]] !== undefined) {
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                var td = document.createElement("td");
                th.innerHTML = jsonTable['fields'][j];
                th.title = jsonTable['desc'][j];
                td.innerHTML = json[arr_keys[j]];
                tr.appendChild(th);
                tr.appendChild(td);
                table.appendChild(tr);
            }
        }
        if (table.hasChildNodes()) {
            makeTitle(jsonTable["title"], meta_place);
            meta_place.appendChild(table);
        }
    }
    if(json_str == "{}") {
        table = document.createElement("div");
        switch (lang){
            case "fr":
                table.innerHTML = "Aucune métadonnée EXIF n'a été trouvée. <strong>Note:<strong> Le Format EXIF s'applique uniquement aux images .jpg et .tiff";
                break;
            case "en":
            default:
                table.innerHTML = "No EXIF Metadata was found. <strong>Note:</strong> The EXIF standard applies only to .jpg and .tiff images";
                break;
        }
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
    },
    en: {
        metadata: {
            title: "Video Metadata",
            name: ["Moov", "Duration", "Duration of fragment", "Fragmented", "Fragment time", "Progressive", "IOD", "Brands", "Created time", "Modified time"],
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
        },
        "error": "Video failed loading. Check the URL and try again"
    },
    fr: {
        metadata: {
            title: "Métadonnées de la video",
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
            "Chaîne de charactère, donnant les paramètres codecs MIME pour cette piste (ex. \"avc1.42c00d\" ou \"mp4a.40.2\"), pour être utilisé pour créer un objet SourceBuffer avec Media Source Extensions",
            "Chaîne de charactère, donnant le code de langage à 3 lettres",
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
        },
        "error": "Vidéo impossible à charger. Veuillez verifier l'URL et réessayer"
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
        document.getElementById("error-metadata").innerHTML = jsonTitleTableMetadata[global_language]["error"];
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
            document.getElementById("error-metadata").innerHTML = json_translate_img[global_language]["error"];
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
    var GPSLatitudeRef = getTableValue("GPS Latitude Ref.");
    var GPSLatitude = getTableValue("GPS Latitude");
    var GPSLongitudeRef = getTableValue("GPS Longitude Ref.");
    var GPSLongitude = getTableValue("GPS Longitude");
    if (GPSLatitude != "" && GPSLatitudeRef != "" && GPSLongitude != "" && GPSLongitudeRef != "") {
        var div = document.getElementById("place-metadata");
        var br = document.createElement("br");
        div.appendChild(br);
        var btn = document.createElement("button");
        btn.setAttribute("class","button");
        btn.innerHTML = '<span lang="en" ' + (global_language == 'en' ? '' : 'hidden="hidden"') +
            '>View GPS location</span><span lang="fr" ' + (global_language == 'fr' ? '' : 'hidden="hidden"') +
            '>Afficher localisation GPS</span>';
        div.appendChild(btn);
        btn.onclick = function() {
            var mapurl = "http://maps.google.com/maps?q=";
            var arr_lat = GPSLatitude.split(",");
            var arr_long = GPSLongitude.split(",");
            mapurl += arr_lat[0] + "° " + arr_lat[1] + "' " + GPSLatitudeRef + " " +
                arr_long[0] + "° " + arr_long[1] + "' " + GPSLongitudeRef;
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
        document.getElementById("error-metadata").innerHTML = json_translate_img[lang]["error"];
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
        var jsonText = jsonTitleTableMetadata[lang];
        var partNames = [];
        var titles = [];
        var descs = [];
        for (var part of ["metadata", "track", "audio"])
        {
            var text = jsonText[part];
            partNames.push(text["title"]);
            titles = titles.concat(text["name"]);
            descs = descs.concat(text["desc"]);
        }
        $("#place-metadata").find("h3").html(function (index) {
            return partNames[index];
        })
        updateTitleTableMetadata("place-metadata", titles, descs);
    }
}
