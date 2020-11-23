$( document ).ready(function() {
  
anychart.onDocumentReady(function () {

  const sendUserText = ()=>{
    //TO-DO send message(user's input) via WebSocket to the server
    console.log(document.getElementById("text").innerHTML)
  }
  document.getElementById("go").addEventListener("click", ()=> {sendUserText()} );
  // document.getElementById("color-selector").addEventListener("click", ()=> {sendUserText()} );
  
  
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
    for (var i = 0; i < 6; i ++){
      charts.push(anychart.tagCloud(text));
    }

    for (var j = 0; j < charts.length; j ++){

      let boundVals = j<3 ? [j*'33' +'%', "0%", "33%", "50%"] : [(j-3)*'33' +'%', "50%", "33%", "50%"]
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
    
  });
});
