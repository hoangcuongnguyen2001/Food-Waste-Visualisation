"use strict";
const interactive_width = 1000;
const interactive_height = 450;
const interactive_padding = 50;

const interactive = document.getElementById("chart1interactive");
const chart1 = document.getElementById("chart1");

const interactive_years = ['2006-2007','2008-2009','2009-2010','2010-2011','2013-2014',
            '2014-2015','2015-2016','2016,2017','2017-2018','2018-2019'];
let interactive_dataset = [44, 40, 38, 41, 44, 43, 49, 47, 46, 41];

// Create X Scale and Y Scale
let interactive_xScale = d3.scaleBand()
                        .domain(d3.range(interactive_dataset.length))
                        .rangeRound([interactive_padding, interactive_width])
                        .paddingInner(0.2)
                        .paddingOuter(0.2);

let interactive_yScale = d3.scaleLinear()
                        .domain([0, d3.max(interactive_dataset)])
                        .rangeRound([interactive_height - interactive_padding, interactive_padding]);

// X and Y Axis
let interactive_xAxis = d3.axisBottom().scale(interactive_xScale).tickFormat(i => interactive_years[i])
let interactive_yAxis = d3.axisLeft().scale(interactive_yScale);

// Create SVG
const interactive_svg = d3.select("#chart1interactive")
                        .append("svg")
                        .attr("width", interactive_width)
                        .attr("height", interactive_height);

// Insert Rectangles
interactive_svg.selectAll("rect")
            .data(interactive_dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => interactive_xScale(i))
            .attr("y", d => interactive_yScale(d))
            .attr("width", interactive_xScale.bandwidth())
            .attr("height", d => interactive_height - interactive_padding - interactive_yScale(d))
            .attr("fill", '#383745')
            .on("mouseover", function(d) {
                const interactive_xPosition = parseFloat(d3.select(this).attr("x")) + interactive_xScale.bandwidth() / 2;
                const interactive_yPosition = parseFloat(d3.select(this).attr("y")) + 14;
     
                interactive_svg.append("text")
                            .attr("id", "tooltip")
                            .attr("x", interactive_xPosition)
                            .attr("y", interactive_yPosition)
                            .attr("text-anchor", "middle")
                            .attr("font-family", "Helvetica")
                            .attr("font-size", "11px")
                            .attr("font-weight", "bold")
                            .attr("fill", "white")
                            .text(d);
                
                interactive_svg.selectAll("rect").style("opacity", 0.5);
                d3.select(this).style("opacity", 1);
            })
            .on("mouseout", () => { 
                interactive_svg.select("#tooltip").remove(); 
                interactive_svg.selectAll("rect").style("opacity", 1);
            });

createXandYAxis();

//Create "Year" on  X axis
interactive_svg.append('text')
            .attr('x', interactive_width/2)
            .attr('y', interactive_height)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 'small')
            .text('Year');

//Create "Food waste per capita (kg/year)" on Y Axis
interactive_svg.append('text')
            .attr('x', -(interactive_height / 2))
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .style('font-size', 'small')
            .text('Food waste per capita (kg/year)');

interactiveTitle("Energy Recovery");

function interactiveTitle(category) {
    // Remove Previous "__ Food Waste Per Capita" title
    interactive_svg.selectAll(".interactiveTitle").remove();

    // Create "___ Food Waste Per Capita" based on selection
    const tempText = category + " Food Waste Per Capita in Australia"
    interactive_svg.append('text')
                .attr('x', interactive_width / 2)
                .attr('y', 12)
                .attr('class', 'interactiveTitle')
                .attr('text-anchor', 'middle')
                .style('font-family', 'Helvetica')
                .style('font-size', '16px')
                .text(tempText);
}

// Add Total Value At Top of Bar
interactive_svg.append("text")

// If energy recovery button is clicked on
d3.select("#energyrecovery")
            .on("click", () => {
                displayIndividualBarchart();
                interactive_dataset = [43.4, 40.1, 38.2, 40.8, 44.8, 43.3, 49.2, 46.8, 46.3, 41.3];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("#a17724");
                createXandYAxis();
                interactiveTitle("Energy Recovery");
            });

// If disposal button is clicked on
d3.select("#disposal")
            .on("click", () => {
                displayIndividualBarchart();
                interactive_dataset = [190, 189, 180, 167, 156, 127, 117, 120, 111, 109];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("#383745");
                createXandYAxis();
                interactiveTitle("Disposal");
            });

// If recycling button is clicked on
d3.select("#recycling")
            .on("click", () => {
                displayIndividualBarchart();
                interactive_dataset = [1.89, 1.13, 2.05, 1.87, 7.49, 21.73, 20.04, 24.39, 23.94, 24.05];
                interactive_svg.selectAll(".axis").remove();
                interactiveXandYScale();
                interactiveXandYAxis();
                fillRect("#9e9cc2");
                createXandYAxis();
                interactiveTitle("Recycling");
            });

// If all button is clicked on
d3.select("#all")
            .on("click", () => {
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
    interactive_xAxis = d3.axisBottom().scale(interactive_xScale).tickFormat(i => interactive_years[i])
    interactive_yAxis = d3.axisLeft().scale(interactive_yScale);
}

// Filling rectangles with colour (after clicking on button)
function fillRect(colour) {
    interactive_svg.selectAll("rect")
                .data(interactive_dataset)
                .transition(2000)
                .ease(d3.easeCircleIn)
                .attr("y", d => interactive_yScale(d))
                .attr("height", d => interactive_height - interactive_padding - interactive_yScale(d))
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