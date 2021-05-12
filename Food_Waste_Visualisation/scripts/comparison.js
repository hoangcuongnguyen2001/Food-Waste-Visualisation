"use strict";


var third_width = 800;
var third_height = 400;
var third_padding = 30;
  	
var third_countries = ["Australia", "Austria", "Denmark", "Netherlands","New Zealand", "Norway", "Sweden", "United Kingdom","USA","Japan","Poland","Finland","Italy","France","Belgium"]
var third_data = [102, 39, 81, 50, 61, 79, 81, 77, 59, 64, 56, 65, 57, 85, 50];

var third_xScale = d3.scaleBand()
	                 .domain(d3.range(third_data.length))
	                 .rangeRound([third_padding ,third_width])
	                 .paddingInner(0.1);

var third_yScale = d3.scaleLinear()
                     .domain([0, d3.max(third_data)])
	                 .range([third_height - third_padding, third_padding]);

var third_xAxis = d3.axisBottom()
					.scale(third_xScale).tickFormat(function(i) {return third_countries[i];})

var third_yAxis = d3.axisLeft()
                    .scale(third_yScale).ticks(5);

var third_svg = d3.select("#chart3")
                  .append("svg")
                  .attr("width", third_width)
                  .attr("height", third_height);

third_svg.selectAll("rect")
	.data(third_data)
  	.enter()
  	.append("rect")
  	.attr("x", function(d, i) {
  	   return third_xScale(i);
  	})
    .attr("y", function(d) {
  	   return third_height - third_padding - third_yScale(d);
  	})
    .attr("width", third_xScale.bandwidth())
  	.attr("height", function(d) {
  	   return third_yScale(d);
  	})
  	.attr("fill", function(d) {
  	   return "rgb(0, 0, " + Math.round(d * 10) + ")";
  	});

//Create "Food waste per capita (kg/year)" on Y Axis
third_svg.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .attr('text-anchor', 'left')
        .style('font-family', 'Helvetica')
        .style('font-size', 'small')
        .text('Food waste per capita (kg/year)');

third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + third_padding + ",0)")
         .call(third_yAxis);

third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + (third_height - third_padding) + ",0)")
         .call(third_xAxis);