"use strict"

console.log('In event page.');
chrome.alarms.onAlarm.addListener(function callback(alarm) {
    console.log("Fetching the build status");
    //fetchResponseAndProcess();
    var message = "Your attention please";
    showNotification(message);
});
chrome.alarms.create("Build status poller", {when: Date.now(), periodInMinutes: 2});

function showNotification(message) {
    chrome.notifications.create('reminder', {
        type: 'basic',
        iconUrl: 'image/logo.png',
        title: 'A build is broken.',
        message: message
    }, function (notificationId) {
    });
}

chrome.notifications.onClicked.addListener(function () {
    launch();
});

function launch() {
    chrome.tabs.create({url: 'popup.html'}, function () {
    });
}