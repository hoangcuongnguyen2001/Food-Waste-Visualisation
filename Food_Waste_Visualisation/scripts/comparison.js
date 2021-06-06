// Created partially with the help of Michael Rovinsky:
// https://stackoverflow.com/questions/67518899/bar-chart-how-could-i-align-the-data-with-countries-when-sorting-in-d3-v5/67529684

"use strict";
// Sorting Countries for CSV file. _
function sortCountries(countries, values, sort) {
   if(sort != "none") {
      let inputCountries = [...countries];
      let inputValues = [...values];

      if (sort == "asc") {
         var sortedValues = [...values].sort((a,b) => {return a - b;});
      } else {
         var sortedValues = [...values].sort((a,b) => {return b - a;});
      }
      
      const sortedCountries = sortedValues.map(function(val) {
         const index = inputValues.findIndex((v) => {return v === val});
         const country = inputCountries[index];
         inputValues = [...inputValues.slice(0, index), ...inputValues.slice(index + 1)]
         inputCountries = [...inputCountries.slice(0, index), ...inputCountries.slice(index + 1)]
         return country;
      })
      return {sortedCountries, sortedValues};
   } else {
      const sortedValues = values;
      const sortedCountries = countries;
      return {sortedCountries, sortedValues};
   }
}

const comparison_width = 1000;
const comparison_height = 500;
const comparison_padding = 50;
   
const comparison_countries = ["Australia", "Austria", "Belgium", "Denmark", "Finland", "France", "Italy", "Japan", "Netherlands","New Zealand", "Norway", "Poland", "Sweden", "UK","USA",]
const comparison_data = [102, 39, 50, 81, 50, 85, 65, 57, 64, 61, 79, 56, 81, 77, 59,];

var sort = "none";
var {sortedCountries, sortedValues} = sortCountries(comparison_countries, comparison_data, sort);

//set up xScale, yScale, x- and y-axis.
const comparison_xScale = d3.scaleBand()
                           .domain(d3.range(sortedValues.length))
	                        .rangeRound([comparison_padding ,comparison_width])
	                        .paddingInner(0.1)
                           .paddingOuter(0.1);

const comparison_yScale = d3.scaleLinear()
                           .domain([0, 120])
	                        .range([comparison_height - comparison_padding, comparison_padding]);
 
const comparison_xAxis = d3.axisBottom().scale(comparison_xScale).tickValues([]);
const comparison_yAxis = d3.axisLeft().scale(comparison_yScale).ticks(5);

// Creating SVG file.
const comparison_svg = d3.select("#chart3")
            .append("svg")
            .attr("width", comparison_width)
            .attr("height", comparison_height);

// For the creation of a colour scale.
const fixed_colour = 12000;

// Create tooltip for the chart.
function createChart(values) {
   comparison_svg.selectAll("rect")
	            .data(values)
     	         .enter()
  	            .append("rect")
  	            .attr("x", (d,i) => comparison_xScale(i))
               .attr("y", d => comparison_yScale(d))
               .attr("width", comparison_xScale.bandwidth())
     	         .attr("height", d => comparison_height - comparison_padding - comparison_yScale(d))
  	            .attr("fill", d => `rgb(${fixed_colour / (d * 3)}, ${fixed_colour / (d * 2)} , ${fixed_colour / d})`)
               .on("mouseover", function(d) {
                  const comparison_xPosition = parseFloat(d3.select(this).attr("x")) + comparison_xScale.bandwidth() / 2;
                  const comparison_yPosition = parseFloat(d3.select(this).attr("y")) + 14;
      
                  comparison_svg.append("text")
                     .attr("id", "tooltip")
                    .attr("x", comparison_xPosition)
                    .attr("y", comparison_yPosition)
                    .attr("text-anchor", "middle")
                     .attr("font-family", "Helvetica")
                    .attr("font-size", "11px")
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                     .text(d);
                  comparison_svg.selectAll("rect").style("opacity", 0.5);
                  d3.select(this).style("opacity", 1);
               })
               .on("mouseout", function() { 
                  //return to normal.
                  comparison_svg.select("#tooltip").remove(); 
                  comparison_svg.selectAll("rect").style("opacity", 1);
               });
}
createChart(sortedValues);

// Draw global average line
comparison_svg.append("line")
            .attr("class", "line globalAverage")
            .attr("x1", comparison_padding)
            .attr("x2", comparison_width)
            .attr("y1", comparison_yScale(74))
            .attr("y2", comparison_yScale(74));

GlobalWasteText(400);

// Create "Food waste per capita (kg/year)" on Y Axis
comparison_svg.append('text')
            .attr('x', -(comparison_height / 2))
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .style('font-size', 'small')
            .text('Food waste per capita (kg/year)');

// Create "Country Household Food waste per capita (kg/year)" as title
comparison_svg.append("text")
            .attr("x", comparison_width / 2)
            .attr("y", 15)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .text('Household Food Waste Per Capita per Country');

// Create "Year" on  X axis
comparison_svg.append('text')
            .attr('x', comparison_width/2)
            .attr('y', comparison_height)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 'small')
            .text('Countries');

// Global Waste Text
function GlobalWasteText(pixels) {
   comparison_svg.append("text")
               .attr("class", "globalWaste")
               .attr("x", comparison_padding + pixels)
               .attr("y", comparison_yScale(74) - 7)
               .text("Global average of household food waste");
}

// Drawing Countries Above Each Bar
function AddCountries(values, countries) {
   comparison_svg.selectAll(".countries").remove();

   comparison_svg.selectAll(".countries")
               .data(values, d => d)
               .enter()
               .append("text")
               .attr("class","countries")
               .attr("text-anchor", "middle")
               .attr("font-size", "10px")
               .attr("x", (d, i) => comparison_xScale(i) + 27)
               .attr("y", d => comparison_yScale(d) - 3)
               .text((d, i) => countries[i])
}
AddCountries(sortedValues, sortedCountries);

// Drawing axes.
function DrawXAxis(xAxis) {
   comparison_svg.append("g")
               .attr("class", "axis")
               .attr("id", "xaxis")
               .attr("transform", "translate(0,"+ (comparison_height - comparison_padding) + ")")
               .call(xAxis);
}
DrawXAxis(comparison_xAxis);
comparison_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + comparison_padding + ",0)")
            .call(comparison_yAxis);

// Redraw Graph
function redrawGraph(values, countries) {
   comparison_svg.selectAll("rect").remove();
   createChart(values);
   AddCountries(values, countries)
}  

// Sort Ascending
function sortAscending() {
   sort = "asc";
   var {sortedCountries, sortedValues} = sortCountries(comparison_countries, comparison_data, sort);
   redrawGraph(sortedValues, sortedCountries);
}

// Sort descending
function sortDescending() {
   sort = "desc";
   var {sortedCountries, sortedValues} = sortCountries(comparison_countries, comparison_data, sort);
   redrawGraph(sortedValues, sortedCountries);
}		

// Sort Ascending button
d3.select("#sortascending").on("click", () => { 
   sortAscending();
   comparison_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(200);
});

// Sort Descending button
d3.select("#sortdescending").on("click", () => { 
   sortDescending();
   comparison_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(520);
});