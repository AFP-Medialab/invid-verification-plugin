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
        return this.history[this.current_index];
    }

    redo(){
        if (this.current_index < this.history.length - 1)
            this.current_index++;
        return this.history[this.current_index]; 
    }
}

var histo = new History("test");
/* Clean element by id */
function cleanElement(id){
    var div = document.getElementById(id);
    /* Clear content*/
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
}

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

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
    document.getElementById("place-inner").appendChild(elem);
    refreshTest();
   
    var elem2 = document.createElement("img");
    elem2.setAttribute("id", "test2");
    elem2.setAttribute("src", img_url);
    elem2.setAttribute("data-zoom-image", img_url)
    document.getElementById("place-lens").appendChild(elem2);
    refreshTest2(); 
}

function ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
        return false;
    } 
    else {
        return true;
    }
}

function submit_img(){
    //document.getElementById("zoom").style = "";
    var img_url = document.getElementById("urlbox").value;
    /*
    if (document.getElementById("localrad").checked)
        img_url = document.getElementById("filechooser").value
    */
    if (img_url != "") {
        histo = new History(img_url);
        rebuild(histo.getHistory());
        document.getElementById("none").checked = true;
        var e = document.getElementById("scale_input");
        e.style.display = "none";
        var el = document.getElementById("magnifier-content");
        el.style = "";
        if (!ValidURL(img_url)) {
            document.getElementById("lst_search_btn").style = "display: none;"
        }
        else {
            document.getElementById("lst_search_btn").style = "";
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

document.getElementById("none").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style.display = "none";
};

document.getElementById("sharp").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style.display = "none";
};


document.getElementById("bicubic").onclick = function() {
    var e = document.getElementById("scale_input");
    e.style = "";
};

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


function apply_filter(){
    //document.getElementById("test").setAttribute("crossOrigin", "");
    var new_url = histo.getHistory();
    var scale = parseFloat(document.getElementById("scale").value) / 100
    var img = document.getElementById("test");
    //Solve firefox : "SecurityError: The operation is insecure"
    img.crossOrigin = "anonymous";
    if(document.getElementById('sharp').checked)
        new_url = Filters.filterImage(img, "sharp", scale);
    else if (document.getElementById('bicubic').checked)
        new_url = Filters.filterImage(img, "bicubic", scale);
    histo.addHistory(new_url);
    rebuild(histo.getHistory());
};

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
    submit_img();
});

function imageSearch(){
    var search_url = "https://www.google.com/searchbyimage?&image_url=";
    search_url += document.getElementById("urlbox").value;
    chrome.tabs.create({url:search_url});
}

function baiduSearch(){
    var search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
    search_url += document.getElementById("urlbox").value;
    search_url += "&fm=index&uptype=urlsearch";
    chrome.tabs.create({url:search_url});
}

function yandexSearch(){
    var search_url = "https://yandex.com/images/search?url=";
    search_url += document.getElementById("urlbox").value;
    search_url += "&rpt=imageview";
    chrome.tabs.create({url:search_url});
}

/* Google button : Image reverse search */
document.getElementById("img_rev_search_btn").onclick = function() {
    imageSearch();
};

/* Google button : Image reverse search */
document.getElementById("baidu_rev_search_btn").onclick = function() {
    baiduSearch();
};

/* Google button : Image reverse search */
document.getElementById("yandex_rev_search_btn").onclick = function() {
    yandexSearch();
};

function imageVerification(){
    var search_url = "http://reveal-mklab.iti.gr/reveal/?image=";
    search_url += document.getElementById("urlbox").value;
    chrome.tabs.create({url:search_url});
}

/* Verification button : Image Verification Assistant */
document.getElementById("img_verif_btn").onclick = function() {
    imageVerification();
};