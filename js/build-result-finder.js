
var getStateOfBuild = function(buildURL){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", buildURL+"/lastCompletedBuild/api/json?pretty=true", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
		var lastCompletedBuild = JSON.parse(xhr.responseText);
		document.getElementById("status").innerText = lastCompletedBuild.result;
	  }
	}
	xhr.send();
}

$( document ).ready(function() {
    console.log( "ready!" );
	var buildURL = "https://slabnode368.netact.nsn-rdnet.net/jenkins/job/ison_product_15.5_integration";
	document.getElementById("buildURL").innerText = buildURL;
	getStateOfBuild(buildURL);
});