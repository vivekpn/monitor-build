
var getStateOfBuild = function(buildURL){
	var statusDivision=document.getElementById("status");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", buildURL+"/lastCompletedBuild/api/json?pretty=true", true);
	xhr.onerror= function(){
		statusDivision.innerText = "Error occurred while fetching. Please try again";
	}
	xhr.onload = function(){
		var lastCompletedBuild = JSON.parse(xhr.responseText);
		statusDivision.innerText = lastCompletedBuild.result;
	}
	xhr.onprogress = function(){
		statusDivision.innerText = "Checking. Please wait...";		
	}
	xhr.send();
}

$( document ).ready(function() {
	var buildURL = null;
	chrome.storage.sync.get("buildURL", function(items) {
		if(items.buildURL){
			buildURL = items.buildURL;
			document.getElementById("buildURL").href = buildURL;
			document.getElementById("buildURL").innerText = buildURL;		
			getStateOfBuild(buildURL);
		} else{
			document.getElementById("information").innerText = "Please configure a right URL in the options.";
		}
	});
});