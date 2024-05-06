// Create the map
var map = L.map('map').setView([51.505, -0.09], 13);
// Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Define custom marker icon
var customIcon = L.icon({
    iconUrl: 'images/icon-location.svg', // Replace with the path to your custom marker image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});
// Initialize marker variable
var marker;


function placeMarker(latlng) {
    let latitude = latlng.lat;
    let longitude = latlng.lng;


    // Remove existing marker (if any)
    if (marker) {
        map.removeLayer(marker);
    }

    // Add new marker at the specified location
    map.setView(latlng, 20)
    marker = L.marker(latlng, { icon: customIcon }).addTo(map);
}



let searchBtn = document.getElementById('searchBtn');
let searchBar = document.getElementById('searchbar');
const ip = document.getElementById('ipAddress');
const Location = document.getElementById('location');
const timeZone = document.getElementById('timezone');
const isp = document.getElementById('isp');
const loadingSkeleton = document.querySelectorAll('.loading');


let ipInfo ={};

// Function to fetch geolocation data
function fetchGeoLocation(ipAddress, callBack) {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_CvEfYiWVoj1AhOdmaiMzbXttHigen&ipAddress=${ipAddress}`)
        .then(response => response.json())
        .then(data => {
            // Check if data.location exists before accessing its properties
            if (data.location) {
                // Store geolocation data in ipInfo object
                ipInfo ={
                    country : data.location.country,
                    region : data.location.region,
                    geoNameId: data.location.geonameId,
                    timeZone : data.location.timezone,
                    isp : data.isp,
                    lat : data.location.lat,
                    lng: data.location.lng
                };

                ip.innerText = ipAddress;
                Location.innerText = `${ipInfo.region}, ${ipInfo.country} ${ipInfo.geoNameId}`;
                timeZone.innerText = `UTC ${ipInfo.timeZone}`;
                isp.innerText = ipInfo.isp;

                callBack(ipInfo.lat, ipInfo.lng);
            } else {
                // Handle case where data.location is missing
                console.error('Error: Missing location data in API response');
            }
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
        });
}


// Event listener for search button click
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    // Get the IP address from the user input (assuming it's entered into a text input field)
    let ipAddress = searchBar.value;
    
    // Call fetchGeoLocation function with the provided IP address
    fetchGeoLocation(ipAddress, (lat, lng) => {
        placeMarker({ lat: lat, lng: lng }); 
    });

});



// ipApi.then(response => response.json()).then(data =>{

   
//     // Extract relevant data from API response
    

//     // Log geolocation data to console
//     console.log(data);
//     console.log(`Location: ${ipInfo.region}, ${ipInfo.country}, ${ipInfo.timeZone}, ${ipInfo.isp}, ${ipInfo.lat}`);
// }).catch(error => {
//     // Log error if API request fails
//     console.log('Error fetching data:', error);
// });

