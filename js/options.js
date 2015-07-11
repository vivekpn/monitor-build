// Saves options to chrome.storage.sync.
var save_options = function() {
    var buildURLs =[];
    $('#input_url_form > p > input[type="url"]').each(function(){
        buildURLs.push(this.value);
    });
    console.log(buildURLs);
    chrome.storage.sync.set({
        buildURLs: buildURLs
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1500);
    });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var restore_options = function() {
    chrome.storage.sync.get("buildURLs", function (items) {
        if (items.buildURLs) {
            console.log(items.buildURLs);
            for(index in items.buildURLs){
                _createNewInputField(items.buildURLs[index]);
            }
        }
        _createNewInputField();
    });
};

$(document).ready(function () {
    restore_options();
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
});
//document.getElementById('save').addEventListener('click',
//    save_options);

var _createNewInputField = function(value){
    var $inputField = $('#input_template').clone(true).removeClass('template').removeAttr('id');
    $inputField.find('input').val(value)
    $inputField.insertBefore("#input_url_form > .add");
    return $inputField;
};