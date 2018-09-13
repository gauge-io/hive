/**
 * Aux.js
 * 
 * Bind all UI Components and data model
 * 
 * @author Ashish Singh [https://github.com/git-ashish](GitHub)
 */

(function Aux() {

    var dispatch = d3.dispatch('filterUpdate', 'applyFiltersOnData', 'datasetRefreshed', 'mapLoaded', 'dataLoaded'),
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
                id: '#filter_decision',
                label: 'Decision Maker',
                type: 'dropdown',
                metric: 'Decision Maker',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Yes",
                        value: "Yes"
                    },
                    {
                        label: "No",
                        value: "No"
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
                range: {
                    //TODO - derive from data
                    min: 0,
                    max: 20,
                    step: 1
                }
            }, {
                id: '#filter_zip_unemp',
                label: 'Unemployment Rate',
                type: 'range-slider',
                metric: 'une',
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
                id: '#filter_adop_device',
                label: 'Device Adoption Score',
                type: 'range-slider',
                metric: 'Device Adoption Score',
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            }, {
                id: '#filter_adop_software',
                label: 'Software Adoption Score',
                type: 'range-slider',
                metric: 'Software Adoption Score',
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            }, {
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
            },

            // Consent
            // 
            {
                id: '#filter_video_diaries',
                label: 'Video Diaries',
                type: 'multi-dropdown',
                metric: 'Video Diaries',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Smartphone, no assistance",
                        value: "Smartphone, no assistance"
                    },
                    {
                        label: "No Smartphone",
                        value: "No Smartphone"
                    },
                    {
                        label: "Smartphone, with assistance",
                        value: "Smartphone, with assistance"
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
          'Annual Support Requests'//,
          //'Purchased Protection'
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

              dispatch.apply('filterUpdate', null, [{
                  metric: oF.metric,
                  type: oF.type,
                  value: values
              }]);

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
      var maxValue = 13;

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
        // data/TopoJSON/mapshaper/us_counties_final-topo.json
        // data/GeoJSON/counties/cb_2017_us_zcta510_500k_1per.json
        
        d3.json("data/TopoJSON/mapshaper/us_counties_final-geo.json").then(function(oGeoJSON){

            //console.log('oTopo', oTopo);
            //
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

      function buildProfileFeatureData() {

        var aProfiles = DataManager.getMainSet(),
        aZipUnique = getUniqueZipFromProfile(aProfiles);

        // 1. Filter features where our profiles are situated.
        // 
        var aFeatureGeo = getFeaturesFromZip(oCountiesGeoJSON.features, aZipUnique);

        console.log("Found features", aFeatureGeo, 'aMissingZCTA' , aZipUnique);

        // 3. Get centroid of GeoJSON features
        // 
        var aFeatureCentroids = getGeoCentroid(aFeatureGeo);

        console.log('Centroid Geo Features', aFeatureCentroids);

        // 4. Build a Map of properties.zcta to feature
        // 
        var oZCTAFeature = d3.map(aFeatureCentroids, function(f){
            return f.properties.ZCTA;
        });

        // 5. Add a Point feature for every profile
        // 
        var aProfileCentroids = aProfiles.map(function(p){
            // TODO
            // Find the ZCTA via lookup
            // 
            return oZCTAFeature.get(p._zip);
        }).filter(function(p){
            return !!p;
        });

        // 6. Build a GeoJSON data source
        // 
        var aGeoJSON = getFeatureCollectionFromFeatures(aProfileCentroids);

        console.log('GeoJSON', aGeoJSON);

        // 5. Add the data source to map with clustering
        // 
        setupProfileClusterLayer(aGeoJSON);

      }

      function setupProfileClusterLayer(aGeoJSON) {
          
          // Add a new source from our GeoJSON data and set the
          // 'cluster' option to true. GL-JS will add the point_count property to your source data.
          map.addSource("profiles", {
              type: "geojson",
              data: aGeoJSON,
              cluster: true,
              // Max zoom to cluster points on
              clusterMaxZoom: 14,
              // Radius of each cluster when clustering points (defaults to 50)
              clusterRadius: 50
          });

          map.addLayer({
              id: "clusters",
              type: "circle",
              source: "profiles",
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
                      "#51bbd6",
                      10,
                      "#f1f075",
                      75,
                      "#f28cb1"
                  ],
                  "circle-radius": [
                      "step",
                      ["get", "point_count"],
                      20,
                      2,
                      30,
                      5,
                      40
                  ]
              }
          });

          map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "profiles",
              filter: ["has", "point_count"],
              layout: {
                  "text-field": "{point_count_abbreviated}",
                  "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                  "text-size": 12
              }
          });

          map.addLayer({
              id: "unclustered-point",
              type: "circle",
              source: "profiles",
              filter: ["!", ["has", "point_count"]],
              paint: {
                  "circle-color": "#11b4da",
                  "circle-radius": 4,
                  "circle-stroke-width": 1,
                  "circle-stroke-color": "#fff"
              }
          });


      }


      // Event Binding
      // 

      dispatch.on('dataLoaded.map', function(){
        buildProfileFeatureData();
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