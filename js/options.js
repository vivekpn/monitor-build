// Saves options to chrome.storage.sync.
function save_options() {
  var build_url = document.getElementById('buildURL').value;
  chrome.storage.sync.set({
    buildURL: build_url,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get("buildURL", function(items) {
	if(items.buildURL){
		document.getElementById('buildURL').value = items.buildURL;
	}
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);