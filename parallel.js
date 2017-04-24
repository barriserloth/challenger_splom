w = 1500; // Width of our visualization
h = 800; // Height of our
yOffset = 50; // Space for y-axis labels
margin = 40; // Margin around visualization
space = 275;

var x = d3.scale.ordinal().rangePoints([margin, w], 1)

vals = ['flight_index', 'num_o_ring_distress', 'launch_temp',
  'leak_check_pressure', 'tufte_metric'
];
labels = ['Flight Index', 'O-Ring Distress', 'Launch Temp',
  'Leak Pressure', 'Tufte Metric'
];

scales = [];

// Next, we will create an SVG element to contain our visualization.
svg = d3.select('body').append('svg')
  .attr('width', w)
  .attr('height', h)

d3.csv("challenger.csv", function(data) {
  for (i = 0; i < 5; i++) {
    plot_axes(data, vals[i], labels[i], i);
  }

  tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  lines = svg.append("g")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", function(d) {
      string = 'M '
      for (i = 0; i < 5; i++) {
        string += (margin + 275 * i) + ' ';
        string += ((scales[i](d[vals[i]])));
        console.log(scales[i](d[vals[i]]));
        if (i != 4) {
          string += ' L ';
        }
      }
      return string;
    })
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', 'red');
      tooltip.transition()
        .duration(200)
        .style('opacity', .9)
      tooltip.html('Flight ' + d[vals[0]])
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 14) + 'px');
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', 'steelblue');
    });


});

function plot_axes(data, xVal, xLabel, i) {
  xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[xVal]);
      }),
      d3.max(data, function(d) {
        return parseFloat(d[xVal]);
      })
    ])
    .range([margin, h - 20]);

  scales.push(xScale);

  axis = d3.svg.axis()
    .scale(xScale)
    .orient('right')
    .ticks(0)
    .outerTickSize(0);
  axisG = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + (margin + (i * space)) + ',0)')
    .call(axis);
  label = svg.append('text')
    .attr('class', 'label')
    .attr('x', margin + i * space)
    .attr('y', 20)
    .text(xLabel);
}
