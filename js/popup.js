"use strict";

$(document).ready(function () {
    $('#refresh_table_button').on('click', function () {
        $('#buld_information_table').find('tbody').empty();
        getFromUserSettings("buildURLs", function (buildURLs) {
            buildURLs.forEach(function (buildURL) {
                fetchAndProcessResponse(buildURL);
            });
        });
    });
    getFromUserSettings("buildURLs", function (buildURLs) {
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
    fetchAndProcessResponse(buildURL);
};

var fetchAndProcessResponse = function (buildURL) {
    chrome.runtime.sendMessage({event: "fetchBuildDetails", buildURL: buildURL}, function (buildInformation) {
        processResponse(buildInformation);
    });
};

var processResponse = function (buildInformation) {
    var $row = $("#row_template").clone(true).html();
    var buildDetails = {};
    var response = buildInformation.response;
    buildDetails.example_website = response['url'];
    buildDetails.example_build_name = response['fullDisplayName'];
    buildDetails.example_status = response['result'];
    buildDetails.example_time = getTimeFromTimestamp(response['timestamp']);
    for (var key in buildDetails) {
        if (!buildDetails.hasOwnProperty(key)) {
            continue;
        }
        $row = $row.replace(key, buildDetails[key]);
    }
    $("#buld_information_table").append($row);
};

var getFromUserSettings = function (key, callback) {
    chrome.runtime.sendMessage({event: "getUserSettings", key: key}, function (value) {
        callback(value);
    });
};

var getTimeFromTimestamp = function (timestamp) {
    return new Date(timestamp);
};