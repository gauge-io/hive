var flag = false;
var WIDTH = d3.select("#kmeans")[0][0].offsetWidth - 20;
var HEIGHT = Math.max(300, WIDTH * .7);
var manualPlacement = false;
var placingFinished = false;
var drawCentroids = false;
var animationDuration = 150,
stepDuration = 150,
colors = ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"];

var svg = d3.select("#kmeans svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .style('padding', '10px')
    .style('background', '#223344')
    .style('cursor', 'pointer')
    .style('-webkit-user-select', 'none')
    .style('-khtml-user-select', 'none')
    .style('-moz-user-select', 'none')
    .style('-ms-user-select', 'none')
    .style('user-select', 'none')
    .on('click', function() {
        d3.event.preventDefault();
        if (!manualPlacement || placingFinished) {
            step();
        }
    });

d3.selectAll("#kmeans button")
    .style('padding', '.5em .8em');

d3.selectAll("#kmeans label")
    .style('display', 'inline-block')
    .style('width', '15em');

var lineg = svg.append('g');
var dotg = svg.append('g');
var centerg = svg.append('g');
d3
d3.select("#step")
    .on('click', function() {
        step();
        draw();
    });
d3.select("#run").
on('click', function() { startRun(); });
d3.select("#restart")
    .on('click', function() { restart();
        draw(); });
d3.select("#reset")
    .on('click', function() { init();
        draw(); });
var groups_old = [];
var groups = [],
    dots = [];
firstRun = true;
var inter;

function startRun() {
    $("#run").prop("disabled", true);
    $("#step").prop("disabled", true);
    step();
    inter = setInterval(step, stepDuration);
}

function stopRun() {
  clearInterval(inter);
  $("#step").prop("disabled", manualPlacement);
  $("#run").prop("disabled", false);
  init();
}

function centroids(cb) {
    drawCentroids = (cb.checked);
}

function manual(cb) {
    manualPlacement = (cb.checked);
    init();
}

function step() {
    d3.select("#restart").attr("disabled", null);
    if (flag) {
        moveCenter();
    } else {
        updateGroups();
    }
    draw();
    flag = !flag;
}

function place(i, K, x1, y1) {
    var g = {
        dots: [],
        color: colors[i], //'hsl(' + (i * 360 / K) + ',100%,50%)',
        center: {
            x: x1,
            y: y1
        },
        init: {
            center: {}
        }
    };
    g.init.center = {
        x: g.center.x,
        y: g.center.y
    };
    return g;
}
var placed = 0;

function init() {
    $("#step").prop("disabled", manualPlacement);
    $("#run").prop("disabled", manualPlacement);
    clearInterval(inter);
    firstRun = true;
    placed = 0;
    d3.select("#restart").attr("disabled", "disabled");

    var N = parseInt(d3.select('#N')[0][0].value, 10);
    var K = parseInt(d3.select('#K')[0][0].value, 10);
    groups = [];

    if (!manualPlacement) {
        for (var i = 0; i < K; i++) {
            groups.push(place(i, K, Math.random() * WIDTH, Math.random() * HEIGHT));
        }
    } else {
        d3.select("#kmeans svg").on("click", function() {
            if (placed < K && manualPlacement) {
                coords = d3.mouse(this);
                groups.push(place(placed, K, coords[0], coords[1]));
                draw();
                placed++;
                if (placed == (K)) {
                    $("#run").prop("disabled", false);
                    $("#step").prop("disabled", false);
                }
            } else {
                step();
                draw();
            }
        });
    }
    dots = [];
    flag = false;
    //dots = drawCentroids ? pushCentroids(N, K) : pushRands(N)
    dots = drawCentroids ? pushCentroids(N, K) : createDatapoints(N);
    draw();
}

function pushRands(N) {
    dots = []
    for (i = 0; i < N; i++) {
        var dot = {
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
            group: undefined
        };
        dot.init = {
            x: dot.x,
            y: dot.y,
            group: dot.group
        };
        dots.push(dot);
    }
    return dots;
}

// Read sample dataset
// 
var dataset,
oFilterConfig = {};
function readData(){

  var aEnabledFilters = [
    //'_isBookmarked',
    //'_aTaskID',
    //'_age', 
    'Age',
    //'_hhi', 
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
    //'unemp',
    //'den',
    'Ethnicity',
    'Segment',
    //'_isParticipant',
    'Protection opinion',
    '# of Devices with Protection Plans'
  ];

  d3.csv("./profile-data.csv", function(error, data, columns){
    
    dataset = data;

    parseData(data);

    createDropdowns(oFilterConfig);

    init();
    draw();
  });


  function parseData(data) {
    
    var firstRow = data[0];

    // create filter config
    // mainly desribe the data type of the variable
    // to be used to determine scale to be used.
    // 
    aEnabledFilters.forEach(function(f){

      var oConf = {
        // 1 - non-numeric
        // 2 - numeric
        type: isNaN(Number(firstRow[f])) ? 1 : 2,
        name: f
      };

      oFilterConfig[f] = oConf;

    });


  }

}

// Create X & Y variable filters
// 
function createDropdowns(oFilterConfig) {
  var ids = ['#x_variable', '#y_variable'].map(function(id){
    var el = d3.select(id);

    el.on('change', onChange);

    return el;
  }),
  aVariables = d3.keys(oFilterConfig);

  ids.forEach(function(id){

    id.selectAll('option')
    .data(aVariables)
    .enter()
    .append('option')
    .text(function(d){
      return oFilterConfig[d].name;
    });

  });

  function onChange(d) {
    resetScales(oFilterConfig[this.value], d3.select(this).attr('data-axis'));

    regenerateDatapoints(xVariable, yVariable);
    draw();
  }

  xVariable = oFilterConfig[aVariables[0]];
  yVariable = oFilterConfig[aVariables[0]];

  resetScales(xVariable, 'x');
  resetScales(yVariable, 'y');

}

// Reset scales and recreate data points
var xScale,
yScale,
xVariable,
yVariable;
function resetScales(oVConf, axis) {
  

  var scale = oVConf.type === 1 ? d3.scale.ordinal() : d3.scale.linear();

  if (axis == 'x') {
    xVariable = oVConf;
    xScale = scale;
    scale.range([0, WIDTH]);
  }else{
    yVariable = oVConf;
    yScale = scale;
    scale.range([HEIGHT, 0]);
  }

  // set domain
  // 
  scale.domain(_.uniqBy(dataset, function(d){
    return d[oVConf.name];
  }).map(function(d){
    return oVConf.type === 2 ? Number(d[oVConf.name]) : d[oVConf.name];
  }).filter(function(d){
    return !!d;
  }));

  if (oVConf.type === 1) {
    scale.rangeRoundBands(axis == 'x' ? [0, WIDTH] : [HEIGHT, 0]);
  }else{
    var et;
    if ((et = d3.extent(scale.domain()))[1] > 10) {
      scale.domain([1, 100]);
    }else{
      scale.domain([0, et[1]]);
    }
    
  }

}

function findDomain(oVConf) {
  dataset
}

function createDatapoints(N) {

  var x = xVariable,
  y = yVariable;

  var fx = x.type === 1 ? function(d){ return d; } : function(d){ return Number(d); },
  fy = y.type === 1 ? function(d){ return d; } : function(d){ return Number(d); };
    
  dots = [];
  for (i = 0; i < dataset.length; i++) {
      var row = dataset[i],
      dot = {
          i: i,
          x: xScale(fx(row[x.name])) + (xScale.rangeBand ? xScale.rangeBand()/2 : 0),
          y: yScale(fy(row[y.name])) + (yScale.rangeBand ? yScale.rangeBand()/2 : 0),
          group: undefined
      };
      dot.init = {
          x: dot.x,
          y: dot.y,
          group: dot.group
      };
      dots.push(dot);
  }
  return dots;
  
}

function regenerateDatapoints(x, y) {

  var fx = x.type === 1 ? function(d){ return d; } : function(d){ return Number(d); },
  fy = y.type === 1 ? function(d){ return d; } : function(d){ return Number(d); };
    
  //dots = [];
  for (i = 0; i < dataset.length; i++) {
      var row = dataset[i],
      dot = dots[i];

      dot.x = xScale(fx(row[x.name])) + (xScale.rangeBand ? xScale.rangeBand()/2 : 0);
      dot.y = yScale(fy(row[y.name])) + (yScale.rangeBand ? yScale.rangeBand()/2 : 0);
  }
  return dots;
  
}

readData();

function pushCentroids(N, K) {

  // limit N to dataset length
  N = N > dataset.length ? dataset.length : N;

    dots = [];
    for (i = 0; i < K; i++) {
        var cX = Math.random() * WIDTH;
        var cY = Math.random() * HEIGHT;
        var cW = getRandomArbitrary(50, 125);
        var cH = getRandomArbitrary(50, 125);
        for (j = 0; j < N / K; j++) {
            rX = Math.random() * cW;
            x = cX + ((cX + rX < WIDTH) ? rX : -1 * rX);
            rY = Math.random() * cH;
            y = cY + ((cY + rY < HEIGHT) ? rY : -1 * rY);
            var dot = {
                x: x,
                /*(Math.random() * WIDTH/K) + cX,*/
                y: y,
                /*(Math.random() * HEIGHT/K) + cY,*/
                group: undefined
            };
            dot.init = {
                x: dot.x,
                y: dot.y,
                group: dot.group
            };
            dots.push(dot);
        }
    }
    return dots;
}
/* from Mozilla Developer Center */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function restart() {
    $("#step").prop("disabled", false);
    $("#run").prop("disabled", false);
    clearInterval(inter);
    firstRun = true;
    flag = false;
    d3.select("#restart").attr("disabled", "disabled");
    groups.forEach(function(g) {
        g.dots = [];
        g.center.x = g.init.center.x;
        g.center.y = g.init.center.y;
    });

    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        /*
        dots[i] = {
            x: dot.init.x,
            y: dot.init.y,
            group: undefined,
            init: dot.init
        };*/
        dots[i].group = undefined;
    }
}


