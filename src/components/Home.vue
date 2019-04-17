<template>
	<div>
		<div class="vw-100" :class="{full: !placeShown, short: placeShown}" id="map"></div>
		<input id="search-input" class="controls d-absolute mt-1 ml-1 border border-success" type="text" 
			placeholder="Search map...">
			
		<div class="text-white font-weight-boldx bg-success rounded p-2" style="bottom: 2px; left: 2px; position:absolute">
			Alpha Version -  
			<a target="_blank" href="https://bit.ly/2VKBSTT"  class="text-white font-underline">Indiegogo Prelaunch!</a>
		</div>

		<div class="modal fade" id="warnModal" @keypress="closeWarn" tabindex="-1" role="dialog" 
			aria-labelledby="warnModalTitle" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-centered">
				<div class="modal-content bg-primary border-primary text-white p-3 text-center" 
					style="border-width:6px !important; box-shadow: 0px 0px 20px #666;">
					<img width="91" height="70" class="m-auto" src="src/assets/sadlogo.jpg" />
					<br>
					<p class="mt-4">
						Oh bother... something went wrong.<br>
						Hm, try disabling adblockers and/or refreshing the page.
					</p>
					<br>
					<button class="btn mt-2 ml-5 mr-5 btn-outline-light" @click="closeWarn">reload page</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
		data() {
			return {
			}
		},
		created(){
			this.loadPlaceTypes()
		},
		mounted(){
		var tthis = this
		var mapInitAndLoad = function(){
			try{
			// Init and load Map
			const map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 40, lng: -88},
				zoom: 3,
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP
				},
			})
			const places = new google.maps.places.PlacesService(map)

			// Location
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => 
				{
					map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude })
					map.zoom = 8
				}, ()=>{})
			} 

			// Place click
			map.addListener('click', 
			function(event) {
				tthis.getPlaceDetails(places, event.placeId)
			})

			// Search box			
			var markers = [];
			var input = document.getElementById('search-input')
			var searchBox = new google.maps.places.SearchBox(input)
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
			map.addListener('bounds_changed', function() {
				searchBox.setBounds(map.getBounds())
			});

			// Search querying
			searchBox.addListener('places_changed', function() {

				var sPlaces = searchBox.getPlaces()
				if (sPlaces && sPlaces.length == 0) { return; }
				// Clear old markers
				markers.forEach(function(marker) { marker.setMap(null); })
				markers = [];

				//Get glu-place ratings
				var ratingDict = []
				sPlaces.forEach(function(p){
					ratingDict.push(p.place_id)
				})
				var bounds = new google.maps.LatLngBounds()
				var i = 0
				var colors = ['#387fe9', '#e94538', '#e96d38', '#e9b438', '#c1e938', '#72e938']
				tthis.getPlaceRatings(ratingDict).then(resDict =>{
					if(!resDict){ resDict = ratingDict; console.log("empty"); }
					sPlaces.forEach(function(place) {
						if (!place.geometry) {
							console.log("Returned place contains no geometry")
							return;
						}

						// Create a marker for each place
						var ratingLabel = (resDict[place.place_id] == 0 ? ' (?★)' : " (" + resDict[place.place_id] + "★)");
						var m = new google.maps.Marker({
							map: map,
							label: {
								text: (place.name.length > 10 ? place.name.substring(0,10)+"..." : place.name) + ratingLabel,
								color: '#333',
								fontSize: '1.1em',
								fontWeight: 'bold'

							},
							icon: {
								path: google.maps.SymbolPath.CIRCLE,
								fillColor: colors[resDict[place.place_id]],
								fillOpacity: 1,
								scale: 8,
								strokeColor: '#222',
								strokeWeight: 1,
								labelOrigin: new google.maps.Point(place.name.length > 10 ? 7.5 : 6,0)
							},
							shape: {coords: [0,0,50,50], type: "rect"},
							title: place.name + ratingLabel,
							position: place.geometry.location,
							optimized: true,
							cursor: 'pointer',
							zIndex: i++
						})
						m.addListener('click', function() {
							map.panTo(place.geometry.location)
							var zm = map.getZoom()
							
							if(zm < 6){
								map.setZoom(6)
							}
							if(zm < 14 && zm > 6){
								map.setZoom(14)
								tthis.getPlaceDetails(places, place.place_id)
							} else {								
								map.setZoom(zm + 2)
								tthis.getPlaceDetails(places, place.place_id)
							}
						})
						m.addListener('dblclick', function() {
							map.setZoom(19)
							map.panTo(place.geometry.location)
							tthis.getPlaceDetails(places, place.place_id)
						})
						markers.push(m)

						if (place.geometry.viewport) {
							// Only geocodes have viewport
							bounds.union(place.geometry.viewport)
						} else {
							bounds.extend(place.geometry.location)
						}

						//Select Place if only result
						if(sPlaces.length == 1){
							tthis.getPlaceDetails(places, sPlaces[0].place_id)
						} else {
							tthis.clearPlace()
						}
						map.fitBounds(bounds)
					});
				});
			});
			} catch(e){
				if(e || e.indexOf("google is not defined")){
					$("#warnModal").modal({backdrop:true, show: true})
						.on('hidden.bs.modal', function (e) {
							window.location.replace(window.location.pathname)
						})
				}
			}
		}
		setTimeout(mapInitAndLoad(), 1000)
		},
		computed: {
			...mapGetters([
				'currentPlace',
				'placeTypes',
				'error'
			]),
			placeShown(){
				return this.currentPlace != null
			},
		},
		methods: {
			...mapActions([
				'getPlaceRatings',
				'getPlace',
				'loadPlaceTypes',
				'loadSponsors',
				'clearPlace',
				'errorMsg',
			]),
			closeWarn(){
				$("#warnModal").modal("hide")
				window.location.replace(window.location.pathname)
			},
			getPlaceDetails(places, placeId){
				var tthis = this
				if (placeId) {
					places.getDetails({placeId: placeId, fields: ['name', 'formatted_address', 'place_id', 'types']}, 
						function(place, status) {

							//discriminate on place type
							var ofType = false;
							tthis.placeTypes.forEach(t=>{
								if(place.types.includes(t.id.toLowerCase().trim().replace(' ','_'))){ ofType = true }
							})
							
							if (status === 'OK' && ofType) {
								//parse address parts
								var addr =  place.formatted_address.split(',')
								var locality = addr[1] ? addr[1].trim() : ""
								var region = addr[2] ? addr[2].split(' ')[1] :""
								var country = addr[3] ? addr[3].trim() : ""

								tthis.getPlace({
									pid: place.place_id, 
									pname: place.name, 
									pcity:  locality, 
									pprovince:  region,
									pcountry:  country
								})
							}
						})
				}
			}
		}
	}
</script>

<style scoped>
	#map.short{
		height: 62%;
	}
	#map.full{
		height: 100%;
	}
	
	.title {
		font-weight: bold;
	}

		#search-input {
			background-color: #fff;
			font-size: 15px;
			padding: 7px 9px;
			width: auto;
			min-width: 120px;
			max-width: 400px;
			border-radius: 3px;
		}

		#search-input:focus {
			width: 75%;
			max-width: auto;
		}

</style>