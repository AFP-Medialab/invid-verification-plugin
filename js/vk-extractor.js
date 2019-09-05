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
    
    function makeHttpObject() {
        try {return new XMLHttpRequest();}
        catch (error) {}
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch (error) {}
        try {return new ActiveXObject("Microsoft.XMLHTTP");}
        catch (error) {}
      
        throw new Error("Could not create HTTP request object.");
    }

    function extractOne(videoUrl) {
        var mp4Url = "";
        return new Promise((resolve, reject) => {
        var sourceHTML;
        var request = makeHttpObject();
        request.open("GET", videoUrl, true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState == 4){
                sourceHTML = request.responseText;

                mp4Url = sourceHTML.split(/url240\"/)[1];

                mp4Url = mp4Url.split("\"")[1];
                resolve(mp4Url);
            }
        };
    }).then(() => { return mp4Url })
    .catch((err) => window.alert(err));
    }
	vkExtractor.extract = function (url, callback) {
       
        if (url.match(/https:\/\/vk\.com\/.*\?z=video-/)){
            var videoUrl = "https://vk.com/" + getId(url);
            extractOne(videoUrl).then(video => {window.alert(video); callback(video) });
           
           // var page = get_page(videoUrl);

            //ar regexExtractor = /<source [^>]*src="([^"]+)"[^>]*>/;
            //callback(page.match(regexExtractor)[1]);

        }
        else
        {
            var promise = new Promise((resolve, reject) => {
                var request = makeHttpObject();
                request.open("GET", url, true);
                request.send(null);
                request.onreadystatechange = function() {
                    if (request.readyState == 4){
                        var videos = request.responseText
                                                .match(/video-[0-9]*_[0-9]*/g)
                                                .filter((value, index, self) => {
                                                    return self.indexOf(value) === index;
                                                });
                        
                        window.alert(videos);
                        videos.forEach( video => { 
                            extractOne("https://vk.com/" + video)
                                .then(url => {
                                        callback(url);
                                }); 

                        });

                        resolve();

                    }
                }
            });

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