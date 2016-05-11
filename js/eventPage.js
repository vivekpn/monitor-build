"use strict";

chrome.notifications.onClicked.addListener(function ( notificationId,  byUser) {
    launchURLinNewTab(notificationId);
});

var createAlarmToPollData = function () {
    chrome.alarms.onAlarm.addListener(function callback(alarm) {
        console.log("Fetching the build status");
        getUserSettings("buildURLs", function (buildURLs) {
            for (var index = 0; index < buildURLs.length; index++) {
                fetchResponse(buildURLs[index]);
            }
        });
    });
    chrome.alarms.create("Build status poller", {when: Date.now(), periodInMinutes: 1});
};

createAlarmToPollData();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var event = request.event;
        if (event == "fetchBuildDetails") {
            fetchResponse(request.buildURL, sendResponse);
            return true;
        }
        if(event == 'getUserSettings'){
            getUserSettings(request.key, sendResponse);
            return true;
        }
    });

var getUserSettings = function(key, sendResponse){
    chrome.storage.sync.get(key, function (items) {
        var value = items[key];
        if (!value) {
            console.log(key, "is not stored");
            value = [];
        }
        sendResponse(value);
    });
};

var showUserNotification = function (id,title,message) {
    chrome.notifications.create(id, {
        type: 'basic',
        iconUrl: 'images/logo.png',
        title: title,
        message: message
    }, function (notificationId) {
    });
};

var fetchResponse = function (buildURL, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildURL + "/lastCompletedBuild/api/json", true);
    xhr.onerror = function () {
        console.log("Error while fetching", buildURL);
    };
    xhr.onload = function () {
        console.log("Loaded response for...", buildURL);
        var buildInformation = {response:JSON.parse(xhr.responseText), lastUpdated:new Date()};
        if(callback) {
            callback(buildInformation);
        }
        var storedBuildInformation = JSON.parse(localStorage.getItem(buildURL));
        if(!storedBuildInformation ){
            var title = buildInformation.response['fullDisplayName']+" status is now available.";
            var message = "The current status is "+ buildInformation.response['result'];
            showUserNotification(buildURL,title ,message);
        }
        else if(storedBuildInformation.response['result']!=buildInformation.response['result']){
            var title = buildInformation.response['fullDisplayName']+" status is changed.";
            var message = storedBuildInformation.response['result']+" is changed to "+ buildInformation.response['result'];
            showUserNotification(buildURL,title ,message);
        }
        localStorage.setItem(buildURL, JSON.stringify(buildInformation));
    };
    xhr.onprogress = function () {
        console.log("In Progress...", buildURL);
    };
    xhr.send();
};

var launchURLinNewTab = function (url) {
    chrome.tabs.create({url: url}, function () {
    });
};