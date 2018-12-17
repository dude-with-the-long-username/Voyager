document.addEventListener("deviceready", function() {
	var geolocationOptions = {
		enableHighAccuracy: true,
		timeout: 100000
	}
	var destinationInput = document.getElementById("destination");
	var destinationAutoComplete = new google.maps.places.Autocomplete(destinationInput);

	destinationAutoComplete.setFields(["geometry"]);
	destinationAutoComplete.addListener("place_changed", destIn);

	var mapDiv = document.getElementById("mapCanvas");
	var map = plugin.google.maps.Map.getMap(mapDiv);

	var sourceInput = document.getElementById("source");
	var sourceAutoComplete = new google.maps.places.Autocomplete(sourceInput);
	sourceInput.disabled = true;
	sourceAutoComplete.setFields(["geometry"]);
	//add listener for place_changed, function destIn() --change its name
	function destIn() {
		mapDiv.style.visibility = "visible";
		destResult = destinationAutoComplete.getPlace();
		var destMarker = map.addMarker({
			position: {
				lat: destResult.geometry.LatLng.lat(),
				lng: destResult.geometry.LatLng.lng()
			},
			animation: plugin.google.maps.Animation.BOUNCE
		});
		//display route from src to dest
	}

	function sourceIn() {
		sourceResult = sourceAutoComplete.getPlace();
		var sourceMarker = map.addMarker({
			position: {
				lat: sourceResult.geometry.LatLng.lat(),
				lng: sourceResult.geometry.LatLng.lng()
			},
			animation: plugin.google.maps.Animation.BOUNCE
		});
		//display route
	}

	function geolocationSuccess(position) {
		map.animateCamera({
			target: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			},
			zoom: 17,
			tilt: 69,
			bearing: 140,
			duration: 4000
		});
		var sourceMarker = map.addMarker({
			position: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			},
			animation: plugin.google.maps.Animation.BOUNCE
		});
		sourceInput.placeholder = position.coords.latitude + ", " + position.coords.longitude;
	}

	function geolocationError(position) {
		//display modal --todo
		sourceInput.placeholder = "Enter your location";
	}


	navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
	sourceInput.disabled = false;

	window.powerManagement.dim(function() {
		console.log("Wakelock acquired");
	}, function() {
		console.log("Failed to acquire wakelock");
	});
}, false);
