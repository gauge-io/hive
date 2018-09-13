/**
 * DataModel 
 * Load the Profiles dataset and prepare custom datasets
 * for data filtering and querying
 */
function DataModel(sUrl) {

  // Will hold the processed master dataset.
  // No filtering is performed on this.
  // 
  var aMasterDataset = [],

  // This is a copy of master dataset
  // over which all the filtering and querying should be performed.
  // The value of this dataset will reflect application of all applied filters
  // at any given time
  // 
  aQueryDataset = [],

  postLoadHook = function(){};


  // Load the dataset
  function load() {

    d3.csv(sUrl, parseRow).then(processData);
    
  }

  // Parse a row of data.
  // 
  // Many columns need processing before
  // ingestion in vis
  // 
  // Create any new fields if needed, here.
  // New private variables start with _
  // 
  function parseRow(d) {

    // Zip
    // 
    d._zip = getSanitizedZip(d.Zip);

    // Age
    // 
    
    try{
      
      var age = (d.Age || '').split('-');

      if (age.length == 2) {
        d._age_min = parseInt(age[0]) || null;
        d._age_max = parseInt(age[1]) || null;
      }else{
        d._age_min = d._age_max = null;
      }

    }catch(e){
      console.log('[ERROR]', 'Age', e.message);
    }

    // Age
    // 
    
    try{
      
      var age = (d.Age || '').split('-');

      if (age.length == 2) {
        d._age_min = parseInt(age[0]) || null;
        d._age_max = parseInt(age[1]) || null;
      }else{
        d._age_min = d._age_max = null;
      }

    }catch(e){
      console.log('[ERROR]', 'Age', e.message);
    }

    // HHI
    // 
    
    try{
      
      var pattern = /[a-z,$,\ ,+]/gi,
      hhi = (d.HHI || ''),
      _hhi = (d.HHI || '').replace(pattern, ''),
      unit = 1000;

      if (_hhi.indexOf('-') > -1) { // $100k - $150k
        _hhi = _hhi.split('-');
        d._hhi_min = parseInt(_hhi[0])*unit || null;
        d._hhi_max = parseInt(_hhi[1])*unit || null;
      
      }else if(hhi.indexOf('Under') > -1){ // Under $30k
        
        d._hhi_min = 0;
        d._hhi_max = parseInt(_hhi)*unit || null;

      }else if (!!hhi){ // $100k, $120k+

        d._hhi_min = parseInt(_hhi)*unit || null;
        d._hhi_max = Infinity;

      }else{
        d._hhi_min = null;
        d._hhi_max = null;
      }

    }catch(e){
      console.log('[ERROR]', 'HHI', e.message);
    }

    
    return d;
    
  }

  /**
   * Process full dataset
   * @param  {Array} aData 
   */
  function processData(aData) {

    // Prepare Master dataset
    // 
    aMasterDataset = _.cloneDeep(aData);

    // Prepare Query dataset
    // 
    aQueryDataset = _.cloneDeep(aData);

    if (typeof postLoadHook === 'function') {
      postLoadHook.apply(DataModel, [aQueryDataset]);
    }

  }

  function postLoad(callback) {
     postLoadHook = callback || function(){};
  }


  // Trigger load
  // 
  load();


  return {

    then: postLoad

  }
  
}