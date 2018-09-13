/**
 * Filter Control
 *
 * Create a type of Filter.
 * Supported types: range-slider, dropdown, checkbox, multi-dropdown
 *
 * Returns a JavaScript Object
 */
function Filter(options) {

  var types = ["dropdown", "multi-dropdown", "range-slider", "checkbox"],
  config = options;

  // store config
  // 

  this.config = options;

}

// Create and return the HTML of the control
// 
Filter.prototype.createHTML = function() {

  var _this = this,
  _node,
  config = this.config,
  sType = config.type;

  // Dropdown control
  // 
  function _dropdown() {


    
  }

  // Range Slider
  // 
  function _rangeslider() {

    var html = '\
      <label></label>\
      <div>\
        <input data-min type="text" value="0"/>\
        <input data-max type="text" value="0"/>\
        <input data-min value="" min="" max="" step="" type="range"/>\
        <input data-max value="" min="" max="" step="" type="range"/>\
        <svg width="100%" height="24">\
          <line x1="4" y1="0" x2="300" y2="0" stroke="#444" stroke-width="12" stroke-dasharray="1 28"></line>\
        </svg>\
      </div>';

    var rs = d3.select(document.createElement('div'));

    rs.classed('filter filter--'+config.type, true)
      .html(html);

    rs.select('div')
      .classed('range-slider', true)

    // Set Min and Max values
    // 
    var step = config.range.step || (config.range.max/config.range.min);

    // init default values
    config.value = {
      min: config.range.min,
      max: config.range.max
    };

    config.isRange = true;

    rs.select('[type="range"][data-min]')
      .attr("min", config.range.min)
      .attr("max", config.range.max);

    rs.select('[type="range"][data-max]')
      .attr("min", config.range.min)
      .attr("max", config.range.max);

    rs.selectAll('[data-min]')
      .attr("value", config.range.min);

    rs.selectAll('[data-max]')
      .attr("value", config.range.max);

    rs.selectAll('[type="range"]')
      .attr("step", step);

    // Add Label
    // 
    rs.select('label')
      .html(config.label);


    // Bind Event
    // 

    var rangeS = rs.node().querySelectorAll("input[type=range]"),
    numberS = rs.node().querySelectorAll("input[type=text]");

    rangeS.forEach(function(el) {
      el.oninput = function() {
        var slide1 = +rangeS[0].value,
            slide2 = +rangeS[1].value;

        if (slide1 > slide2) {
          [slide1, slide2] = [slide2, slide1];
        }

        numberS[0].value = slide1;
        numberS[1].value = slide2;

        // Update current config
        // 
        _this.config.value = {
          min: slide1,
          max: slide2
        }

        // trigger onchange
        // 
        _this.onchange({
          min: slide1,
          max: slide2
        });
      }
    });

    // Insert DOM
    // 
    d3.select(config.id).node()
      .appendChild(rs.node());
    
  }


  switch(sType){

    case "range-slider":

      _node = _rangeslider();

      break;

  }

  return _node;
  
};

// Return Config with active values
// 
Filter.prototype.getState = function() {
  return _.cloneDeep(this.config);
};

Filter.prototype.onchange = function(oValue) {
  console.log('onchange', oValue);
};