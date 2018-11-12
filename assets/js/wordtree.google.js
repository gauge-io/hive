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

  var dispatch = d3.dispatch('libraryLoaded'),

  bIsLibraryLoaded = false,

  // Tree object reference
  oTree,
  oTreeData,
  oTreeOptions,
  sTreeText,
  sTreeType,
  sRootWord,

  // DOM elements
  // 
  wordInput = d3.select('#wordtree_root'),
  wordLayout = d3.select('#wordtree_layout_switch'),
  wordTagsContainer = d3.select('#wordtree_tags'),
  wordTags = d3.selectAll('#wordtree_tags [data-tag]');
  
  // Do one time initialization
  // 
  function init() {

    loadChartLibrary();

    sTreeText = oConfig.text;

    // default tree type
    sTreeType = 'suffix';

    // default Root word
    // first word of text
    sRootWord = (sTreeText || ' ').split(' ')[0];

    // Instantiate and draw the Tree
    drawToDOM(elSelectorTree);

  }

  // Load tree plugin
  function loadChartLibrary() {

    google.charts.load('current', {
      packages:['wordtree']
    });
    google.charts.setOnLoadCallback(onChartLibraryLoaded);
    
  }

  // Triggered once the Google charts library plugin has been loaded
  function onChartLibraryLoaded() {
    bIsLibraryLoaded = true;

    dispatch.call('libraryLoaded', null, true);
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

      // create instance of the word tree
      oTree = new google.visualization.WordTree(elSelectorTree);

      // Bind select/click event handler
      google.visualization.events.addListener(oTree, 'select', selectHandler);

      // Bind on ready event
      google.visualization.events.addListener(oTree, 'ready', readyHandler);

      // display root word
      wordInput.node().value = sRootWord;

      drawTree();
        
    }

    // When a word is clicked
    // update the rootWord
    function selectHandler() {
      var selectedItem = oTree.getSelection();
      if (selectedItem && selectedItem.word) {
        sRootWord = selectedItem.word;
      }
    }

    if (bIsLibraryLoaded) {
      
      _draw();

    }else{
      
      dispatch.on('libraryLoaded.drawToDOM', function(){
        
        _draw();

      });

    }
    
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
    oTreeOptions = {
      wordtree: {
        // We are only using implicit
        format: 'implicit',
        maxFontSize: 14,
        //sentenceSeparator: '\s*(.+?(?:[?!]+|$|\.(?=\s?[A-Za-z]|$)))\s*',
        sentenceSeparator: '\\s*(.+?(?:[?!]+|$|\\.(?=\\s+[A-Za-z]|$)))\\s*',
        type: sTreeType,
        word: sRootWord = (sRootWord||'').replace(/[\ ,.!]/gi, '')
      }
    };

    // prepare dataset
    oTreeData = google.visualization.arrayToDataTable([ 
      ['Phrases'],
      [sTreeText]
    ]);
    
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
    }

    if (!bIsLibraryLoaded) {
      return false;
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
    var t1 = new Date();
    //oTree.clearChart();
    
    updateHandler();

    setTimeout(function(){
      oTree.draw(oTreeData, oTreeOptions);

      setPopularWords();
    }, 1);
    
  }

  // Select TOP 5 words with most weight
  // from the current text
  function setPopularWords() {

    try {

      var aWords = oTree.tree.Me,
      aTags;

      aWords.sort(function(a, b){
        return d3.descending(a.weight, b.weight);
      });

      aTags = aWords.slice(0, 5).map(function(d){
        return d.label;
      });

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
    
  }

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
    }

  }

}