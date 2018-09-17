/**
 * DataModel 
 * Load the Profiles dataset and prepare custom datasets
 * for data filtering and querying
 */
function DataModel(sUrl) {

  // Will hold the processed master dataset.
  // No filtering is performed on this.
  // 
  var oMasterDataset = {},

  aMasterDataset = [],

  // This is a copy of master dataset
  // over which all the filtering and querying should be performed.
  // The value of this dataset will reflect application of all applied filters
  // at any given time
  // 
  aQueryDataset = [],

  // Store of Bookmarked Profiles
  // 
  oBookmarkedProfiles,

  // Map of Zip to ZCTA / GEOID
  oZipMap = {},

  bIsLoaded = false,

  postLoadHook = function(){},

  // URLS
  // 
  sCodeMapUrl = 'data/viz/zip-zcta-geoid5.csv';

  // do init
  // 
  function init() {

    // Set up Bookmarked Profiles
    // 
    oBookmarkedProfiles = d3.set(getBookmarksFromURL());
    
  }

  init();


  // Load the dataset
  function load() {

    load_zip_zcta_geoid_map(function(){
      d3.csv(sUrl, parseRow).then(processData);
    });
    
  }

  // Load Zip to ZCTA/GEOID Mapping
  // 
  function load_zip_zcta_geoid_map(callback) {

    d3.csv(sCodeMapUrl, function(d){
      oZipMap[getSanitizedZip(d.ZIP)] = d;
    }).then(callback);
    
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

    // GEOID
    // 
    d._GEOID = oZipMap[d._zip].GEOID || d._zip;

    // ZCTA
    // 
    d._ZCTA = oZipMap[d._zip].ZCTA5 || d._zip;

    // Is Bookmarked?
    // 
    try {
      d._isBookmarked =  oBookmarkedProfiles.has(d.ID);
    }catch(e){
      console.log('[ERROR]', e.message);
    }

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

    // Employment Title
    // 
    try{
      
      var metric = 'Title';

      d[metric] = d[metric] || null;

      // shorten it for usage in UI
      // 
      d['_title'] = truncate((d[metric] || ''));

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

    // Savviness Score
    // 
    try{
      
      var metric = 'Savviness Index';

      d[metric] = parseInt(d[metric]);

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Purchased Protection
    // 
    try{
      
      var metric = 'Purchased Protection';

      d[metric] = parseInt(d[metric]);

    }catch(e){
      console.log('[ERROR]', e.message);
    }

    // Children in Home
    // 
    try{
      
      var metric = 'Children in Home';

      d[metric] = parseInt(d[metric]) || 0;

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
        min: 0,
        max: 0
      };

      if (_support_req.indexOf('-') > -1) { // 1 - 5 times
        _support_req = _support_req.split('-');
        d._support_req.min = parseInt(_support_req[0]) || 0;
        d._support_req.max = parseInt(_support_req[1]) || 0;
      
      }else if(support_req.indexOf('Zero') > -1){ // Zero...
        
        d._support_req.min = 0;
        d._support_req.max = 0;

      }else if (support_req.indexOf('More') > -1){ // More...

        d._support_req.min = parseInt(_support_req) || 0;
        // Assume 20% more than min
        d._support_req.max = Math.ceil(d._support_req.min * 1.2) || 0;

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
        // Assume 20% more than min
        d._hhi.max = d._hhi.min * 1.2 || null;

      }else{
        d._hhi.min = null;
        d._hhi.max = null;
      }

    }catch(e){
      console.log('[ERROR]', e.message);
    }


    // Choose 1 phone out of all choices
    // 
    try {
      var metric = 'Phone Type';
      d._phone_choice = d[metric].split(',').sort().reverse()[0];
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

    // Prepare a Map
    // 
    oMasterDataset = d3.map(aData, function(d, i){
      return d.ID || (i+1);
    });

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
      return _.cloneDeep(oMasterDataset.values());
    },

    getZIP2ZCTA: function(sZip){
      return oZipMap[sZip] ? oZipMap[sZip].ZCTA5 : sZip;
    },

    getZIP2GEOID: function(sZip){
      return oZipMap[sZip] ? oZipMap[sZip].GEOID : sZip;
    },

    toggleBookmark: function(sID){

      if (!!sID) {

        var oProfile = oMasterDataset.get(sID);

        // if already bookmarked, remove it
        // 
        if (oBookmarkedProfiles.has(sID)) {
          oBookmarkedProfiles.remove(sID);
          
          oProfile._isBookmarked = false;

        }else{
          oBookmarkedProfiles.add(sID);

          oProfile._isBookmarked = true;
        }

      }

    },

    getProfileByID: function(sID){

      if (sID && oBookmarkedProfiles.has(sID)) {
        return _.cloneDeep([oBookmarkedProfiles.get(sID)])[0];
      }

      return {};

    },

    getBookmarkCount: function(){
      return oBookmarkedProfiles.size();
    },

    clearBookmarks: function(){
      oBookmarkedProfiles.clear();
    },

    getBookmarks: function(){
      return oBookmarkedProfiles.values();
    }

  }
  
}