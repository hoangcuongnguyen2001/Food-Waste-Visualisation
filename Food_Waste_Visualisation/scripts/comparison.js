"use strict";
   const third_width = 1000;
   const third_height = 500;
   const third_padding = 50;
  	
   const third_data = [{id: 1, Country: "Australia", HouseholdWaste: 102},
                        {id: 2, Country: "Austria", HouseholdWaste: 39},
                        {id: 3, Country: "Belgium", HouseholdWaste: 50},
                        {id: 4, Country: "Denmark", HouseholdWaste: 81},
                        {id: 5, Country: "Finland", HouseholdWaste: 65},
                        {id: 6, Country: "France", HouseholdWaste: 85},
                        {id: 7, Country: "Italy", HouseholdWaste: 67},
                        {id: 8, Country: "Japan", HouseholdWaste: 64},
                        {id: 9, Country: "Netherlands", HouseholdWaste: 50},
                        {id: 10, Country: "New Zealand", HouseholdWaste: 61},
                        {id: 11, Country: "Norway", HouseholdWaste: 79},
                        {id: 12, Country: "Poland", HouseholdWaste: 56},
                        {id: 13, Country: "Sweden", HouseholdWaste: 81},
                        {id: 14, Country: "UK", HouseholdWaste: 77},
                        {id: 15, Country: "USA", HouseholdWaste: 59}];

//set up xScale, yScale, x- and y-axis.
   const third_xScale = d3.scaleBand()
	                 .domain(d3.range(third_data.length))
	                 .rangeRound([third_padding ,third_width])
	                 .paddingInner(0.1)
                    .paddingOuter(0.1);

   const third_yScale = d3.scaleLinear()
                     //.domain([0, d3.max(third_data)])
                     .domain([0, 120])
	                  .range([third_height - third_padding, third_padding]);

   const third_xAxis = d3.axisBottom()
					     .scale(third_xScale).tickValues([]);
   const third_yAxis = d3.axisLeft()
                    .scale(third_yScale).ticks(5);


// Creating SVG file.
   const third_svg = d3.select("#chart3")
                  .append("svg")
                  .attr("width", third_width)
                  .attr("height", third_height);


// For the creation of a color scale.
   const fixed_color = 10000;
//const colorScale = d3.scaleSequential(d3.interpolatePlasma)
                   // .domain([d3.min(third_data), d3.max(third_data)]);;
//Create tooltip for the chart.

   third_svg.selectAll("rect")
	         .data(third_data)
  	         .enter()
  	         .append("rect")
  	         .attr("x", function(d, i) {
  	              return third_xScale(i);
  	          })
            .attr("y", function(d) {
  	             return third_yScale(d.HouseholdWaste);
  	         })
            .attr("width", third_xScale.bandwidth())
  	         .attr("height", function(d) {
  	              return third_height - third_padding - third_yScale(d.HouseholdWaste);
  	         })
  	         .attr("fill", d => `rgb(0, 0, ${fixed_color / d.HouseholdWaste})`)
   
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
                          .text(d.HouseholdWaste);
              third_svg.selectAll("rect").style("opacity", 0.5);
              d3.select(this).style("opacity", 1);
            })
             .on("mouseout", function() { 
      //return to normal.
                 third_svg.select("#tooltip").remove(); 
                 third_svg.selectAll("rect").style("opacity", 1);
              });

// Text Countries above Graphs
function AddCountryName() {
   third_svg.selectAll("text")
   .data(third_data)
   .enter()
   .append("text")
   .text(function(d) {
      return d.Country;
   })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
         return third_xScale(i) + third_xScale.bandwidth() / 2;
   })
   .attr("y", function(d) {
         return third_yScale(d.HouseholdWaste) - 5;
   })
   .attr("class", "country")
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "black");
}

AddCountryName();

//Draw global average line
  third_svg.append("line")
           .attr("class", "line globalAverage")
           .attr("x1", third_padding)
           .attr("x2", third_width)
           .attr("y1", third_yScale(74))
           .attr("y2", third_yScale(74));

GlobalWasteText(410);

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
// Drawing axes.
   third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0,"+ (third_height - third_padding) + ")")
         .call(third_xAxis);

   third_svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + third_padding + ",0)")
         .call(third_yAxis);

// Sort Ascending
function sortAscending() {
    
   third_svg.selectAll("rect")
            .sort(function(a, b) {
                 return d3.ascending(a.HouseholdWaste, b.HouseholdWaste);
            })
            .attr("x", function(d, i) {
                 return third_xScale(i);
            });
            third_svg.selectAll(".country").remove();
            AddCountryName();
            third_svg.on("mouseover", function(d) {
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
                        .text(d.HouseholdWaste);
             third_svg.selectAll("rect").style("opacity", 0.5);
             d3.select(this).style("opacity", 1.5);
          })
           .on("mouseout", function() { 
    //return to normal.
               third_svg.select("#tooltip").remove(); 
               third_svg.selectAll("rect").style("opacity", 1);
            });
   
}

// Sort descending
function sortDescending() {
   
   third_svg.style("display", "default");
   
   third_svg.selectAll("rect")
            .sort(function(a, b) {
                 return d3.descending(a.HouseholdWaste, b.HouseholdWaste);
            })
            .attr("x", function(d, i) {
                 return third_xScale(i);
            });
}		

// Global Waste Text
function GlobalWasteText(pixels) {
   third_svg.append("text")
            .attr("class", "globalWaste")
            .attr("x", third_padding + pixels)
            .attr("y", third_yScale(74) - 7)
            .text("Global average of household food waste");
}

// Sort Ascending button
d3.select("#sortascending").on("click", function() { 
   sortAscending();
   third_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(200);
})

// Sort Descending button
d3.select("#sortdescending").on("click", function() { 
   sortDescending();
   third_svg.selectAll(".globalWaste").remove();
   GlobalWasteText(520);
})