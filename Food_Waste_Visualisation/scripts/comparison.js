"use strict";


var third_width = 1000;
var third_height = 450;
var third_padding = 30;
  	
var third_countries = ["Australia", "Austria", "Denmark", "Netherlands","New Zealand", "Norway", "Sweden", "UK","USA","Japan","Poland","Finland","Italy","France","Belgium"]
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



//Create tooltip for the chart.
var third_tooltip = svg.append("g")
  .attr("id", "tooltip")
  .style("display", "none");
    
third_tooltip.append("rect")
             .attr("width", 30)
             .attr("height", 20)
             .attr("fill", "white")
             .style("opacity", 0.5);

third_tooltip.append("text")
             .attr("x", 15)
             .attr("dy", "1em")
             .style("text-anchor", "middle")
             .attr("font-size", "12px")
             .attr("font-weight", "bold");

third_svg.selectAll("rect")
	.data(third_data)
  	.enter()
  	.append("rect")
  	.attr("x", function(d, i) {
  	   return third_xScale(i);
  	})
   .attr("y", function(d) {
  	   return third_yScale(d);
  	})
   .attr("width", third_xScale.bandwidth())
  	.attr("height", function(d) {
  	   return third_height - third_padding - third_yScale(d);
  	})
  	.attr("fill", function(d) {
  	   return "rgb(" + Math.round(d * 2) + "," + Math.round(d) + ","  + Math.round(d / 2) + ")";
  	})
   .on("mouseover", function() { third_tooltip.style("display", null); })
   .on("mousemove", function(d) {
       // return the value for the hover place.
       var third_xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 3;
       var third_yPosition = parseFloat(d3.select(this).attr("y")) + 3;
       third_tooltip.attr("transform", "translate(" + third_xPosition + "," + third_yPosition + ")");
       third_tooltip.select("text").text(d);
       // changing opacity.
       d3.selectAll("rect").style("opacity", 0.75);
       d3.select(this).style("opacity", 1.25);

  })
  .on("mouseout", function() { 
      //return to normal.
       tooltip.style("display", "none"); 
       d3.selectAll("rect").style("opacity", 1);
  });



//Draw 350 ppm line
third_svg.append("line")
   .attr("class", "line globalAverage")
   .attr("x1", third_padding)
   .attr("x2", third_width)
   .attr("y1", yScale(74))
   .attr("y2", yScale(74));

third_svg.append("text")
   .attr("class", "globalWaste")
   .attr("x", third_padding + 20)
   .attr("y", yScale(500000) - 7)
   .text("Global average of household food waste");

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
         .attr("transform", "translate(0,"+ (third_height - third_padding) + ")")
         .call(third_xAxis);