/**
 * Word Tree Code
 */

function WordTree(oDispatch) {

  // validate availability of Event Bus
  if (!oDispatch) {
    console.log('Error:', 'WordTree not initialised. No dispatch passed.');
    return false;
  }
  

  /**
   * Dispatch event bus.
   * This is how WordTree communicates with rest of the framework.
   * Events supported: 
   */
  var dispatch = oDispatch,

  bIsLibraryLoaded = false,

  // Tree object reference
  oTree,
  oTreeData,
  oTreeOptions
  ;

  // Do one time initialization
  // 
  function init() {

    loadChartLibrary();

    // initialize variables
    // 
    
    oTreeOptions = {
      wordtree: {
        format: 'implicit',
        type: 'suffix',
        word: null
      }
    };

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

    if (bIsLibraryLoaded) {

    }else{
      dispatch.on('libraryLoaded.drawToDOM', function(){

      });
    }

    function _draw() {

        // create instance of the word tree
        oTree = new google.visualization.WordTree(elSelectorTree);

        drawTree(oConfig);
        
    }
    
  }

  function prepareConfig() {

    // prepare dataset
    oTreeData = google.visualization.arrayToDataTable(
      [ ['Phrases'],
        [sText]
      ]
    );
    
  }

  /**
   * Update the root word
   * @param  {string} sRootWord A single word
   */
  function updateRoot(sRootWord) {
    
  }

  /**
   * Update the tree
   * @param  {object} oParams Apply settings to the word tree
   */
  function drawTree(oConfig) {

    // draw tree
    oTree.draw(oConfig.data, oConfig.options);
    
  }


  return {

    draw: drawToDOM

  }

}