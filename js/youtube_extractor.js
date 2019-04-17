function getYtVideoUrl(urlPage)
{
	function get_json(page) {
		var regex = /ytplayer\.config = \{(.*)\};ytplayer/;
		var json_str = "{" + page.match(regex)[1] + "}";
		return JSON.parse(json_str);
	}

	function get_quality(elt) {
		var width_heigth = elt["size"].split("x");
		return parseInt(width_heigth[0]) * parseInt(width_heigth[1]);
	}

	function decode(encoded) {
		var decoded = decodeURI(encoded);
		var list = decoded.split("&");
		var res = {}
		for (var elt of list) {
			var tmp = elt.split("=");
			if (tmp.length == 2)
				res[tmp[0]] = decodeURI(tmp[1]);
		}
		return res;
	}

	var json_page = get_json(get_page(urlPage));
	if (Object.keys(json_page).length === 0)
		return null;
	var data = json_page["args"];
	if (Object.keys(data).length === 0)
		return null;

	var tmp1 = data["url_encoded_fmt_stream_map"] || '';
	var tmp2 = data["adaptive_fmts"] || '';
	var encoded_data_list = tmp1 + ',' + tmp2;
	//console.log(encoded_data_list);
	if (encoded_data_list == ',')
		return null;
	var list_url = {};
	var final_url = {url: "", res: 0};
	for (var encoded_data of encoded_data_list.split(",")) {
		//console.log("toto" + encoded_data);
		var decoded_data = decode(encoded_data);
		//console.log(decoded_data);
		var index = decoded_data["itag"];
		list_url[index] = decoded_data;
		if (!decoded_data["size"])
			continue;
		list_url[index]["res"] = get_quality(decoded_data);
		if (final_url["res"] >= decoded_data["res"])
			continue;
		final_url["url"] = decoded_data["url"];
		final_url["res"] = decoded_data["res"];
	}
	return decodeURIComponent(final_url["url"]);
}