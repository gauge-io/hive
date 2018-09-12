/**
 * Aux.js
 * 
 * Bind all UI Components and data model
 * 
 * @author Ashish Singh [https://github.com/git-ashish](GitHub)
 */

(function Aux() {

  var dispatch = d3.dispatch('filterUpdate');


  // UI Layer
  // 
  function initUI() {

    // Define DOM elements
    // 

    // Define UI Filters
    // 

    var aFilters = [{
      id: '#filter_age',
      label: 'Age',
      type: 'range-slider',
      metric: 'Age',
      range: {
        min: 0,
        max: 100,
        step: 1
      }
    }];

    // Create controls
    // 

    aFilters.forEach(function(oF){

      var oFilter = new Filter(oF);

      // add to DOM
      // 
      oFilter.createHTML();

      // Bind a dispatch
      oFilter.onchange = function(values){

        dispatch.apply('filterUpdate', null, [{
          metric: oF.metric,
          value: values
        }]);

      }

    });

    // Do Event Binding
    // 

    
  }

  // Initialise Mapping
  // 
  // Instantiate Map
  // 
  // 
  function initMap() {
    
  }


  // Bind Events
  // 
  function bindEvents() {

    dispatch.on('filterUpdate', function(oPayload){

      console.log('dispatch filterUpdate', oPayload);

    });
    
  }

  initMap();

  initUI();

  bindEvents();

  
})(window);