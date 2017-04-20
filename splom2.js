// Part of a brief D3 tutorial.
// Upon completion, will display an interactive scatterplot showing relationship between
//   different values associated with the top 100 words in Shakespeare's First Folio
// CS 314, Spring 2017
// Eric Alexander

// First, we will create some constants to define non-data-related parts of the visualization
w = 700; // Width of our visualization
h = 500; // Height of our visualization
xOffset = 40; // Space for x-axis labels
yOffset = 100; // Space for y-axis labels
margin = 10; // Margin around visualization
vals = ['flight_index', 'num_o_ring_distress', 'launch_temp',
  'leak_check_pressure', 'tufte_metric'
];
xVal = vals[0]; // Value to plot on x-axis
yVal = vals[1]; // Value to plot on y-axis

// Next, we will load in our CSV of data
d3.csv('challenger.csv', function(csvData) {
  data = csvData;

  // This will define scales that convert values
  // from our data domain into screen coordinates.
  xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[xVal]);
      }) - 1,
      d3.max(data, function(d) {
        return parseFloat(d[xVal]);
      }) + 1
    ])
    .range([yOffset + margin, w - margin]);
  yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[yVal]);
      }) - 1,
      d3.max(data, function(d) {
        return parseFloat(d[yVal]);
      }) + 1
    ])
    .range([h - xOffset - margin, margin]); // Notice this is backwards!

  // Next, we will create an SVG element to contain our visualization.
  svg = d3.select('#pointsSVG').append('svg:svg')
    .attr('width', w)
    .attr('height', h);

  // Build axes! (These are kind of annoying, actually...)
  xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);
  xAxisG = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (h - xOffset) + ')')
    .call(xAxis);
  xLabel = svg.append('text')
    .attr('class', 'label')
    .attr('x', w / 2)
    .attr('y', h - 5)
    .text(xVal);
  yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(5);
  yAxisG = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + yOffset + ',0)')
    .call(yAxis);
  yLabel = svg.append('text')
    .attr('class', 'label')
    .attr('x', yOffset / 2)
    .attr('y', h / 2 - 10)
    .text(yVal);

  // Now, we will start actually building our scatterplot!
  // Select elements
  // Bind data to elements
  points = svg.selectAll('circle')
    .data(data);

  // Create a new div for the tooltip
  // From http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Create new elements if needed
  points.enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(d[xVal]);
    })
    .attr('cy', function(d) {
      return yScale(d[yVal]);
    })
    .attr('r', 2)
    .style('fill', 'steelblue')
    .on('mouseover', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(d[xVal] + ', ' + d[yVal])
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 14) + 'px');
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
});
