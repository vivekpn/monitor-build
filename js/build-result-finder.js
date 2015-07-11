
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
    var $row = $("#row_template").clone().removeClass('empty_row').removeAttr('id').html();
    var buildDetails = {};
    buildDetails.example_website=response.url;
    buildDetails.example_build_name=response.fullDisplayName;
    buildDetails.example_status=response.result;
    buildDetails.example_time=response.id;
    for (key in buildDetails) {
        $row = $row.replace(key, buildDetails[key]);
    }
    $("#buld_information_table").append($row);
};

$(document).ready(function () {
    chrome.storage.sync.get("buildURL", function (items) {
        if (items.buildURL) {
            var buildURL = items.buildURL;
            getStateOfBuild(buildURL);
        } else{
            console.log("Build URL is not stored")
        }
    });
});