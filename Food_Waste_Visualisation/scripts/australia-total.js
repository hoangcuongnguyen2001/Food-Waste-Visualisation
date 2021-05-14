
"use strict";
let width = 900;
let height = 450;
let padding = 30;

let dataset = [{Year:'2006-2007',Energy_Recovery: 44, Disposal : 190, Recycling: 2},
               {Year:'2008-2009',Energy_Recovery: 40, Disposal : 189, Recycling: 1},
               {Year:'2009-2010',Energy_Recovery: 38, Disposal : 180, Recycling: 2},
               {Year:'2010-2011',Energy_Recovery: 41, Disposal : 167, Recycling: 2},
               {Year:'2013-2014',Energy_Recovery: 44, Disposal : 150, Recycling: 7},    
               {Year:'2014-2015',Energy_Recovery: 43, Disposal : 127, Recycling: 21},
               {Year:'2015-2016',Energy_Recovery: 49, Disposal : 117, Recycling: 20},
               {Year:'2016-2017',Energy_Recovery: 47, Disposal : 120, Recycling: 24},
               {Year:'2017-2018',Energy_Recovery: 46, Disposal : 111, Recycling: 24},
               {Year:'2018-2019',Energy_Recovery: 41, Disposal : 109, Recycling: 24}];

let first_stack = ["Recycling", "Energy_Recovery", "Disposal"];
let stack = d3.stack().keys(first_stack).order(d3.stackOrderDescending); 
let series = stack(dataset);

 //Create SVG element
let svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

const colors = ['green', 'blue', 'orange'];


let xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))
               .range([padding, width])
               .paddingInner(0.2)
               .paddingOuter(0.2);


let yScale = d3.scaleLinear()
               .domain([0,				
                   d3.max(dataset, function(d) {
                       return d.Energy_Recovery + d.Disposal + d.Recycling;
                   })
               ])
               .range([height - padding, padding]);

// Create x- and y-axis.
let xAxis = d3.axisBottom().scale(xScale).tickFormat(function(i) {return dataset[i].Year;})
let yAxis = d3.axisLeft().scale(yScale);

   // Add a group for each row of data
let groups = svg.selectAll("g")
       .data(series)
       .enter()
       .append("g")
       .style("fill", function(d, i) {
           return colors[i];
       });


//Create tooltip for the chart.
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

   // Add a rect for each data value
groups.selectAll("rect")
       .data(function(d) { return d; })
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
           return xScale(i);
       })
       .attr("y", function(d) {
           return yScale(d[1]);
       })
       .attr("height", function(d) {
           return yScale(d[0]) - yScale(d[1]);
       })
       .attr("width", xScale.bandwidth())
       .on("mouseover", function() { tooltip.style("display", null); })
       .on("mousemove", function(d) {
           // return the value for the hover place.
           var xPosition = parseFloat(d3.select(this).attr("x")) + 20;
           var yPosition = parseFloat(d3.select(this).attr("y"));
           tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
           tooltip.select("text").text(d[1] - d[0]);
           // changing opacity.
           d3.selectAll("rect").style("opacity", 0.5);
           d3.select(this).style("opacity", 1);

      })
      .on("mouseout", function() { 
          //return to normal.
           tooltip.style("display", "none"); 
           d3.selectAll("rect").style("opacity", 0.8);
      });


//Create X axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + (height - padding) + ")")
.call(xAxis);

//Create Y axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + padding + ",0)")
.call(yAxis);

//Create "Year" on  X axis
svg.append('text')
.attr('x', width/2)
.attr('y', height)
.attr('text-anchor', 'middle')
.style('font-family', 'Helvetica')
.style('font-size', 'small')
.text('Year');

//Create "Food waste per capita (kg/year)" on Y Axis
svg.append('text')
.attr('x', 5)
.attr('y', 6)
.attr('text-anchor', 'left')
.style('font-family', 'Helvetica')
.style('font-size', 'small')
.text('Food waste per capita (kg/year)');


var size = 10;
svg.selectAll("mydots")
  .data(first_stack)
  .enter()
  .append("circle")
    .attr("cx", 750)
    .attr("cy", function(d,i){ return 24 + i*(size+5);}) 
    .attr("r", 7)
    .style("fill", function(d,i){ return colors[i];});

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(first_stack)
  .enter()
  .append("text")
    .attr("x", 750 + size*1.2)
    .attr("y", function(d,i){ return 22 + i*(size+5) + (size/2);}) 
    .text(d => d)
    .style("fill", (d, i) => colors[i])
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

//Add Total Value At Top Of Bar
svg.selectAll(".text")
	 .data(dataset, function(d){
     return d.Year;
   })
   .enter()
   .append("text")
	 .attr("class", "text")
	 .attr("text-anchor", "middle")

	 .attr("x", function(d,i) {
     return xScale(i) + 35;
    })
	 .attr("y", function(d){ 
     return yScale(d.Energy_Recovery + d.Disposal +d.Recycling) - 3;

