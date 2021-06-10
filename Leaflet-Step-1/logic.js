var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function markerSize(magnitude) {
    return magnitude * 4;
};

var earthquake = new L.LayerGroup();

d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
    createMap(earthquake);
});


function Color(magnitude) {
    if (magnitude > -10 & magnitude < 10) {
        return 'RGB(124,252,0)'
    } else if (magnitude > 10 & magnitude < 30) {
        return 'RGB(173,255,47)'
    } else if (magnitude > 30 & magnitude < 50) {
        return 'RGB(255,215,0)'
    } else if (magnitude > 50 & magnitude < 70) {
        return 'RGB(218,165,32)'
    } else if (magnitude > 70 & magnitude < 90) {
        return 'RGB(184,134,11)'
    } else {
        return 'RGB(255,0,0)'
    }
};


function createMap() {
   
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var baseLayers = {
        "Satellite": light     
    };

    var overlays = {
        "Earthquakes": earthquake,
        
    };

    var myMap = L.map('map', {
        center: [37.8968, -119.5828],
        zoom: 3.5,
        layers: [light, earthquake]
    });

    L.control.layers(baseLayers, overlays).addTo(myMap);
 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            depth = [-10, 10, 30, 50, 70, 90],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Depth in Km</h4>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(depth[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
  
    legend.addTo(myMap);

}

