"use strict";

$(document).ready(function () {
    $('#refresh_table_button').on('click', function () {
        $('#buld_information_table').find('tbody').empty();
        getFromChromeStorage("buildURLs", function (buildURLs) {
            buildURLs.forEach(function (buildURL) {
                fetchAndProcess(buildURL);
            });
        });
    });
    getFromChromeStorage("buildURLs", function (buildURLs) {
        buildURLs.forEach(function (buildURL) {
            getStateOfBuild(buildURL);
        });
    });
});

var getStateOfBuild = function (buildURL) {
    var storedValue = JSON.parse(localStorage.getItem(buildURL));
    if (storedValue) {
        processResponse(storedValue);
        return;
    }
    fetchAndProcess(buildURL);
};

var fetchAndProcess = function (buildURL) {
    chrome.runtime.sendMessage({event: "fetch", buildURL: buildURL}, function (response) {
        processResponse(response);
    });
};


var processResponse = function (response) {
    var $row = $("#row_template").clone(true).html();
    var buildDetails = {};
    buildDetails.example_website = response.url;
    buildDetails.example_build_name = response.fullDisplayName;
    buildDetails.example_status = response.result;
    buildDetails.example_time = getTimeFromTimestamp(response.timestamp);
    for (var key in buildDetails) {
        $row = $row.replace(key, buildDetails[key]);
    }
    $("#buld_information_table").append($row);
};

var getFromChromeStorage = function (key, callback) {
    chrome.storage.sync.get(key, function (items) {
        if (items[key]) {
            var value = items[key];
            callback(value);
        } else {
            console.log("Build URL is not stored")
        }
    });
};

var getTimeFromTimestamp = function (timestamp) {
    return new Date(timestamp * 1000);
};