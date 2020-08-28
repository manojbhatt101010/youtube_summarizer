window.onload = function() {

	function showMessage(text, color) {
		message.innerHTML = text;
		message.style.color = color;
	}

	async function getSummary(videoId) {
		var summaryLength = document.getElementById("slider").value;
		var summary = await fetch(`http://127.0.0.1:5000/?videoId=${videoId}&summaryLength=${summaryLength}`, {method: "GET"}).catch((error) => {
			showMessage("Error1! Couldn't connect to server", "red");
		});

		if(summary.ok) {
			summary = await summary.json();
			if("Error" in summary) {
				showMessage(summary["Error"], "red");
			} else {
				alert(summary["result"]);
			}
		} 
		else {
			showMessage("Error2! Couldn't connect to server", "red");
		}
	}

	function getVideoId(url) {
		var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		var match = url.match(regExp);

		if(match && match[2].length == 11) {
			return match[2];
		} else {
			return "error";
		}
	}

	function showSummary() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
			var url = tabs[0].url;
			var videoId = getVideoId(url);
			if(videoId.localeCompare("error") == 0) {
				showMessage("Error! Couldn't get the Video ID", "red");
			} 
			else {
				getSummary(videoId);
				showMessage("Success", "green");
			}
		});
	}	

	document.getElementById("getSummaryButton").addEventListener("click", showSummary);
	var message = document.getElementById("message");
}