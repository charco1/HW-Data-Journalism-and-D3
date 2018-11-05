//Set up our chart
//Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins
var svgWidth = 900;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var HealthData;

//Append svg group
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
   
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    

// var chartGroup = svg.append("g")
//                     .attr("transform", `translate(${margin.left},${margin.top})`)
//                     .call(yAxis);

//Initialize tooltip
var toolTip = d3.select ("#scatter")
    .append("div")
    .attr("class", "toolTip")
    .style("opacity", 0);


//Pull in data from CSV file
d3.csv("/data/data.csv").then(function(HealthData) {
    //console.log(data);

    //Loop through data in healthData set
    HealthData.forEach(function(data) {
        data.ages = +data.ages;
        data.smokers = +data.smokers;
    });
   
//Create scale functions(range)
//scale x to chart width
var xScale = d3.scaleLinear()
.domain([30, d3.max(HealthData, d => d.ages)]) 

//scale y to chart height
var yScale = d3.scaleLinear()
.domain([8, d3.max(HealthData, d => d.smokers)]) 
.range([height, 0]);

//Stores the min and max values in a column in data.csv (for a global data set)

    var xMin;
    var xMax;
    var yMin;
    var yMax;

//Create xAxis and yAxis function 
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

//Append xAxis and yAxis to the chart
//set x to the bottom of the chart( add to html)
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

// set y to the y axis (add to html)
chartGroup.append("g")
    .call(yAxis);

//Create circle chart
var circlesGroup = chartGroup.selectAll("circle")
    .data(HealthData)
    .enter()
    .append("circle")
    // .attr("cx", function (d) {return xScale(d[defaultAxisLabelX])})
    // .attr("cy", function (d) {return yScale(d[defaultAxisLabelY])})
    .attr("cx", function (d) {return xScale(d.ages)})
    .attr("cy", function (d) {return yScale(d.smokers)})
    .attr("r", "15")
    .attr("fill", "#4380BA")
    .attr("opacity", "0.75");

//Display tooltip on click
var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Ages: ${d.ages}<br>Smokers: ${d.smokers}`);
    });

//Create tooltip in the chart
chartGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);

})

//Click mouseout
.on("mouseout", function(data, index) {
    toolTip.hide(data);

});

//Add label to data points
chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .selectAll("tspan")
    .data(HealthData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
        return xScale(data.ages - 0);
                
        })
        .attr("y", function(data) {
            return yScale(data.smokers - 0.2);

        })
        .text(function(data) {
            return data.locationAbbr
        });

//Axes labels
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