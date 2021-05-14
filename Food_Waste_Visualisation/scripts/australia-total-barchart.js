"use strict";
let interactive_width = 900;
let interactive_height = 450;
let interactive_padding = 30;

let interactive = document.getElementById("chart1interactive");
let chart1 = document.getElementById("chart1");

let interactive_years = ['2006-2007','2008-2009','2009-2010','2010-2011','2013-2014',
            '2014-2015','2015-2016','2016,2017','2017-2018','2018-2019'];
let interactive_dataset = [44, 40, 38, 41, 44, 43, 49, 47, 46, 41];

let interactive_xScale = d3.scaleBand()
            .domain(d3.range(interactive_dataset.length))
            .rangeRound([interactive_padding, interactive_width])
            .paddingInner(0.2)
            .paddingOuter(0.2);

let interactive_yScale = d3.scaleLinear()
            .domain([0, d3.max(interactive_dataset)])
            .rangeRound([interactive_height - interactive_padding, interactive_padding]);

// X and Y Axis
let interactive_xAxis = d3.axisBottom().scale(interactive_xScale).tickFormat(function(i) {return interactive_years[i];})
let interactive_yAxis = d3.axisLeft().scale(interactive_yScale);

// Create SVG
let interactive_svg = d3.select("#chart1interactive")
            .append("svg")
            .attr("width", interactive_width)
            .attr("height", interactive_height);

// Insert Rectangles
interactive_svg.selectAll("rect")
            .data(interactive_dataset)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {return interactive_xScale(i);})
            .attr("y", function(d) {return interactive_yScale(d);})
            .attr("width", interactive_xScale.bandwidth())
            .attr("height", function(d) {return interactive_height - interactive_padding - interactive_yScale(d);})
            .attr("fill", "blue");

createXandYAxis();

// Add Total Value At Top of Bar
interactive_svg.append("text")

// If energy recovery button is clicked on
d3.select("#energyrecovery")
            .on("click", function() {
                displayIndividualBarchart();
                interactive_dataset = [44, 40, 38, 41, 44, 43, 49, 47, 46, 41];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("blue");
                createXandYAxis();
            });

// If disposal button is clicked on
d3.select("#disposal")
            .on("click", function() {
                displayIndividualBarchart();
                interactive_dataset = [190, 189, 180, 167, 156, 127, 117, 120, 111, 109];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("orange");
                createXandYAxis();
            });

// If recycling button is clicked on
d3.select("#recycling")
            .on("click", function() {
                displayIndividualBarchart();
                interactive_dataset = [2, 1, 2, 2, 7, 21, 20, 24, 24, 24];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("green");
                createXandYAxis();
            });

// If all button is clicked on
d3.select("#all")
            .on("click", function() {
                interactive.style.display = "none";
                chart1.style.display = "block";
            });

// X and Y Scales
function interactiveXandYScale() {
    interactive_xScale = d3.scaleBand()
            .domain(d3.range(interactive_dataset.length))
            .rangeRound([interactive_padding, interactive_width])
            .paddingInner(0.2)
            .paddingOuter(0.2);
    
    interactive_yScale = d3.scaleLinear()
            .domain([0, d3.max(interactive_dataset)])
            .rangeRound([interactive_height - interactive_padding, interactive_padding]);
}

// Calling X and Y Axis
function interactiveXandYAxis() {
    interactive_xAxis = d3.axisBottom().scale(interactive_xScale).tickFormat(function(i) {return interactive_years[i];})
    interactive_yAxis = d3.axisLeft().scale(interactive_yScale);
}

// Filling rectangles with colour (after clicking on button)
function fillRect(colour) {
    interactive_svg.selectAll("rect")
            .data(interactive_dataset)
            .transition(1000)
            .ease(d3.easeCircleIn)
            .attr("y", function(d) {return interactive_yScale(d);})
            .attr("height", function(d) {return interactive_height - interactive_padding - interactive_yScale(d);})
            .attr("fill", colour);
}

// Create X and Y Axis (after clicking on button)
function createXandYAxis() {
    interactive_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + (interactive_height - interactive_padding) + ")")
            .call(interactive_xAxis);

    interactive_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + interactive_padding + ",0)")
            .call(interactive_yAxis);
}

// Display each individual bar chart
function displayIndividualBarchart() {
    interactive.style.display = "block";
    chart1.style.display = "none";
}