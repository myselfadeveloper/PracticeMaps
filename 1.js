function myFunction(){
  require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/layers/FeatureLayer",
  "esri/widgets/Track",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Compass",
  "esri/widgets/Home",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/Popup",
  "esri/widgets/ScaleBar",
  "dojo/domReady!"
], function(Map, MapView, Search, FeatureLayer, Track, BasemapToggle, BasemapGallery, Compass, Home, LayerList, Legend, Popup, ScaleBar){
  var map = new Map({
    basemap: "satellite"
  });
  var view = new MapView({
    container: "viewDiv",  // Reference to the scene div created in step 5
    map: map,  // Reference to the map object created before the scene
    zoom: 3,  // Sets the zoom level based on level of detail (LOD)
    center: [-101.94981250000075, 41.20977753557709]  // Sets the center point of view in lon/lat
  });
  
  var trackWidget = new Track({
  view: view
  });
  view.ui.add(trackWidget, "top-left");
  var searchWidget = new Search({
  view: view
  });
  // Adds the search widget below other elements in
  // the top left corner of the view
  view.ui.add(searchWidget, {
  position: "top-right",
  index: 2
  });
  
  var basemapToggle = new BasemapToggle({
  view: view,
  //nextBasemap: "hybrid"
  nextBasemap: "streets"
  });
  view.ui.add(basemapToggle, "bottom-left");

  var basemapGallery = new BasemapGallery({
  view: view
  });
  // Add widget to the bottom left corner of the view
  view.ui.add(basemapGallery, {
  position: "bottom-right"
  });

  var compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-left");

  var homeWidget = new Home({
  view: view
  });
  // adds the home widget to the top left corner of the MapView
  view.ui.add(homeWidget, "top-left");

  var layerList = new LayerList({
  view: view
  });
  // Adds widget below other elements in the top left corner of the view
  view.ui.add(layerList, {
  position: "bottom-left"
  });

  var legend = new Legend({
  view: view,
  layerInfos: [{
    layer: FeatureLayer,
    title: "Legend"
  }]
  });
  view.ui.add(legend, "bottom-right");

  var scaleBar = new ScaleBar({
  view: view
  });
  // Add widget to the bottom left corner of the view
  view.ui.add(scaleBar, {
  position: "bottom-left"
  });

  var fl = new FeatureLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3"
  });
  map.add(fl);  // adds the layer to the map
  
  // points to a hosted Feature Layer in ArcGIS Online
  var f2 = new FeatureLayer({
  portalItem: {  // autocasts as esri/portal/PortalItem
    id: "8444e275037549c1acab02d2626daaee"
  }
  });
  map.add(f2);  // adds the layer to the map


      /********************
       * Add feature layer
       ********************/
      // sampling of breweries
      var featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/OpenBeerDatabase/FeatureServer/0",
        outFields: ["*"],
        definitionExpression: "country = 'United States'",

        // add a custom action
        popupTemplate: {
          title: "{name}",
          content: [{
            type: "fields",
            fieldInfos: [{
              fieldName: "name"
            }, {
              fieldName: "address1",
              label: "address"
            }, {
              fieldName: "city"
            }, {
              fieldName: "state"
            }, {
              fieldName: "phone"
            }, {
              fieldName: "website"
            }]
          }],
          actions: [{
            id: "find-brewery",
            image: "beer.png",
            title: "Brewery Info"
          }]
        }
      });

      map.add(featureLayer);
      view.then(function() {
        var popup = view.popup;
        popup.viewModel.on("trigger-action", function(event) {
          if (event.action.id === "find-brewery") {
            var attributes = popup.viewModel.selectedFeature.attributes;
            // Get the "website" field attribute
            var info = attributes.website;
            // Make sure the "website" attribute value is not null
            if (info !== null) {
              // Open up a new browser using the URL value in the 'website' field
              window.open(info.trim());
              // If the "website" value is null, open a new window and Google search the name of the brewery
            } else {
              window.open("https://www.google.com/search?q=" +
                attributes.name);
            }
          }
        });
      });
    });
};