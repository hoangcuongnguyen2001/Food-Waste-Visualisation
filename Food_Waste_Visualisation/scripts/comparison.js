"use strict";


var third_width = 700;
var third_height = 300;
var third_padding = 30;
  	

var third_data = [{Country:"Australia", Household_Food_Waste:102},
	{Country:"Austria", Household_Food_Waste:39},
	{Country:"Denmark", Household_Food_Waste:81},
	{Country:"Netherlands", Household_Food_Waste:50},
	{Country:"New Zealand", Household_Food_Waste:61},
	{Country:"Norway", Household_Food_Waste:79},
	{Country:"Sweden", Household_Food_Waste:81},
	{Country:"United Kingdom", Household_Food_Waste:77},
	{Country:"USA", Household_Food_Waste:59},
	{Country:"Japan", Household_Food_Waste:64},
	{Country:"Poland", Household_Food_Waste:56},
	{Country:"Finland", Household_Food_Waste:65},
	{Country:"Italy", Household_Food_Waste:67},
	{Country:"France", Household_Food_Waste:85},
    {Country:"Belgium", Household_Food_Waste:50}];



    var third_xScale = d3.scaleBand()
	               .domain(d3.range(third_data.length))
	               .rangeRound([third_padding ,third_width])
	               .paddingInner(0.1);

    var third_yScale = d3.scaleLinear()
                    .domain([0,				
                     d3.max(third_data, function(d) {
                       return d.Household_Food_Waste;
                      })
                   ])
	               .range([third_height - third_padding, third_padding]);


    var third_yAxis = d3.axisLeft()
                 .scale(yScale);

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



   third_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + third_padding + ",0)")
      .call(third_yAxis);