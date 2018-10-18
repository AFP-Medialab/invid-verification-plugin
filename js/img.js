/* History */
class History{

    constructor(url){
        this.current_index = 0;
        this.history = [url];
    }

    removeHistoryFrom(index){
        return this.    history.splice(index, this.history.length - index);
    }

    addHistory(url){
        if (this.current_index < this.history.length -1){
            this.removeHistoryFrom(this.current_index + 1);
        }
        this.current_index++;
        return this.history.push(url);
    }

    getHistory(){
        return this.history[this.current_index];
    }

    clearHistory(){
        this.current_index = -1;
        return this.removeHistoryFrom(0);
    }

    undo(){
        if (this.current_index > 0)
            this.current_index--;
        /* display reverse search button */
        if (this.current_index == 0 && !this.local_path)
            displayRevBtnMagnifier();

        return this.history[this.current_index];
    }

    redo(){
        /* hide reverse search button */
        if (this.current_index == 0)
            hideRevBtnMagnifier();

        if (this.current_index < this.history.length - 1)
            this.current_index++;
        return this.history[this.current_index]; 
    }
}

var histo = new History("test");
histo.local = false;

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

/*Recreate the zoom on the image*/
function rebuild(img_url){
    var test = document.getElementById("test");
    if(test != null) {
        test.remove();
    }

    var test2 = document.getElementById("test2");
    if(test2 != null) {
        test2.remove();
    }

    removeElementsByClass("zoomContainer");

    var elem = document.createElement("img");
    elem.setAttribute("id", "test");
    elem.setAttribute("src", img_url);
    elem.setAttribute("data-zoom-image", img_url)
    elem.style = "max-width: 80%;";
    document.getElementById("place-inner").appendChild(elem);
    refreshTest();
   
    var elem2 = document.createElement("img");
    elem2.setAttribute("id", "test2");
    elem2.setAttribute("src", img_url);
    elem2.setAttribute("data-zoom-image", img_url)
    elem2.style = "max-width: 80%;";
    document.getElementById("place-lens").appendChild(elem2);
    refreshTest2(); 

    
}
/*Check if url is valid*/
function ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return regex.test(str);
}
/*submit image url*/
function submit_img(){
    var img_url = document.getElementById("urlbox").value;
    if (img_url != "") {
        img_url = get_real_url_img(img_url);
        var old = histo.local;
        histo = new History(img_url);
        histo.local_path = old;
        histo.local = false;
        rebuild(histo.getHistory());
        document.getElementById("none").checked = true;
        var e = document.getElementById("scale_input");
        e.style.display = "none";
        document.getElementById("copy_url_img_magnifier").style.display = (histo.local_path) ? "" : "none";
        if (!ValidURL(img_url)) {
            document.getElementById("lst_search_btn").setAttribute("style", "display: none");
            document.getElementById("magnifier-content").style.display = (histo.local_path) ? "" : "none";
        }
        else {
            document.getElementById("lst_search_btn").setAttribute("style", "display: inline");
            document.getElementById("magnifier-content").style.display = "";
        }
    }
}

var form = document.getElementById("img_form");
if (form.addEventListener){
    form.addEventListener("submit", submit_img, false);
}
form.addEventListener("submit", function(e){
    e.preventDefault();
});

/*Display or hide scale element*/
document.getElementById("none").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style.display = "none";
};

document.getElementById("sharp").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style.display = "none";
};

document.getElementById("flip").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style.display = "none";
}


document.getElementById("bicubic").onclick = function() {
    var e = document.getElementById("scale_input");
    e.setAttribute("style", "");
};

/*Undo or redo filter*/
document.getElementById("undo").onclick = function() {
    rebuild(histo.undo());
};

document.getElementById("redo").onclick = function() {
    rebuild(histo.redo());
}

document.getElementById("scale").onchange = function(){
    var num = document.getElementById("scale").value;
    $("#show_scale").html("Scale :" + num + "%");
}

/*get selected filter and apply it*/
function apply_filter(){
    if (!document.getElementById('none').checked && document.getElementById("copy_url_img_magnifier").style.display == "none")
        hideRevBtnMagnifier();
    var new_url = histo.getHistory();
    var scale = parseFloat(document.getElementById("scale").value) / 100
    var img = document.getElementById("test");
    //Solve firefox : "SecurityError: The operation is insecure"
    img.crossOrigin = "anonymous";
    if(document.getElementById('sharp').checked)
        new_url = Filters.filterImage(img, "sharp", scale);
    else if (document.getElementById('bicubic').checked)
        new_url = Filters.filterImage(img, "bicubic", scale);
    else if (document.getElementById("flip").checked)
        new_url = Filters.filterImage(img, "flip", scale);
    histo.addHistory(new_url);
    rebuild(histo.getHistory());
};

/*Listen if button clicked and submit the url*/
var form = document.getElementById("filter_form");
if (form.addEventListener){
    form.addEventListener("submit", apply_filter, false);
}

form.addEventListener("submit", function(e){
    e.preventDefault();
});

/* switch tab to Magnifier tab*/
function callMagnifier(url){
    document.getElementById("urlbox").value = url;
    submit_img();
}

/* Get local file path */
$('#file-input').change( function(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    document.getElementById("urlbox").value = tmppath;
    histo.local = true;
    submit_img();
});

/* Add reverse search */
(function() {

    function getImg() {
        var url = histo.getHistory();
        return encodeURIComponent(url);
    }

    /* Google button : Image reverse search */
    document.getElementById("img_rev_search_btn").onclick = function() {
        reverseImgSearch('google', getImg());
    };

    /* Google button : Image reverse search */
    document.getElementById("baidu_rev_search_btn").onclick = function() {
        reverseImgSearch('baidu', getImg());
    };

    /* Google button : Image reverse search */
    document.getElementById("yandex_rev_search_btn").onclick = function() {
        reverseImgSearch('yandex', getImg());
    };

    document.getElementById("tineye_rev_search_btn").onclick = function() {
        reverseImgSearch('tineye', getImg());
    }

    /* Verification button : Image Verification Assistant */
    document.getElementById("img_verif_btn").onclick = function() {
        openTab("http://reveal-mklab.iti.gr/reveal/?image=" + histo.getHistory());
    };
})();

/* For button to encode imge modified */
document.getElementById("copy_url_img_magnifier").addEventListener("click", function() {
    var text = histo.getHistory();
    if (!/data:image\/png/.test(text))
        text = Filters.filterImage(document.getElementById("test"), "none", 1);
    copyText(text);
    this.innerHTML = "URL copied";
    openTab("https://www.google.com/searchbyimage?&image_url=")
});

document.getElementById("download_img_magnifier").addEventListener("click", function() {
    this.href = histo.getHistory();
    var url_start = histo.history[0];
    var image_name = url_start.substring(url_start.lastIndexOf("/") + 1);
    index = image_name.indexOf("?");
    if (index != -1)
        image_name = image_name.substring(0, index);
    this.download = image_name;
});

/* Hide reverse button */
function hideRevBtnMagnifier()
{
    document.getElementById("lst_search_btn").style.display = "none";
    document.getElementById("copy_url_img_magnifier").style.display = "";
}

/* Display reverse button */
function displayRevBtnMagnifier()
{
    document.getElementById("lst_search_btn").style.display = "inline";
    document.getElementById("copy_url_img_magnifier").style.display = "none";
}
