/**
 * Utility functions
 * 
 */

// Polyfills
// 
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/**
 * Sanitize a USPS ZIP Code
 *
 * 1. Shorten it: 66217-9570 should become 66217
 * 2. Complete it: 9570 should become 09570
 */
function getSanitizedZip(sZip) {
  if (!sZip) {
    return null;
  }
  // 1.
  if (sZip.length != 5) {
    return _complete(sZip);
  }

  return sZip;

  // 2.
  function _complete(sZipShort) {
    if (sZipShort.length < 5) {
      var fill = d3.range(5 - sZipShort.length),
        aFiller = [];
      fill.forEach(function() {
        aFiller.push(0);
      });
      return aFiller.join('') + sZipShort;
    }

    return sZipShort.slice(0, 5);
  }
}

/**
 * Get Unique Zip Codes from Profiles data
 * @param  {[type]} aProfiles [description]
 * @return {[type]}           [description]
 */
function getUniqueZipFromProfile(aProfiles) {
  
  var aZip = aProfiles.map(function(d){
      return d._zip;
  });
  
  return _.uniq(aZip);
}

/**
 * Get Unique GEOID Codes from Profiles data
 * @param  {[type]} aProfiles [description]
 * @return {[type]}           [description]
 */
function getUniqueGEOIDFromProfile(aProfiles) {
  
  var aGEOID = aProfiles.map(function(d){
      return d._GEOID;
  });
  
  return _.uniq(aGEOID);
}



/**
 * Get GeoID from ZIP using iterator
 * We are using the DataManager getZIP2GEOID() as iterator
 * @param  {array} aZipUnique 
 * @param  {function} fnIterator 
 * @return {array}            
 */
function getGeoIDFromZip(aZipUnique, fnIterator) {

  return aZipUnique.map(fnIterator);
  
}

function getZCTAFromZip(aZipUnique, fnIterator) {

  return aZipUnique.map(fnIterator);
  
}

/**
 * Get Topologies for Zip codes
 * @param  {TopoJSON} aTopologies 
 * @param  {array}    aZip        Unique Zip code
 * @return {array}                Topologies
 */
function getTopoFromZip(aGeometry, aZip) {

  return aGeometry.filter(function(g) {
    var index = aZip.indexOf(g.properties.ZCTA);
    if (index > -1) {
      aZip.splice(index, 1);
      return true;
    }
    return false;
  });
}

function getFeaturesFromZip(aFeatures, aZip) {
  return aFeatures.filter(function(g) {
    var index = aZip.indexOf(g.properties.ZCTA);
    if (index > -1) {
      aZip.splice(index, 1);
      return true;
    }
    return false;
  });
}

function getFeaturesFromZCTA(aFeatures, aZip) {
  return aFeatures.filter(function(g) {
    var index = aZip.indexOf(g.properties.ZCTA);
    if (index > -1) {
      aZip.splice(index, 1);
      return true;
    }
    return false;
  });
}

function getFeaturesFromGeoID(aFeatures, aGeoID) {
  return aFeatures.filter(function(g) {
    var index = aGeoID.indexOf(g.properties.GEOID);
    if (index > -1) {
      aGeoID.splice(index, 1);
      return true;
    }
    return false;
  });
}


/**
 * Convert topolgies to GeoJSON features
 * @param  {array} aTopologies 
 * @return {array} GeoJSON Features 
 */
function topo2Geo(aTopologies, aTopoArcs) {

  function simpleTopology(object) {
    return {
      type: "Topology",
      transform: { scale: [1, 1], translate: [0, 0] },
      objects: { foo: object },
      arcs: aTopoArcs
    };
  }

  var aGeo = [];

  aTopologies.map(function(t) {

    var oTopoGeometry = simpleTopology(t);

    aGeo.push(topojson.feature(oTopoGeometry, oTopoGeometry.objects.foo));

  });

  return aGeo;

}

/**
 * Get Centroid of a GeoJSON feature
 * @param  {array} aFeatures
 * @return {array} aFeature with type Point
 */
