import anychart from 'anychart'
anychart.onDocumentReady(function () {
  var text = [
    {x: "learning", value: 80, category: "noun"},
    {x: "includes", value: 56, category: "verb"},
    {x: "lists", value: 44, category: "noun"},
    {x: "meaning", value: 40, category: "noun"},
    {x: "useful", value: 36, category: "adjective"},
    {x: "different", value: 32, category: "adjective"},
    {x: "grammar", value: 28, category: "noun"},
    {x: "teaching", value: 24, category: "noun"},
    {x: "example", value: 20, category: "noun"},
    {x: "thing", value: 12, category: "noun"}
];
    // create tag cloud
    var chart = anychart.tagCloud(text);
    // set data with settings
    // chart.data(text, {
    //   mode: 'by-word',
    //   minLength: 4,
    //   maxItems: 200
    // });
    // set chart title
    chart
      .title(
        'CS492 - Semantic Word Clouds'
      )
      // set array of angles, by which words will be placed
      .angles([0])
      // enabled color range
      .colorRange(true)
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
    chart.container('container');
    // initiate chart drawing
    chart.draw();
  });