function draw() {

    var circles = dotg.selectAll('circle')
        .data(dots);
    circles.enter()
        .append('circle');
    circles.exit().remove();
    circles
        .transition()
        .duration(animationDuration)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', function(d) { return d.group ? d.group.color : '#ffffff'; })
        .attr('r', 5);

    if (dots[0].group) {
        var l = lineg.selectAll('line')
            .data(dots);
        var updateLine = function(lines) {
            lines
                .attr('x1', function(d) { return d.x; })
                .attr('y1', function(d) { return d.y; })
                .attr('x2', function(d) { return d.group ? d.group.center.x : d.x; })
                .attr('y2', function(d) { return d.group ? d.group.center.y : d.y; })
                .attr('stroke', function(d) { return d.group ? d.group.color : '#fff'; });
        };
        updateLine(l.enter().append('line'));
        updateLine(l.transition().duration(animationDuration));
        l.exit().remove();
    } else {
        lineg.selectAll('line').remove();
    }

    var c = centerg.selectAll('path')
        .data(groups);
    var updateCenters = function(centers) {
        centers
            .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)"; })
            .attr('fill', function(d, i) { return d.color; })
            .attr('stroke', '#aabbcc');
    };
    c.exit().remove();
    updateCenters(c.enter()
        .append('path')
        .attr('d', d3.svg.symbol().type('cross'))
        .attr('stroke', '#aabbcc'));
    updateCenters(c
        .transition()
        .duration(animationDuration));

    drawAnalysis(analyseClusters());
}

