javascript:void(function() {
	if (location.href.indexOf("mousehuntgame.com") < 0) {
		alert("You are not on mousehuntgame.com! Please try again.");
		return;
	}
	var defaultURL = "http://tsitu.github.io/MH-Tools/setup.html";
	var waitingURL = "http://tsitu.github.io/MH-Tools/setupwaiting.html";
	// var defaultURL = "http://localhost:8888/setup.html"; //debug
	// var waitingURL = "http://localhost:8888/setupwaiting.html"; //debug
	var bases = [];
	var weapons = [];
	var charms = [];
	var maxSize = 30;
	var interval = '';
	var timeout = '';
	var sendingBases = "false";
	var sendingWeapons = "false";
	var sendingCharms=  "false";
	var baseIter = 0;
	var weaponIter = 0;
	var charmIter = 0;
	var baseInterval = '';
	var weaponInterval = '';
	var charmInterval = '';
	var baseButton = document.querySelector("a.campPage-trap-armedItem.base");
	var weaponButton = document.querySelector("a.campPage-trap-armedItem.weapon");
	var charmButton = document.querySelector("a.campPage-trap-armedItem.trinket");
	var newWindow = window.open(waitingURL, '_blank');

	function checkDOM() {
		baseButton.click();
		var timeout = setTimeout(function() {
			newWindow.close();
			clearInterval(interval);
			alert("XHR timed out! Please check your connection and try again.");
			return;
		}, 4000);
		var interval = setInterval(function() {
			if (document.querySelector("div.campPage-trap-itemBrowser.base") != null) {
				clearTimeout(timeout);
				clearInterval(interval);
				parse();
			}
		}, 100);
	}

	function parse() {
		var baseText = document.querySelectorAll("div.passedFilters .campPage-trap-itemBrowser-item.base.clear-block .campPage-trap-itemBrowser-item-name");
		for (var i=0; i<baseText.length; i++) {
			bases.push(baseText[i].textContent);
		}
		console.log("Number of bases: " + bases.length);

	    weaponButton.click();
	    var weaponText = document.querySelectorAll("div.passedFilters .campPage-trap-itemBrowser-item.weapon.clear-block .campPage-trap-itemBrowser-item-name");
		for (var i=0; i<weaponText.length; i++) {
			weapons.push(weaponText[i].textContent);
		}
		console.log("Number of weapons: " + weapons.length);

	    charmButton.click();
	    var charmText = document.querySelectorAll("div.passedFilters .campPage-trap-itemBrowser-item.trinket.clear-block .campPage-trap-itemBrowser-item-name");
		for (var i=0; i<charmText.length; i++) {
			charms.push(charmText[i].textContent);
		}
		console.log("Number of charms: " + charms.length);

		var closeButton = document.querySelector("a.campPage-trap-blueprint-closeButton");
	    if (closeButton != null) {
	    	closeButton.click();
	    }

    	if (bases.length > 0) {
    		sendingBases = "true";
	    	sendBases(); 	
	    }

	    if (weapons.length > 0) {
	    	sendWeapons();
	    }

	    if (charms.length > 0) {
	    	sendCharms();
	    }
	}

	function sendBases() {
		baseInterval = setInterval(function() {
			if (sendingBases == "true") {
				clearInterval(baseInterval);
				var slice = bases.slice(baseIter,baseIter+maxSize);
				// console.log("slice size: " + slice.length);
				var url = defaultURL + "?bases=";
	        	url += encodeURI(slice.join('/'));
	        	url += "/";
	        	// console.log(url);
	        	// console.log("URL length: " + url.length);
        		newWindow.location.href = url;
        		baseIter += maxSize;
        		if (baseIter < bases.length) {
        			setTimeout(sendBases, ping() + 500);
        		}
        		else {
        			sendingBases = "false";
        			setTimeout(function() {
        				sendingWeapons = "true";
        			}, ping() + 500);
        		}
			}
		}, 250);
	}

	function sendWeapons() {
		weaponInterval = setInterval(function() {
			if (sendingWeapons == "true") {
				clearInterval(weaponInterval);
				var slice = weapons.slice(weaponIter,weaponIter+maxSize);
				// console.log("slice size: " + slice.length);
				var url = defaultURL + "?weapons=";
	        	url += encodeURI(slice.join('/'));
	        	url += "/";
	        	// console.log(url);
	        	// console.log("URL length: " + url.length);
        		newWindow.location.href = url;
        		weaponIter += maxSize;
        		if (weaponIter < weapons.length) {
        			setTimeout(sendWeapons, ping() + 500);
        		}
        		else {
        			sendingWeapons = "false";
        			setTimeout(function() {
        				sendingCharms = "true";
        			}, ping() + 500);
        		}
			}
		}, 250);
	}

	function sendCharms() {
		charmInterval = setInterval(function() {
			if (sendingCharms == "true") {
				clearInterval(charmInterval);
				var slice = charms.slice(charmIter,charmIter+maxSize);
				// console.log("slice size: " + slice.length);
				var url = defaultURL + "?charms=";
	        	url += encodeURI(slice.join('/'));
	        	url += "/";
	        	// console.log(url);
	        	// console.log("URL length: " + url.length);
        		newWindow.location.href = url;
        		charmIter += maxSize;
        		if (charmIter < charms.length) {
        			setTimeout(sendCharms, ping() + 500);
        		}
        		else {
        			sendingCharms = "false";
        			setTimeout(function() {
        				newWindow.location.href = defaultURL;
        			}, ping() + 500);
        		}
			}
		}, 250);
	}

	function ping() {
		var started = new Date().getTime();
		var cacheBuster = "?nnn=" + started;
		var http = new XMLHttpRequest();
		http.open("GET", "//www.mousehuntgame.com" + cacheBuster, true);
		http.onreadystatechange = function() {
			if (http.readyState == 4) {
			  var ended = new Date().getTime();
			  var milliseconds = ended - started;
			  console.log("Ping time: " + milliseconds + "ms");
			  return milliseconds;
			}
		};
		try {
			http.send(null);
		} catch(exception) {
			// this is expected
		}
	}

	if (baseButton != null && weaponButton != null && charmButton != null) {
		checkDOM();
	}
	else {
		newWindow.close();
		alert("Please navigate to the Camp page!");
		return;
	}
})();