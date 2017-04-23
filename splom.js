// CS 314, Spring 2017
// Eric Alexander

// First, we will create some constants to define non-data-related parts of the visualization
w = 300; // Width of our visualization
h = 250; // Height of our visualization
xOffset = 20; // Space for x-axis labels
yOffset = 50; // Space for y-axis labels
margin = 10; // Margin around visualization
border=1;
bordercolor='black';

vals = ['flight_index', 'num_o_ring_distress', 'launch_temp',
  'leak_check_pressure', 'tufte_metric'];

labels = ['Flight Index', 'O-Ring Distress', 'Launch Temp',
'Leak Pressure', 'Tufte Metric'];

var color = d3.scale.category10();

function make_x_axis(){
  return d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5)
}

function make_y_axis(){
  return d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(5)
}

// Next, we will load in our CSV of data
d3.csv('challenger.csv', function(data) {
  for(i=0; i<5; i++)
    for(j=0; j<5; j++)
      plot(data, vals[j], vals[i], labels[i]);
});

function plot(data, xVal, yVal, xName){

  xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[xVal]);
      }),
      d3.max(data, function(d) {
        return parseFloat(d[xVal]);
      })
    ])
    .range([margin+yOffset, w-margin*4]);
  yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
        return parseFloat(d[yVal]);
      }),
      d3.max(data, function(d) {
        return parseFloat(d[yVal]);
      })
    ])
    .range([h-xOffset-margin, margin*3.5]); // Notice this is backwards!


  // Next, we will create an SVG element to contain our visualization.
  svg = d3.select('#pointsSVG').append('svg:svg')
    .attr('width', w)
    .attr('height', h)
    .attr('border', border)

  if(xVal !== yVal){
    svg.append('g')
       .attr('class', 'grid')
       .attr('transform', 'translate(0,' + h + ')')
       .call(make_x_axis()
	    .tickSize(-h, 0, 0)
	    .tickFormat('')
       )

    svg.append('g')
       .attr('class', 'grid')
       .call(make_y_axis()
	   .tickSize(-w, 0, 0) .tickFormat('')
       );       
  }

  if(xVal === yVal){
    svg.style('background-color', 'gray');
  }

  borderPath = svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', h)
    .attr('width', w)
    .style('stroke', bordercolor)
    .style('fill', 'none')
    .style('stroke-width', border);
  
  // Build axes! (These are kind of annoying, actually...)
  if(xVal !== yVal && i == 0){
    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('top')
      .ticks(5);
    xAxisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + 30 + ')')
      .call(xAxis);
  }

  if(xVal !== yVal && i == 4){
    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(5);
    xAxisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + (h - xOffset) + ')')
      .call(xAxis);
  }

  if(xVal === yVal){
    xLabel = svg.append('text')
          .attr('class', 'label')
          .attr('x', w/2)
          .attr('y', h/2)
          .text(xName);
  }

  if(xVal !== yVal && j == 0){
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(5);
    yAxisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + yOffset + ',0)')
      .call(yAxis);
  }

  if(xVal !== yVal && j == 4){
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('right')
      .ticks(5);
    yAxisG = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + (w-margin*3) + ',0)')
      .call(yAxis);
  }


  // Create a new div for the tooltip
  // From http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  tooltip = d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

  // Now, we will start actually building our scatterplot!
  // Select elements
  // Bind data to elements
  if(xVal !== yVal){
    points = svg.selectAll('circle')
        .data(data)
      .enter()
        .append('circle')
        .attr('class', function(d) { return 'flight_' + d[vals[0]]; })
        .attr('id', function(d) { return 'flight_' + d[vals[0]]; })
        .attr('cx', function(d) {
          return xScale(d[xVal]);
        })
        .attr('cy', function(d) {
          return yScale(d[yVal]);
        })
        .attr('r', 4)
        .style('fill', function(d) { return color(d[vals[1]]); })
        .on('mouseover', function(d) {
          d3.selectAll('.flight_' + d[vals[0]])
            .transition()
            .duration(200)
            .attr('r', 7);
          tooltip.transition()
            .duration(200)
            .style('opacity', .9)
          tooltip.html('Flight ' + d[vals[0]] + ': ' + d[xVal] + ', ' + d[yVal])
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 14) + 'px');

        })
	// found the d3 'active' attribute to calculate toggles
        .on('click', function(d) {
          var active   = eval('flight_' + d[vals[0]]).active ? false : true;
          d3.selectAll('.flight_' + d[vals[0]])
            .transition()
            .style('fill', function(d){
                if (active === false){
                  eval('flight_' + d[vals[0]]).active = active;
                  return color(d[vals[1]]);
                }
                else{
                  eval('flight_' + d[vals[0]]).active = active;
                  return 'red';
                }
             })
        })
        .on('mouseout', function(d) {
          d3.selectAll('.flight_' + d[vals[0]])
            .transition()
            .duration(200)
            .attr('r', 4);
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });

  }
}
