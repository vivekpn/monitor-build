"use strict"


chrome.notifications.onClicked.addListener(function () {
    launch();
});

chrome.alarms.onAlarm.addListener(function callback(alarm) {
    console.log("Fetching the build status");
    //fetchResponse();
    //var message = "Your attention please";
    //showNotification(message);
});
chrome.alarms.create("Build status poller", {when: Date.now(), periodInMinutes: 2});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.event == "fetch") {
            fetchResponse(request.buildURL, sendResponse);
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
        var response = JSON.parse(xhr.responseText);
        localStorage.setItem(buildURL, JSON.stringify(response));
        callback(response);
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