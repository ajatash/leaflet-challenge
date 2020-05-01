// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  var streetmap =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(myMap);


  
  // Load in geojson data
  var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  var geojson;
  
  // Grab data with d3
  d3.json(geoData, function(data) {
  
    // Create a new choropleth layer
    geojson = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "mag",
  
      // Set color scale
      scale: ["#ffffb2", "#b10026"],
  
      // Number of breaks in step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },


      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "<br>" + "Date:" + new Date(feature.properties.time) + "</p>");
    }
    }).addTo(myMap);
  
    // Set up the legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Earthquake Magnitude</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);

  
  
  });

  function chooseRadius(magnitude) {
    var radius = 0
    if ( magnitude > 6 ) radius = 50; 
    else if ( magnitude > 4 ) radius = 35;
    else if ( magnitude > 4 ) radius = 25;
    else if ( magnitude > 3 ) radius = 20;
    else if ( magnitude > 2 ) radius = 15;
    else if ( magnitude > 1 ) radius = 10;
    // else if ( magnitude > 0 ) fillColor = "#ffffd4";
    else radius = 0;  // no data
    return radius;
  }

  d3.json(geoData, function(data) {
    var earthquakeData = data.features;
    // var covidFiltered = covidData.filter(function(d) {
    //   return d.Province_State === "Minnesota" });
    console.log(earthquakeData);
    function oneachfeature(feature, layer) {
    // https://gis.stackexchange.com/questions/166252/geojson-layer-order-in-leaflet-0-7-5/167904#167904
    layer.options.zIndex = 650;
    layer.bindPopup("<h4>" + feature.properties.place +
      "</h4><hr><p>Confirmed cases: " + (feature.properties.mag) +
       "</p><hr><p>" + new Date(feature.properties.Last_Update) + "</p>");
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
           layer.bringToFront();
       }
      }
 
 
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: oneachfeature,
    pointToLayer: function(feature,latlng){
	  return new L.CircleMarker(latlng, {
      radius: chooseRadius(feature.properties.mag),
      fillOpacity: 1,
      fillColor: "#ce1432",
      weight: 0,
      color: "red"}); // feature.properties.mag
    },
    pane: 'points'
  })

  earthquakes.addTo(myMap);
});
