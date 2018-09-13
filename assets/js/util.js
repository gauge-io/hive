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
            fill.forEach(function(){
                aFiller.push(0);
            });
            return aFiller.join('') + sZipShort;
        }

        return sZipShort.slice(0, 5);
    }
}

/**
 * Apply a set of filters on a dataset.
 * Filters are AND 
 * @param  {Array} aData    Profile Dataset
 * @param  {Array} aFilters Array of filter Objects
 * @return {Array}          Filtered dataset. Does NOT modifies the input.
 */
function applyFiltersOnData(aData, aFilters) {

  var aFilteredData = _.cloneDeep(aData);

  // Loop for each filter type
  // 

  aFilters.forEach(function(oF){

    // Type of filter.
    // Determines how its value properties should be treated.
    // Supported types - range-slider, dropdown, multi-dropdown, checkbox
    // 
    var sType = oF.type;

    try {

      if (sType === 'range-slider') {

        try {

          /**
           * value is an object with two properties min & max
           */
          

        }

      }else if (sType === 'dropdown') {

      }else if (sType === 'multi-dropdown') {

      }else if (sType === 'checkbox') {

      }


    }catch(e){
      console.log('ERROR', 'Filter', oF, e.message);
    }

  });

  return aFilteredData;
  
}































