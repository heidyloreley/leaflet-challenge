
// Creating map object
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2
});

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(map);

// Request to get the information
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";


// Define circles radius
function radius(r) {
    return r < 1 ? 5 :
        r < 2 ? 10 :
            r < 3 ? 15 :
                r < 4 ? 20 :
                    r < 5 ? 25 :
                        30;
}

// Define circles color
function cColor(color) {
    return color < 1 ?  "#1a9850":
    color < 2 ? "#91cf60" :
    color < 3 ? "#d9ef8b" :
    color < 4 ? "#fee08b" :
    color < 5 ? "#fc8d59" :
        "#d73027";
}


d3.json(url, function (data) {
    console.log(data.features)

    // Create GeoJson layer with Magnitude Earthquake to slyle size and color
    // Display on PopUp
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: radius(feature.properties.mag),
                fillColor: cColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
            );
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h2>" + feature.properties.place + "</h2> <hr> <h3>" +
                "Magnitude: " + feature.properties.mag + "</h3> <hr> <h3>" +
                "Duration (in minutes): " + feature.properties.dmin + "</h3>")
        },

    }).addTo(map);
});

// Add Legend
// Set up the legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    var magnitudes = [0,1,2,3,4,5]
    var categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var labels = [];

    // loop through magnitudes intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + cColor(magnitudes[i]) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);