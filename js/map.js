var markerLayer,
areaLayer;

function setColor(type) {
	return type == 'ownership' ? "#8CC739" :
	       type == 'repair' ? "#085DAD" : 
	       type == 'preservation' ? "#21BEDE" : 
	                     "#bae4bc";
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.type),
        color: "white",
        fillOpacity: 0.9,
        radius: 5
    };
}

$.getJSON("data/areas.geojson", function(data) {
    areaLayer = L.geoJson(data, {
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: '#ADB6B5',
        dashArray: '3'
    });
})

	
$.getJSON("data/addresses.geojson", function(data) {
    markerLayer = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker (latlng, style(feature));

    },
    onEachFeature: function(feature, layer) {            
        var props = layer.feature.properties;
        
        layer.bindPopup("<b>"+props.address+"</b>"+"<br>"+"Type: "+props.type);
            
    }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += "<b>"+'Type of Assistance'+"</b>"+"<br>";
    
    types = ['ownership', 'repair', 'preservation'];
    labels = ['Home Ownership','Emergency Repairs','Preservation'];
    
    for (var i = 0; i < types.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + setColor(types[i]) + '"></i> ' +
             (types[i] ? labels[i] + '<br>' : '+');
    }
    
    return div;
};

	var map = L.map('map', {maxZoom: 17}).fitBounds(markerLayer.getBounds());
	L.control.layers({
	    'Positron': L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
subdomains: 'abcd',
}).addTo(map),
        'Terrain': new L.StamenTileLayer("terrain"),
	    'Toner': new L.StamenTileLayer("toner"),
        'Toner-Lite': new L.StamenTileLayer("toner-lite")}).addTo(map);
    areaLayer.addTo(map);
	markerLayer.addTo(map);
	legend.addTo(map);
})