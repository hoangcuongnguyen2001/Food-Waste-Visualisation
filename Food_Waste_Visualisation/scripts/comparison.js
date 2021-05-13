"use strict";


var third_width = 1000;
var third_height = 500;
var third_padding = 30;
  	
var third_countries = ["Australia", "Austria", "Denmark", "Netherlands","New Zealand", "Norway", "Sweden", "UK","USA","Japan","Poland","Finland","Italy","France","Belgium"]
var third_data = [102, 39, 81, 50, 61, 79, 81, 77, 59, 64, 56, 65, 57, 85, 50];

var third_xScale = d3.scaleBand()
	                 .domain(d3.range(third_data.length))
	                 .rangeRound([third_padding ,third_width])
	                 .paddingInner(0.1)
                    .paddingOuter(0.1);

var third_yScale = d3.scaleLinear()
                     .domain([0, d3.max(third_data)])
	                  .range([third_height - third_padding, third_padding]);

var third_xAxis = d3.axisBottom()
					     .scale(third_xScale)
                    .tickFormat(function(i) {return third_countries[i];})

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
  	   return third_yScale(d);
  	})
   .attr("width", third_xScale.bandwidth())
  	.attr("height", function(d) {
  	   return third_height - third_padding - third_yScale(d);
  	})
  	.attr("fill", function(d) {
  	   return "rgb(" + Math.round(d) + "," + Math.round(d * 1.25) + ", 0)";
  	})
   .on("mouseover", function(d) {
      var third_xPosition = parseFloat(d3.select(this).attr("x")) + third_xScale.bandwidth() / 2;
      var third_yPosition = parseFloat(d3.select(this).attr("y")) + 14;

      svg.append("text")
         .attr("id", "tooltip")
         .attr("x", third_xPosition)
         .attr("y", third_yPosition)
         .attr("text-anchor", "middle")
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("font-weight", "bold")
         .attr("fill", "yellow")
         .text(d);

       // changing opacity.
       d3.selectAll("rect").style("opacity", 0.75);
       d3.select(this).style("opacity", 1.25);

  })
  .on("mouseout", function() { 
      //return to normal.
      d3.select("#tooltip").remove();
       d3.selectAll("rect").style("opacity", 1);
  });



//Draw global average line
third_svg.append("line")
   .attr("class", "line globalAverage")
   .attr("x1", third_padding)
   .attr("x2", third_width)
   .attr("y1", third_yScale(74))
   .attr("y2", third_yScale(74));

third_svg.append("text")
   .attr("class", "globalWaste")
   .attr("x", third_padding + 20)
   .attr("y", third_yScale(74) - 7)
   .text("Global average of household food waste");

//Create "Food waste per capita (kg/year)" on Y Axis
third_svg.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .attr('text-anchor', 'left')
        .style('font-family', 'Helvetica')
        .style('font-size', 'small')
        .text('Food waste per capita (kg/year)');



//Create "Year" on  X axis
svg.append('text')
   .attr('x', third_width/2)
   .attr('y', third_height - 12)
   .attr('text-anchor', 'middle')
   .style('font-family', 'Helvetica')
   .style('font-size', 'small')
   .text('Countries');


third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + third_padding + ",0)")
         .call(third_yAxis);



third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0,"+ (third_height - third_padding) + ")")
         .call(third_xAxis);


var sortAscending = function() {
             
   third_svg.selectAll("rect")
            .sort(function(a, b) {
                 return d3.ascending(a, b);
            })
            .attr("x", function(d, i) {
               return xScale(i);
            });
}

var sortDescending = function() {
             
   third_svg.selectAll("rect")
            .sort(function(a, b) {
                 return d3.descending(a, b);
            })
            .attr("x", function(d, i) {
               return xScale(i);
            });
         
}		



d3.select("#sortascending").on("click", function() { 
   sortAscending();
            
})


d3.select("#sortdescending").on("click", function() { 
   sortDescending();
            
})