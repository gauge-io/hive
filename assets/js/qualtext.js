function QualText(){

  var wsport = 8282,
  host = '34.94.239.124',
  ST_API = 'http://'+host+':'+ wsport +'/scattertext/',
  // file uuid
  UUID;

  // Create WebSocket connection.
  const socket = new WebSocket('ws://'+host+':'+wsport);

  // Connection opened
  socket.onopen = function (event) {
    socket.send('Hello Server!');
  }

  // Listen for messages
  socket.onmessage = function (event) {
    var result = JSON.parse(event.data);
    console.log('Message from server ', result);

    if(result.type == 'uuid' && uuid() == result.msg){
      /*

      // Change focus to the output tab
      $("#output-tab span").click();

      $("iframe")
        .removeClass("hidden")
        .attr("src", "/html/"+result.msg+".html");

      $("#loader").addClass("hidden");

      */

      onsuccess(result);
    }
  }

  socket.onclose = function (event) {
    console.log('Connection closed ', event);
  }

  socket.onerror = function (event) {
    console.log('Error ', event);
  }

  // On Submit Event handler
  /*
  $("#submit-csv").on("click", function () {

    // parse CSV text
    try {

      var csvText = elCSV.val();

      var oParsedCSV = d3.csvParse(csvText);

      console.log('oParsedCSV', oParsedCSV);

      sendPOST(oParsedCSV, {
        textCol: '_transcript',
        categoryCol: 'Segment',
        category: 'Young Operators',
        isEmpath: false,
        removeStopwords: true,
        categoryName: 'Segment A',
        notCategoryName: 'Segment B',
        minTermFrequency: 8
      });

      $("#loader").removeClass("hidden");
      $("iframe").addClass("hidden");

    } catch (error) {
      console.log('error', error);
    }

  });
  */

  // Send HTTP POST to send CSV data to the server
  function sendPOST(data, config){
    $.ajax({
      type: "POST",
      url: ST_API, 
      data: JSON.stringify({
        data: data,
        config: config
      }),
      dataType: "json",
      contentType: "application/json"
    }).done(function(out){
      console.log('Processed', out);
      // The output will be generated with this file name
      uuid(out.fileName);
    }).fail(function(){
      console.log('ERROR')
    })
  }

  function uuid(val){
    if(!arguments.length){
      return UUID;
    }
    UUID = val;
  }

  function onsuccess(oData){}
  function onerror(event){}
  function onclose(event){}

  return {
    sendRequest: sendPOST,
    onmessage: function(fnCallback){
      if(typeof fnCallback === "function"){
        onsuccess = fnCallback;
      }
    },
    onerror: function(fnCallback){
      if(typeof fnCallback === "function"){
        onerror = fnCallback;
      }
    },
    onclose: function(fnCallback){
      if(typeof fnCallback === "function"){
        onclose = fnCallback;
      }
    },
  }

}