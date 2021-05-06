var width = 700;
    height = 300;
    padding = 30;
  	

var xScale, yScale, xAxis, yAxis;

var data = [{Country:"Australia", Household_Food_Waste:"102"},
	{Country:"Austria", Household_Food_Waste:"39"},
	{Country:"Denmark", Household_Food_Waste:"81"},
	{Country:"Netherlands", Household_Food_Waste:"50"},
	{Country:"New Zealand", Household_Food_Waste:"61"},
	{Country:"Norway", Household_Food_Waste:"79"},
	{Country:"Sweden", Household_Food_Waste:"81"},
	{Country:"United Kingdom", Household_Food_Waste:"77"},
	{Country:"USA", Household_Food_Waste:"59"},
	{Country:"Japan", Household_Food_Waste:"64"},
	{Country:"Poland", Household_Food_Waste:"56"},
	{Country:"Finland", Household_Food_Waste:"65"},
	{Country:"Italy", Household_Food_Waste:"67"},
	{Country:"France", Household_Food_Waste:"85"},
    {Country:"Belgium", Household_Food_Waste:"50"}];

var dataset;

    var xScale = d3.scaleBand()
	               .domain()
	               .rangeRound([padding ,width])
	               .paddingInner(0.05);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset)])
	               .range([height - padding, 0]);


    var xAxis = d3.axisBottom()
                  .scale(xScale);


    var yAxis = d3.axisLeft()
                 .scale(yScale);

    var svg = d3.select("#chart3")
                .append("svg")
                .attr("width", width)
                .attr("height", height);



 svg.selectAll("rect")
	.data(dataset)
  	.enter()
  	.append("rect")
  	.attr("x", function(d, i) {
  	   return xScale(i);
  	})
    .attr("y", function(d) {
  	   return height - padding - yScale(d);
  	})
    .attr("width", xScale.bandwidth())
  	.attr("height", function(d) {
  	   return yScale(d);
  	})
  	.attr("fill", function(d) {
  	   return "rgb(0, 0, " + Math.round(d * 10) + ")";
  	})
  	.on("mouseover", function(d){
		d3.select(this).attr("fill", "orange");
  		var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
  		var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

  		svg.append("text")
  			.attr("id", "tooltip")
  			.attr("x", xPosition)
  			.attr("y", yPosition)
  			.attr("text-anchor", "middle")
  			.attr("font-family", "sans-serif")
  			.attr("font-size", "11px")
  			.attr("font-weight", "bold")
  			.attr("fill", "black")
  			.text(d);
  	})
  	.on("mouseout", function(d){
  		d3.select("#tooltip").remove();
  		d3.select(this).attr("fill", function(d){
  			return "rgb(0, 0, " + Math.round(d * 10) + ")";
  		})
  	});




 //Create X axis
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);