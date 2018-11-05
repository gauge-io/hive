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
  sRootWord
  ;

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
   */
  function prepareConfig() {
    
    // prepare default Tree config
    oTreeOptions = {
      wordtree: {
        // We are only using implicit
        format: 'implicit',
        type: sTreeType,
        word: sRootWord
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
      /*
      updateTree({
        type: wordLayout.node().value,
        rootWord: wordInput.node().value = this.getAttribute('data-tag')
      });
      */

      sTreeType = wordLayout.node().value;
      sRootWord = wordInput.node().value = this.getAttribute('data-tag');

      updateTree();

    });
    
  }

  init();

  bindEvents();



  return {

    update: updateTree

  }

}