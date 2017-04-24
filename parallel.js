w = 300; // Width of our visualization
h = 800; // Height of our 
yOffset = 50; // Space for y-axis labels
margin = 10; // Margin around visualization

vals = ['flight_index', 'num_o_ring_distress', 'launch_temp',
  'leak_check_pressure', 'tufte_metric'
];
labels = ['Flight Index', 'O-Ring Distress', 'Launch Temp',
'Leak Pressure', 'Tufte Metric'];


d3.csv("challenger.csv", function(data) {

  for(i=0; i<5; i++){
    plot_axes(data, vals[i]);
  }

});

function plot_axes(data, xVal){
  xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[xVal]);
      }),
      d3.max(data, function(d) {
        return parseFloat(d[xVal]);
      })
    ])
    .range([yOffset + margin, h-20]);

    // Next, we will create an SVG element to contain our visualization.
    svg = d3.select('body').append('svg')
      .attr('width', w)
      .attr('height', h)


    axis = d3.svg.axis()
      .scale(xScale)
      .orient('right')
      .ticks(1);
    axisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + yOffset + ',0)')
      .call(axis);
    label = svg.append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 20)
          .text(xVal);

}


// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}
