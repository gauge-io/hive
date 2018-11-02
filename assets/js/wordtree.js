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
  sTreeText
  ;

  // Do one time initialization
  // 
  function init() {

    loadChartLibrary();

    sTreeText = oConfig.text;

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

      drawTree();
        
    }


    if (bIsLibraryLoaded) {
      
      _draw();

    }else{
      
      dispatch.on('libraryLoaded.drawToDOM', function(){
        
        _draw();

      });

    }
    
  }

  /**
   * Prepare the configuration and dataset for Tree
   * @param  {object} oParams Settings for word tree
   * 
   * Properties of oParams: {
   *   type: [string] prefix, suffix, double
   *   text: [string] Full text of the Tree
   *   rootWord: [string] A word to be set as the Tree's root
   * }
   */
  function prepareConfig(oParams) {

    oParams = Object.assign({
      type: 'suffix',
      rootWord: null,
      text: ''
    }, oParams || {});
    
    // prepare default Tree config
    oTreeOptions = {
      wordtree: {
        // We are only using implicit
        format: 'implicit',
        type: oParams.type,
        word: oParams.rootWord
      }
    };

    // prepare dataset
    oTreeData = google.visualization.arrayToDataTable([ 
      ['Phrases'],
      [oParams.text]
    ]);
    
  }

  /**
   * Update the Word Tree using oConfig parameters
   * 
   * @param  {object} oParams Settings for word tree
   * 
   * Properties of oParams: {
   *   type: [string] prefix, suffix, double
   *   text: [string] Full text of the Tree
   *   rootWord: [string] A word to be set as the Tree's root
   * }
   */
  function updateTree(oParams) {

    oParams = Object.assign(oParams, {
      text: sTreeText
    });

    prepareConfig(oParams);

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
    oTree.draw(oTreeData, oTreeOptions);
    
  }

  function bindEvents() {

    // Listen to changes for the root word of the graph
    // ID wordtree_root for element
    // 

    var wordInput = d3.select('#wordtree_root'),
    wordLayout = d3.select('#wordtree_layout_switch'),
    wordTags = d3.selectAll('#wordtree_tags [data-tag]');
    
    // Root word
    wordInput.on('change', function(){

      updateTree({
        type: wordLayout.node().value,
        rootWord: wordInput.node().value
      });

    });

    // Layout    
    wordLayout.on('change', function(){

      updateTree({
        type: wordLayout.node().value,
        rootWord: wordInput.node().value
      });

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
      updateTree({
        type: wordLayout.node().value,
        rootWord: wordInput.node().value = this.getAttribute('data-tag')
      });

    });
    
  }

  init();

  bindEvents();



  return {

    update: updateTree

  }

}