function getGeoCentroid(aFeatures) {

  return aFeatures.map(function(f, i) {
    // Coordinates must have numbers
    // 
    var centroid;
    try {
      centroid = turf.centroid(f, f.properties);
    } catch (e) {
      console.log('[Error turf.centroid]', e.message);
    }
    return centroid;
  }).filter(function(c) {
    return !!c;
  });
}

/**
 * Get a FeatureCollection from a set of Features | GeoJSON
 * @param  {Array} aFeatures Features
 * @return {JSON}           FeatureCollection
 */
function getFeatureCollectionFromFeatures(aFeatures) {
  return turf.featureCollection(aFeatures);
}

/**
 * Package an array of GeoJSON features into a FeatureCollection
 * @param  {array}  aFeatures
 * @return {JSON}
 */
function packageFeatures2Collection(aFeatures) {

}


/**
 * Apply a set of filters on a dataset.
 * Filters are AND 
 * @param  {Array} aFilters Array of filter Objects
 * @param  {Array} aData    Profile Dataset
 * @return {Array}          Filtered dataset. Does NOT modifies the input.
 */
function applyFiltersOnData(aFilters, aData) {

  var aFilteredData = _.cloneDeep(aData),
    aBooleanFilters = [];

  // Loop for each filter type
  // and build boolean functions
  // 

  aFilters.forEach(function(oF) {

    // Type of filter.
    // Determines how its value properties should be treated.
    // Supported types - range-slider, dropdown, multi-dropdown, checkbox
    // 
    var sType = oF.type;

    try {

      if (sType == 'range-slider') {

        try {

          /**
           * value is an object with two properties min & max
           */
          aBooleanFilters.push(function(d) {

            var b;

            try {

              b = oF.isRangeValue ? (d[oF.metric].min >= oF.value.min && d[oF.metric].max <= oF.value.max) : (d[oF.metric] >= oF.value.min && d[oF.metric] <= oF.value.max);

            } catch (e) {
              console.log('ERROR', 'boolean', e.message);
            }

            return !!b;

          });


        } catch (e) {
          console.log('ERROR', 'boolean filters', e.message);
        }

      } else if (sType == 'dropdown') {

        // If value is 'All', return true
        // 
        if (oF.value == 'All') {
          return true;
        }

        try {

          /**
           * value is string
           */
          aBooleanFilters.push(function(d) {

            var b;

            try {

              b = (d[oF.metric]).toString() == oF.value;

            } catch (e) {
              console.log('ERROR', e.message);
            }

            return !!b;

          });


        } catch (e) {
          console.log('ERROR', e.message);
        }

      } else if (sType == 'multi-dropdown') {

        /**
         * value an Array of String
         */
        aBooleanFilters.push(function(d) {

          // Empty Array or 'All' in the value means all are selected
          // 
          if (!oF.value.length || oF.value.indexOf('All') > -1) {
            return true;
          }

          var b;

          try {

            // Two possibilities -
            // 1. When the metric value is not an array
            // 2. When the metric value is an array
            // 
            if (Array.isArray(d[oF.metric]) && d[oF.metric].length) {  // 2.
              b = _.difference(d[oF.metric], oF.value).length < d[oF.metric].length;
            }else{  // 1.
              b = oF.value.indexOf(d[oF.metric]) > -1;
            }

          } catch (e) {
            console.log('ERROR', e.message);
          }

          return !!b;

        });

      } else if (sType == 'checkbox') {

        /**
         * value boolean
         */
        aBooleanFilters.push(function(d) {

          var b;

          try {

            b = oF.value == !!d[oF.metric];

          } catch (e) {
            console.log('ERROR', e.message);
          }

          return !!b;

        });

      }

    } catch (e) {
      console.log('ERROR', 'Filter', oF, e.message);
    }

  });

  // Apply functions on the dataset
  // 

  aFilteredData = aFilteredData.filter(function(d) {

    var bPass = true,
      i = aBooleanFilters.length - 1;

    while (i > -1 && bPass) {
      bPass = bPass && aBooleanFilters[i--](d);
    }

    return bPass;

  });


  return aFilteredData;

}

