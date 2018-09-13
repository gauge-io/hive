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

  bIsLoaded = false,

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
    // Value type isRangeValue
    
    try{
      
      var age = (d.Age || '').split('-');

      d._age = {
        min: null,
        max: null
      };

      if (age.length == 2) {
        d._age.min = parseInt(age[0]) || null;
        d._age.max = parseInt(age[1]) || null;
      }else{
        d._age.min = d._age.max = null;
      }

    }catch(e){
      console.log('[ERROR]', e.message);
    }


    // Gender
    // 
    try{
      
      var metric = 'Gender';

      d[metric] = d[metric] || null;

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Own-Rent
    //
    try{
      
      var metric = 'Own-Rent';

      d[metric] = d[metric] || null;

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Employment Status
    // 
    try{
      
      var metric = 'Employment Status';

      d[metric] = d[metric] || null;

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Hardware Score
    // 
    try{
      
      var metric = 'Hardware Score';

      d[metric] = parseInt(d[metric]);

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Software Score
    // 
    try{
      
      var metric = 'Software Score';

      d[metric] = parseInt(d[metric]);

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Children in Home
    // 
    try{
      
      var metric = 'Children in Home';

      d[metric] = parseInt(d[metric]) || null;

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Annual Support Requests
    // 
    try{
      
      var metric = 'Annual Support Requests',
      pattern = /[a-z,A-Z,\ ,+]/gi,
      support_req = (d[metric] || ''),
      _support_req = (d[metric] || '').replace(pattern, '');

      d._support_req = {
        min: null,
        max: null
      };

      if (_support_req.indexOf('-') > -1) { // 1 - 5 times
        _support_req = _support_req.split('-');
        d._support_req.min = parseInt(_support_req[0]) || null;
        d._support_req.max = parseInt(_support_req[1]) || null;
      
      }else if(support_req.indexOf('Zero') > -1){ // Zero...
        
        d._support_req.min = 0;
        d._support_req.max = 0;

      }else if (support_req.indexOf('More') > -1){ // More...

        d._support_req.min = parseInt(_support_req) || null;
        d._support_req.max = Infinity;

      }

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // HHI
    // Value type isRangeValue
    
    try{
      
      var pattern = /[a-z,$,\ ,+]/gi,
      hhi = (d.HHI || ''),
      _hhi = (d.HHI || '').replace(pattern, ''),
      unit = 1000;

      d._hhi = {
        min: null,
        max: null
      };

      if (_hhi.indexOf('-') > -1) { // $100k - $150k
        _hhi = _hhi.split('-');
        d._hhi.min = parseInt(_hhi[0])*unit || null;
        d._hhi.max = parseInt(_hhi[1])*unit || null;
      
      }else if(hhi.indexOf('Under') > -1){ // Under $30k
        
        d._hhi.min = 0;
        d._hhi.max = parseInt(_hhi)*unit || null;

      }else if (!!hhi){ // $100k, $120k+

        d._hhi.min = parseInt(_hhi)*unit || null;
        d._hhi.max = Infinity;

      }else{
        d._hhi.min = null;
        d._hhi.max = null;
      }

    }catch(e){
      console.log('[ERROR]', e.message);
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

    bIsLoaded = true;

    postLoadHook = callback || function(){};

    return DataModel;
  }

  return {

    load: load,

    then: postLoad,

    isLoaded: function(){
      return !!bIsLoaded;
    },

    getQuerySet: function(){
      return aQueryDataset;
    },

    setQuerySet: function(aData){
      aQueryDataset = aData;

      return DataModel;
    },

    getMainSet: function(){
      return _.cloneDeep(aMasterDataset);
    }

  }
  
}