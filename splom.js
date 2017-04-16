var margin = {top: 20, right: 20, bottom: 50, left: 60},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xValue = function(d) { return d.temp; };
var xScale = d3.scale.linear().range([0, width]);
var xMap = function(d) { return xScale(xValue(d)); };
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return d.tufte; };
var yScale = d3.scale.linear().range([height, 0]);
var yMap = function(d) { return yScale(yValue(d)); };
var yAxis = d3.svg.axis().scale(yScale).orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("challenger.csv", function(d){
  return{
    index: +d.flight_index,
    distress: +d.num_o_ring_distress,
    temp: +d.launch_temp,
    pressure: +d.leak_check_pressure,
    tufte: +d.tufte_metric
  };
}, function(error, rows){
  xValue = function(d) { return d.temp; };
  yValue = function(d) { return d.tufte; };
  populateScatterPlot(rows, "Temperature", "Tufte Metric");
});

function populateScatterPlot(data, xLabel, yLabel) {
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", 180)
      .attr("y", 40)
      .style("text-anchor", "center")
      .text(xLabel);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -180)
      .attr("y", -40)
      .style("text-anchor", "end")
      .text(yLabel);

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "steelblue");
}