/**
 * Using profile data, create a text from their transcript info
 * @param  {array}  aProfiles Profiles
 * @return {string}           Transcript text
 */
function buildProfileTranscriptText(aProfiles) {

  return aProfiles.map(function(d){
    return d._transcript;
  }).join('\n');
  
}

/**
 * Get a list of tech savviness points for a profile
 * @param  {object} oProfile [description]
 * @return {[type]}          [description]
 */
function getTechSavvinessPoints(oProfile) {

  var aPoints = [];

  // 1. Acts as a Tech Support person?
  // 
  if (oProfile['Tech Support Person'] == 'Me') {
    aPoints.push('Acts as a Tech Support person');
  }

  if (oProfile._support_req.min > 0) {
    aPoints.push(oProfile['Annual Support Requests'] + ' annual support requests');
  }

  aPoints.push(oProfile['# of Devices with Protection Plans'] + ' devices with protection');

  aPoints.push('Perception of Protection - ' + oProfile['Perception of Protection']);

  return aPoints;
  
}


/**
 * Get a list of profile IDs from URL
 */
function getBookmarksFromURL() {

  var aBookmarkedIDs = [];
  
  try{

    var slug = window.location.href || '',
    // entry after bookmakrked keyword
    aSlug = slug.split('bookmarked=');

    aBookmarkedIDs = aSlug[1] ? aSlug[1].replace(/[\ \#]/gi, '').split(',') : [];

  }catch(e){
    console.log('ERROR', e.message);
  }

  return aBookmarkedIDs;

}

/**
 * Generate a Bookmark URL
 * @param  {array} aBookmarkedIDs Array of Profile IDs to bookmark
 * @return {string}                
 */
function generateBookmarkURL(aBookmarkedIDs) {
  var slug = window.location.href || '',
  // entry after bookmakrked keyword
  aSlug = slug.split('?');

  return [aSlug[0], '?', 'bookmarked=', (aBookmarkedIDs || []).join(',')].join('');
}


function copyToClipboard(str) {
  try {
    var el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    var selected =            
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
  }catch(e){
    console.log('ERROR', e.message);
  }
};

/**
 * Truncate a string over a given length and add ellipsis if necessary
 * @param {string} str - string to be truncated
 * @param {integer} limit - max length of the string before truncating
 * @return {string} truncated string
 */
function truncate(str, limit) {
  limit = limit || 20;
  return (str.length > limit) ? str.substr(0, limit-1) + '...' : str;
}


function getProfileAvatar(sGender, sEthinicty) {
  // Ethinicty to Image mapping
  // Values are for images based in images/avatars
  // 
  var oEthinicityImageMap = {
    "African American": "african-american",
    "Asian": "asian",
    "Caucasian": "caucasian",
    "Hispanic/Latino": "hispanic",
    "Mid-Eastern": "mid-eastern",
    "Pacific Islander": "pacific-islander",
    "Native American": "other",
    "Other": "other"
  },
  imagePath = 'images/avatars/';

  var img = oEthinicityImageMap[sEthinicty] || oEthinicityImageMap['Other'];
  // Add gender version
  // 
  return imagePath + img + '-' + (sGender == 'Male' ? 'male.png' : 'female.png');
  
}

// Add meta properties to a profile data
// required for presentation in Large Profile Popup 
// 
function getProfileWithMetaProperties(d, isActiveProfile) {
  return Object.assign(d, {
    // small profile meta
    // 
    avatar: getProfileAvatar(d['Gender'], d['Ethnicity']),
    hs: Math.round(d['Hardware Score']),
    ss: Math.round(d['Software Score']),
    ts: Math.round(d['Savviness Index']),
    // Large profile meta
    // 
    isActiveProfile: !!isActiveProfile,
    tsp: getTechSavvinessPoints(d)
  });
}
