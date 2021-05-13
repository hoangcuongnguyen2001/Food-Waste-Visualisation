"use strict";
let interactive_width = 900;
let interactive_height = 450;
let interactive_padding = 30;

let interactive_years = ['2006-2007','2008-2009','2009-2010','2010-2011','2013-2014',
            '2014-2015','2015-2016','2016,2017','2017-2018','2018-2019'];
let interactive_dataset = [44, 40, 38, 41, 44, 43, 49, 47, 46, 41];

let interactive_xScale = d3.scaleBand()
            .domain(d3.range(interactive_dataset.length))
            .rangeRound([padding, interactive_width])
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
            .attr("x", function(d,i) {return xScale(i);})
            .attr("y", function(d) {return interactive_yScale(d);})
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return interactive_height - interactive_padding - interactive_yScale(d);})
            .attr("fill", "green");

// Call X and Y Axis
interactive_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + (interactive_height - interactive_padding) + ")")
            .call(interactive_xAxis);

interactive_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + interactive_padding + ",0)")
            .call(interactive_yAxis);