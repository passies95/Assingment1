/*===================================================
Assingment 1
Author: Pascal Ogola           
===================================================*/
// Initialize the map and tiles
var mapCentre = [0.1989826,37.0060];
var mapZoom = 6;

var map = L.map('map').setView(mapCentre, mapZoom);
// Add Basemap Tilelayers
// Two basemaps have been selected, one satellite and the other and topomap
// Add Osm Layer
// Google Streets Layer
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
 }).addTo(map);
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
 // Add Google Satelite Layer
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3']
});
// Add Carto Db Layer
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

// Define Layer Control Variables
// Add the basemaps to the Layer Control Variable
var baseLayers = {
    "Carto Light":CartoDB_Positron,
    "Google Map":googleStreets,
    "OpenStreetMap": osm,
    "Satellite":googleSat
};

var overlays = {};
//Add Layer Control to Map
var layerControl = L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);

// Fetch and add data to map
// Define a color scheme based on the density value
function getColor(density) {
    if (density > 1000) {
        return '#FFFF00';
    } else if (density > 500) {
        return '#BD0026';
    } else if (density > 200) {
        return '#800026';
    } else if (density > 100) {
        return '#FEB24C';
    } else if (density > 50) {
        return '#FD8D3C';
    } else {
        return '#FFEDA0';
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1
    };
}

// Retrieve the counties data from the geojson
var kenyaCounties = L.geoJson(KenyaCounties, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

console.log(kenyaCounties)
// Add the Layer to Layer Control
layerControl.addOverlay(kenyaCounties, "Kenya Counties")

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    // Open Layer Popup
    layer.openPopup();

}

function resetHighlight(e) {
    var layer = e.target;
    kenyaCounties.resetStyle(e.target);
    //Close open Popup
    layer.closePopup();

}

function zoomToFeature(e) {
    var layer = e.target;
    map.fitBounds(layer.getBounds());
    layer.openPopup();
}

// Add a popup indicating the density, round the density since persons are whole numbers
function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(`<b>County:</b> ${feature.properties.NAME_1}<br>
            <b>Density Per Square Km:</b> ${Math.round(feature.properties.density)}<br>`
        );
    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Add Legend to Map
var legendItems = [{
    label: '1 - 49 People ',
    type: "rectangle",
    color: "#FFEDA0",
    fillColor: "#FFEDA0",
    weight: 1,
    layers: kenyaCounties
},
{
    label: "50 - 99 People ",
    type: "rectangle",
    color: "#FD8D3C",
    fillColor: "#FD8D3C",
    weight: 1,
    layers: kenyaCounties
},
{
    label: "100 - 199 People ",
    type: "rectangle",
    color: "#FEB24C",
    fillColor: "#FEB24C",
    weight: 1,
    layers: kenyaCounties
},
{
    label: "200 - 499 People ",
    type: "rectangle",
    color: "#800026",
    fillColor: "#800026",
    weight: 1,
    layers: kenyaCounties
},
{
    label: "500 - 999 People ",
    type: "rectangle",
    color: "#BD0026",
    fillColor: "#BD0026",
    weight: 1,
    layers: kenyaCounties
},
{
    label: "1000 - 6250 People ",
    type: "rectangle",
    color: "#FFFF00",
    fillColor: "#FFFF00",
    weight: 1,
    layers: kenyaCounties
}
];

var legend = L.control.Legend({
    position: "bottomright",
    title: 'Population Density Per Square Km',
    collapsed: false,
    symbolWidth: 18,
    opacity: 1,
    column: 1,
    legends: legendItems
}).addTo(map);