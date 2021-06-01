"use strict";
// Sorting Countries for CSV file. _
    function sortCountries(countries, values, sort) {

      if(sort != "none") {
         let inputCountries = [...countries];
         let inputValues = [...values];

         if (sort == "asc") {
            var sortedValues = [...values].sort(function(a,b) {return a - b;});
         } else {
            var sortedValues = [...values].sort(function(a,b) {return b - a;});
         }
         const sortedCountries = sortedValues.map(function(val) {
            const index = inputValues.findIndex(function(v) {return v === val;});
            const country = inputCountries[index];
            return country;
         })
         return {sortedCountries, sortedValues};
         
      } else {
         const sortedValues = values;
         const sortedCountries = countries;
         return {sortedCountries, sortedValues};
      }
   }

   const third_width = 1000;
   const third_height = 500;
   const third_padding = 50;
  	
   const third_countries = ["Australia", "Austria", "Denmark", "Netherlands","New Zealand", "Norway", 
                           "Sweden", "UK","USA","Japan","Poland","Finland","Italy","France","Belgium"]
   const third_data = [102, 39, 81, 50, 61, 79, 81, 77, 59, 64, 56, 65, 57, 85, 50];

   var sort = "none";
   var {sortedCountries, sortedValues} = sortCountries(third_countries, third_data, sort);

//set up xScale, yScale, x- and y-axis.
   const third_xScale = d3.scaleBand()
	                 .domain(d3.range(sortedValues.length))
	                 .rangeRound([third_padding ,third_width])
	                 .paddingInner(0.1)
                    .paddingOuter(0.1);

   const third_yScale = d3.scaleLinear()
                     .domain([0, 120])
	                  .range([third_height - third_padding, third_padding]);

   const third_xAxis = d3.axisBottom()
					     .scale(third_xScale).tickFormat(function(i) {return sortedCountries[i];})
   const third_yAxis = d3.axisLeft()
                    .scale(third_yScale).ticks(5);


// Creating SVG file.
   const third_svg = d3.select("#chart3")
                  .append("svg")
                  .attr("width", third_width)
                  .attr("height", third_height);

// For the creation of a color scale.
   const fixed_color = 12000;

//Create tooltip for the chart.
function createChart(values) {
   third_svg.selectAll("rect")
	         .data(values)
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
  	         .attr("fill", d => `rgb(${fixed_color / (d * 3)}, ${fixed_color / (d * 2)} , ${fixed_color / d})`)
            .on("mouseover", function(d) {
                 const third_xPosition = parseFloat(d3.select(this).attr("x")) + third_xScale.bandwidth() / 2;
                 const third_yPosition = parseFloat(d3.select(this).attr("y")) + 14;
      
                 third_svg.append("text")
                          .attr("id", "tooltip")
                          .attr("x", third_xPosition)
                          .attr("y", third_yPosition)
                          .attr("text-anchor", "middle")
                          .attr("font-family", "sans-serif")
                          .attr("font-size", "11px")
                          .attr("font-weight", "bold")
                          .attr("fill", "white")
                          .text(d);
                  third_svg.selectAll("rect").style("opacity", 0.5);
                  d3.select(this).style("opacity", 1);
            })
            .on("mouseout", function() { 
               //return to normal.
               third_svg.select("#tooltip").remove(); 
               third_svg.selectAll("rect").style("opacity", 1);
            });
}
createChart(sortedValues);

//Draw global average line
  third_svg.append("line")
           .attr("class", "line globalAverage")
           .attr("x1", third_padding)
           .attr("x2", third_width)
           .attr("y1", third_yScale(74))
           .attr("y2", third_yScale(74));

GlobalWasteText(520);

//Create "Food waste per capita (kg/year)" on Y Axis
third_svg.append('text')
         .attr('x', -(third_height / 2))
         .attr('y', 10)
         .attr('text-anchor', 'middle')
         .attr('transform', 'rotate(270)')
         .style('font-family', 'Helvetica')
         .style('font-size', 'small')
         .text('Food waste per capita (kg/year)');

// Create "Country Household Food waste per capita (kg/year)" as title
   third_svg.append("text")
            .attr("x", third_width / 2)
            .attr("y", 15)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .text('Household Food Waste Per Capita per Country');

//Create "Year" on  X axis
   third_svg.append('text')
            .attr('x', third_width/2)
            .attr('y', third_height)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 'small')
            .text('Countries');

// Global Waste Text
function GlobalWasteText(pixels) {
   third_svg.append("text")
            .attr("class", "globalWaste")
            .attr("x", third_padding + pixels)
            .attr("y", third_yScale(74) - 7)
            .text("Global average of household food waste");
}

// Drawing axes.
function DrawXAxis(xAxis) {
   third_svg.append("g")
         .attr("class", "axis")
         .attr("id", "xaxis")
         .attr("transform", "translate(0,"+ (third_height - third_padding) + ")")
         .call(xAxis);
}
DrawXAxis(third_xAxis);

   third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + third_padding + ",0)")
         .call(third_yAxis);

// Redraw Graph
function redrawGraph(xAxis, values) {
   third_svg.selectAll("rect").remove();
   third_svg.select("#xaxis").remove();
   DrawXAxis(xAxis);
   createChart(values);
}  

// Sort Ascending
function sortAscending() {
   sort = "asc";
   var {sortedCountries, sortedValues} = sortCountries(third_countries, third_data, sort);

   var third_xAxis = d3.axisBottom().scale(third_xScale).tickFormat(function(i) {return sortedCountries[i];})
   redrawGraph(third_xAxis, sortedValues);
}

// Sort descending
function sortDescending() {
   sort = "desc";
   var {sortedCountries, sortedValues} = sortCountries(third_countries, third_data, sort);

   var third_xAxis = d3.axisBottom().scale(third_xScale).tickFormat(function(i) {return sortedCountries[i];})
   redrawGraph(third_xAxis, sortedValues);
}		

// Sort Ascending button
d3.select("#sortascending").on("click", function() { 
   sortAscending();
   third_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(200);
});

// Sort Descending button
d3.select("#sortdescending").on("click", function() { 
   sortDescending();
   third_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(520);
});