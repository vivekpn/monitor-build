"use strict";

$(document).ready(function () {
    $('#input_url_form').submit(function() {
        save_options();
        return false;
    });

    $(".add").click(function() {
        _createNewInputField();
        return false;
    });

    $(".remove").click(function() {
        $(this).parent().remove();
    });

    getFromUserSettings("buildURLs", restore_options);

});

// Saves options to chrome.storage.sync.
var save_options = function() {
    var buildURLs =[];
    $('#input_url_form').find('p > input[type="url"]').each(function(){
        buildURLs.push(this.value);
    });
    console.log(buildURLs);
    chrome.storage.sync.set({
        buildURLs: buildURLs
    }, function () {
        // Update status to let user know options were saved.
        changeSubmitStatus('Options saved.');
    });
};

var changeSubmitStatus = function(text){
    var $status = $('#status');
    $status.text(text);
    setTimeout(function () {
        $status.text('');
    }, 2500);
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var restore_options = function(buildURLs) {
        if (buildURLs) {
            console.log("URLs stored: ",buildURLs);
            for(var index = 0; index<buildURLs.length; index++){
                if(!buildURLs[index]){
                    continue;
                }
                _createNewInputField(buildURLs[index]);
            }
        }
        _createNewInputField();
};

var _createNewInputField = function(value){
    var $inputField = $('#input_template').clone(true).removeClass('template').removeAttr('id');
    var $input = $inputField.find('input');
    $input.val(value);
    $input[0].oninvalid = function(){
        changeSubmitStatus("Submit failed. Error in one or more fields.");
    };
    $inputField.insertBefore("#input_url_form > .add");
    return $inputField;
};

var getFromUserSettings = function (key, callback) {
    chrome.runtime.sendMessage({event: "getUserSettings", key: key}, function (value) {
        callback(value);
    });
};
