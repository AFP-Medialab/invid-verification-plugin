
// Nav bar
$("#remote_resources_title").click(() => {
    console.log("remote click")
    if(!$("#remote_resources_content").is(":visible")) {
        console.log("remote click and not visible")
        $("#user_resources_content").hide();
        $("#remote_resources_content").show();
        $("#user_resources_title").attr("class","btn btn-default");
        $("#remote_resources_title").attr("class","btn btn-primary");
    }
});

// Nav bar
$("#user_resources_title").click(() => {
    console.log("resource click")
    if(!$("#user_resources_content").is(":visible")) {
        console.log("resource click and not visible")
        $("#remote_resources_content").hide();
        $("#user_resources_content").show();
        $("#remote_resources_title").attr("class","btn btn-default");
        $("#user_resources_title").attr("class","btn btn-primary");
    }
});