function moveCenter() {
    groups.forEach(function(group, i) {
        if (group.dots.length == 0) return;

        // get center of gravity
        var x = 0,
            y = 0;
        group.dots.forEach(function(dot) {
            x += dot.x;
            y += dot.y;
        });

        group.center = {
            x: x / group.dots.length,
            y: y / group.dots.length
        };
    });

}

function updateGroups() {
    groups.forEach(function(g) { g.dots = []; });
    dots.forEach(function(dot) {
        // find the nearest group
        var min = Infinity;
        var group;
        groups.forEach(function(g) {
            var d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
            if (d < min) {
                min = d;
                group = g;
            }
        });

        // update group
        if (group) {
          group.dots.push(dot);
        }
        dot.group = group;
    });
}

function analyseClusters() {
  var oInfo = {};

  groups.forEach(function(g, i){

    oInfo[i] = {};
    
    // find X axis values
    oInfo[i][xVariable.name] = _.uniqBy(g.dots, function(d){ 
      return dataset[d.i][xVariable.name]; 
    })
    .map(function(d){ 
      return dataset[d.i][xVariable.name]; 
    });

    // find Y axis values
    oInfo[i][yVariable.name] = _.uniqBy(g.dots, function(d){ 
      return dataset[d.i][yVariable.name]; 
    })
    .map(function(d){ 
      return dataset[d.i][yVariable.name]; 
    });

  });

  return oInfo;

}

function drawAnalysis(oInfo) {
  
  var el = d3.select('#analysis');

  var olCluster = el.selectAll('li')
    .data(d3.values(oInfo));

  olCluster.exit().remove();

  var ol = olCluster.enter().append('li');

  olCluster.each(function(){

    var data = d3.select(this).datum();

    var li = d3.select(this).selectAll('div')
    .data(d3.values(data).map(function(d, i){
      return {
        key: d3.keys(data)[i],
        values: d
      }
    }));

    li.exit().remove();

    li.enter().append('div');

    li.html(function(d){
      var _html = '';      
      var values = _.uniq(d.values);

      _html += '<em>' + d.key + '</em>: ';
      _html += oFilterConfig[d.key].type === 1 ? values.toString() : d3.extent(values, function(e){ return Number(e); }).join(' – ');
    
      return _html;
    });

  });

}

//init();
//draw();