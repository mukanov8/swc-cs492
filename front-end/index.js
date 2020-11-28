  function makeDraggable(evt) {
    let svg = evt.target;
    let selectedElement = false;
    let selectedElementText = false;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    function getMousePosition(evt) {
      let CTM = svg.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }
    function startDrag(evt) {
      selectedElement = evt.target;
      let text_nodes = $(selectedElement).parent().next().children();
      for (let i = 0; i < text_nodes.length; i++){
        if (text_nodes[i].textContent === selectedElement.textContent){
          selectedElementText = text_nodes[i];
        }
      }

      let transforms = selectedElement.transform.baseVal;
      let transforms_text = selectedElementText.transform.baseVal;
      console.log(transforms, transforms_text, selectedElementText);
      offset = getMousePosition(evt);
      // Ensure the first transform is a translate transform
      if ((transforms.length === 0 ||
        transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) || (transforms_text.length === 0 ||
        transforms_text.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE)) {
      // Create an transform that translates by (0, 0)
        var translate = svg.createSVGTransform();
        var translate_text = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        translate_text.setTranslate(0, 0);
      // Add the translation to the front of the transforms list
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        selectedElementText.transform.baseVal.insertItemBefore(translate_text, 0);
      }
      // Get initial translation amount
      transform = transforms.getItem(0);
      transform_text = transforms_text.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
      offset.x -= transform_text.matrix.e;
      offset.y -= transform_text.matrix.f;

      //Change wordcloud order in DOM
      $('svg').children()[0].children()[0];
      // var children = 
      // // console.log(children.map((child) => {return child.id;}))
      // if ($(selectedElement).parent().parent().parent() !== children[-1]){
      //   $(selectedElement).parent().parent().parent().insertAfter(children[children.length-1]);
      // }
      // console.log(children.map((child) => {return child.id;}));


    }
    function drag(evt) {
      if (selectedElement && selectedElementText) {
        evt.preventDefault();
        var coord = getMousePosition(evt);
        transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        transform_text.setTranslate(coord.x - offset.x, coord.y - offset.y);
      }
    }
    function endDrag(evt) {
      selectedElement = null;
      selectedElementText = null;
    }
  }

