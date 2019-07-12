/**
 * Aux.js
 * 
 * Bind all UI Components and data model
 * 
 * @author Ashish Singh [GitHub](https://github.com/git-ashish)
 */

(function Aux() {

    var dispatch = d3.dispatch('filterUpdate', 'applyFiltersOnData', 'datasetRefreshed', 'mapLoaded', 'dataLoaded', 'updateProfileGeoJSON', 'adhocMetricUpdate', 'adhocUpdateDone', 'profile-features-joined', 'toggleBookmark', 'showProfileOnMap', 'resetFilters', 'switchView', 'wordtreeBeginUpdate', 'wordtreeLoaded', 'profilePopupShown'),
    sUrlProfile = 'data/viz/profile_with_comments.csv', //'data/viz/profile-data.csv',

    DataManager,

    map,

    oCountiesGeoJSON;


    // UI Layer
    // 
    function initUI() {

        // Define DOM elements/objects
        // 
        var oWordTree,
        elWordTree = document.getElementById('wordtree_graph');

        // Qual Text
        var Scattertext = QualText();

        // Define UI Filters
        // 

        var aFilters = [
            // Bookmarked
            //
            {
                id: '#filter_bookmarked',
                label: 'Display',
                type: 'dropdown',
                metric: '_isBookmarked',
                values: [{
                    label: 'All',
                    selected: true,
                    value: 'All'
                }, {
                    label: 'Bookmarked',
                    value: 'true'
                }, {
                    label: 'Not Bookmarked',
                    value: 'false'
                }]
            },

            // Scatterplot Matrix - Column Selection
            // 
            {
              id: '#filter_scatterplot_columns',
              label: 'Attributes to Corelate',
              type: 'multi-dropdown',
              metric: '_scatterplot_columns',
              isAdhoc: true,
              values: [/*{
                   label: 'Age', 
                   value: '_age',
              },
              {
                   label: 'Annual HHI', 
                   value: '_hhi',
              },
              {
                   label: 'Gender', 
                   value: 'Gender',
              },
              {
                   label: 'Own or Rent', 
                   value: 'Own-Rent',
              },
              {
                   label: 'Employment Status', 
                   value: 'Employment Status',
              },
              {
                   label: 'Annual Support Requests',
                   value: 'Annual Support Requests'
              },
              {
                   label: 'Purchased Protection',
                   value: 'Purchased Protection'
              },
              {
                   label: 'Ethnicity',
                   value: 'Ethnicity'
              },*/
              {
                   label: 'Hardware Score', 
                   value: 'Hardware Score',
                   selected: true
              },
              {
                   label: 'Software Score',
                   value: 'Software Score',
                   selected: true
              },
              {
                   label: 'Savviness Index', 
                   value: 'Savviness Index',
                   selected: true
              },
              {
                   label: '# of Devices with Protection Plans',
                   value: '# of Devices with Protection Plans'
              }]
            },

            // Is a Participant
            // 
            {
                id: '#filter_is_participant',
                label: 'Participant',
                type: 'dropdown',
                metric: '_isParticipant',
                values: [{
                    label: 'All',
                    value: 'All'
                }, {
                    label: 'Yes',
                    value: 'true',
                    selected: true
                }, {
                    label: 'No',
                    value: 'false'
                }]
            },

            // Scattertext filters
            //
            
            // Mode
            // 
            {
              id: '#filter_st_mode',
              label: 'Mode',
              type: 'dropdown',
              metric: 'st_mode',
              isAdhoc: true,
              values: [{
                label: 'Frequency',
                value: 'frequency',
                selected: true
              }, {
                label: 'Topics',
                value: 'empath'
              }, {
                label: 'Semiotic Square',
                value: 'semiotic'
              }]
            },
            // Category Column
            // 
            {
              id: '#filter_st_category_col',
              label: 'Category Column',
              type: 'dropdown',
              metric: 'categoryCol',
              isAdhoc: true,
              values: [{
                label: 'Segment',
                value: 'Segment',
                selected: true
              }, {
                label: 'Gender',
                value: 'Gender'
              }, {
                label: 'Ethnicity',
                value: 'Ethnicity'
              }, {
                label: 'Employment Status',
                value: 'Employment Status'
              }/*, {
                label: 'Purchased Protection',
                value: 'Purchased Protection'
              }*/, {
                label: 'Own-Rent',
                value: 'Own-Rent'
              }, {
                label: 'Perception of Protection',
                value: 'Perception of Protection'
              }]
            },

            // Category value
            // 
            {
              id: '#filter_st_category',
              label: 'Category',
              type: 'dropdown',
              metric: 'category',
              isAdhoc: true,
              values: []
            },

            // Category A value
            // 
            {
              id: '#filter_st_category_a',
              label: 'Category A',
              type: 'dropdown',
              metric: 'categoryA',
              isAdhoc: true,
              values: []
            },

            // Category B value
            // 
            {
              id: '#filter_st_category_b',
              label: 'Category B',
              type: 'dropdown',
              metric: 'categoryB',
              isAdhoc: true,
              values: []
            },

            // Neutral Categories
            // 
            {
              id: '#filter_st_neutral_categories',
              label: 'Neutral Categories',
              type: 'multi-dropdown',
              metric: 'neutralCategories',
              isAdhoc: true,
              values: []
            },
            
            // Category value
            // 
            {
              id: '#filter_st_min_term_frequency',
              label: 'Minimum Term Frequency',
              type: 'slider',
              metric: 'minTermFrequency',
              isAdhoc: true,
              value: 5,
              range: {
                  min: 1,
                  max: 20,
                  step: 1
              }
            },

            // ./ End Scattertext filters

            // Dimensions
            // 
            // Protection Opinion
            // 
            {
                id: '#filter_protection_opinion',
                label: '',
                type: 'dropdown',
                metric: 'Protection opinion',
                values: [{
                    label: "Product Opinion",
                    value: "All",
                    selected: true
                  }
                ]
            },

            // Tasks
            // 
            {
              id: '#filter_tasks',
              label: '', //Tasks
              type: 'multi-dropdown',
              metric: '_aTaskID',
              values: [{
                label: 'All',
                selected: true,
                value: 'All'
              },{
                label: "Intro Selfie",
                value: "1"
              },
              {
                label: "What is Home?",
                value: "2"
              },
              {
                label: "The Highs and Lows",
                value: "3"
              },
              {
                label: "To-Do List",
                value: "4"
              },
              {
                label: "Meet and Greet",
                value: "5"
              },
              {
                label: "Unlikely Best Friends",
                value: "6"
              },
              {
                label: "Boxes and Brochures",
                value: "7"
              },
              {
                label: "Technology Love and Technology Frustration",
                value: "8"
              },
              {
                label: "Log your Activities",
                value: "9"
              },
              {
                label: "Upgrading Versions",
                value: "10"
              },
              {
                label: "Warranties",
                value: "11"
              },
              {
                label: "In-Home Visit",
                value: "12"
              }]
            },
            
            // Adoption Score
            //
            {
                id: '#filter_hardware',
                label: 'Hardware Adoption',
                type: 'range-slider',
                metric: 'Hardware Score',
                isDataDriven: true,
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            },
            {
                id: '#filter_software',
                label: 'Software Adoption',
                type: 'range-slider',
                metric: 'Software Score',
                isDataDriven: true,
                range: {
                    min: 0,
                    max: 99,
                    step: 1
                }
            },
            {
                id: '#filter_savviness',
                label: 'Technology Savviness',
                type: 'range-slider',
                metric: 'Savviness Index',
                isDataDriven: true,
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
                isDataDriven: true,
                range: {
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
                metric: '_hhi',
                isDataDriven: true,
                isRangeValue: true,
                range: {
                    min: 0,
                    max: 100000,
                    step: 1
                }
            }, {
                id: '#filter_children',
                label: 'Children in Home',
                type: 'range-slider',
                metric: 'Children in Home',
                isDataDriven: true,
                range: {
                    min: 0,
                    max: 10,
                    step: 1
                }
            }, 
            // ZIP Code Associations
            // 
            {
                id: '#filter_zip_den',
                label: 'People per square mile',
                type: 'range-slider',
                metric: 'den',
                isAdhoc: true,
                isFeatureDriven: true,
                description: true,
                hasLegend: '#legend_den',
                step: 10,
                range: {
                    min: 0,
                    max: 157000,
                    step: 1
                }
            }, {
                id: '#filter_zip_unemp',
                label: 'Percentage',
                type: 'range-slider',
                metric: 'unemp',
                isAdhoc: true,
                isFeatureDriven: true,
                description: true,
                hasLegend: '#legend_unemp',
                range: {
                    min: 0,
                    max: 100,
                    step: 1
                }
            },

            // Usage
            // 
            {
                id: '#filter_annual_support',
                label: 'Annual Support Requests',
                type: 'range-slider',
                metric: '_support_req',
                isDataDriven: true,
                range: {
                    min: 0,
                    max: 10,
                    step: 1,
                    hasPlus: true
                }
            }, {
                id: '#filter_purchased_protection',
                label: 'Purchased Product',
                type: 'dropdown',
                metric: 'Purchased Protection',
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    }, {
                        label: "Yes",
                        value: "1"
                    },
                    {
                        label: "No",
                        value: "0"
                    }
                ]
            },{
                id: '#filter_num_device_protection',
                label: 'Devices with Product Plans',
                type: 'range-slider',
                metric: '# of Devices with Protection Plans',
                isDataDriven: true,
                range: {
                    min: 0,
                    max: 15,
                    step: 1
                }
            }, {
                id: '#filter_perception_protection',
                label: 'Perception of Product',
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
            }, { 
                id: '#filter_ethnicity',
                label: 'Ethnicity',
                type: 'multi-dropdown',
                metric: 'Ethnicity',
                isDataDriven: true,
                values: [{
                        label: "All",
                        value: "All",
                        selected: true
                    },{
                        label: "African American",
                        value: "African American"
                    }, {
                        label: "Asian",
                        value: "Asian"
                    }, {
                        label: "Caucasian",
                        value: "Caucasian"
                    },
                    {
                        label: "Hispanic/Latino",
                        value: "Hispanic/Latino"
                    },
                    {
                        label: "Mid-Eastern",
                        value: "Mid-Eastern"
                    },
                    {
                        label: "Pacific Islander",
                        value: "Pacific Islander"
                    },{
                        label: "Native American",
                        value: "Native American"
                    }
                ]
            }, { 
                id: '#filter_segments',
                label: 'Segments',
                type: 'multi-dropdown',
                metric: 'Segment',
                isDataDriven: false,
                values: [{
                  label: "All",
                  value: "All",
                  selected: true
                },
                  {label: "Segment A", value: "Tech Challenged"},
                  {label: "Segment B", value: "Own But Don't Operate"},
                  {label: "Segment C", value: "Young Operators"},
                  {label: "Segment D", value: "Own & Operate"}
                ]
            }

        ],

        oFiltersMap = d3.map(aFilters, function(d){
          return d.id;
        }),
        
        // Array of Filter instances
        // 
        aActiveFilters = [],

        // List of controls which need to be excluded
        // temporarily
        aExcludeFromActiveFilters = [],

        // Enable filters that are currenlty applicable here
        // by metric value
        // 
        aEnabledFilters = [
          '_isBookmarked',
          '_aTaskID',
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
          'den',
          'Ethnicity',
          'Segment',
          '_isParticipant',
          'Protection opinion',
          '# of Devices with Protection Plans',
          '_scatterplot_columns',
          // Scattertext filters
          'st_mode',
          'categoryCol',
          'category',
          'categoryA',
          'categoryB',
          'neutralCategories',
          'minTermFrequency'
        ],

        aDataDrivenFilters = aFilters.filter(function(oF){
          return oF.isDataDriven;
        }),

        aFeatureDrivenFilters = aFilters.filter(function(oF){
          return oF.isFeatureDriven;
        }),

        // Store reference to features of all profiles
        // 
        oProfileFeatures = {},

        bookmarkListTpl = d3.select('#profile_miniscore_tpl').html();
        
        Mustache.parse(bookmarkListTpl);

        // Create controls
        // 
        function initFilters() {

          // Initialize data driven filters
          // 
          initDataDrivenFilters();

          // Update Filters from Map
          // 
          aFilters = oFiltersMap.values();
          

          // Create Controls
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
                    value: values,
                    el: this
                  }])

                }else{

                  dispatch.apply('filterUpdate', null, [{
                      metric: oF.metric,
                      type: oF.type,
                      value: values
                  }]);

                }

              }

              oFilter.onselect = function(values) {

                // Don't trigger for adhoc filters
                // They handle their change via dispatches
                // 
                if (oF.isAdhoc) {

                  dispatch.apply('adhocMetricUpdate', null, [{
                    metric: oF.metric,
                    isAdhoc: true,
                    type: oF.type,
                    value: values,
                    el: this
                  }])

                }

              }

          });

          // Exclude any Filters based on the default View
          // Currently based on Recruitment view 
          aExcludeFromActiveFilters = [
            '_aTaskID',
            '_isParticipant'
          ];

        }

        // Initialize data driven filters
        // 
        function initDataDrivenFilters() {

          var aData = DataManager.getMainSet();

          aData.forEach(function(d){

            // For every filter
            // 
            aDataDrivenFilters.forEach(function(oF){

              if (oF.type == 'dropdown' || oF.type == 'multi-dropdown') {
                // Create an array of values
                // 
                if (d[oF.metric]) {

                  oF.values = oF.values || [{
                    label: 'All',
                    value: 'All',
                    selected: true
                  }];

                  oF.values.push({
                    label: _.capitalize(d[oF.metric]),
                    value: d[oF.metric]
                  });

                }

              }else if(oF.type == 'range-slider'){

                // Define a range property
                // 
                if (d[oF.metric]) {

                  oF._values = oF._values || [];

                  // is isRangeValue
                  // 
                  if (oF.isRangeValue) {
                    oF._values.push(parseFloat(d[oF.metric].min) || 0);
                    oF._values.push(parseFloat(d[oF.metric].max) || 0);
                  }else{
                    oF._values.push(parseFloat(d[oF.metric]) || 0);
                  }

                }

              }

            });

          });

          // Make the filter values Unique
          // and Update filters map
          // 
          aDataDrivenFilters.map(function(oF){

            if (oF.type == 'dropdown' || oF.type == 'multi-dropdown') {

              oF.values = d3.map(oF.values, function(d){
                return d.value;
              }).values();
              
            }else if(oF.type == 'range-slider'){


              var aExtent = d3.extent(oF._values || []),
              // only max to 10 when value is large
              step = aExtent[1] < 100 ? 1 : Math.round(Math.max(aExtent[1]/10, 1));

              delete oF._values;

              oF.range = {
                min: Math.min(0, aExtent[0]),
                max: Math.max(aExtent[1], step * 10),
                // max 10 steps
                step: step
              }

            }

            // Update original filter
            // 
            oFiltersMap.set(oF.id, oF);

          });

        }

        // Initialize feature based filters
        // 
        function initFeatureBasedMetrics(aGeoJSON) {

          aGeoJSON.features.forEach(function(f){

            aFeatureDrivenFilters.forEach(function(oF){

              if(oF.type == 'range-slider'){

                // Define a range property
                // 

                oF._values = oF._values || [];

                oF._values.push(parseFloat(f.properties[oF.metric]) || 0);

              }

            })

          });

          // Make the filter values Unique
          // and Update filters map
          // 
          aFeatureDrivenFilters.map(function(oF){

            if(oF.type == 'range-slider'){

              var aExtent = d3.extent(oF._values || []),
              // only max to 10 when value is large
              step = aExtent[1] < 100 ? 1 : Math.round(Math.max(aExtent[1]/10, 1));

              delete oF._values;

              oF.range = {
                min: aExtent[0],
                max: Math.round(Math.max(aExtent[1], step * 10)),
                // max 10 steps
                step: step
              }

            }

            // Update original filter
            // 
            oFiltersMap.set(oF.id, oF);

          });
          
        }

        // Apply active filters on the dataset
        // oFiltersMap
        function applyFilters() {

          // Build filter objects
          // 
          
          // AdHoc Filters should be skipped as they handle their
          // filtering separately ( not directly bound to profile dataset )
          // property isAdhoc = true
          // 
          var _aFilters = aActiveFilters.filter(function(oF){
            // Also exclude any explicitly excluded filters
            // 
            
            var s = oF.getState();
            
            return !s.isAdhoc && aExcludeFromActiveFilters.indexOf(s.metric) == -1;

          }).map(function(oF){
            return oF.getState();
          });

          // TODO
          // Do this in a Worker
          // 
          DataManager.setQuerySet( applyFiltersOnData(_aFilters, DataManager.getMainSet()) );

          //console.log('Filtered Data', DataManager.getQuerySet());

          // Dispatch info and new dataset
          // 
          dispatch.apply('datasetRefreshed', null, [DataManager.getQuerySet()]);
          
        }

        // Reset all defined filers
        // 
        function resetFilters() {

          // Reset every active filter
          aActiveFilters.forEach(function(oF){
            oF.reset();
          });
          
          // Update results
          // 
          dispatch.apply('applyFiltersOnData');

          // Reset Zip Filter
          // 
          jQuery('#filter_zip li[default]').trigger('click');
        }

        // Show a list of Bookmarked Profiles
        // 
        function showBookmarkList(aBookmarkIds) {

          var target = jQuery('#bookmarked_items .bookmarked-profiles'),
          aData;

          // reset
          // 
          target.html('');

          // Get Profiles with features
          // 
          
          aData = oProfileFeatures.values().filter(function(f){
            return aBookmarkIds.indexOf(f.properties.ID) > -1;
          }).map(function(d){
            return getProfileWithMetaProperties(d.properties);
          });

          target.html(Mustache.render(bookmarkListTpl, {
            profiles: aData
          }));

          // Bind Events
          // 

          target.find('li').off('click').on('click', function(){
            // Show Large profile on the Map
            // 
            var id = this.getAttribute('data-id'),
            oData = oProfileFeatures.get(id);

            oData.properties.isActiveProfile = true;

            // dispatch
            // 
            dispatch.apply('showProfileOnMap', null, [oData]);

            // Add an active class on the li
            // 
            jQuery(this).siblings().removeClass('active');
            jQuery(this).addClass('active');

          });

        }

        // Update Filter Panel UI
        //
        function updateFilterPanel(obj) {

          // Update Record Count
          // 
          if (obj && obj.recordCount != undefined) {

            // Update Record Count
            d3.selectAll('[data-id="record-count"]')
              .html(obj.recordCount);

            // Update Participant Count
            d3.select('#participant-count')
              .html(obj.recordCount);

          }

          // Update Word Count
          // 
          if (obj && obj.wordCount != undefined) {

            d3.select('#word-count')
              .html(obj.wordCount);

          }

          // Update Bookmark Count
          // 
          d3.select('#bookmark-count')
            .html(DataManager.getBookmarkCount());
          
        }

        // Update Box plot for Dimension Protection opinion
        // 
        function initBoxplot(aData) {

          function getData() {
            return aData.map(function(d){
              return d['Protection opinion'] || 0;
            });
          }

            var dataArr = getData();

            var chartRange = d3.extent(dataArr);

            var totalWidth = 280,
                totalHeight = 55,
                margin = {
                    top: 10,
                    right: 0,
                    bottom: 30,
                    left: 0
                },
                width = totalWidth - margin.left - margin.right,
                height = totalHeight - margin.top - margin.bottom;

            var chart = d3v3.box()
                .value(function(d) {
                    return d;
                })
                .width(width)
                .height(height)
                .domain([chartRange[0], chartRange[1]]);

            var xScale = d3v3.scale.linear()
                // this is the data x values
                .domain([chartRange[0], chartRange[1]])
                // this is the svg width
                .range([0, width]);

            d3v3.select('#filter_protection_opinion_bp').html('');

            var svg = d3v3.select('#filter_protection_opinion_bp').selectAll('svg')
                .data([dataArr])
                .enter().append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)
                    .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .call(chart);

            //svg.call(chart);

            if (!svg.select('g.x.axis').node()) {
              // axis
              var xAxis = d3v3.svg.axis()
                  .scale(xScale)
                  .orient('bottom')
                  .ticks(10);

              // add axis
              svg.append('g')
                  .attr('class', 'x axis')
                  .attr('transform', 'translate(0,' + (height + 10) + ')')
                  .call(xAxis);
            }
        }

        // Initialize the Word Tree
        // 
        function initWordTree() {

          var aData = DataManager.getQuerySet(),
          oText = buildProfileTranscriptText(aData);

          updateFilterPanel({
            recordCount: aData.length,
            wordCount: oText.wordCount
          });

          if(!oWordTree){

            // init word tree
            oWordTree = WordTree(elWordTree, {
              text: oText.text
            });

            // attach onready
            oWordTree.onready(function(){
              dispatch.apply('wordtreeLoaded');
            });

            oWordTree.onupdate(function(){
              dispatch.apply('wordtreeBeginUpdate');
            });

          }else{
            updateWordTree(oText.text);
            oWordTree.resize();
          }

        }

        // Initialize the Scatterplot Matrix
        // 
        function initScatterPlotMatrix() {
          
          var renders = {
            "viewof d3radius": "#filter_scatterplot_hexbinradius",
            "graph": "#scatterplotmatrix",
          };
          for (let i in renders){
            renders[i] = document.querySelector(renders[i]);
          }


          // Load the notebook, observing its cells with a default Inspector
          // that simply renders the value of each cell into the provided DOM node.
          var runtime = new window.observable.Runtime();

          var notebookModule = runtime.module(window.observable.notebook, (variable) => {
            if (renders[variable]){
              return new window.observable.Inspector(renders[variable]);
            }
            if (variable === "width") {
              
            }
            
            // Force evaluation of all the other cells in the notebook.
            //return true;
          });

          // Dimension of the chart
          // 
          notebookModule.redefine("width", [], Math.min($("#scatterplotmatrix").height(), $("#scatterplotmatrix").width()));

          // Profile popover
          // 
          notebookModule.redefine("onHover", [], function(){
            return (
              function onHover(d){

                // do we have data?
                // 
                if(d){

                  delete d.x;
                  delete d.y;
                  if(d.length){
                    var el = Popup.miniPopup(d, true);
                    $('#ptooltip .content').html(el);
                    $('#ptooltip').show();
                  }
                }else{
                  $('#ptooltip').hide();
                }
              }
            )
          });

          dispatch.on('profilePopupShown.scatterplotmatrix', function(el){

            if(getActiveView() === 'quantitative-corelation'){
              $('#ptooltip .content').html(el);
              $('#ptooltip').show();
            }else{
              $('#ptooltip').hide();
            }

          });


          // Update chart when dataset gets filtered
          // 
          dispatch.on('datasetRefreshed.scatterplotmatrix', function(aData){

            notebookModule.redefine("data", [], aData);

          });


          // Update variables to corelate
          // 
          dispatch.on('adhocMetricUpdate.scatterplotmatrix', function(oPayload){
            notebookModule.redefine("matrixcolumns", [], oPayload.value);
          });


        }

        // Update the text of the Word Tree
        // 
        function updateWordTree(sText) {
          if (oWordTree && getActiveView() == 'qualitative-tree') {
            oWordTree.update(sText);
          }
        }

        // Init UI for Qualitative Text
        // 
        function initQualText() {

          var elContainer = d3.select('#qualtext'),
          iframe = elContainer.select('iframe'),
          host = '34.94.121.136',
          serverURL = 'http://'+host+':8282/html/';

          // Get a list of data driven filters by metric
          var oDataFilterByMetricMap = d3.map(oFiltersMap.values(), function(d){ return d.metric; }),
          oFilterInstanceByMetricMap = d3.map(aActiveFilters, function(oF){ return oF.config.metric; }),
          _aFilters = ['st_mode', 'categoryCol', 'category', 'categoryA', 'categoryB', 'neutralCategories', 'minTermFrequency'],
          isCategorySet = !!oFilterInstanceByMetricMap.get('category').config.value;

          // Listen for messages
          Scattertext.onmessage(function (result) {
            
            console.log('Message from server ', result);
        
            if(result.type == 'uuid'){
              // Change focus to the output tab
        
              // reload the iframe
              // currently used for making the vis render
              // based on actual window size
              iframe.attr("src", serverURL+result.msg+".html");
        
              //$("#loader").addClass("hidden");
            }
          });
        
          Scattertext.onerror(function (event) {
            console.log('Scattertext Server Error:', event);
          });

          Scattertext.onclose(function (event) {
            alert('Connection to Scattertext server closed! Please refresh.');
          });

          // Update chart when dataset gets filtered
          // 
          dispatch.on('datasetRefreshed.qualtext', null);
          dispatch.on('datasetRefreshed.qualtext', function(aData){

            if(getActiveView() != 'qualitative-text'){
              return;
            }

            if(!aData.length){
              alert('No data records match current filter settings.');
              return;
            }
            
            // Get scattertext
            triggerST(aData, generateConfig());

          });

          dispatch.on('adhocMetricUpdate.qualtext', function(oPayload){
            
            // if a filter for scattertext is changed
            var filterMetric = oPayload.metric;

            if(_aFilters.indexOf(filterMetric) == -1){
              return;
            }

            setupFilters(oFilterInstanceByMetricMap.get('st_mode').config.value);

            // If Category Column is changed, update the Category filter
            if(filterMetric == 'categoryCol' && oDataFilterByMetricMap.has(oPayload.value)){
              var oCF = oFilterInstanceByMetricMap.get('category'),
              oCAF = oFilterInstanceByMetricMap.get('categoryA'),
              oCBF = oFilterInstanceByMetricMap.get('categoryB'),
              oCNF = oFilterInstanceByMetricMap.get('neutralCategories'),

              aValues = oDataFilterByMetricMap.get(oPayload.value).values;

              if(oCF && aValues && aValues.length){

                aValues = aValues.filter(function(d){
                  return d.value != 'All';
                }).map(function(d){
                  delete d.selected;
                  return d;
                });
                aValues[0].selected = true;
                
                oCF.config.values = aValues;
                oCF.setDefaultValue(aValues).reset();

                // For Semiotic filters
                oCAF.config.values = aValues;
                oCAF.setDefaultValue(aValues).reset();
                
                var bSelected=false;
                oCBF.config.values = aValues.map(function(d){
                  d.selected = bSelected ? false : (bSelected = d.value != oCAF.config.value);
                  return d;
                });
                oCBF.setDefaultValue(aValues).reset();
                
                oCNF.config.values = aValues.map(function(d){
                  d.selected = [oCAF.config.value, oCBF.config.value].indexOf(d.value) == -1;
                  return d;
                });
                oCNF.config.value = getSelectedValues(oCNF.config.values);
                oCNF.setDefaultValue(aValues).reset();

                isCategorySet = true;
              }
            }

            // Get scattertext
            triggerST(DataManager.getQuerySet(), generateConfig());

          });

          function getSelectedValues(aF){
            return aF.filter(function(d){ return d.selected; }).map(function(d){ return d.value; });
          }

          function generateConfig(){
            var oConfig = {};
            _aFilters.forEach(function(sMetric){
              var oFM = oFilterInstanceByMetricMap.get(sMetric).config;
              if(oFM.type != 'multi-dropdown'){
                oConfig[sMetric] = oFM.value;
              }else{
                if(Array.isArray(oFM.value)){
                  oConfig[sMetric] = oFM.value;
                }else{
                  oConfig[sMetric] = getSelectedValues(oFM.values);
                }
              }
            });

            return oConfig;
          }

          function setupFilters(st_mode){

            $('[filter-st-mode]:not([filter-st-'+st_mode+'])').addClass('filter--hidden');
            $('[filter-st-mode][filter-st-'+st_mode+']').removeClass('filter--hidden');

          }

          var sTimeout;
          function triggerST(aData, oConfig){

            if(!isCategorySet){
              jQuery('#filter_st_category_col select').chosen().trigger("change");
              return;
            }

            var size = elContainer.node().getBoundingClientRect(),
            padding = 30;
            
            clearTimeout(sTimeout);
            sTimeout = setTimeout(function(){
              console.log(oConfig);
              var isSemiotic = oConfig.st_mode == 'semiotic';
              Scattertext.sendRequest(aData.filter(function(d){ return d._st_text; }), {
                textCol: oConfig.textCol || '_st_text',
                categoryCol: oConfig.categoryCol,
                category: oConfig.category,
                isEmpath: oConfig.st_mode == 'empath',
                isSemiotic: isSemiotic,
                categoryA: oConfig.categoryA,
                categoryB: oConfig.categoryB,
                neutralCategories: oConfig.neutralCategories,
                removeStopwords: true,
                categoryName: oConfig.category,
                notCategoryName: 'Not ' + oConfig.category,
                minTermFrequency: +oConfig.minTermFrequency,
                width: size.width - padding*(isSemiotic ? 15 : 1),
                height: size.height - padding*(isSemiotic ? 4 : 1)
              });
            }, 500);

          }
          
        }

        // Switch the UI View
        function switchView(sView) {
          
          switch(sView){

            case 'qualitative-tree':
              
              initWordTree();

              break;

            case 'quantitative-corelation':

              initScatterPlotMatrix();

              break;

            case 'qualitative-text':

              initQualText();

              break;

          }

          // Toggle Filters
          toggleFiltersBasedOnView(sView);
          
        }

        // Some filters need to be disabled
        // for certain view
        // 
        function toggleFiltersBasedOnView(sView) {

          if (sView == 'recruitment') {

            aExcludeFromActiveFilters = ['_aTaskID', '_isParticipant', 'Protection opinion'];

          }else if (sView == 'qualitative-tree') {

            aExcludeFromActiveFilters = ['_isParticipant', '_isBookmarked', 'Protection opinion'];

          }else if (sView == 'quantitative') {

            aExcludeFromActiveFilters = ['_isParticipant', '_isBookmarked', '_aTaskID'];

          }else if (sView == 'participants') {

            aExcludeFromActiveFilters = aEnabledFilters.filter(function(f){
              // exclude all except these
              return ['Segment', '_aTaskID', '_isParticipant'].indexOf(f) == -1; 
            });

          }

          // Reset filters which have been excluded
          // such that there full range of values are considered
          // 
          
          // Update results
          // 
          dispatch.apply('applyFiltersOnData');
          
        }

        // Toggle loading state of the UI
        // 
        function toggleLoading(bLoading) {
          
          if (bLoading) {
            jQuery('body').attr('data-loading', true);
          }else{
            jQuery('body').removeAttr('data-loading');
          }

        }



        // Event Binding
        // 
        
        // Listen to requests for Filtering dataset
        // 
        dispatch.on('applyFiltersOnData.aux', function(){

          //console.log('Filtering Dataset');

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

          // Update Boxplot filter
          // 
          initBoxplot(aData);

        });

        // Listen for Dataset update and Update Word Tree
        // if its active
        // 
        dispatch.on('datasetRefreshed.wordtree', function(aData){

          var oText = buildProfileTranscriptText(aData);

          updateFilterPanel({
            recordCount: aData.length,
            wordCount: oText.wordCount
          });

          updateWordTree(oText.text);

        });

        dispatch.on('adhocUpdateDone.ui', function(oPayload){

          updateFilterPanel({
            recordCount: oPayload.count
          });

        });

        var firstTime = true;
        dispatch.on('dataLoaded.ui', function(){
          
          // Update Count
          // 
          updateFilterPanel({
            recordCount: DataManager.getQuerySet().length
          });

          // Initialize Data Driven Filters
          // 
          initFilters();

          // Show currently bookmarked profiles
          // 
          showBookmarkList( DataManager.getBookmarks() );

          if(firstTime){
            firstTime = false;
            switchView(getActiveView());
          }

        });

        dispatch.on('toggleBookmark.ui', function(){
          updateFilterPanel();

          // Show currently bookmarked profiles
          // 
          showBookmarkList( DataManager.getBookmarks() );
        });

        // Reset all filters to their init positions
        // 
        dispatch.on('resetFilters.ui', function(){

          resetFilters();

        });

        // Word Tree is ready for interaction
        dispatch.on('wordtreeLoaded.ui', function(){
          toggleLoading(false);
        });

        // Word Tree is being updated
        dispatch.on('wordtreeBeginUpdate.ui', function(){
          toggleLoading(true);
        });

        // Handle switch view
        // 
        dispatch.on('switchView.ui', function(sView){

          switchView(sView);

        });

        // Profile dataset has been joined with Map
        // Called only once
        // 
        dispatch.on('profile-features-joined.ui', function(aGeoJSON){

          // prepare a ProfileID - feature map
          // 
          oProfileFeatures = d3.map(aGeoJSON.features, function(d){
            return d.properties.ID;
          });

          initFeatureBasedMetrics(aGeoJSON);

          // Enable the Vis
          // 
          jQuery('body').removeClass('loading');

        });

        // Add Keyboard navigation support to the Bookmarked list items
        // 
        jQuery('body').off('keydown').on('keydown', function(e){

          var target = jQuery('#bookmarked_items .bookmarked-profiles'),
          selected = target.find('li.active'),
          li,
          isVisible = !!target.parent(':visible').length;

          // only process further if Bookmared tabs is open
          // 
          if (!isVisible) {
            return;
          }

          selected = selected.length ? selected : target.find('li:first-child');

          if (selected.length) {
            if ([37,38].indexOf(e.keyCode) > -1) { // up / left
              
              selected.removeClass("active");
              if (selected.prev().length == 0) {
                  li = selected.siblings().last();
              } else {
                  li = selected.prev();
              }
            }
            if ([39, 40].indexOf(e.keyCode) > -1) { // down / right
                selected.removeClass("active");
                if (selected.next().length == 0) {
                    li = selected.siblings().first();
                } else {
                    li = selected.next();
                }
            }

            if (li.length) {
              li.trigger('click');
            }
          }

        });

        // Enable View Switching
        // 
        var uiSwitch = jQuery('.filter-panel-switch select').chosen();
        uiSwitch.change(function(e){

          // set active view value as an attribute
          // on body.
          // 
          d3.select('body')
            .attr('data-view', this.value);

          dispatch.call('switchView', null, this.value);

        });


    }

    // Initialise Mapping
    // 
    function initMap() {

      var aAdhocMapMetrics = ['den', 'unemp'];

      // Create Map
      // 
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-99.9, 41.5],
        zoom: 3,
        maxZoom: 12
      });

      // Add zoom and rotation controls to the map.
      // 
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

      // Create Popup control
      // 
      var mapPopup = new mapboxgl.Popup({closeOnClick: false}),
      iCountyZoomThreshold = 4,
      // Lets not show the dots
      iClusterZoomThreshold = 13,
      // store all profile markers currently added to the map
      aProfileMarkersOnMap = [];

      map.on('load', function() {

        // Dispatch map load event
        dispatch.apply('mapLoaded');

      });

      // Share dispatch with Popup
      // 
      Popup.setDispatch(dispatch);

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

        // 1. Filter features where our profiles are situated.
        // 
        var aFeatureGeo = getFeaturesFromGeoID(oCountiesGeoJSON.features, aGeoID);
        
        //console.log("Found features", aFeatureGeo, 'aMissingZCTA' , aGeoID/*, aZipUnique*/);

        // 3. Get centroid of GeoJSON features
        // 
        var aFeatureCentroids = getActiveView('quantitative') ? getRandomPointInGeo(aFeatureGeo) : getGeoCentroid(aFeatureGeo);
        
        //console.log('Centroid Geo Features', aFeatureCentroids);

        // 4. Build a Map of properties.GEOID to feature
        // 
        var oGEOIDFeature = d3.map(aFeatureCentroids, function(f){
            return f.properties.GEOID;
        });

        // 5. Add a Point feature for every profile
        // 
        var aProfileCentroids = aProfiles.map(function(p){
            // Find the GEOID via lookup
            // 
            var oF = oGEOIDFeature.get(DataManager.getZIP2GEOID(p._zip)),
            oProfileF;

            // if feature is found,
            // add profile properties to the feature
            // 
            if (oF) {
              oProfileF = _.cloneDeep([oF])[0];
              oProfileF.properties = Object.assign(oProfileF.properties, p);
            }

            return oProfileF;
        }).filter(function(p){
            return !!p;
        });

        // 6. Build a GeoJSON data source
        // 
        var aGeoJSON = getFeatureCollectionFromFeatures(aProfileCentroids);

        //console.log('GeoJSON', aGeoJSON);

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
        var aGeoJSON = aProfileFeatures = buildProfileFeatureData(true);
        
        setupProfileClusterLayer(aGeoJSON);

        // 6. Add the Counties layer
        // 
        setupCountyLayer(oCountiesGeoJSON);

        // 7. Add layers for Opinion heatmap - Quantitative analysis
        // 
        setupQuantitativeLayer(aGeoJSON);

        // Setup metrics which depend on Feature-Profile Join Data
        // 
        dispatch.apply('profile-features-joined', null, [aGeoJSON]);

      }

      function setupProfileClusterLayer(aGeoJSON) {
          
          // Add a new source from our GeoJSON data and set the
          // 'cluster' option to true. GL-JS will add the point_count property to your source data.
          map.addSource("profiles", {
              type: "geojson",
              data: aGeoJSON || [],
              cluster: true,
              // Max zoom to cluster points on
              clusterMaxZoom: iClusterZoomThreshold,
              // Radius of each cluster when clustering points (defaults to 50)
              clusterRadius: 50
          });

          map.addLayer({
              id: "clusters",
              type: "circle",
              source: "profiles",
              filter: ["has", "point_count"],
              paint: {
                  "circle-color": "#ef6548", //"#666",
                  "circle-radius": [
                    'interpolate',
                    ['linear'],
                    ['get', 'point_count'],
                    5, 10,
                    100, 40,
                    1000, 50
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

          // When a Cluster Marker is clicked
          // 
          map.on('click', 'clusters', function (e) {
              var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
              var clusterId = features[0].properties.cluster_id,
              point_count = features[0].properties.point_count,
              clusterSource = map.getSource('profiles');

              var coordinates = features[0].geometry.coordinates.slice();

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              clusterSource.getClusterExpansionZoom(clusterId, function (err, zoom) {
                  if (err)
                      return;

                  map.easeTo({
                      center: features[0].geometry.coordinates,
                      zoom: zoom
                  });
              });

              // Get cluster's direct children
              // 
              clusterSource.getClusterLeaves(clusterId, point_count, 0, function(err, aFeatures){

                /*
                mapPopup.setDOMContent(Popup.miniPopup(aFeatures.map(function(d){ return d.properties; })))
                  .setLngLat(coordinates)
                  .addTo(map);
                */

                showPopupOnMap(coordinates, Popup.miniPopup(aFeatures.map(function(d){ return d.properties; })));

              });

          });

          // When an unclustered point is clicked
          // 
          map.on('click', 'unclustered-point', function (e) {
            // set bbox as 5px reactangle area around clicked point
            //var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];

            var coordinates = e.features[0].geometry.coordinates.slice(), //[e.lngLat.lng, e.lngLat.lat],
            aFeatures = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });

            showPopupOnMap(coordinates, Popup.miniPopup(aFeatures.map(function(d){ return d.properties; })), true);

          });
          
          // Set on Profile click function
          // 
          Popup.onProfileclick(function(allProfiles){

            var el = Popup.profilePopup({
              profiles: allProfiles, 
              isActiveProfile: true
            });

            mapPopup.setDOMContent(el);

            // dispatch event
            // 
            dispatch.apply('profilePopupShown', null, [el]);

          });

          map.on('mouseenter', 'clusters', function () {
              map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'clusters', function () {
              map.getCanvas().style.cursor = '';
          });
          map.on('mouseenter', 'unclustered-point', function () {
              map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'unclustered-point', function () {
              map.getCanvas().style.cursor = '';
          });

          // Event Binding
          // 

          // When new data update is available, update the datasource
          // 
          dispatch.on('updateProfileGeoJSON.cluster-layer', function(aProfilesGeoJSON){

            map.getSource("profiles")
              .setData(aProfilesGeoJSON);


            // only add when active view is Participants
            if (getActiveView('participants')) {
              addProfileMarkersToMap(aProfilesGeoJSON);
            }

          });

      }

      // Setup heatmap layers for Quantitative analysis
      // 
      function setupQuantitativeLayer(aGeoJSON) {

        var bVisible = getActiveView('quantitative');

        // Add a new source from our GeoJSON data and set the
        map.addSource("profiles-quant", {
            type: "geojson",
            data: aGeoJSON || []
        });

        map.addLayer({
            "id": "profiles-quant-heat",
            "type": "heatmap",
            "source": "profiles-quant",
            "maxzoom": 9,
            "layout": {
              "visibility": bVisible ? 'visible' : 'none'
            },
            "paint": {
                // Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get", "Protection opinion"],
                    0, 0,
                    10, 1
                ],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 1,
                    9, 3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(33,102,172,0)",
                    0.1, "yellow",
                    1, "red"
                    /*
                    0, "rgba(33,102,172,0)",
                    0.2, "rgb(103,169,207)",
                    0.4, "rgb(209,229,240)",
                    0.6, "rgb(253,219,199)",
                    0.8, "rgb(239,138,98)",
                    1, "rgb(178,24,43)"
                    */
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 2,
                    9, 20
                ],
                // Transition from heatmap to circle layer by zoom level
                "heatmap-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, 1,
                    9, 0
                ],
            }
        }, 'waterway-label');

        map.addLayer({
            "id": "profiles-quant-point",
            "type": "circle",
            "source": "profiles-quant",
            "minzoom": 7,
            "layout": {
              "visibility": bVisible ? 'visible' : 'none'
            },
            "paint": {
                // Size circle radius by opinion and zoom level
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, [
                        "interpolate",
                        ["linear"],
                        ["get", "Protection opinion"],
                        1, 1,
                        10, 4
                    ],
                    16, [
                        "interpolate",
                        ["linear"],
                        ["get", "Protection opinion"],
                        1, 5,
                        10, 50
                    ]
                ],
                // Color circle by opinion
                "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "Protection opinion"],
                    1, "yellow",  //"rgba(33,102,172,0)",
                    //2, "rgb(103,169,207)",
                    //3, "rgb(209,229,240)",
                    //4, "rgb(253,219,199)",
                    //5, "rgb(239,138,98)",
                    10, "red" //"rgb(178,24,43)"
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 0,
                // Transition from heatmap to circle layer by zoom level
                "circle-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, 0,
                    8, 1
                ]
            }
        }, 'waterway-label');

        // Event Binding
        // 

        map.on('mouseenter', 'profiles-quant-heat', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'profiles-quant-heat', function () {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'profiles-quant-point', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'profiles-quant-point', function () {
            map.getCanvas().style.cursor = '';
        });

        // When heat layer is clicked
        // 
        map.on('mouseenter', 'profiles-quant-point', function (e) {
          // set bbox as 5px reactangle area around clicked point
          //var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
          
          var coordinates = e.features[0].geometry.coordinates.slice(), //[e.lngLat.lng, e.lngLat.lat],
          aFeatures = map.queryRenderedFeatures(e.point, { layers: ['profiles-quant-point'] });

          showPopupOnMap(coordinates, Popup.miniPopup(aFeatures.map(function(d){ return d.properties; })), true);

        });

        // When new data update is available, update the datasource
        // 
        dispatch.on('updateProfileGeoJSON.heatmap-layer', function(aProfilesGeoJSON){

          // only add when active view is Quantitative
          if (getActiveView('quantitative')) {
            map.getSource("profiles-quant")
              .setData(aProfilesGeoJSON);
          }

        });

      }

      /**
       * Draw a marker for each profile on the map
       * 
       * @param {array} profile features array
       */
      function addProfileMarkersToMap(oFeatureGeo) {

        removeProfileMarkers();

        // add markers to map
        oFeatureGeo.features.forEach(function(marker) {
          
          // create a DOM element for the marker
          var el = Popup.miniPopup([marker.properties]);

          // add marker class
          // 
          d3.select(el)
            .classed('profile-marker', true);
          
          el.addEventListener('click', function() {

            // content is already set via profile's row element
            // inside popup.js
            // 
            mapPopup
              .setLngLat(this.geometry.coordinates)
              .addTo(map);

          }.bind(marker));

          // add marker to map
          aProfileMarkersOnMap.push(
            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates)
              .addTo(map)
          );
          
        });
      }

      /**
       * Remove any existing markers from the map
       */
      function removeProfileMarkers() {
        aProfileMarkersOnMap.forEach(function(marker){
          marker.remove();
        });
      }

      function setupCountyLayer(aGeoJSON) {

        var oFilters = {
          'unemp': [
                  'interpolate',
                  ['linear'],
                  ['get', 'unemp'],
                  0, '#f7fbff',
                  1, '#deebf7',
                  2, '#c6dbef',
                  4, '#9ecae1',
                  8, '#6baed6',
                  16, '#4292c6', 
                  32, '#2171b5',
                  64, '#08519c'
              ],

          'den': [
                  'interpolate',
                  ['linear'],
                  ['get', 'den'],
                  1,'#f7fcf5',
                  10,'#e5f5e0',
                  50,'#c7e9c0',
                  200,'#a1d99b',
                  500,'#74c476',
                  1000,'#41ab5d',
                  2000,'#238b45',
                  4000,'#006d2c',
                  250000,'#00441b'
              ]
        };

        /*
        // 
        1, "#fff7ec", 
        10, "#fee8c8", 
        50, "#fdd49e", 
        200, "#fdbb84", 
        500, "#fc8d59", 
        1000, "#ef6548", 
        2000, "#d7301f", 
        4000, "#b30000", 
        250000, "#7f0000"
         */

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
          'minzoom': iCountyZoomThreshold,
          'type': 'fill',
          //'filter': ['==', 'isCounty', true],
          'paint': {
              'fill-color': oFilters['den'],
              'fill-opacity': 0.75
          }
        }, 'waterway-label');

        // Event Binding
        // 

        // When new data update is available, update the datasource
        // 
        var iLayerFilterUpdateTimer;
        dispatch.on('adhocMetricUpdate.county-layer', function(oPayload){

          // check if metric is applicable to maps
          // 
          if(aAdhocMapMetrics.indexOf(oPayload.metric) == -1){
            return false;
          }

          clearTimeout(iLayerFilterUpdateTimer);

          iLayerFilterUpdateTimer = setTimeout(function(){

            // Update Paint fill of layer
            // 
            map.setPaintProperty("county-metric", "fill-color", oFilters[oPayload.metric]);

            // Set Filter
            // 
            map.setFilter("county-metric", null);
            map.setFilter("county-metric", ['all', ['>=', oPayload.metric, oPayload.value.min], ['<=', oPayload.metric, oPayload.value.max]]);

            // Update Profiles based on matching features
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

      // Show Popup on the map
      // 
      function showPopupOnMap(coordinates, domContent, bFlyMap) {
        
        mapPopup
          .setLngLat(coordinates)
          .setDOMContent(domContent)
          .addTo(map);

        if (bFlyMap) {
          // Center map on the point
          // 
          map.flyTo({center: coordinates});
        }
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

      // Show a Profile Popup on Map
      // 
      dispatch.on('showProfileOnMap.map', function(oProfile){
        //console.log('Profile', oProfile);

        // Mark as active
        // 
        var el = Popup.profilePopup({
          profiles: [oProfile.properties], 
          isActiveProfile: true
        });

        showPopupOnMap(
          oProfile.geometry.coordinates.slice(), 
          el,
          true
        );

        dispatch.apply('profilePopupShown', null, [el]);

      });

      // Handle switch view
      // 
      dispatch.on('switchView.map', function(sView){

        // Switch the UI View
        // Remove markers for views except Participants
        // 
        if (sView != 'participants') {
          removeProfileMarkers();
        }

        if (sView != 'qualitative-tree') {
          // trigger resize to allow map to attain its size
          // 
          setTimeout(function(){
            try {
              window.dispatchEvent(new Event('resize'));
            }catch(e){
              var resizeEvent = window.document.createEvent('UIEvents'); 
              resizeEvent.initUIEvent('resize', true, false, window, 0); 
              window.dispatchEvent(resizeEvent);
            }
          }, 1);
        }

        // Toggle Map layers
        // 
        var bQuant = sView == 'quantitative',
        bParticipants = sView == 'participants';

        ['clusters', 'cluster-count', 'unclustered-point', 'county-metric'].forEach(function(sLayer){
          map.setLayoutProperty(sLayer, 'visibility', (bQuant || bParticipants) ? 'none' : 'visible');
        });

        ['profiles-quant-heat', 'profiles-quant-point'].forEach(function(sLayer){
           map.setLayoutProperty(sLayer, 'visibility', bQuant ? 'visible' : 'none');
        });

      });

      // Remove Popup on Esc
      // 
      document.addEventListener('keydown', onKeyDown);

      function onKeyDown(e) {
        // If the ESC key is pressed
        if (e.keyCode === 27) {
          // remove Popup from the map
          // 
          mapPopup.remove();
        }
      }

    }

    // Initialise Data loading
    // 
    function initData(){

      DataManager = DataModel(sUrlProfile);
      
      DataManager.then(function(aQueryDataset){

        //console.log('Aux - data loaded', aQueryDataset);
        
        //initMap();

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

          //console.log('dispatch filterUpdate', oPayload);

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


      // On Bookmark Toggle
      // 
      dispatch.on('toggleBookmark.mapui', function(oPayload){

        if (oPayload) {
          DataManager.toggleBookmark(oPayload.ID);
        }

      });

      // Menu Toggle
      // 
      jQuery('#toggle_menu').click(function() {
        jQuery(this).toggleClass('active');
        jQuery('#overlay').toggleClass('open');
      });

      // Menu Action Items
      // 
      jQuery('#filterpanel_menu li').on('click', function(e){

        var action = jQuery(this).attr("data-action");

        if (action == "copyurl") {

          copyToClipboard(generateBookmarkURL(DataManager.getBookmarks()));
          alert('Bookmark URL Copied');

        }else if (action == "clearbookmarks") {
          
          DataManager.clearBookmarks();
          dispatch.apply('toggleBookmark');

        }else if (action == "resetFilters") {

          dispatch.apply('resetFilters');

        }

        // Close the menu
        jQuery('#toggle_menu').trigger('click');

      });

      // Tab Click Events
      // 
      jQuery('.md-tabs > li').on('click', function(){
          // remove active class from siblings
          // 
          var $this = jQuery(this),
          siblings = $this.siblings(),
          siblingA = siblings.find('a'),
          targetId = $this.find('a').attr('data-target')
          $target = jQuery(targetId);

          siblings.removeClass('active');

          // mark clicked tab as active
          // 
          $this.addClass('active');

          // Toggle visibility of target contents
          // 
          siblingA.each(function(){
              jQuery(jQuery(this).attr('data-target')).hide();
          });

          // Show target content
          // 
          jQuery(targetId).show();

          // For Zip Code Association Metrics, trigger events
          // 
          if ($this.hasClass('adhoc-metric')) {


            dispatch.apply('adhocMetricUpdate', null, [{
              metric: $this.attr('data-metric'),
              value: {
                min: parseInt($target.find('input[readonly][data-min]').val()),
                max: parseInt($target.find('input[readonly][data-max]').val())
              }
            }]);

          }
      });

      // Menu Button
      var menuBtn = jQuery('#menu_btn');
      menuBtn.on('click', function (){
        
        menuBtn.toggleClass('open');

        jQuery('#filter_panel').toggleClass('open');

      });

      // Close #ptooltip
      // 
      jQuery('#ptooltip .mapboxgl-popup-close-button').on('click', function(){
        jQuery('#ptooltip').hide();  
      });


    }

    bindEvents();

    initMap();

    initData();

    initUI();


})(window);