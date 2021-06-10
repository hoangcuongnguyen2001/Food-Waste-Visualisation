"use strict";
const width = 1000;
const height = 450;
const padding = 50;

const dataset = [{Year:'2006-2007',Energy_Recovery: 44, Disposal : 190, Recycling: 2},
                {Year:'2008-2009',Energy_Recovery: 40, Disposal : 189, Recycling: 1},
                {Year:'2009-2010',Energy_Recovery: 38, Disposal : 180, Recycling: 2},
                {Year:'2010-2011',Energy_Recovery: 41, Disposal : 167, Recycling: 2},
                {Year:'2013-2014',Energy_Recovery: 44, Disposal : 150, Recycling: 7},    
                {Year:'2014-2015',Energy_Recovery: 43, Disposal : 127, Recycling: 21},
                {Year:'2015-2016',Energy_Recovery: 49, Disposal : 117, Recycling: 20},
                {Year:'2016-2017',Energy_Recovery: 47, Disposal : 120, Recycling: 24},
                {Year:'2017-2018',Energy_Recovery: 46, Disposal : 111, Recycling: 24},
                {Year:'2018-2019',Energy_Recovery: 41, Disposal : 109, Recycling: 24}];

const first_stack = ["Recycling", "Energy_Recovery", "Disposal"];
const stack = d3.stack().keys(first_stack).order(d3.stackOrderDescending); 
const series = stack(dataset);

//Create SVG element
const svg = d3.select("#chart1")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

// Colours for each node
const colours = ['#9e9cc2', '#a17724', '#383745'];

// X/Y Scales
const xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .range([padding, width])
                .paddingInner(0.2)
                .paddingOuter(0.2);

const yScale = d3.scaleLinear()
                  .domain([0,				
                      d3.max(dataset, d => { return d.Energy_Recovery + d.Disposal + d.Recycling; })
                  ])
                  .range([height - padding, padding]);

// Create x- and y-axis.
const xAxis = d3.axisBottom().scale(xScale).tickFormat(i => dataset[i].Year)
const yAxis = d3.axisLeft().scale(yScale);

// Add a group for each row of data
var groups = svg.selectAll("g")
                .data(series)
                .enter()
                .append("g")
                .style("fill", (d, i) => colours[i]);


//Create tooltip for the chart.
const tooltip = svg.append("g")
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
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => { return yScale(d[0]) - yScale(d[1]); })
      .attr("width", xScale.bandwidth())
      .on("mouseover", () => tooltip.style("display", null))
      .on("mousemove", function(d) {
          // return the value for the hover place.
          var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() * 3 / 10;
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
    .style("font-size", "12px")
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
    .attr('x', -(height / 2))
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(270)')
    .style('font-family', 'Helvetica')
    .style('font-size', 'small')
    .text('Food waste per capita (kg/year)');

// Create "Overall Food Waste Per Capita"
svg.append('text')
    .attr('x', width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '20px')
    .text('Overall Food Waste Per Capita in Australia');

var size = 10;
svg.selectAll("mydots")
    .data(first_stack)
    .enter()
    .append("circle")
    .attr("cx", 850)
    .attr("cy", (d,i) => 24 + i*(size+5)) 
    .attr("r", 7)
    .style("fill", (d,i) => colours[i]);

const new_stack = ["Recycling", "Energy recovery" , "Disposal"]
// Add one dot in the legend for each name.
svg.selectAll("mylabels")
    .data(new_stack)
    .enter()
    .append("text")
    .attr("x", 850 + size*1.2)
    .attr("y", (d,i) => 22 + i*(size+5) + (size/2)) 
    .text(d => d)
    .style("fill", (d, i) => colours[i])
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

//Add Total Value At Top Of Bar
svg.selectAll(".text")
    .data(dataset, d => d.Year)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("x", (d,i) => xScale(i) + 35)
    .attr("y", d => yScale(d.Energy_Recovery + d.Disposal +d.Recycling) - 3)
    .text((d) => d.Energy_Recovery + d.Disposal +d.Recycling)