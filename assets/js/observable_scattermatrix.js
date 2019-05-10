// URL: https://observablehq.com/d/94749c2763adbd00
// Title: Scatterplot Matrix with Brushing as a Function
// Author: Ashish Singh (@git-ashish)
// Version: 507
// Runtime version: 1

const m0 = {
  id: "94749c2763adbd00@507",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Scatterplot Matrix with Brushing as a Function

Hex Mode - When you brush, it will use the selected area to filter the number of datapoints within the bounds, then sets the fill-opacity of the hexbin to the percent of datapoints within the bounds.`
)})
    },
    {
      inputs: ["mode","scatterplotMatrix","data","columns","colorBy","width","height","padding","hexbinMatrix","d3radius"],
      value: (function(mode,scatterplotMatrix,data,columns,colorBy,width,height,padding,hexbinMatrix,d3radius){return(
mode == "normal" ? scatterplotMatrix(data, columns, colorBy, width, height, padding, true) : hexbinMatrix(data, columns, width, height, padding, true, d3radius)
)})
    },
    {
      name: "viewof mode",
      inputs: ["radio"],
      value: (function(radio){return(
radio({
  title: 'Rendering Mode',
  options: [
    { label: 'Normal', value: 'normal' },
    { label: 'Hexbin', value: 'hex' }
  ],
  value: 'normal'
})
)})
    },
    {
      name: "mode",
      inputs: ["Generators","viewof mode"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof d3radius",
      inputs: ["slider"],
      value: (function(slider){return(
slider({
  min: 1, 
  max: 10,
  step: 1, 
  value: 6, 
  title: "Hexbin Radius"
})
)})
    },
    {
      name: "d3radius",
      inputs: ["Generators","viewof d3radius"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`##### Color by Column`
)})
    },
    {
      name: "colorBy",
      value: (function(){return(
"Segment"
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`##### Matrix Columns`
)})
    },
    {
      name: "matrixcolumns",
      value: (function(){return(
["Software Score", "Savviness Index", "Protection opinion"]
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`##### Columns List`
)})
    },
    {
      inputs: ["data"],
      value: (function(data){return(
data.columns
)})
    },
    {
      name: "scatterplotMatrix",
      inputs: ["d3","DOM"],
      value: (function(d3,DOM){return(
(data, columns, colorColumn, width, height, padding, brushing = false) => {
  
  const size = (width - (columns.length + 1) * padding) / columns.length + padding
  
  const svg = d3.select(DOM.svg(width, width))
      .attr("viewBox", `${-padding} 0 ${width} ${width}`)
      .style("max-width", "100%")
      .style("height", "auto");
  
  const x = columns.map(c => d3.scaleLinear()
    .domain(d3.extent(data, d => d[c]))
    .rangeRound([padding / 2, size - padding / 2]))
  
  const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]))
  
  const z = d3.scaleOrdinal()
    .domain(data.map(d => d[colorColumn]))
    .range(d3.schemeCategory10);
  
  function xAxis() {
    
    const axis = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
    
    d3.select(this).selectAll("g").data(x).enter().append("g")
        .attr("transform", (d, i) => `translate(${(columns.length - i - 1) * size},0)`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }
  
  svg.append("g")
      .attr("class", "x axis")
      .each(xAxis);

  function yAxis() {
    
    const axis = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
    
    d3.select(this).selectAll("g").data(y).enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }

  svg.append("g")
      .attr("class", "y axis")
      .each(yAxis);

  const cell = svg.append("g")
    .selectAll("g")
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join("g")
      .attr("class", "cell")
      .attr("transform", ([i, j]) => `translate(${(columns.length - i - 1) * size},${j * size})`);

  cell.append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("x", padding / 2 + 0.5)
      .attr("y", padding / 2 + 0.5)
      .attr("width", size - padding) 
      .attr("height", size - padding);

  cell.each(function([i, j]) {
    
    d3.select(this).selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("cx", d => x[i](d[columns[i]]))
        .attr("cy", d => y[j](d[columns[j]]))
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .style("fill", d => z(d[colorColumn]));
  });

  svg.append("g")
      .style("font", "bold 10px sans-serif")
    .selectAll("text")
    .data(columns)
    .join("text")
      .attr("transform", (d, i) => `translate(${(columns.length - i - 1) * size},${i * size})`)
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(d => d);
  
   
  
    var brush = d3.brush()
      .on("start", brushstart)
      .on("brush", brushmove)
      .on("end", brushend)
      .extent([[0,0],[size,size]]);
  
  if(brushing) {
    cell.call(brush);
  }
  
  let brushCell 

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = d3.brushSelection(this);   
    if(!e) {
      d3.selectAll(".circle").style("fill-opacity", 1)
    } else {
      
      const xScale = x[p[0]]
      const yScale = y[p[1]]

      const xRange = [xScale.invert(e[0][0]), xScale.invert(e[1][0])]
      const yRange = [yScale.invert(e[0][1]), yScale.invert(e[1][1])]

      d3.selectAll("circle").style("fill-opacity", .2)
      d3.selectAll("circle")
        .filter(d => d[columns[p[0]]] >= xRange[0] 
                & d[columns[p[0]]] <= xRange[1] 
                & d[columns[p[1]]] <= yRange[0]
                & d[columns[p[1]]] >= yRange[1])
        .style("fill-opacity", 1)
    }

  }

  // If the brush is empty, select all circles.
  function brushend() {
    var e = d3.brushSelection(this);
    if (e === null) d3.selectAll("circle").style("fill-opacity", 1);
  } 
  
  return svg.node();
  
}
)})
    },
    {
      name: "hexbinMatrix",
      inputs: ["d3","DOM"],
      value: (function(d3,DOM){return(
(data, columns, width, height, padding, brushing = false, radiusSize) => {
  
  const size = (width - (columns.length + 1) * padding) / columns.length + padding
  
  const svg = d3.select(DOM.svg(width, width))
      .attr("viewBox", `${-padding} 0 ${width} ${width}`)
      .style("max-width", "100%")
      .style("height", "auto");
  
  const x = columns.map(c => d3.scaleLinear()
    .domain(d3.extent(data, d => d[c]))
    .rangeRound([padding / 2, size - padding / 2]))
  
  const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]))
  
  function xAxis() {
    
    const axis = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
    
    d3.select(this).selectAll("g").data(x).enter().append("g")
        .attr("transform", (d, i) => `translate(${(columns.length - i - 1) * size},0)`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }
  
  svg.append("g")
      .attr("class", "x axis")
      .each(xAxis);

  function yAxis() {
    
    const axis = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
    
    d3.select(this).selectAll("g").data(y).enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }

  svg.append("g")
      .attr("class", "y axis")
      .each(yAxis);

  const cell = svg.append("g")
    .selectAll("g")
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join("g")
      .attr("class", "cell")
      .attr("transform", ([i, j]) => `translate(${(columns.length - i - 1) * size},${j * size})`);

  cell.append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("x", padding / 2 + 0.5)
      .attr("y", padding / 2 + 0.5)
      .attr("width", size - padding) 
      .attr("height", size - padding);

  cell.each(function([i, j]) {
    
      const hex = d3.hexbin()
          .x(d => x[i](d[columns[i]]))
          .y(d => y[j](d[columns[j]]))
          .radius(radiusSize)
          .extent([[0, 0], [size - padding, size - padding]])

      const bins = hex(data)
        
      const color = d3.scaleSequential(d3.interpolateViridis)
          .domain([0, d3.max(bins, d => d.length) / 2])
          
      d3.select(this)
        .selectAll("path")
        .data(bins, d => `${d.x}-${d.y}`)
        .join("path")
        .attr("class", "hex")
        .attr("d", d => hex.hexagon())
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .style("fill", d => color(d.length))
        .style("stroke", d => color(d.length))
        .style("Stroke-width", .5);
    
  });

  svg.append("g")
      .style("font", "bold 10px sans-serif")
    .selectAll("text")
    .data(columns)
    .join("text")
      .attr("transform", (d, i) => `translate(${(columns.length - i - 1) * size},${i * size})`)
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(d => d);
  
  const brush = d3.brush()
      .on("start", brushstart)
      .on("brush", brushmove)
      .on("end", brushend)
      .extent([[0,0],[size,size]]);
  
  if(brushing) {
    cell.call(brush);
  }
  
  let brushCell 

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = d3.brushSelection(this);   
    if(!e) {
      d3.selectAll(".hex").style("fill-opacity", 1)
    } else {
      
      const xScale = x[p[0]]
      const yScale = y[p[1]]

      const xRange = [xScale.invert(e[0][0]), xScale.invert(e[1][0])]
      const yRange = [yScale.invert(e[0][1]), yScale.invert(e[1][1])]
    
      const filteredData = data
         .filter(d => d[columns[p[0]]] >= xRange[0] 
                    & d[columns[p[0]]] <= xRange[1] 
                    & d[columns[p[1]]] <= yRange[0]
                    & d[columns[p[1]]] >= yRange[1]);
      
      cell.each(function([i, j]) {
        d3.selectAll(".hex")
          .style("fill-opacity", d => {
            const dem = d.length 
            const numerator = d.filter(e => 
                      e[columns[p[0]]] >= xRange[0] 
                    & e[columns[p[0]]] <= xRange[1] 
                    & e[columns[p[1]]] <= yRange[0]
                    & e[columns[p[1]]] >= yRange[1]).length;
            return numerator / dem;
          })
      });

    }

  }

  // If the brush is empty, select all circles.
  function brushend() {
    var e = d3.brushSelection(this);
    if (e === null) d3.selectAll(".hex").style("fill-opacity", 1);
  } 
  
  return svg.node();
  
}
)})
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv("https://gist.githubusercontent.com/git-ashish/acde4c3c03ae6c30d35eebe70707f255/raw/d6d6a6040afc4acc4ffb88e596417c21e6ed9f59/survey.csv", d3.autoType)
)})
    },
    {
      name: "columns",
      inputs: ["matrixcolumns"],
      value: (function(matrixcolumns){return(
matrixcolumns
)})
    },
    {
      name: "petaldata",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv("https://gist.githubusercontent.com/mbostock/b038321e2a8177baf9e6a547195da966/raw/6c8eb7f5c644be0394f7fc384e42de9fab41927f/iris.csv", d3.autoType)
)})
    },
    {
      name: "width",
      value: (function(){return(
768
)})
    },
    {
      name: "height",
      value: (function(){return(
600
)})
    },
    {
      name: "padding",
      value: (function(){return(
20
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5","d3-tile@0.0", "d3-hexbin@0.2")
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "radio",
      remote: "radio"
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, getValue, format, display, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range", title, description, submit, format, display,
    attributes: {min, max, step, value},
    getValue
  });
}
)})
    },
    {
      name: "radio",
      inputs: ["input","html"],
      value: (function(input,html){return(
function radio(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "radio",
    title,
    description,
    submit,
    getValue: input => {
      const checked = Array.prototype.find.call(input, radio => radio.checked);
      return checked ? checked.value : undefined;
    },
    form: html`
      <form>
        ${options.map(({ value, label }) => {
          const input = html`<input type=radio name=input ${
            value === formValue ? "checked" : ""
          } style="vertical-align: baseline;" />`;
          input.setAttribute("value", value);
          const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
    );
  if (format) format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format@1")
)})
    }
  ]
};

const notebook = {
  id: "94749c2763adbd00@507",
  modules: [m0,m1]
};

export default notebook;
