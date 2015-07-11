"use strict";

$(document).ready(function () {
    $('#refresh_table_button').on('click',function(){
        $('#buld_information_table > tbody').empty();
        getFromChromeStorage("buildURLs", function (buildURLs) {
            for (var index in buildURLs) {
                fetchResponseAndProcess(buildURLs[index]);
            }
        });
    });
    getFromChromeStorage("buildURLs", function (buildURLs) {
        for (var index in buildURLs) {
            getStateOfBuild(buildURLs[index]);
        }
    });
});

var getStateOfBuild = function (buildURL) {
    var storedValue = JSON.parse(localStorage.getItem(buildURL));
    if(storedValue){
        processResponse(storedValue);
        return;
    }
    fetchResponseAndProcess(buildURL);
};

var fetchResponseAndProcess = function (buildURL) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildURL + "/lastCompletedBuild/api/json", true);
    xhr.onerror = function () {
        console.log("Error while fetching", buildURL);
    };
    xhr.onload = function () {
        console.log("Loaded...", buildURL);
        var response = JSON.parse(xhr.responseText);
        processResponse(response);
        localStorage.setItem(buildURL, JSON.stringify(response));
    };
    xhr.onprogress = function () {
        console.log("In Progress...", buildURL);
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

var getFromChromeStorage = function(key, callback) {
    chrome.storage.sync.get(key, function (items) {
        if (items[key]) {
            var value = items[key];
            callback(value);
        } else {
            console.log("Build URL is not stored")
        }
    });
};

var getTimeFromTimestamp = function(timestamp){
    return new Date(timestamp*1000);
};