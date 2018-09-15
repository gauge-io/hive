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

  
  // Checkbox control
  // 
  function _checkbox() {

    var html = '\
      <label></label>\
      <div>\
      <input type="checkbox"/>\
      <label data-label></label>\
      </div>\
    ';

    var dd = d3.select(document.createElement('div'));

    dd.classed('filter filter--'+config.type, true)
      .html(html);

    dd.select('div')
      .classed('checkbox', true);

    // Add checked
    // Init value
    // 
    var bSelected = _this.config.value = (config.values && config.values[0] && !!config.values[0].selected );
    
    dd.select('input')
      .attr("checked", bSelected ? "checked" : "")
      .attr("id", (config.id + "_lbl").replace('#',''));

    dd.select('[data-label]')
      .attr("for", (config.id + "_lbl").replace('#','') )
      .html(config.values[0].label);
    
    // Add Label
    // 
    dd.select('label')
      .html(config.label);

    // Insert DOM
    // 
    d3.select(config.id).node()
      .appendChild(dd.node());

    dd.select('input')
    .on('change', function(d){
      // trigger onchange
      // 
      _this.onchange(_this.config.value = this.checked);
    });
    
  }

  // Dropdown control
  // 
  function _dropdown() {

    var html = '\
      <label></label>\
      <div>\
      <select></select>\
      </div>\
    ';

    var dd = d3.select(document.createElement('div'));

    dd.classed('filter filter--'+config.type, true)
      .html(html);

    dd.select('div')
      .classed('dropdown', true);

    // Add options to select
    // 
    
    dd.select('select')
      .selectAll('option')
      .data(config.values)
    .enter()
      .append('option')
      .attr('value', function(d){
        return d.value;
      })
      .html(function(d){
        return d.label;
      })
      .filter(function(d){
        return d.selected;
      })
      .attr('selected', function(d){
        _this.config.value = d.value;
        return 'selected';
      });

    // Add Label
    // 
    dd.select('label')
      .html(config.label);

    // Insert DOM
    // 
    d3.select(config.id).node()
      .appendChild(dd.node());

    // Trigger Chosen
    // 
    var chosen = jQuery(dd.select('select').node()).chosen();

    chosen.change(function(e){

      // Update value

      // trigger onchange
      // 
      _this.onchange(_this.config.value = this.value);

    });

  }

  // Multi Select
  // 
  function _multidropdown() {
    

    var html = '\
      <label></label>\
      <div>\
      <select multiple></select>\
      </div>\
    ';

    var dd = d3.select(document.createElement('div'));

    dd.classed('filter filter--'+config.type, true)
      .html(html);

    dd.select('div')
      .classed('multi-dropdown', true);

    // Add options to select
    // 
    
    dd.select('select')
      .selectAll('option')
      .data(config.values)
    .enter()
      .append('option')
      .attr('value', function(d){
        return d.value;
      })
      .html(function(d){
        return d.label;
      })
      .filter(function(d){
        return d.selected;
      })
      .attr('selected', function(d){
        _this.config.value = [d.value];
        return 'selected';
      });

    // Add Label
    // 
    dd.select('label')
      .html(config.label);

    // Insert DOM
    // 
    d3.select(config.id).node()
      .appendChild(dd.node());

    // Trigger Chosen
    // 
    var chosen = jQuery(dd.select('select').node()).chosen();

    chosen.change(function(e){

      // if selection is not 'All' and 'All' is also selected, de-select it
      // 
      var aVal = jQuery(this).val();
      if (aVal.length > 1 && aVal.indexOf('All') > -1) {
        jQuery(this).find('[value="All"]')
          .removeAttr("selected");

        chosen.trigger('chosen:updated');
      }

      // trigger onchange
      // 
      var el = d3.selectAll(this.selectedOptions),
      aValues = [];
      el.each(function(){
        aValues.push(this.value);
      });

      // update values
      // 
      _this.config.value = aValues;

      _this.onchange(aValues);

    });
  }

  // Range Slider
  // 
  function _rangeslider() {

    var html = '\
      <label></label>\
      <div>\
        <input data-min readonly type="text" value="0"/>\
        <input data-max readonly type="text" value="0"/>\
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

    case "dropdown":

      _node = _dropdown();

      break;

    case "multi-dropdown":

      _node = _multidropdown();

      break;

    case "checkbox":

      _node = _checkbox();

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