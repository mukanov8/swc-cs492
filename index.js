

anychart.onDocumentReady(function () {
  $.ajax(
    'https://cdn.anychart.com/samples/tag-cloud/alice-in-wonderland/text.txt'
  ).done(function (text) {
    // create tag cloud
    var chart = anychart.tagCloud();
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
});