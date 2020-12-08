function makeDraggable(evt) {
  let svg = evt.target;
  let selectedElement = false;
  let selectedElementText = false;
  if (svg.tagName == "path"){
    return;
  }
  let flag = false;

  evt.preventDefault();
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
    flag = true;
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
    var children = $('svg').children().children();
    // console.log(children.map((child) => {return child.id;}))
    if ($(selectedElement).parent().parent().parent() !== children[children.length-2]){
      $(selectedElement).parent().parent().parent().insertAfter(children[children.length-2]);
    }
     // console.log(children.map((child) => {return child.id;}));


    }
    function drag(evt) {
      if (selectedElement && selectedElementText) {
        evt.preventDefault();
        var coord = getMousePosition(evt);
        transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        transform_text.setTranslate(coord.x - offset.x, coord.y - offset.y);
        flag = true;
      }
    }
    function endDrag(evt) {
     // selectedElement.parent().removeChild(selectedElement);
     // selectedElementText.parent().removeChild(selectedElementText);
     if (flag === true){
      var fc = $(selectedElement).parent().parent().attr('transform').toString();
      console.log(fc.split("matrix"));
      console.log(getMousePosition(evt));
      flag = false;
   }
      selectedElement = null;
      selectedElementText = null;
    }
  }

$( document ).ready(function() { 
    
    //parameters that user can modify and that are passed to WC.
    let wordCloudParams = {
      processedText: {},
      clusterNum: 6,
      mode: 1,
      angles: [0, 0],
      textSpacing: 1,
      font: 'Times New Roman',
      hoverColor: '#FFA317',
      selectColor: '#FFA317',
      wordColorIndex: 0,
      clusterFlag: false,
      placeholderFlag: true,
      //placeholder word cloud data
      placeholderText: {"0": [{"x": "prototypes", "value": 138}, {"x": "prototype", "value": 554}, {"x": "ui", "value": 138}, {"x": "tested", "value": 101}], "1": [{"x": "time", "value": 41}, {"x": "novel", "value": 122}, {"x": "centered", "value": 117}, {"x": "features", "value": 111}, {"x": "page", "value": 109}, {"x": "three", "value": 98}, {"x": "design", "value": 95}, {"x": "created", "value": 79}, {"x": "separate", "value": 74}, {"x": "complete", "value": 68}, {"x": "management", "value": 50}, {"x": "around", "value": 43}, {"x": "earlier", "value": 40}, {"x": "one", "value": 26}], "2": [{"x": "interactive", "value": 138}, {"x": "reuse", "value": 138}, {"x": "login", "value": 138}, {"x": "users", "value": 88}], "3": [{"x": "stages", "value": 97}, {"x": "distinct", "value": 138}, {"x": "interaction", "value": 138}, {"x": "functional", "value": 128}, {"x": "complex", "value": 85}], "4": [{"x": "scenarios", "value": 117}, {"x": "tasks", "value": 513}, {"x": "detailed", "value": 82}, {"x": "data", "value": 58}], "5": [{"x": "enough", "value": 63}, {"x": "build", "value": 222}, {"x": "need", "value": 166}, {"x": "support", "value": 162}, {"x": "fake", "value": 138}, {"x": "fed", "value": 99}, {"x": "revise", "value": 98}, {"x": "choose", "value": 95}, {"x": "supports", "value": 89}, {"x": "flexible", "value": 85}, {"x": "sure", "value": 80}, {"x": "intend", "value": 79}, {"x": "ready", "value": 75}, {"x": "mean", "value": 72}, {"x": "needs", "value": 68}, {"x": "means", "value": 68}, {"x": "fully", "value": 66}, {"x": "rather", "value": 63}, {"x": "target", "value": 56}, {"x": "least", "value": 55}, {"x": "make", "value": 46}, {"x": "may", "value": 42}]}
    };

    //updates word cloud according to user configurations
    const updateParams = () => { 
        //checks which word cloud mode was choosen
        let rbs = document.querySelectorAll('input[name="mode"]');
        for (let rb of rbs) {
            if (rb.checked) {
                wordCloudParams.mode = parseInt(rb.value);
                break;
            }
        }
        //checks the chosen angles
        wordCloudParams.angles = [parseInt(document.getElementById("anglefrom").value), parseInt(document.getElementById("angleto").value)]
        //checks the chosen words color 
        wordCloudParams.wordColorIndex = parseInt(document.getElementById("wordcolor").value);
        //checks the chosen spacing bt words
        wordCloudParams.textSpacing = parseInt(document.getElementById("textspacing").value);
        //checks the chosen font
        wordCloudParams.font = document.getElementById("font").value;
        //checks if cluster number has changed->either updates the cloud or sends updated data to server
        if (wordCloudParams.clusterFlag){
          wordCloudParams.clusterFlag = false;
          sendMessage();
        }  
        else updateCloud()
    }
    //checks if the #of clusters changed(#of categories) by user. Updates the WC parameter accordingly.
    const updateClusters = () =>{
      let newClusterNum = parseInt(document.getElementById("clusters").value)
      if (newClusterNum!=wordCloudParams.clusterNum){
        wordCloudParams.clusterFlag = true;
        wordCloudParams.clusterNum = newClusterNum;
      }
      else wordCloudParams.clusterFlag = false;
    }
    //re-renders the cloud with updated parameters
    const updateCloud = () => {
      $( "#vis" ).empty();
      generateCloud(wordCloudParams);
 
    }
    //makes the screenshot and downloads the WC
    const saveAsImage =() =>{
      const screenshotTarget = document.getElementById("vis");
      const downloadURI= (uri, name) =>{
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
        //after creating link you should delete dynamic link (not implemented)
        // clearDynamicLink(link); 
      }
      html2canvas(screenshotTarget).then((canvas) => {
          let myImage = canvas.toDataURL("image/png");;
          downloadURI("data:" + myImage, "myWordCloud.png");
      });
    }
 
    function sendMessage(){
      wordCloudParams.placeholderFlag = false;
      let message = document.getElementById("text").value;
      message = wordCloudParams.clusterNum.toString()+":"+message;
      console.log("Send to Server => "+message+"\n")
      fetch('/generate', {
        method: 'POST',
        body: JSON.stringify({msg:message,}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
      }).then(function (data) {
        wordCloudParams.processedText = data
        console.log(data);
        updateCloud()
      }).catch(function (error) {
        console.warn('Something went wrong.', error);
      });
    }

    //the user text input send button, user customization apply button, 
    //user selected #of cluster button, user download WC button listeners 
    document.getElementById("go").addEventListener("click", ()=> {sendMessage()} );
    document.getElementById("apply").addEventListener("click", ()=> {updateParams()} );
    document.getElementById("clusters").addEventListener("change", ()=> {updateClusters()} );
    document.getElementById("download-png").addEventListener("click", () =>{saveAsImage()} );
    
    //main function for generating the word cloud
    const generateCloud = (wordCloudParams) => {
      
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }

      anychart.onDocumentReady(function () {

      if (wordCloudParams.placeholderFlag) text2 = wordCloudParams.placeholderText;
      else text2 = wordCloudParams.processedText;
      
      // create tag cloud
      let stage = acgraph.create('vis');
      let charts = [];
      let color = anychart.scales.ordinal();
      let modes = ['rect', 'circular']
      let randColors = Array.from(' '.repeat(wordCloudParams.clusterNum));

      if (wordCloudParams.wordColorIndex==0){
        // let colorPalette = anychart.palettes.defaultPalette.concat(anychart.palettes.provence);
        // colorPalette = colorPalette.concat(anychart.palettes.wines);
        // colorPalette = colorPalette.concat(anychart.palettes.pastel);
        let colorPalette = ["#64b5f6", "#1976d2", "#ef6c00", "#ffd54f", "#455a64", "#96a6a6", "#dd2c00", "#00838f", "#00bfa5", "#ffa000", "#a53db1", "#faabc9", "#cade58"]
        for (let i=0; i< randColors.length;i++){
          let randInt = getRandomInt(0, colorPalette.length )
          randColors[i] = colorPalette[randInt]
          colorPalette.splice(randInt,1)
        }
      }
      else if (wordCloudParams.wordColorIndex==2){
        color = anychart.scales.linearColor()
      }

      for (let i = 0; i < wordCloudParams.clusterNum; i ++){
        charts.push(anychart.tagCloud(text2));
      }
      for (let j = 0; j < charts.length; j ++){
        let boundVals = j<3 ? [j*'33' +'%', "0%", "33%", "50%"] : [(j-3)*'33' +'%', "50%", "33%", "50%"]
          // set data with settings
        charts[j].data(text2[j], {
          mode: modes[wordCloudParams.mode],
          // minLength: 4,
          // maxItems: 100
        });
        charts[j]
          // set array of angles, by which words will be placed
          .angles(wordCloudParams.angles)
          // set the spacing between the word in WC
          .textSpacing(wordCloudParams.textSpacing)
          .bounds(boundVals)
          // set color scale
          .colorScale(color)
          // set settings for normal state
          .normal({
            fontFamily:  wordCloudParams.font,
            fill: (wordCloudParams.wordColorIndex==0)? randColors[j]: charts[j].normal().fill()
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
          // customize  the tooltip
          .tooltip().format('Importance: {%Value}');

          // set container id for the chart
          charts[j].container(stage);
          // initiate chart drawing
          charts[j].draw();
          $('svg').attr('onload', 'makeDraggable(evt)');
        }
       // document.querySelector('svg').addEventListener('click', (evt) => makeDraggable(evt));  
      });
  }
  generateCloud(wordCloudParams);
     
});

 // Select the node that will be observed for mutations
 const targetNode = document.getElementById('vis');

 // Options for the observer (which mutations to observe)
 const config = { attributes: false, childList: true, subtree: false };

 // Callback function to execute when mutations are observed
 const callback = function(mutationsList, observer) {
     // Use traditional 'for loops' for IE 11
     for(const mutation of mutationsList) {
         if (mutation.type === 'childList') {
             $('svg').click((evt) => makeDraggable(evt));
             $('svg g g g').dblclick(function(event){
               event.preventDefault();
               event.stopPropagation();
              $('textarea').highlightWithinTextarea({
                highlight: event.target.textContent
              });
              $('.hwt-container').css("width", "100%");
             });
         }
     }
 };

 // Create an observer instance linked to the callback function
 const observer = new MutationObserver(callback);

 // Start observing the target node for configured mutations
 observer.observe(targetNode, config);

 // Later, you can stop observing
// observer.disconnect();
