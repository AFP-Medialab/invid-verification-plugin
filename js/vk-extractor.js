/**
* Javascript used by VK extractor
*/

(function() {
	window.extractors = window.extractors || [];

	var vkExtractor = function() {};
	extractors.push(vkExtractor);

	vkExtractor.validUrl = function (url) {
		return url.startsWith("https://vk.com/");
	}

	vkExtractor.extract = function (url, callback) {
       
        if (url.match(/https:\/\/vk\.com\/.*\?z=video-/)){
            var videoUrl = "https://vk.com/" + getId(url);
            function makeHttpObject() {
                try {return new XMLHttpRequest();}
                catch (error) {}
                try {return new ActiveXObject("Msxml2.XMLHTTP");}
                catch (error) {}
                try {return new ActiveXObject("Microsoft.XMLHTTP");}
                catch (error) {}
              
                throw new Error("Could not create HTTP request object.");
            } 
            var sourceHTML;
            var request = makeHttpObject();
            request.open("GET", videoUrl, true);
            request.send(null);
            request.onreadystatechange = function() {
                if (request.readyState == 4){
                    sourceHTML = request.responseText;

                    var mp4Url = sourceHTML.split(/url240\"/)[1];

                    mp4Url = mp4Url.split("\"")[1];
                    
                    callback(mp4Url);
                }
            };

           // var page = get_page(videoUrl);

            //ar regexExtractor = /<source [^>]*src="([^"]+)"[^>]*>/;
            //callback(page.match(regexExtractor)[1]);

        }
	}

	function getId(url) {
        var id = "";

           // window.alert(url);
            id = url.split("=")[1];
            while (id.includes("%"))
                id = id.split("%")[0];
    
        return id;
        
	}
})();