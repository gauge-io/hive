/**
 * Aux.js
 * 
 * Bind all UI Components and data model
 * 
 * @author Ashish Singh [https://github.com/git-ashish](GitHub)
 */

(function Aux() {

    var dispatch = d3.dispatch('filterUpdate', 'applyFiltersOnData', 'datasetRefreshed', 'mapLoaded', 'dataLoaded', 'updateProfileGeoJSON', 'adhocMetricUpdate', 'adhocUpdateDone'),
    sUrlProfile = 'data/viz/profile-data.csv',

    DataManager,

    map,

    oCountiesGeoJSON;


    // UI Layer
    // 
    function initUI() {

        // Define DOM elements
        // 

        // Define UI Filters
        // 

        var aFilters = [
            // Adoption Score
            //
            {
                id: '#filter_hardware',
                label: 'Hardware',
                type: 'range-slider',
                metric: 'Hardware Score',
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            },
            {
                id: '#filter_software',
                label: 'Software',
                type: 'range-slider',
                metric: 'Software Score',
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            },
            {
                id: '#filter_savviness',
                label: 'Savviness Index',
                type: 'range-slider',
                metric: 'Savviness Index',
                range: {
                    min: 0,
                    max: 300,
                    step: 1
                }
            },

            // Demographics
            // 
            {
                id: '#filter_gender',
                label: 'Gender',
                type: 'dropdown',
                metric: 'Gender',
                values: [{
                    label: 'All',
                    selected: true,
                    value: 'All'
                }, {
                    label: 'Male',
                    value: 'Male'
                }, {
                    label: 'Female',
                    value: 'Female'
                }]
            }, {
                id: '#filter_age',
                label: 'Age',
                type: 'range-slider',
                metric: '_age',
                isRangeValue: true,
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 100,
                    step: 1
                }
            }, {
                id: '#filter_employment',
                label: 'Employment Status',
                type: 'multi-dropdown',
                metric: 'Employment Status',

                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Employed full-time",
                        value: "Working F/T"
                    },
                    {
                        label: "Employed part-time",
                        value: "Working P/T"
                    }, {
                        label: "Self-employed",
                        value: "Self-Employed"
                    },
                    {
                        label: "Temporarily unemployed",
                        value: "Unemployed/Looking for work"
                    }, {
                        label: "Full-time student",
                        value: "F/T Student"
                    }, {
                        label: "Retired",
                        value: "Retired"
                    }, {
                        label: "A homemaker",
                        value: "Homemaker"
                    }
                ]
            }, {
                id: '#filter_ownrent',
                label: 'Own or Rent',
                type: 'dropdown',
                metric: 'Own-Rent',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Own",
                        value: "Own"
                    },
                    {
                        label: "Rent",
                        value: "Rent"
                    }
                ]
            }, {
                id: '#filter_hhi',
                label: 'Annual HHI',
                type: 'range-slider',
                metric: 'Annual HHI',
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 100000,
                    step: 1
                }
            }, {
                id: '#filter_children',
                label: 'Children in Home',
                type: 'range-slider',
                metric: 'Children in Home',
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 10,
                    step: 1
                }
            }, 
            // ZIP Code Associations
            // 
            {
                id: '#filter_zip_den',
                label: 'Density Sq. Mile',
                type: 'range-slider',
                metric: 'den',
                isAdhoc: true,
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 200000,
                    step: 2000
                }
            }, {
                id: '#filter_zip_unemp',
                label: 'Unemployment Rate',
                type: 'range-slider',
                metric: 'unemp',
                isAdhoc: true,
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 15,
                    step: 1
                }
            },

            // Usage
            // 
            {
                id: '#filter_device_usage',
                label: 'Device Usage',
                type: 'dropdown',
                metric: 'Device Usage',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Leisure only",
                        value: "Leisure only"
                    },
                    {
                        label: "Work & leisure",
                        value: "Work & leisure"
                    },
                    {
                        label: "Entirety of day",
                        value: "Entirety of day"
                    }
                ]
            }, {
                id: '#filter_habit_purchase',
                label: 'Purchase Habits',
                type: 'multi-dropdown',
                metric: 'Purchase Habits',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Leisure only",
                        value: "Leisure only"
                    },
                    {
                        label: "Manufacturer's retail store",
                        value: "Manufacturer's retail store"
                    },
                    {
                        label: "Third-party store",
                        value: "Third-party store"
                    },
                    {
                        label: "Second-hand",
                        value: "Second-hand"
                    },
                    {
                        label: "Manufacturer's website",
                        value: "Manufacturer's website"
                    },
                    {
                        label: "Third-party website",
                        value: "Third-party website"
                    }
                ]
            }, {
                id: '#filter_annual_support',
                label: 'Annual Support Requests',
                type: 'range-slider',
                metric: '_support_req',
                range: {
                    min: 0,
                    max: 10,
                    step: 1,
                    hasPlus: true
                }
            }, {
                id: '#filter_purchased_protection',
                label: 'Purchased Protection',
                type: 'checkbox',
                metric: 'Purchased Protection',
                values: [{
                  label: "Has purchased protection",
                  value: true,
                  selected: true
                }] 
            }, {
                id: '#filter_perception_protection',
                label: 'Perception of Protection',
                type: 'multi-dropdown',
                metric: 'Perception of Protection',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Waste of money",
                        value: "Waste of money"
                    },
                    {
                        label: "Just hope for the best",
                        value: "Just hope for the best"
                    },
                    {
                        label: "Makes sense for expensive",
                        value: "Makes sense for expensive"
                    },
                    {
                        label: "Smart and responsible thing to do",
                        value: "Smart and responsible thing to do"
                    }
                ]
            }, {
                id: '#filter_techsupport',
                label: 'Tech Support Person',
                type: 'multi-dropdown',
                metric: 'Tech Support Person',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    },{
                        label: "A Child",
                        value: "A child"
                    }, {
                        label: "Me",
                        value: "Me"
                    },
                    {
                        label: "A partner or spouse",
                        value: "A partner or spouse"
                    },
                    {
                        label: "Someone else that does not live in the household",
                        value: "Someone else that does not live in the household"
                    },
                    {
                        label: "I typically seek out a professional for tech support",
                        value: "I typically seek out a professional for tech support"
                    }
                ]
            }

        ],
        
        // Array of Filter instances
        // 
        aActiveFilters = [],

        // Enable filters that are currenlty applicable here
        // 
        aEnabledFilters = [
          '_age', 
          '_hhi', 
          'Gender', 
          'Own-Rent', 
          'Employment Status', 
          'Hardware Score', 
          'Software Score',
          'Savviness Index', 
          'Annual Support Requests',
          'Purchased Protection',
          'Perception of Protection',
          'Tech Support Person',
          'Children in Home',
          'unemp',
          'den'
        ];

        // Create controls
        // 

        aFilters.filter(function(oF){
          return aEnabledFilters.indexOf(oF.metric) > -1;
        }).forEach(function(oF) {

            var oFilter = new Filter(oF);

            // Preserve instance
            // 
            aActiveFilters.push(oFilter);

            // add to DOM
            // 
            oFilter.createHTML();

            // Bind a dispatch
            oFilter.onchange = function(values) {

              // Don't trigger for adhoc filters
              // They handle their change via dispatches
              // 
              if (oF.isAdhoc) {

                dispatch.apply('adhocMetricUpdate', null, [{
                  metric: oF.metric,
                  isAdhoc: true,
                  type: oF.type,
                  value: values
                }])

              }else{

                dispatch.apply('filterUpdate', null, [{
                    metric: oF.metric,
                    type: oF.type,
                    value: values
                }]);

              }

            }

        });

        // Apply active filters on the dataset
        // 
        function applyFilters() {

          // Build filter objects
          // 
          
          var _aFilters = aActiveFilters.map(function(oF){
            return oF.getState();
          });

          // TODO
          // Do this in a Worker
          // 
          DataManager.setQuerySet( applyFiltersOnData(_aFilters, DataManager.getMainSet()) );

          console.log('Filtered Data', DataManager.getQuerySet());

          // Dispatch info and new dataset
          // 
          dispatch.apply('datasetRefreshed', null, [DataManager.getQuerySet()]);
          
        }

        // Update Filter Panel UI
        //
        function updateFilterPanel(obj) {

          d3.select('#record-count')
            .html(obj.recordCount ? (obj.recordCount + ' Records') : 'No matching records');
          
        }

        // Do Event Binding
        // 
        
        // Listen to requests for Filtering dataset
        // 
        dispatch.on('applyFiltersOnData.aux', function(){

          console.log('Filtering Dataset');

          setTimeout(function(){
            
            applyFilters();

          }, 1);

        });

        // Listen for Dataset update and Update UI
        // 
        dispatch.on('datasetRefreshed.ui', function(aData){

          updateFilterPanel({
            recordCount: aData.length
          });

        });

        dispatch.on('adhocUpdateDone.ui', function(oPayload){

          updateFilterPanel({
            recordCount: oPayload.count
          });

        });

        dispatch.on('dataLoaded.ui', function(){
          
          updateFilterPanel({
            recordCount: DataManager.getQuerySet().length
          });

        });

    }

    // Initialise Mapping
    // 
    function initMap() {

      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-99.9, 41.5],
        zoom: 3
      });

      // Join local JSON data with vector tile geometry
      // USA unemployment rate in 2009
      // Source https://data.bls.gov/timeseries/LNS14000000
      var maxValue = 13,
      iCountyZoomThreshold = 4;

      map.on('load', function() {

        // Dispatch map load event
        dispatch.apply('mapLoaded');

      });

      /**
       * Load counties Geojson
       * This features from here will be used
       * to join with ZIP from profile dataset
       * to build a layer of Profiles
       *
       * TODO - we may get these features from Mapbox layer instead of loading it
       * separately
       * 
       * @return {[type]} [description]
       */
      function loadGeojson() {

        // Work with GeoJSON
        // 
        // data/TopoJSON/mapshaper/us_counties_final-geo.json
        
        d3.json("data/GeoJSON/counties/counties-metrics-geo-3220.json").then(function(oGeoJSON){
            
            oCountiesGeoJSON = oGeoJSON;
            
        });
        
      }

      loadGeojson();

      // Load Counties TopoJSON
      // 
      // 1. Filter topologies where our profiles are situated.
      // 2. Get GeoJSON features of these topologies
      // 3. Get centroid of GeoJSON features
      // 4. Build a Map of properties.zcta to feature
      // 5. Add a Point feature for every profile
      // 6. Build a GeoJSON data source
      
      function buildProfileFeatureData(bReturnData) {

        var aProfiles = DataManager.getQuerySet(),
        aZipUnique = getUniqueZipFromProfile(aProfiles),
        aGeoID = getUniqueGEOIDFromProfile(aProfiles);
        //aGeoID = getGeoIDFromZip(aZipUnique, DataManager.getZIP2GEOID),
        //aZCTA = getZCTAFromZip(aZipUnique, DataManager.getZIP2ZCTA);

        // 1. Filter features where our profiles are situated.
        // 
        var aFeatureGeo = getFeaturesFromGeoID(oCountiesGeoJSON.features, aGeoID);
        //var aFeatureGeo = getFeaturesFromZip(oCountiesGeoJSON.features, aZipUnique);
        //var aFeatureGeo = getFeaturesFromZCTA(oCountiesGeoJSON.features, aZCTA);

        console.log("Found features", aFeatureGeo, 'aMissingZCTA' , aGeoID/*, aZipUnique*/);

        // 3. Get centroid of GeoJSON features
        // 
        var aFeatureCentroids = getGeoCentroid(aFeatureGeo);

        console.log('Centroid Geo Features', aFeatureCentroids);

        // 4. Build a Map of properties.zcta to feature
        // 
        var oGEOIDFeature = d3.map(aFeatureCentroids, function(f){
            return f.properties.GEOID;
            //return f.properties.ZCTA;
        });

        // 5. Add a Point feature for every profile
        // 
        var aProfileCentroids = aProfiles.map(function(p){
            // Find the GEOID via lookup
            // 
            return oGEOIDFeature.get(DataManager.getZIP2GEOID(p._zip));
            //return oGEOIDFeature.get(DataManager.getZIP2ZCTA(p._zip));
        }).filter(function(p){
            return !!p;
        });

        // 6. Build a GeoJSON data source
        // 
        var aGeoJSON = getFeatureCollectionFromFeatures(aProfileCentroids);

        console.log('GeoJSON', aGeoJSON);

        // 5. Add the data source to map with clustering
        // 
        //setupProfileClusterLayer(aGeoJSON);

        // 6. Add the Counties layer
        // 
        //setupCountyLayer(oCountiesGeoJSON);
        //

        if (bReturnData) {
          return aGeoJSON;
        }

        // Dispatch event
        // 
        dispatch.apply('updateProfileGeoJSON', null, [aGeoJSON]);

      }

      /**
       * Set up the Map
       *
       * 1. Add necessary data sources
       * 2. Add all the needed layers
       * 
       * Should be called only once in a Lifetime
       */
      function setupMap() {

        // 5. Add the data source to map with clustering
        // 
        setupProfileClusterLayer(buildProfileFeatureData(true));

        // 6. Add the Counties layer
        // 
        setupCountyLayer(oCountiesGeoJSON);

        //buildProfileFeatureData();
        
      }

      function setupProfileClusterLayer(aGeoJSON) {
          
          // Add a new source from our GeoJSON data and set the
          // 'cluster' option to true. GL-JS will add the point_count property to your source data.
          map.addSource("profiles", {
              type: "geojson",
              data: aGeoJSON || [],
              cluster: true,
              // Max zoom to cluster points on
              clusterMaxZoom: iCountyZoomThreshold,
              // Radius of each cluster when clustering points (defaults to 50)
              clusterRadius: 50
          });



          map.addLayer({
              id: "clusters",
              type: "circle",
              source: "profiles",
              //maxzoom: iCountyZoomThreshold,
              filter: ["has", "point_count"],
              paint: {
                  // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                  // with three steps to implement three types of circles:
                  //   * Blue, 20px circles when point count is less than 100
                  //   * Yellow, 30px circles when point count is between 100 and 750
                  //   * Pink, 40px circles when point count is greater than or equal to 750
                  "circle-color": [
                      "step",
                      ["get", "point_count"],
                      "#666",
                      10,
                      "#666",
                      75,
                      "#666"
                  ],
                  "circle-radius": [
                    // TODO - Linear scale?
                    'interpolate',
                    ['linear'],
                    ['get', 'point_count'],
                    5, 10,
                    100, 40,
                    1000, 50
                    /*
                      "step",
                      ["get", "point_count"],
                      10,
                      10, // count
                      20, // size
                      30, // count
                      30 // size
                    */
                  ]
              }
          });

          map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "profiles",
              //maxzoom: iCountyZoomThreshold,
              filter: ["has", "point_count"],
              layout: {
                  "text-field": "{point_count_abbreviated}",
                  "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                  "text-size": 12
              },
              paint: {
                "text-color": "#fff"
              }
          });

          map.addLayer({
              id: "unclustered-point",
              type: "circle",
              source: "profiles",
              filter: ["!", ["has", "point_count"]],
              paint: {
                  "circle-color": "#ef6548",
                  "circle-radius": 4,
                  "circle-stroke-width": 1,
                  "circle-stroke-color": "#fff"
              }
          });


          // Event Binding
          // 

          // When new data update is available, update the datasource
          // 
          dispatch.on('updateProfileGeoJSON.cluster-layer', function(aProfilesGeoJSON){

            map.getSource("profiles")
              .setData(aProfilesGeoJSON);

          });


      }

      function setupCountyLayer(aGeoJSON) {

        var oFilters = {
          'unemp': [
                  'interpolate',
                  ['linear'],
                  ['get', 'unemp'],
                  2, '#eff3ff',
                  4, '#c6dbef',
                  6, '#9ecae1',
                  8, '#6baed6',
                  10, '#4292c6',
                  12, '#2171b5',
                  14, '#084594'
              ],

          'den': [
                  'interpolate',
                  ['linear'],
                  ['get', 'den'],
                  0, '#F2F12D',
                  1000, '#EED322',
                  5000, '#E6B71E',
                  15000, '#DA9C20',
                  25000, '#CA8323',
                  50000, '#B86B25',
                  100000, '#A25626',
                  150000, '#8B4225',
                  250000, '#723122'
              ]
        };

        // Add a new source from our Counties GeoJSON data
        // NOTE - Source needs data at the time of creation
        // 
        map.addSource("counties", {
            type: "geojson",
            data: aGeoJSON,
            // Max zoom to cluster points on
            clusterMaxZoom: 14,
            // Radius of each cluster when clustering points (defaults to 50)
            clusterRadius: 50
        });

        // Add Layer
        // For Unemployment / Population Density Metric
        // 
        map.addLayer({
          'id': 'county-metric',
          'source': 'counties',
          //'source-layer': 'state_county_population_2014_cen',
          'minzoom': iCountyZoomThreshold,
          'type': 'fill',
          //'filter': ['==', 'isCounty', true],
          'paint': {
              'fill-color': oFilters['unemp'],
              'fill-opacity': 0.75
          }
        }, 'waterway-label');

        /*

        map.addLayer({
          'id': 'county-highlighted',
          'source': 'counties',
          //'source-layer': 'state_county_population_2014_cen',
          'minzoom': iCountyZoomThreshold,
          'type': 'fill',
          //'filter': ['==', 'isCounty', true],
          'paint': {
              'fill-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'unemp'],
                  2, '#eff3ff',
                  4, '#c6dbef',
                  6, '#9ecae1',
                  8, '#6baed6',
                  10, '#4292c6',
                  12, '#2171b5',
                  14, '#084594'
              ],
              'fill-opacity': 0.75
          }
        });

        */


        // Event Binding
        // 

        // When new data update is available, update the datasource
        // 
        var iLayerFilterUpdateTimer;
        dispatch.on('adhocMetricUpdate.county-layer', function(oPayload){

          clearTimeout(iLayerFilterUpdateTimer);

          iLayerFilterUpdateTimer = setTimeout(function(){

            // Update Paint fill of layer
            // 
            map.setPaintProperty("county-metric", "fill-color", oFilters[oPayload.metric]);

            // Set Filter
            // 
            map.setFilter("county-metric", null);
            map.setFilter("county-metric", ['all', ['>=', oPayload.metric, oPayload.value.min], ['<=', oPayload.metric, oPayload.value.max]]);

            // Update Profiles based on matchinf features
            // 
            var aJson = buildProfileFeatureData(true);
            if (aJson && aJson.features) {

              var _aJson = aJson.features.filter(function(f){
                return f.properties[oPayload.metric] >= oPayload.value.min && f.properties[oPayload.metric] <= oPayload.value.max;
              });

              dispatch.apply('updateProfileGeoJSON', null, [getFeatureCollectionFromFeatures(_aJson)]);

              dispatch.apply('adhocUpdateDone', null, [{
                count: _aJson.length
              }]);

            }

          }, 200);


        });
        
      }


      // Event Binding
      // 

      // Our pre-requiste dataset has loaded
      // 
      dispatch.on('dataLoaded.map', function(){
        
        setupMap();

      });

      // When new data update is available
      // 
      dispatch.on('datasetRefreshed.cluster-layer', function(aProfiles){

        buildProfileFeatureData(/*aProfiles*/);

      });

    }

    // Initialise Data loading
    // 
    function initData(){

      DataManager = DataModel(sUrlProfile);
      
      DataManager.then(function(aQueryDataset){

        console.log('Aux - data loaded', aQueryDataset);

      });

      // Load data
      // 
      DataManager.load();

    }

    // Bind Events
    // 
    function bindEvents() {

      var iFilterUpdateTimer;

      dispatch.on('filterUpdate', function(oPayload) {

          console.log('dispatch filterUpdate', oPayload);

          clearTimeout(iFilterUpdateTimer);
          iFilterUpdateTimer = setTimeout(function(){
            
            dispatch.apply('applyFiltersOnData');

          }, 100);

      });

      // On Map Load
      // This event will only be triggered ONCE
      // 
      dispatch.on('mapLoaded.mapui', function(){

        // Once we are sure, we have the profile data loaded
        // 
        var iPostMapLoadInterval = setInterval(function(){

          if (DataManager.isLoaded()) {

            // Is Profile Feature Layer data ready?
            // 
            if (oCountiesGeoJSON) {
              
              clearInterval(iPostMapLoadInterval);

              dispatch.apply('dataLoaded');

            }

          }


        }, 100);

      });


    }

    initMap();

    initData();

    initUI();

    bindEvents();


})(window);