$( document ).ready(function() { 
  
    const webSocket = new WebSocket("ws://175.215.17.245:9998");
    
    let wordCloudParams = {
      processedText: {},
      clusterNum: 6,
      mode: ['rect', 'by-word'],
      angles: [0, 0],
      textSpacing: 1,
      font: 'Times New Roman',
      hoverColor: '#FFA317',
      selectColor: '#FFA317',
      wordColorIndex: 0,
    };

    webSocket.onopen = function(message){
      console.log("Server Connect"+"\n")
    };
    webSocket.onclose = function(message){
      console.log("Server Disconnect"+"\n")
    };
    webSocket.onerror = function(message){
      console.log("Error"+ "\n");
    };
    function sendMessage(){
      let message = document.getElementById("text").value;
      console.log("Send to Server => "+message+"\n")
      message = wordCloudParams.clusterNum.toString()+":"+message;
      webSocket.send(message);
    }
    function disconnect(){
      webSocket.close();
    }
    webSocket.onmessage = function(message){
      wordCloudParams.processedText = {};
      wordCloudParams.processedText = JSON.parse(message.data.slice(9));
      console.log("Recieved From Server"+"\n");
      $( "#vis" ).empty();
      generateCloud(wordCloudParams);
      $('svg').attr('onload', "makeDraggable(evt)");
    };

    document.getElementById("go").addEventListener("click", ()=> {sendMessage()} );


    

    const generateCloud = (wordCloudParams) => {
      anychart.onDocumentReady(function () {

      //below is sample input text for word cloud with 6 subclouds
      // let text2 = {"0": [{"x": "pop", "value": 75}], 
      //             "1": [{x: "pictures", value: 150}, {x: "peeped",value: 75}, {x: "daisies", value: 75}, {x: "flashed", value: 75}], 
      //             "2": [{"x": "watch", "value": 103}, {"x": "sitting", "value": 59}, {"x": "hear", "value": 58}], 
      //             "3": [{"x": "actually", "value": 45}, {"x": "suddenly", "value": 179}, {"x": "conversations", "value": 133}, {"x": "mind", "value": 100}, {"x": "never", "value": 86}, {"x": "moment", "value": 85}, {"x": "nothing", "value": 82}, {"x": "thought", "value": 81}, {"x": "stupid", "value": 75}, {"x": "pleasure", "value": 75}, {"x": "curiosity", "value": 75}, {"x": "considering", "value": 71}, {"x": "fortunately", "value": 69}, {"x": "wondered", "value": 66}, {"x": "reading", "value": 60}, {"x": "remarkable", "value": 59}, {"x": "shall", "value": 54}, {"x": "ought", "value": 53}, {"x": "looked", "value": 49}, {"x": "seemed", "value": 46}, {"x": "quite", "value": 44}, {"x": "feel", "value": 43}, {"x": "getting", "value": 42}, {"x": "found", "value": 39}, {"x": "feet", "value": 38}, {"x": "either", "value": 37}, {"x": "seen", "value": 35}, {"x": "worth", "value": 32}, {"x": "whether", "value": 29}, {"x": "could", "value": 19}, {"x": "would", "value": 13}], 
      //             "4": [{"x": "like", "value": 34}, {"x": "alice", "value": 452}, {"x": "rabbit", "value": 301}, {"x": "dear", "value": 150}, {"x": "sister", "value": 115}, {"x": "across", "value": 88}, {"x": "book", "value": 87}, {"x": "tired", "value": 75}, {"x": "sleepy", "value": 75}, {"x": "pink", "value": 75}, {"x": "oh", "value": 75}, {"x": "eyes", "value": 69}, {"x": "get", "value": 65}, {"x": "think", "value": 64}, {"x": "way", "value": 60}, {"x": "burning", "value": 59}, {"x": "hot", "value": 54}, {"x": "hedge", "value": 52}, {"x": "well", "value": 51}, {"x": "deep", "value": 49}, {"x": "white", "value": 43}, {"x": "natural", "value": 34}, {"x": "see", "value": 30}, {"x": "use", "value": 30}, {"x": "large", "value": 29}, {"x": "say", "value": 28}, {"x": "making", "value": 28}, {"x": "close", "value": 28}, {"x": "another", "value": 27}, {"x": "much", "value": 27}, {"x": "world", "value": 24}, {"x": "take", "value": 23}, {"x": "made", "value": 20}], 
      //             "5": [{"x": "started", "value": 35}, {"x": "ran", "value": 96}, {"x": "went", "value": 77}, {"x": "hurried", "value": 75}, {"x": "tunnel", "value": 69}, {"x": "stopping", "value": 64}, {"x": "afterwards", "value": 60}, {"x": "straight", "value": 56}, {"x": "picking", "value": 54}, {"x": "dipped", "value": 54}, {"x": "trouble", "value": 49}, {"x": "occurred", "value": 46}, {"x": "time", "value": 45}, {"x": "twice", "value": 45}, {"x": "field", "value": 38}, {"x": "took", "value": 36}, {"x": "falling", "value": 35}, {"x": "beginning", "value": 34}, {"x": "late", "value": 29}, {"x": "day", "value": 25}, {"x": "bank", "value": 21}]}
      // if(wordCloudParams.processedText.length>0){
      text2 = wordCloudParams.processedText;
      // }
 
      // create tag cloud
      let stage = acgraph.create('vis');
      let charts = [];
      let colors = [anychart.scales.ordinal(), anychart.scales.linearColor()]

      for (let i = 0; i < wordCloudParams.clusterNum; i ++){
        charts.push(anychart.tagCloud(text2));
      }
      for (let j = 0; j < charts.length; j ++){
        let boundVals = j<3 ? [j*'33' +'%', "0%", "33%", "50%"] : [(j-3)*'33' +'%', "50%", "33%", "50%"]
          // set data with settings
        charts[j].data(text2[j], {
          mode: wordCloudParams.mode,
          // minLength: 4,
          // maxItems: 100
        });
        charts[j]
          // set array of angles, by which words will be placed
          .angles(wordCloudParams.angles)
          .textSpacing(wordCloudParams.textSpacing)
          .bounds(boundVals)
          // set color scale
          .colorScale(colors[wordCloudParams.wordColorIndex])
          // set settings for normal state
          .normal({
            fontFamily:  wordCloudParams.font
          })
          // set settings for hovered state
          .hovered({
            fill: wordCloudParams.hoverColor
          })
          // set settings for selected state
          .selected({
            fill: wordCloudParams.selectColor,
            fontWeight: 'bold'
          })
          .tooltip().format('Importance: {%Value}');

          // set container id for the chart
          charts[j].container(stage);
          // initiate chart drawing
          charts[j].draw();

        }
        document.querySelector('svg').addEventListener('click', (evt) => makeDraggable(evt));  
      });
  }

})