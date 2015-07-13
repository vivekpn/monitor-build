"use strict"


chrome.notifications.onClicked.addListener(function () {
    launch();
});

chrome.alarms.onAlarm.addListener(function callback(alarm) {
    console.log("Fetching the build status");
    fetchResponse();
    //var message = "Your attention please";
    //showNotification(message);
});
chrome.alarms.create("Build status poller", {when: Date.now(), periodInMinutes: 2});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var event = request.event;
        if (event == "fetchBuildDetails") {
            localStorage.setItem('lastUpdated', new Date());
            fetchResponse(request.buildURL, sendResponse);
            return true;
        }
        if(event == 'getUserSettings'){
            var key = request.key;
            chrome.storage.sync.get(key, function (items) {
                var value = items[key];
                if (!value) {
                    console.log(key, "is not stored");
                    value = [];
                }
                sendResponse(value);
            });
            return true;
        }
    });

var showNotification = function (message) {
    chrome.notifications.create('reminder', {
        type: 'basic',
        iconUrl: 'image/logo.png',
        title: 'A build is broken.',
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
        console.log("Loaded...", buildURL);
        var buildInformation = {response:JSON.parse(xhr.responseText), lastUpdated:new Date()};
        localStorage.setItem(buildURL, JSON.stringify(buildInformation));
        if(callback) {
            callback(buildInformation);
        }
    };
    xhr.onprogress = function () {
        console.log("In Progress...", buildURL);
    };
    xhr.send();
};

function launch() {
    chrome.tabs.create({url: 'popup.html'}, function () {
    });
}