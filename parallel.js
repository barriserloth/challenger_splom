w = 1500; // Width of our visualization
h = 800; // Height of our
yOffset = 50; // Space for y-axis labels
margin = 10; // Margin around visualization
space = 275;

var x = d3.scale.ordinal().rangePoints([10, w], 1)

vals = ['flight_index', 'num_o_ring_distress', 'launch_temp',
  'leak_check_pressure', 'tufte_metric'
];
labels = ['Flight Index', 'O-Ring Distress', 'Launch Temp',
'Leak Pressure', 'Tufte Metric'];

scales = [];

// Next, we will create an SVG element to contain our visualization.
svg = d3.select('body').append('svg')
  .attr('width', w)
  .attr('height', h)

d3.csv("challenger.csv", function(data) {

  for(i=0; i<5; i++){
    plot_axes(data, vals[i], labels[i], i);
  }

  lines = svg.append("g")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", function(d){
            string = 'M '
            for(i=0; i<5; i++){
              string += (10 + 275*i) + ' ';
              string += ((scales[i](d[vals[i]])));
              console.log(scales[i](d[vals[i]]));
              if (i != 4){
                string += ' L ';
              }
            }
            return string;
        })
        .attr('stroke', 'red')
        .attr('fill', 'none');


});

function plot_axes(data, xVal, xLabel, i){

  xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[xVal]);
      }),
      d3.max(data, function(d) {
        return parseFloat(d[xVal]);
      })
    ])
    .range([yOffset + margin, h-20]);

    scales.push(xScale);

    axis = d3.svg.axis()
      .scale(xScale)
      .orient('right')
      .ticks(10);
    axisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + (10 + (i*space))+ ',0)')
      .call(axis);
    label = svg.append('text')
          .attr('class', 'label')
          .attr('x', 10+i*space)
          .attr('y', 20)
          .text(xLabel);


}
