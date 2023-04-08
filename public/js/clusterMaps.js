window.onload = function () {
    L.mapquest.key = mapToken;
    var baseLayer = L.mapquest.tileLayer('map');

    var map = L.mapquest.map('cluster-map', {
        center: L.latLng(campgrounds[0][1], campgrounds[0][0]),
        layers: baseLayer,
        zoom: 4
    });

    var addressPoints = [];
    for (var i = 0; i < campgrounds.length; i++) {
        addressPoints.push([campgrounds[i][1], campgrounds[i][0], camps[i].title, camps[i].location, camps[i].id]);
    }
    console.log(addressPoints)
    var markers = L.markerClusterGroup();

    for (var i = 0; i < addressPoints.length; i++) {
        var addressPoint = addressPoints[i];
        var title = addressPoint[2];
        var location = addressPoint[3];
        var id = addressPoint[4];
        var popupContent =
            `<h6><a href="/campgrounds/campgroundDetail/${id}"> ${title}</a></h6>
            <p>${location}</p>`;
        var marker = L.marker(new L.LatLng(addressPoint[0], addressPoint[1]), {
            icon: L.mapquest.icons.marker()
        });
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    }

    map.addLayer(markers);

    // Add a scale control to the map
    L.control.scale().addTo(map);

    // Add a layers control to the map
    L.control.layers({
        'Map': baseLayer,
        'Satellite': L.mapquest.tileLayer('satellite'),
        'Hybrid': L.mapquest.tileLayer('hybrid')
    }).addTo(map);
}



// window.onload = function () {
//     L.mapquest.key = mapToken;
//     var baseLayer = L.mapquest.tileLayer('map');

//     var map = L.mapquest.map('cluster-map', {
//         center: L.latLng(campgrounds[0][1], campgrounds[0][0]),
//         layers: baseLayer,
//         zoom: 4
//     });

//     var addressPoints = [];
//     for (var i = 0; i < campgrounds.length; i++) {
//         addressPoints.push([campgrounds[i][1], campgrounds[i][0], camps[i].title, camps[i].location, camps[i].id]);
//     }
//     console.log(addressPoints)
//     var markers = L.markerClusterGroup();

//     for (var i = 0; i < addressPoints.length; i++) {
//         var addressPoint = addressPoints[i];
//         var title = addressPoint[2];
//         var location = addressPoint[3];
//         var id = addressPoint[4];
//         var popupContent =
//             `<h6><a href="/campgrounds/campgroundDetail/${id}"> ${title}</a></h6>
//             <p>${location}</p>`;
//         var marker = L.marker(new L.LatLng(addressPoint[0], addressPoint[1]), {
//             icon: L.mapquest.icons.marker()
//         });
//         marker.bindPopup(popupContent);
//         markers.addLayer(marker);
//     }

//     map.addLayer(markers);
// }
