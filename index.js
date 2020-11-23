


anychart.onDocumentReady(function () {
  var text = [
    {x: "learning", value: 80},
    {x: "includes", value: 56},
    {x: "lists", value: 44},
    {x: "meaning", value: 40},
    {x: "useful", value: 36},
    {x: "different", value: 32},
    {x: "grammar", value: 28},
    {x: "teaching", value: 24},
    {x: "example", value: 20},
    {x: "thing", value: 12},
    {x: "hey", value: 80},
    {x: "there", value: 56},
    {x: "how", value: 44},
    {x: "are", value: 40},
    {x: "you", value: 36},
    {x: "doing", value: 32},
    {x: "Iam", value: 28},
    {x: "doing", value: 24},
    {x: "quite", value: 20},
    {x: "well", value: 12}
  ];

    // create tag cloud
    //   var title = anychart.standalones.title();
    // title.padding(10).text('CS492 - Semantic Word Clouds');
    var stage = acgraph.create('vis');
    var charts = [];
    for (var i = 0; i < 2; i ++){
      charts.push(anychart.tagCloud(text));
    }

    for (var j = 0; j < charts.length; j ++){
      // set data with settings
    charts[j].data(text, {
      mode: 'by-word',
      minLength: 4,
      maxItems: 100
    });
    // set chart title
    charts[j]
      // .title(
      //   'CS492 - Semantic Word Clouds'
      // )
      // set array of angles, by which words will be placed
      .angles([0])
      .bounds(j*'33' +'%', "5%", "33%", "50%")
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

  
   
    // $('.draggable').css('cursor', 'move');
    // $('.draggable').click(function(event){
    //     console.log(event.target);
    //     console.log(event.target);
    // });

    
    

    $('svg').attr('onload', "makeDraggable(evt)");
    
  });

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

  
