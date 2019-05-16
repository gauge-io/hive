/**
 * Word Tree - Draws a word tree
 * 
 * @param {HTML element}  elSelectorTree  elSelector DOM element where the viz will be rendered
 * @param {object}        oConfig         Configuration options for the Word Tree
 * Properties of oConfig: {
 *   type: [string] prefix, suffix, double
 *   text: [string] Full text of the Tree
 *   rootWord: [string] A word to be set as the Tree's root
 * }
 *
 * @returns {object} Object with function named 'update' which accepts one parameter oConfig.
 * The structure of this parameter is same as oConfig used during initialization.
 * Call update() to update the Tree after instantiation.
 */
function WordTree(elSelectorTree, oConfig) {

  // validate
  if (!elSelectorTree) {
    console.log('Error:', 'WordTree not initialised. No DOM element passed.');
    return false;
  }

  // variable declaration
  //   

  // Tree object reference
  var oTree,
  oTreeData,
  oTreeOptions,
  sTreeText,
  sTreeType,
  sRootWord,
  tree,
  textViewer,
  oWordTokens = {},
  // List of words which should not be counted for Top words ranking
  aStopList = ['.', 'gonna'],

  // Tree Core
  // 
  unicodePunctuationRe = "!-#%-*,-/:;?@\\[-\\]_{}\xa1\xa7\xab\xb6\xb7\xbb\xbf\u037e\u0387\u055a-\u055f\u0589\u058a\u05be\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f14\u0f3a-\u0f3d\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u1400\u166d\u166e\u169b\u169c\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205e\u207d\u207e\u208d\u208e\u2329\u232a\u2768-\u2775\u27c5\u27c6\u27e6-\u27ef\u2983-\u2998\u29d8-\u29db\u29fc\u29fd\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00-\u2e2e\u2e30-\u2e3b\u3001-\u3003\u3008-\u3011\u3014-\u301f\u3030\u303d\u30a0\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0\uaaf1\uabeb\ufd3e\ufd3f\ufe10-\ufe19\ufe30-\ufe52\ufe54-\ufe61\ufe63\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff0a\uff0c-\uff0f\uff1a\uff1b\uff1f\uff20\uff3b-\uff3d\uff3f\uff5b\uff5d\uff5f-\uff65",

  re = new RegExp("[" + unicodePunctuationRe + "]|\\d+|[^\\d" + unicodePunctuationRe + "0000-001F007F-009F002000A01680180E2000-200A20282029202F205F3000".replace(/\w{4}/g, "\\u$&") + "]+", "g"),

  lines = [],
  state = {},
  tokens,
  selectedLines = [],
  width,
  height,

  // DOM elements
  // 
  wordInput = d3.select('#wordtree_root'),
  wordLayout = d3.select('#wordtree_layout_switch'),
  wordTagsContainer = d3.select('#wordtree_tags'),
  wordTags = d3.selectAll('#wordtree_tags [data-tag]'),

  // Tree Core
  // 
  vis = d3v3.select("#wt_vis"),
  svg,
  clip,
  treeG,
  heatmap,
  page,
  text = d3v3.select("#wt_text"),
  keyword = d3v3.select("#wordtree_root");
  
  // Do one time initialization
  // 
  function init() {

    sTreeText = oConfig.text;

    // default tree type
    sTreeType = 'suffix';

    // default Root word
    // first word of text
    sRootWord = (sTreeText || ' ').split(' ')[0];

    svg = vis.append("svg")
      .classed('wordtree__graph', true);

    clip = svg
      .append("defs")
      .append("clipPath")
        .attr("id", "clip")
      .append("rect");

    treeG = svg.append("g")
      .attr("transform", "translate(0,20)")
      .attr("clip-path", "url(#clip)");

    heatmap = svg.append("g");
    
    text.on("scroll", scroll);

    // Word Tree
    // 
    tree = wordtree()
      .on("prefix", function(d) {
        text.call(textViewer);
        var prefix = state.prefix = d.keyword;
        keyword.property("value", prefix);
        url({prefix: prefix});
        refreshText(d.tree);
      });

    // text viewer
    // 
    textViewer = d3v3.longscroll()
      .render(function(div) {
        var a = div.selectAll("a")
            .data(function(i) { return lines[i] || []; });
        a.enter().append("a")
            .attr("href", function(d) { return "#" + encodeURIComponent(d.token); })
            .on("click", function(d) {
              d3v3.event.preventDefault();
              url({prefix: d.token});
              change();
            })
            .text(function(d) {
              if (d.whitespace) this.parentNode.insertBefore(document.createTextNode(" "), this);
              return d.token;
            });
        a.classed("highlight", highlight)
      });

    heatmap.append("rect")
      .attr("class", "frame")
      .attr("width", 20);

    page = heatmap.append("rect")
    .datum({y: 0})
    .attr("class", "page")
    .attr("width", 20)
    .call(d3v3.behavior.drag().origin(Object).on("drag", drag));


    // Instantiate and draw the Tree
    drawToDOM(elSelectorTree);

  }

  /**
   * Render the chart into a DOM element
   * 
   * Chart has 2 elements: 
   * 1. Top config panel
   * 2. Word Tree
   * 
   * @param  {DOM element} elSelector DOM element where the viz will be rendered
   */
  function drawToDOM(elSelectorTree) {

    function _draw() {

      // prepare config and dataset for Word Tree
      prepareConfig(oConfig);

      // display root word
      wordInput.node().value = sRootWord;

      processText(sTreeText);

      drawTree();

      resize();
        
    }

    // When a word is clicked
    // update the rootWord
    function selectHandler() {
      var selectedItem = oTree.getSelection();
      if (selectedItem && selectedItem.word) {
        sRootWord = selectedItem.word;
      }
    }

    _draw();
    
  }

  // on tree ready
  function readyHandler() {
    
  }

  // Before tree update
  function updateHandler() {
    
  }

  /**
   * Prepare the configuration and dataset for Tree
   */
  function prepareConfig() {
    
    // prepare default Tree config
    //keyword.property("value", sRootWord);
    //url({prefix: sRootWord});
  }

  /**
   * Update the Word Tree using oConfig parameters
   * 
   * @param  {string} sNewTreeText Full text of the Tree
   * 
   */
  function updateTree(sNewTreeText) {
    
    // Update Tree text
    if (sNewTreeText) {
      sTreeText = sNewTreeText;
      processText(sTreeText);
    }

    prepareConfig();

    drawTree();
    
  }

  /**
   * Draw the tree
   *
   * It assumes that the dataset is availabel in variable oTreeData
   * and options in oTreeOptions
   */
  function drawTree() {

    // draw tree using prepared data and config variables
    // 
    
    updateHandler();

    setTimeout(function(){
      
      url({reverse: sTreeType == 'prefix' ? 1 : 0, prefix: sRootWord});
      change();

      readyHandler();

      setPopularWords();
    }, 1);
    
  }

  // Select TOP 5 words with most weight
  // from the current text
  function setPopularWords() {

    try {

      var aWords = Object.values(oWordTokens),
      aTags;

      aWords.sort(function(a, b){
        return d3.descending(a.weight, b.weight);
      });

      aTags = aWords.slice(0, 20).map(function(d){
        return d.label;
      }).filter(function(d){
        return aStopList.indexOf(d) == -1;
      }).slice(0, 5);

      var tags = wordTagsContainer.selectAll('.wttags__tag')
        .data(aTags);

      tags.enter()
        .append('li')
      .merge(tags)
        .classed('wttags__tag', true)
        .attr('data-tag', function(d){
          return d;
        })
        .text(function(d){
          return d;
        });

      // update tags
      wordTags = d3.selectAll('#wordtree_tags [data-tag]');

      bindEvents();

    }catch(e){

    }
    
  }

  function bindEvents() {

    // Listen to changes for the root word of the graph
    // ID wordtree_root for element
    // 

    // Root word
    wordInput.on('change', function(){

      sTreeType = wordLayout.node().value;
      sRootWord = wordInput.node().value;

      updateTree();

    });

    // Layout    
    wordLayout.on('change', function(){

      sTreeType = wordLayout.node().value;
      sRootWord = wordInput.node().value;

      updateTree();

    });

    // Tags
    wordTags.on('click', function(){

      // remove any other active tag
      var n = this,
      aSiblings = this.parentNode.children,
      iLength = aSiblings.length;

      for (var i = iLength - 1; i >= 0; i--) {
        d3.select(aSiblings[i])
          .classed('active', false);
      }

      // Add active class
      d3.select(n)
        .classed('active', true);

      // Update tree

      sTreeType = wordLayout.node().value;
      sRootWord = wordInput.node().value = this.getAttribute('data-tag');

      updateTree();

    });

    // Handle Resize
    // 
    d3.select(window)
      .on("keydown.hover", hoverKey)
      .on("keyup.hover", hoverKey)
      .on("resize", function(d){
        if (getActiveView('qualitative-tree')) {
          resize();
        }
      })
      //.on("popstate", change);
    
  }

  /*=================================
  =            Tree Core            =
  =================================*/


  function resize() {
    var textWindowWidth = 300;
    width = vis.node().clientWidth - textWindowWidth;
    height = Math.max((vis.node().clientHeight || height) - 0, 100);
    heatmap.attr("transform", "translate(" + (width - 20.5) + ",.5)")
        .select("rect.frame").attr("height", height - 1);
    svg .attr("width", width)
        .attr("height", height);
    clip.attr("width", width - 30.5)
        .attr("height", height);
    treeG.call(tree.width(width - 30).height(height - 20));
    updateHeatmap();
    text.style("width", textWindowWidth + 'px')
      .call(textViewer);
  }

  function processText(t) {
    var i = 0,
        m,
        n = 0,
        line = 0,
        lineLength = 0,
        tmp = text.append("span").text("m"),
        dx = 285 / tmp.node().offsetWidth;
    tmp.remove();
    tokens = [];
    lines = [];
    var line = [];
    oWordTokens = {};
    while (m = re.exec(t)) {
      var w = t.substring(i, m.index);
      if (/\r\n\r\n|\r\r|\n\n/.test(w)) {
        lines.push(line, []);
        line = [];
        lineLength = m[0].length;
      } else {
        lineLength += m[0].length + !!w.length;
        if (lineLength > dx) lineLength = m[0].length, lines.push(line), line = [];
      }
      var token = {token: m[0], lower: m[0].toLowerCase(), index: n++, whitespace: w, line: lines.length};
      tokens.push(token);
      line.push(token);
      i = re.lastIndex;
      // token count
      // 
      oWordTokens[token.lower] = oWordTokens[token.lower] || {label: token.token, weight: 0};
      ++oWordTokens[token.lower].weight;
    }
    lines.push(line);
    text.call(textViewer.size(lines.length));
    tree.tokens(tokens);
    change();
  }

  function url(o, push) {
    var query = [],
        params = {};
    for (var k in state) params[k] = state[k];
    for (var k in o) params[k] = o[k];
    for (var k in params) {
      query.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
    }
    history[push ? "pushState" : "replaceState"](null, null, "?" + query.join("&"));
  }

  function urlParams(h) {
    var o = {};
    h && h.split(/&/g).forEach(function(d) {
      d = d.split("=");
      o[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    });
    return o;
  }

  function change() {
    if (!location.search) {
      return;
    }
    var last = state ? state.source : null;
    state = urlParams(location.search.substr(1));
    if (tokens && tokens.length) {
      var start = state.prefix;
      if (!start) {
        url({prefix: start = tokens[0].token});
      }
      keyword
          .property("value", start);
      start = start.toLowerCase().match(re);
      treeG.call(tree.sort(state.sort === "occurrence"
            ? function(a, b) { return a.index - b.index; }
            : function(a, b) { return b.count - a.count || a.index - b.index; })
          .reverse(+state.reverse)
          .phraseLine(+state["phrase-line"])
          .prefix(start));
      refreshText(tree.root());
    }
  }

  function currentLine(node) {
    if (!node) return 0;
    var children = node.children;
    while (children && children.length) {
      node = children[0];
      children = node.children;
    }
    return node.tokens[0].line - 3; // bit of a hack!
  }

  function refreshText(node) {
    clearHighlight();
    var parent = node, depth = 0;
    while (parent) {
      depth += parent.tokens.length;
      parent = parent.parent;
    }
    selectedLines = [];
    highlightTokens(node, depth);
    updateHeatmap();
    text.call(textViewer.position(currentLine(node)));
  }

  function clearHighlight() {
    for (var i = -1; ++i < tokens.length;) tokens[i].highlight = false;
  }

  function highlightTokens(node, depth) {
    if (!node) return;
    if (node.children && node.children.length) {
      depth += node.tokens.length;
      node.children.forEach(function(child) {
        highlightTokens(child, depth);
      });
    } else {
      node.tokens.forEach(function(token) { token.highlight = true; });
      for (var n = node.tokens[0].index, i = Math.max(0, n - depth); i <= n; i++) {
        tokens[i].highlight = true;
        selectedLines.push(tokens[i].line);
      }
    }
  }

  function highlight(d) { return d.highlight; }

  function updateHeatmap() {
    try  {
      var line = heatmap.selectAll("line").data(selectedLines),
          n = textViewer.size();
      line.enter().insert("line", "rect").attr("x2", 20);
      line.attr("transform", function(d) { return "translate(0," + ((height * d / n) || 0)  + ")"; });
      line.exit().remove();
      var d = page.datum();
      d.h = Math.min(height, Math.max(10, height * height / (textViewer.rowHeight() * lines.length)));
      page.attr("height", (d.h - 1) || 0);
    }catch(e){}
  }

  function scroll() {
    var d = page.datum();
    page.attr("y", d.y = Math.max(0, Math.min(height - d.h, height * this.scrollTop / (textViewer.rowHeight() * lines.length))));
  }

  function drag(d) {
    d.y = Math.max(0, Math.min(height - d.h - 1, d3v3.event.y));
    text.node().scrollTop = d.y * textViewer.rowHeight() * lines.length / height;
    page.attr("y", d.y);
  }

  function hoverKey() {
    svg.classed("hover", d3.event.shiftKey);
  }
    
  
  
  /*=====  End of Tree Core  ======*/
  

  init();

  bindEvents();

  return {

    update: updateTree,

    onready: function(callback){
      if (typeof callback === "function") {
        readyHandler = callback;
      }
    },

    onupdate: function(callback){
      if (typeof callback === "function") {
        updateHandler = callback;
      }
    },

    getData: function(){
      return oTree;
    },

    resize: function(){

      resize();

    }

  }

}