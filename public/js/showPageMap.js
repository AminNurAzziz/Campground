// L.mapquest.key = '<%- process.env.MAPSQUEST_API_KEY;%>';
L.mapquest.key = mapToken;

// create the map
const map = L.mapquest.map('map', {
    center: [coordinates[1], coordinates[0]],
    layers: L.mapquest.tileLayer('map'),
    zoom: 16
});

// create a MapQuest marker icon
const markerIcon = L.icon({
    iconUrl: 'https://assets.mapquestapi.com/icon/v2/marker-blue.png',
    // iconUrl: 'https://assets.mapquestapi.com/icon/v2/marker@2x.png',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -35]
});

// create a marker with the obtained [coordinates[1], coordinates[0]] and icon
const marker = L.marker([coordinates[1], coordinates[0]], { icon: markerIcon });

const popupContent = `
    <h6>${camp.title}</h6>
    <p>${camp.location}</p>
`;
// add a popup to the marker with the title of the camp
marker.bindPopup(popupContent);

// add the marker to the map
marker.addTo(map);


// L.mapquest.key = mapToken;

// L.mapquest.map('map', {
//     center: [37.7749, -122.4194],
//     layers: L.mapquest.tileLayer('map'),
//     zoom: 12
// });


// //Map Marker Icon
// // create a MapQuest marker icon
// const markerIcon = L.icon({
//     iconUrl: 'https://assets.mapquestapi.com/icon/v2/marker@2x.png',
//     iconSize: [36, 46],
//     iconAnchor: [18, 46],
//     popupAnchor: [0, -35]
// });

// // create a marker with the obtained coordinates and icon
// const marker = L.marker([37.7749, -122.4194], { icon: markerIcon });

// // add the marker to the map
// marker.addTo(map);

