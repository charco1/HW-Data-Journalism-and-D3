//Set up our chart
//Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins
var svgWidth = 900;
var svgHeight = 500;
var margin = {top: 20, bottom: 60, right: 20, left: 50};
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

//Append svg group
var svg = d3
.select ("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);   


var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initialize tooltips
var toolTip = d3.select (".scatter")
.append("div")
.attr("class", "toolTip")
.style("opacity", 0);


//Pull in data from csv file 
d3.csv("/data/data.csv").then(function(HealthData) {
//console.log(data);

//Loop through data in HealthData set
HealthData.forEach(function(data) {
    data.ages = +data.ages;
    data.smokers = +data.smokers;
});

//Create scale functions (range)
//Scale x to chart width
var xScale = d3.scaleLinear()
.domain([30, d3.max(healthData, d => d.ages)]) 
.range([0, width]);

//scale y to chart height
var yScale = d3.scaleLinear()
.domain([8, d3.max(HealthData, d => d.smokers)])
.range([height, 0]);

//Create xAxis and yAxis function
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

//Append xAxis and yAxis to the chart
//Set x to the bottom of the chart( add to html)
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(xAxis);

//Set y to the y axis (add to html)
chartGroup.append("g")
.call(yAxis);

//Create Circles
var circlesGroup = chartGroup.selectAll("circle")
.data(HealthData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.ages))
.attr("cy", d => yScale(d.smokers))
.attr("r", "15")
.attr("fill", "#4380BA")
.attr("opacity", ".75");

//Initialize Tooltip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {

    return (`${d.state}<br>Age: ${d.age}<br>Smokers: ${d.smokers}`);

}); 

//Create tooltip in the chart
chartGroup.call(toolTip);

//Create event listeners to display and hide the tooltip
circlesGroup.on("mouseover", function(data) {
 toolTip.show(data, this);

})
// Click mouseout
.on("mouseout", function(data, index) {
toolTip.hide(data);
    
});

// Add label to data points
chartGroup.append("text")
.style("text-anchor", "middle")
.style("font-size", "12px")
.selectAll("tspan")
.data(HealthData)
.enter()
.append("tspan")
  .attr("x", function(data) {
      return xScale(data.age - 0);
  })
  .attr("y", function(data) {
      return yScale(data.smokers - 0.2);
  })
  .text(function(data) {
      return data.locationAbbr
  });

  
// Axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left )
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokers(%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Age (Median)");
});


