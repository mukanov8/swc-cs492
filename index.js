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
    var chart = anychart.tagCloud(text);
    // set data with settings
    chart.data(text, {
      mode: 'by-word',
      minLength: 4,
      maxItems: 200
    });
    // set chart title
    chart
      .title(
        'CS492 - Semantic Word Clouds'
      )
      // set array of angles, by which words will be placed
      .angles([0])
      // enabled color range
      // .colorRange(true)
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
