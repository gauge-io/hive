/**
 * Utility functions
 * 
 */

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
    // TODO - work with processed GeoJSON with metrics
    // ZCTA5CE10
    var index = aZip.indexOf(g.properties.ZCTA);
    if (index > -1) {
      aZip.splice(index, 1);
      return true;
    }
    return false;
  });
}

/**
 * Get a ZCTA for a Zip
 * @param  {array} aZipUnique Zip
 * @return {array}            ZCTA
 */
function getZCTAFromZip(aZipUnique) {
  // TODO
  // 1. Build a map from file uszipsv1.2-zip-to-zcta.csv
  // 2. Use results from this mapping to find ZCTA of a Zip
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

              b = d[oF.metric] == oF.value;

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

            b = oF.value.indexOf(d[oF.metric]) > -1;

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

            b = oF.value == (d[oF.metric] || '').toLowerCase();

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