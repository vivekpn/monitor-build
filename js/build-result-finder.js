
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
	var buildURL = "https://slabnode368.netact.nsn-rdnet.net/jenkins/job/ison_product_15.5_integration";
	document.getElementById("buildURL").innerText = buildURL;
	getStateOfBuild(buildURL);
});