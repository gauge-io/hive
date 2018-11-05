/**
 * Aux.js
 * 
 * Bind all UI Components and data model
 * 
 * @author Ashish Singh [GitHub](https://github.com/git-ashish)
 */

(function Aux() {

    var dispatch = d3.dispatch('filterUpdate', 'applyFiltersOnData', 'datasetRefreshed', 'mapLoaded', 'dataLoaded', 'updateProfileGeoJSON', 'adhocMetricUpdate', 'adhocUpdateDone', 'profile-features-joined', 'toggleBookmark', 'showProfileOnMap', 'resetFilters', 'switchView'),
    sUrlProfile = 'data/viz/profile-data.csv',

    DataManager,

    map,

    oCountiesGeoJSON;


    // UI Layer
    // 
    function initUI() {

        // Define DOM elements/objects
        // 
        var oWordTree;

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
                    label: 'Yes',
                    value: 'true'
                }, {
                    label: 'No',
                    value: 'false'
                }]
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
                label: 'Purchased Protection',
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
                label: 'Devices with Protection Plans',
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
            }

        ],

        oFiltersMap = d3.map(aFilters, function(d){
          return d.id;
        }),
        
        // Array of Filter instances
        // 
        aActiveFilters = [],

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
          '# of Devices with Protection Plans'
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

          // Enable UI
          // 



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

              oFilter.onselect = function(values) {

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

                }

              }

          });

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


              var aExtent = d3.extent(oF._values),
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

              var aExtent = d3.extent(oF._values),
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
            return !oF.getState().isAdhoc;
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

          if (obj && obj.recordCount) {

            // Update Record Count
            // 
            d3.select('#record-count')
              .html(obj.recordCount);

          }

          // Update Bookmark Count
          // 
          d3.select('#bookmark-count')
            .html(DataManager.getBookmarkCount());
          
        }

        // Initialize the Word Tree
        // 
        function initWordTree() {

          //var sText = "Response Second segment First segment Im not typically a person who purchases extended warranties but I have in the past. I dont organize the info in a specific way and I have no idea when anything expires. Tech frustration: my printer doesnt like me. I try printing wirelessly, through a usb connection, through the HP app...nothing works well. And when I finally do get it to print something from a pc or phone Im always out of ink. Of all the technology in my house, this printer consistently fails me and its annoying whenever I have to print. Love technology: I was at a resort this past weekend with other family members and didnt know the area. A combination of google maps, Waze, yelp, open table and weather helped make the weekend less stressful on everyone. Loved my phone and being able to find solutions in real time. Online upgrades part 2 Online upgrades part1 My friends passed off a Amazon dot to us on Tuesday. I set it up in the bathroom for shower music. Echo devices are supposed to be able to syce music together for whole house audio. Apparently this does not work with Bluetooth speakers connected, so in my case, none of my speakers will sync. Grrrr, minus 3 points for Amazon. Wireless printing is amazing! To be able to work on my resume on Google docs (on any device) and cloud print via wifi is super handy. Score one for technology. I started keeping boxes when I bought my home and started outfitting it. It quickly got overwhelming. Then I stopped keeping them all and started just keeping boxes for expensive things or things I felt would break at some point (ie cell phones, printers, headphones), eventually that became overwhelming. I now try to hold on the the boxes for a month or less, then just the paperwork if it seems worthwhile. I know what you are thinking. Well maybe. My guess is either wow thats a lot of dust, which I agree with. Or, so is it worth it to save them? 98% of the time no. The product either works fine, or at least works fine I till the warranty expires. Even in the case it breaks while the warranty is in force, I have found the internet is the best way to find the information and contact the company, then they dont usually even want you to sent the box. As I write this I realize how futile it is to save this stuff. Maybe I should just start taking pictures of the stuff that matters and save it in its own album online.... Then after the research at Apple.com I would go to the Verizon store to price out what an upgrade would cost especially since the features between the 3 are so similar. 'One thing that frustrates me about technology is when you really need it to work and it acts up. For instance as you can see above I have 3 emails on my Office 365 app - my school, my work, and my boss. I can also see all the calendars merged into one. The one problem with this is that, like today, if my boss changes his password for some reason it kicks me off all my emails until I put in the new password. My other option is deleting his account and then adding it after I talk to him. Another issue I have been having is that I cannot see two of the other attorneys calendars which I could before when I was a clerk. To remedy this we had to put a call into the people that do IT for the whole firm bc they are familiar with network permissions.'This picture depicts everything I hate about technology. Im a part time server still and this is an image I see in reality at least 5 times a weekend. People are so caught up in technology that they dont really interact with people anymore. Because I observe this a the time I try to set rules when my friends or family go out to dinner...no phones! One thing I love about technology today is how everything is connected wirelessly through Bluetooth and the internet. I love that I can listen to my music while stuck in rush hour traffic and switch stations on voice command. The iPhone just had an update that allows Siri to interact with Pandora and Siri can be accessed through my car via Bluetooth. Having all my favorite tunes comes in clutch for the hour commute each way to work usually in rush hour. I hate technology - I was playing Xbox the other day and the controller died. I didnt have any fresh AA batteries so I had to go scour the house for something to borrow them from. Also the remote for my soundbar is dead and I cant get the little door open to access the batteries. Lithium batteries are starting to feel so old fashioned and annoying. Looking for a new TV you had some trouble with our printer this week, called tech support but did not have any success. Ordered a new printer on eBay 😑 Sunday pre game, enjoying Sunday football on our TV... favorite day of the week! Boxes, manuals Shopping My ever growing book of passwords! I hate technology for the constant changing of passwords! It seems I never have the correct one. I have tried Vaults and other Keeper apps but when the time comes for the password I find myself having to constantly reset as I have forgotten the current password. I love technology! 14 hours of audio book on audible in the car on a road trip this weekend! Made the time fly!! Sorry Im not really a saver. I look everything up on the internet. Upgrade contd iPhone Xs Max Shopping Extended I left my laptop cord in the hotel room and I use it for everything so now I have to wait for a replacement. It sucks I really depend on it This is an app on my phone it keeps us ahead of what the river is doing and updates frequently Upgrading from a Galaxy Amp 2, to a Galaxy Amp Prime. Would consider a warranty, but usually dont but them. Just want standard features, nothing special at a decent affordable price. Random This is a photo of my piece of crap blue ray player that stopped working last night resulting in me not watching a movie resulting in me being charged another night at redbox. Lol. So technology is awesome when youre running late to work and forgot your wallet and are starving. My credit card is loaded into my phone and I can buy food at lots of places with an ap! Junk drawer manuals! Short video Cell Shopping for a Tmobile phone Shopping for a New Tmobile Phone Shopping for a Tmobile phone I hate my dumb thermostat. It did not come on and the house is 82 degrees. Time to get a Smart Thermostat. I have to manual turn it up and down. I love Technology. Google Maps on my phone saved me by getting me to a destination I could not find Old warranties and manuals Heres the error message. It plays cds! Here are the details. Does it play cds? Good memory New I want something new with decent memory. 'I tried to video screen record this but I kept getting error messages. I contacted the help desk but never heard back. In case my friend isnt able to fix my laptop, I will need to get a new laptop. My boyfriend suggested I look at Dell.'Packaging and brochures for my Bose Sleepbuds I love technology! Im able to find and pay for parking ahead of time. That way Im not driving around looking for parking. I hate technology! My laptop is dead and I dint know why. Shopping for a laptop upgrade Warranties 'Why do I hate technology? Memory is never big enough!'Why do I love technology? Because Im able to take pictures and share them immediately with friends and familia. Me in the store. You can see the excitement in my eyes. This is the model Id buy (and almost did). You can see all the specs and I would also add on the Apple Care - well worth the $99 in my humble opinion. Im very familiar with the iPad and didnt need to ask for help. I do like the Retina display and the ProMotion technology but have no idea what that is or how it works but it looks damn cool! Going through the various options. I have a budget in mind so I narrow it down to the 10.5 w/ 64GB. This would be my 3rd iPad so Im pretty familiar with options and what I like/want. Thats the one but I wouldnt buy the stylus, waaay overpriced Heres the iPad Im looking at - 2nd from left, the 10.5 model. Walking into the Apple store to purchase an iPad. 'Technology Love - I love that I can set the alarm on my Apple Watch and it wont wake up my wife. Because the alarm is actually a vibration, you dont have to wake up to an audible alarm. Definitely more pleasant that way.'Technology Frustration - Apple chargers do not hold up well. The cable easily gets nicks/splits and exposes the wiring. One of the few knocks against Apple. 'Two Factor Authentication I love the ease of TFA between my devices. I can access these via both my phone and watch. Although not pictured, the TFAs come to my watch also.''Two Factor Authentication Computer screen shot'Boxes - Video 1 Love technology! My study group decided to take a quiz later today, but I havent seen the lectures yet. Ill was out at the park and then a baby shower, so I didnt have the ability to sit down at a computer to watch. Luckily I can access the class on my phone through the schools app! I was able to watch the lecture, and plan on taking the quiz later when I get home. I hate technology. My automatic light dimmer and timer has not been functioning with the app on my phone. With products like this, there doesnt seem to be a lot of tech support. I have to shut the whole tanks electric power system down, and restart it so I can try to connect to the Bluetooth on the lights. Now its 270 dollars gone bc there is no warranty offered on it 'The reason I upgraded iPhone was bc its water resistant We upgraded sound system bc it has the imax quality He is in charge of that part'I dont know if this really qualifies as an ‘I hate technology ‘ post, but...we have zero choice here in our neighborhood for internet providers. Comcast owns us and they are well aware. Our bill for internet is $112 a month, our service is sketchy at best and I work from home about 15 hours a week. If I try to post or upload anything I have to walk out to the room that has the Xfinity/Comcast device to complete whatever I am trying to do. Very frustrating. I wish there was some competition around here because I think our quality and service would greatly improve. Frustration! We are on a mini vacation/some work too. We decided to drive to Taos and the Internet is barely usable anywhere. Which is fine, its good to unplug but I am so dependent on using it for directions! Also, I rarely keep warranty cards, etc...because the Verizon store, Costco, the places we usually buy our electronics keep records of purchases so I dont have to. Tv shopping on line Love technology! Get Upside is a new app that gives money back on gas purchases at gas station you pick from app. Locked out of account. Trying to help my son complete his new hire paperwork. He tried guessing his password to many times before opting to choose forgot password. Having to wait a while for account to unlock to try resetting password. If that does not work, I will make him call his new employer in the morning. Usually a website will unlock after about 15 minutes. The Indeemo app makes me love technology Computer brochures Brochure hunting Brochures Brochures Upgrade Help please The rest of the story! Its a little over the 10 minutes....please let me know if I need to redo it! 'Only 2 warranties in my house.  Both on my cell phone and my husband cell phone. I dont have the paperwork but can look it up on tmobile. It doesnt expire since I pay for it every month. Anything else that would have come with a warranty would have been the manufacturers warranty only and they have all expired....even the car!😁'Housley: Upgrading Versions - how I would choose and purchase a new computer online 10/10/18. Housley: When technology can be so frustrating 10/9/18. Housley loves technology 'Kelly Housley: boxes and brochures. Disorganized, but try to keep everything I think I may need to do anything with or get information from.'Technology Frustration No Go For Warranties Part two...looking at micro center Video from target.com 'My main technology frustration...our slow internet!!! We live in area that doesnt have good, fast options. Ugh!'Heres my video about boxes and brochures...of which I have nothing to show you...once I know something works, all packing materials and brochures are outta here! If I need information, I go online for it. Cellphone Upgrade Upgrade browsw My Tech Love is my IPad...its because its MY iPad, my son had his iPad and always have little complaint every time I needed to use it , however I had a tablet at one time and everybody wanted to use it and when it started to mess up nobody wants to take responsibility for it, so my wonderful uncle in Georgia bought me an iPad and sent it to me. Its my iPad, no ones allowed to use it and I just love it. You have seen it several times here right now Im using it to stream cable however I love it cuz I get to do shopping on the internet Ivel actually have done work from work at home on my iPad, I dont have a desktop the only other love technology that I have is my cellphone, like I said before its my mini assistant so it was nice to get a second assistant type which is my iPad New TV..maybe next year Upgrading AppleCare ...and this, do not work. This.... Or this isnt working.... When this isnt working.... 'Peace of mind Freedom Never alone Sony A7III Stunning images Enhanced capabilities Beautiful memories'Warranties. AppleCare Box for recent hair dryer purchase Boxes Manuals Warranties I hope this is what you wanted. Tech support contacted me and I started getting a different error message to I did the best I could holding the phone and recording with it. Hello, I am trying to work on this task and I am getting this error message. How can I get around this? I dont have anything else open. Thanks for any advise you can give I recorded a video of my process to look for a new laptop for my daughter. Video seemed easier than screen capture and honestly I would not typically do a lot of research on my phone. Too small and the browsers arent as easy to work in. This is my nightmare. It requires at least two remotes to turn on anything because the universal remote controls volume but no other features if the receiver. Add in that I accidentally hit the off button instead of the on button on said universal remote...it took three remotes to get my DirectTV on so I could record a show 😒 I did in fact try to use the app on my phone instead, which should be much quicker. But for some reason the app would.not.load. So apparently this TV and receiver talk to each other and I dont have to tell the receiver which source is playing sound! Who knew? And a lifesaver when trying to start the dvd for my 4 nieces and nephew, all under the age of 10. Patience is not their virtue Shopping for a laptop Frustrated will the technology. So when taking a picture on my phone to upload for my task, my pictures wont display in your app. I retrieved my work cell phone, took the snapshot and texted it to my cell phone I am using for this project. BMX racing. Thanks to my cell phones camera capabilities I was able to take videos and pictures of my 3year old grandson racing his BMX bike. Makes my heart Happy and I love sharing this with friends and family. Boxes 'Technology Frustration AND Technology Love (over the same issue): for the last task tonight (Upgrades) I got carried away with shopping and my second video was too long. First, I uploaded it anyway hoping Indeemo would just cut it off at 10 minutes but the Indeemo screen was just black after the upload. So I canceled it and googled how to edit the video down to under 10 minutes. At first I thought I would have to do the whole thing again and it would be much less spontaneous. So I was super happy when I finally figured out how to trim and save. Yay me.''Upgrading Versions Part 2: Scoping out HDTV smart TV upgrade. Sorry, it was too long so I trimmed the last 27 seconds! All youre missing is my endless rant about a warranty term. Also, Im adding this task to my diary of frustrating tech moments because I didnt know how to trim 😬'Upgrading Versions: Part 1, Desktop PC TV upgrade This wireless remote technology saved my day. We had my in-laws over for dinner Sunday and I had to have a brisket smoked and ready to eat on time. To get that done I had to start the brisket on the smoker at midnight. If you have never smoked a brisket it takes a lot of attention to cook it probably. The remote devise was on my night stand and sound the alarm when the meat reached a programmed temperature. The other end of this devise was in the meat and it operates up to 300 ft. I was up at 130 and 430 to care for the brisket. Without this devise I would not been able to smoke the brisket overnight without staying up all night. This devise saved the day. Brochures and Boxes TiVo conclusion TiVo shopping I scrapbooked all day on my computer. I had a good time and got a lot of pages done. My phone is on do not disturb and the volume is set to see zero and it still rings! Not cool at theaters out church! Warranties part 2 Keeping manuals The Process to Buy a Television Went all day in meetings and kept up with emails and texts without the obvious and distracting phone or computer in front of me. The S3 watch was technology in action. Love it! Packaging and stuff iPhone upgrade planned for February 2019.";
          
          var sText = buildProfileTranscriptText(DataManager.getQuerySet());

          if(!oWordTree){

            // init word tree
            oWordTree = WordTree(document.getElementById('wordtree_graph'), {
              text: sText
            });

          }else{
            updateWordTree(sText);
          }

        }

        // Update the text of the Word Tree
        // 
        function updateWordTree(sText) {
          if (oWordTree) {
            oWordTree.update(sText);
          }
        }

        // Switch the UI View
        function switchView(sView) {
          
          // set active view value as an attribute
          // on body.
          // 
          d3.select('body')
            .attr('data-view', sView);

          switch(sView){

            case 'qualitative':
              
              initWordTree();

            break;

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

        });

        // Listen for Dataset update and Update Word Tree
        // if its active
        // 
        dispatch.on('datasetRefreshed.wordtree', function(aData){

          updateWordTree(buildProfileTranscriptText(aData));

        });

        dispatch.on('adhocUpdateDone.ui', function(oPayload){

          updateFilterPanel({
            recordCount: oPayload.count
          });

        });

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

          dispatch.call('switchView', null, this.value);

        });

    }

    // Initialise Mapping
    // 
    function initMap() {

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
      iClusterZoomThreshold = 13;

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
        var aFeatureCentroids = getGeoCentroid(aFeatureGeo);

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

            mapPopup.setDOMContent(

              Popup.profilePopup({
                profiles: allProfiles, 
                isActiveProfile: true
              })

            );
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

        map.on('click', 'county-metric' function(e) {
          // set bbox as 5px reactangle area around clicked point
          var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
          var features = map.queryRenderedFeatures(bbox, { layers: ['county-metric'] });

          // Run through the selected features and set a filter
          // to match features with unique FIPS codes to activate
          // the `counties-highlighted` layer.
          var filter = features.reduce(function(memo, feature) {
              memo.push(feature.properties.GEOID);
              return memo;
          }, ['in', 'GEOID']);

          map.setFilter("county-highlighted", filter);
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

        showPopupOnMap(
          oProfile.geometry.coordinates.slice(), 
          Popup.profilePopup({
            profiles: [oProfile.properties], 
            isActiveProfile: true
          }),
          true
        );

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


    }

    bindEvents();

    initMap();

    initData();

    initUI();


})(window);