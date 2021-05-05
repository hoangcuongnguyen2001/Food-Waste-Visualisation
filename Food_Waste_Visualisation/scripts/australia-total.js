let width = 600;
    height = 300;
    padding = 30;

let dataset = [{Year:'2006-2007',Energy_Recovery: 44, Disposal : 190, Recycling: 2},
               {Year:'2008-2009',Energy_Recovery: 40, Disposal : 189, Recycling: 1},
               {Year:'2009-2010',Energy_Recovery: 38, Disposal : 180, Recycling: 2},
               {Year:'2010-2011',Energy_Recovery: 41, Disposal : 167, Recycling: 2},
               {Year:'2013-2014',Energy_Recovery: 44, Disposal : 150, Recycling: 7},    
               {Year:'2014-2015',Energy_Recovery: 43, Disposal : 127, Recycling: 21},
               {Year:'2015-2016',Energy_Recovery: 49, Disposal : 117, Recycling: 20},
               {Year:'2016-2017',Energy_Recovery: 47, Disposal : 120, Recycling: 24},
               {Year:'2017-2018',Energy_Recovery: 46, Disposal : 111, Recycling: 24},
               {Year:'2018-2019',Energy_Recovery: 41, Disposal : 109, Recycling: 24}];

let stack = d3.stack().keys(["Energy_Recovery", "Disposal", "Recycling"]).order(d3.stackOrderDescending); 
let series = stack(dataset);

 //Create SVG element
let svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

let colors = d3.scaleOrdinal(d3.schemeCategory10);


var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))
               .range([padding, width])
               .paddingInner(0.1)
               .paddingOuter(0.1);


var yScale = d3.scaleLinear()
               .domain([0,				
                   d3.max(dataset, function(d) {
                       return d.Energy_Recovery + d.Disposal + d.Recycling;
                   })
               ])
               .range([height - padding, padding]);

// Create x- and y-axis.
var xAxis = d3.axisBottom().scale(xScale).ticks(5);
var yAxis = d3.axisLeft().scale(yScale).ticks(5);

   // Add a group for each row of data
var groups = svg.selectAll("g")
       .data(series)
       .enter()
       .append("g")
       .style("fill", function(d, i) {
           return colors(i);
       });

   // Add a rect for each data value
groups.selectAll("rect")
       .data(function(d) { return d; })
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
           return xScale(i);
       })
       .attr("y", function(d) {
           return yScale(d[1]);
       })
       .attr("height", function(d) {
           return yScale(d[0]) - yScale(d[1]);
       })
       .attr("width", xScale.bandwidth());

//Create X axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + (height - padding) + ")")
.call(xAxis);

//Create Y axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + padding + ",0)")
.call(yAxis);

