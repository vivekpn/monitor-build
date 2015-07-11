
var getStateOfBuild = function (buildURL) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildURL + "/lastCompletedBuild/api/json", true);
    xhr.onerror = function () {
        console.log("Error while fetching",buildURL);
    };
    xhr.onload = function () {
        console.log("Loaded...",buildURL);
        var response = JSON.parse(xhr.responseText);
        processResponse(response);
    };
    xhr.onprogress = function () {
        console.log("In Progress...",buildURL);
    };
    xhr.send();
};

var processResponse = function (response) {
    var $row = $("#row_template").clone(true).html();
    var buildDetails = {};
    buildDetails.example_website=response.url;
    buildDetails.example_build_name=response.fullDisplayName;
    buildDetails.example_status=response.result;
    buildDetails.example_time= getTimeFromTimestamp(response.timestamp);
    for (key in buildDetails) {
        $row = $row.replace(key, buildDetails[key]);
    }
    $("#buld_information_table").append($row);
};

$(document).ready(function () {
    chrome.storage.sync.get("buildURLs", function (items) {
        if (items.buildURLs) {
            var buildURLs = items.buildURLs;
            for(var index in buildURLs){
                getStateOfBuild(buildURLs[index]);
            }
        } else{
            console.log("Build URL is not stored")
        }
    });
});

var getTimeFromTimestamp = function(timestamp){
    var date = new Date(timestamp*1000);
// hours part from the timestamp
    var hours = date.getHours();
// minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return date;
};