  function makeDraggable(evt) {
    var svg = evt.target;
    var selectedElement = false;
    var selectedElementText = false;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }
    function startDrag(evt) {
      selectedElement = evt.target;
      var text_nodes = $(selectedElement).parent().next().children();
      for (var i = 0; i < text_nodes.length; i++){
        if (text_nodes[i].textContent === selectedElement.textContent){
          selectedElementText = text_nodes[i];
        }
      }

      var transforms = selectedElement.transform.baseVal;
      var transforms_text = selectedElementText.transform.baseVal;
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
    // WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
    
    let processedText = {};
    let clusterNum = 6;
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
      message = clusterNum.toString()+":"+message;
      webSocket.send(message);
    }
    function disconnect(){
      webSocket.close();
    }
    webSocket.onmessage = function(message){
      processedText = {};
      processedText = JSON.parse(message.data.slice(9));
      console.log("Recieved From Server"+"\n");
      $( "#vis" ).empty();
      generateCloud(processedText);
      $('svg').attr('onload', "makeDraggable(evt)");
      // processedText = JSON.parse(message.data);
    };
    // const sendUserText = ()=>{
    //   //TO-DO send message(user's input) via WebSocket to the server
    //   console.log(document.getElementById("text").value)
    // }
    document.getElementById("go").addEventListener("click", ()=> {sendMessage()} );


    

    const generateCloud = (cloudText) => {
      anychart.onDocumentReady(function () {
      // below is sample input text for 1 word subcloud
      // let text = 
      //   [
      //   {x: "learning", value: 80},
      //   {x: "includes", value: 56},
      //   {x: "lists", value: 44},
      //   {x: "meaning", value: 40},
      //   {x: "useful", value: 36},
      //   {x: "different", value: 32},
      //   {x: "grammar", value: 28},
      //   {x: "teaching", value: 24},
      //   {x: "example", value: 20},
      //   {x: "thing", value: 12},
      //   {x: "hey", value: 80},
      //   {x: "there", value: 56},
      //   {x: "how", value: 44},
      //   {x: "are", value: 40},
      //   {x: "you", value: 36},
      //   {x: "doing", value: 32},
      //   {x: "Iam", value: 28},
      //   {x: "doing", value: 24},
      //   {x: "quite", value: 20},
      //   {x: "well", value: 12}
      //   ]
      //below is sample input text for word cloud with 6 subclouds
      // let text2 = {"0": [{"x": "pop", "value": 75}], 
      //             "1": [{x: "pictures", value: 150}, {x: "peeped",value: 75}, {x: "daisies", value: 75}, {x: "flashed", value: 75}], 
      //             "2": [{"x": "watch", "value": 103}, {"x": "sitting", "value": 59}, {"x": "hear", "value": 58}], 
      //             "3": [{"x": "actually", "value": 45}, {"x": "suddenly", "value": 179}, {"x": "conversations", "value": 133}, {"x": "mind", "value": 100}, {"x": "never", "value": 86}, {"x": "moment", "value": 85}, {"x": "nothing", "value": 82}, {"x": "thought", "value": 81}, {"x": "stupid", "value": 75}, {"x": "pleasure", "value": 75}, {"x": "curiosity", "value": 75}, {"x": "considering", "value": 71}, {"x": "fortunately", "value": 69}, {"x": "wondered", "value": 66}, {"x": "reading", "value": 60}, {"x": "remarkable", "value": 59}, {"x": "shall", "value": 54}, {"x": "ought", "value": 53}, {"x": "looked", "value": 49}, {"x": "seemed", "value": 46}, {"x": "quite", "value": 44}, {"x": "feel", "value": 43}, {"x": "getting", "value": 42}, {"x": "found", "value": 39}, {"x": "feet", "value": 38}, {"x": "either", "value": 37}, {"x": "seen", "value": 35}, {"x": "worth", "value": 32}, {"x": "whether", "value": 29}, {"x": "could", "value": 19}, {"x": "would", "value": 13}], 
      //             "4": [{"x": "like", "value": 34}, {"x": "alice", "value": 452}, {"x": "rabbit", "value": 301}, {"x": "dear", "value": 150}, {"x": "sister", "value": 115}, {"x": "across", "value": 88}, {"x": "book", "value": 87}, {"x": "tired", "value": 75}, {"x": "sleepy", "value": 75}, {"x": "pink", "value": 75}, {"x": "oh", "value": 75}, {"x": "eyes", "value": 69}, {"x": "get", "value": 65}, {"x": "think", "value": 64}, {"x": "way", "value": 60}, {"x": "burning", "value": 59}, {"x": "hot", "value": 54}, {"x": "hedge", "value": 52}, {"x": "well", "value": 51}, {"x": "deep", "value": 49}, {"x": "white", "value": 43}, {"x": "natural", "value": 34}, {"x": "see", "value": 30}, {"x": "use", "value": 30}, {"x": "large", "value": 29}, {"x": "say", "value": 28}, {"x": "making", "value": 28}, {"x": "close", "value": 28}, {"x": "another", "value": 27}, {"x": "much", "value": 27}, {"x": "world", "value": 24}, {"x": "take", "value": 23}, {"x": "made", "value": 20}], 
      //             "5": [{"x": "started", "value": 35}, {"x": "ran", "value": 96}, {"x": "went", "value": 77}, {"x": "hurried", "value": 75}, {"x": "tunnel", "value": 69}, {"x": "stopping", "value": 64}, {"x": "afterwards", "value": 60}, {"x": "straight", "value": 56}, {"x": "picking", "value": 54}, {"x": "dipped", "value": 54}, {"x": "trouble", "value": 49}, {"x": "occurred", "value": 46}, {"x": "time", "value": 45}, {"x": "twice", "value": 45}, {"x": "field", "value": 38}, {"x": "took", "value": 36}, {"x": "falling", "value": 35}, {"x": "beginning", "value": 34}, {"x": "late", "value": 29}, {"x": "day", "value": 25}, {"x": "bank", "value": 21}]}
      let text2 ={};
      // if(cloudText.length>0){
      text2 = cloudText;
      // }
 

      //0-6: cluster number
      // create tag cloud
      //   var title = anychart.standalones.title();
      // title.padding(10).text('CS492 - Semantic Word Clouds');
      var stage = acgraph.create('vis');
      var charts = [];
      for (var i = 0; i < 6; i ++){
        charts.push(anychart.tagCloud(text2));
      }
      for (var j = 0; j < charts.length; j ++){
        let boundVals = j<3 ? [j*'33' +'%', "0%", "33%", "50%"] : [(j-3)*'33' +'%', "50%", "33%", "50%"]
          // set data with settings
        charts[j].data(text2[j], {
          mode: 'by-word',
          // minLength: 4,
          // maxItems: 100s
        });
        // set chart title
        charts[j]
          // .title(
          //   'CS492 - Semantic Word Clouds'
          // )
          // set array of angles, by which words will be placed
          .angles([0])
          .bounds(boundVals)
          // enabled color range
          // set color scale
          .colorScale(anychart.scales.ordinalColor())
          // set settings for normal state
          .normal({
            fontFamily: 'Times New Roman'
          })
          // set settings for hovered state
          .hovered({
            fill: '#df8892'
          })
          // set settings for selected state
          .selected({
            fill: '#df8892',
            fontWeight: 'bold'
          });

          // set container id for the chart
          charts[j].container(stage);
          // initiate chart drawing
          charts[j].draw();

        }
        

        document.querySelector('svg').addEventListener('click', (evt) => makeDraggable(evt));
        
      });
  }

})