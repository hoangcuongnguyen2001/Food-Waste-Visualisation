// Ideas taken from Gerardo Furtado's Australia map: https://bl.ocks.org/GerardoFurtado/02aa65e5522104cb692e

const second_width = 1000;
const second_height = 850;

const projection = d3.geoMercator().center([132, -28]) // approximate geographical center of Australia, marked 
                                                       // 2.5 degrees lower on latitude from Lambert gravitation centre
                                                       // Source: https://www.ga.gov.au/scientific-topics/national-location-information/dimensions/centre-of-australia-states-territories#:~:text=000%20scale%20maps.-,Lambert%20gravitational%20centre,named%20in%20honour%20of%20Dr.
                   .translate([second_width/2, second_height/2])
                   .scale(1000);


const second_color = d3.scaleQuantize().range(['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000']);
    
const path = d3.geoPath().projection(projection);


const second_svg = d3.select("#chart2")
			.append("svg")
			.attr("width", second_width)
			.attr("height", second_height);


d3.csv("data/Waste_Per_State_Per_Capita(1).csv").then(function(data) {

	//Set input domain for color scale
	second_color.domain([
		d3.min(data, function(d) { return d.Total; }), 
		d3.max(data, function(d) { return d.Total; })
	]);

    d3.json("data/aust.json").then(function(json) {

        for (var i = 0; i < data.length; i++) {
    
            var data_state = data[i].States;
            
            //Grab data value, and convert from string to float
            var dataTotal = parseFloat(data[i].Total);
            var dataEnergy = parseFloat(data[i].Energy_Recovery);
            var dataDisposal = parseFloat(data[i].Disposal);
            var dataRecycling = parseFloat(data[i].Recycling);
    
       
            for (var j = 0; j < json.features.length; j++) {
            
                var json_state = json.features[j].properties.STATE_NAME;
    
                if (data_state == json_state) {
            
                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataTotal;
                    
                    //Stop looking through the JSON
                    break;
                    
                }
            }		
        }


        // create tooltip
        var second_tooltip = second_svg.append("g")
                                       .attr("class", "tooltip")
                                       .style("display", "none");
    
           second_tooltip.append("rect")
                         .attr("width", 150)
                         .attr("height", 20)
                         .attr("fill", "gray")
                         .style("opacity", 2);

           second_tooltip.append("text")
                        .attr("x", 15)
                        .attr("dy", "1.2em")
                        .style("text-anchor", "middle")
                        .attr("font-size", "10px")
                        .attr("font-weight", "bold");

        

        second_svg.selectAll("path")
			      .data(json.features)
		        .enter()
			      .append("path")
			      .attr("d", path)
				    .attr("class", "state")
			      .style("fill", function(d) {
			      
					//Get data value
				        var value = d.properties.value;
					   		
				        if (value) {
					    //If value exists…
					        return second_color(value);
				        } else {
					    //If value is undefined…
					        return "#ccc";
				        }
			       }).on('mouseover', function() {
              second_tooltip.style("display", null);
            })
            .on("mousemove", function(d) {
              second_tooltip.style("display", "block");
              second_tooltip.select("text").text(d.properties.STATE_NAME + "/\n/" 
              + "Amount of food waste per capita: " + d.properties.value + "(kg/year)");
              second_tooltip.attr("transform", "translate(" + d3.mouse(this)[0] + "," +d3.mouse(this)[1] + ")");
              d3.select(this).style("opacity", 1);
            })
            .on('mouseout', function(d) {
                second_tooltip.style('display', 'none');
                d3.selectAll(second_svg).style("opacity", 0.5);
            });

            

			// Write down state names...
            /*second_svg.selectAll("text")
				.data(json.features)
				.enter()
				.append("text")
				.attr("fill", "black")
				.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				.attr("text-anchor", "middle")
                .style('font-family', 'Helvetica')
    			.attr("dy", ".3em")
				.text(function(d) {
					return d.properties.STATE_NAME;
				});*/
          
        
        
        
        //The color legend here based from Ronan Graham in Scott Logic:
        //https://blog.scottlogic.com/2019/03/13/how-to-create-a-continuous-colour-range-legend-using-d3-and-d3fc.html

			    const domain = second_color.domain();
                const second_width = 100;
                const second_height = 150;
                
                const paddedDomain = fc.extentLinear()
                      .pad([0.1, 0.1])
                      .padUnit("percent")(domain);
                    const [min, max] = paddedDomain;
                    const expandedDomain = d3.range(min, max, (max - min) / height);
                
                const second_xScale = d3.scaleBand()
                                        .domain([0, 1])
                                        .range([0, second_width]);
                
                const second_yScale = d3.scaleLinear()
                                        .domain(paddedDomain)
                                        .range([second_height, 0]);
                
                const svgBar = fc
                  .autoBandwidth(fc.seriesSvgBar())
                  .xScale(second_xScale)
                  .yScale(second_yScale)
                  .crossValue(0)
                  .baseValue((_, i) => (i > 0 ? expandedDomain[i - 1] : 0))
                  .mainValue(d => d)
                  .decorate(selection => {
                    selection.selectAll("path").style("fill", d => second_color(d));
                  });
                
                const axisLabel = fc
                  .axisRight(yScale)
                  .tickValues([...domain, (domain[1] + domain[0]) / 2])
                  .tickSizeOuter(0);
                
                const legendSvg = d3.select("#chart2").append("svg")
                    .attr("height", second_height)
                    .attr("width", second_width);
                
                const legendBar = legendSvg
                    .append("g")
                    .datum(expandedDomain)
                    .call(svgBar);
                
                const barWidth = Math.abs(legendBar.node().getBoundingClientRect().x);
                legendSvg.append("g")
                    .attr("transform", `translate(${barWidth})`)
                  .datum(expandedDomain)
                  .call(axisLabel)
                  .select(".domain")
                  .attr("visibility", "hidden");
                
                legendSvg.style("margin", "1em");
                 

                // Create label for the program.
                const markingNumber = 990;
                second_svg.append('text')
                          .attr('x', markingNumber)
                          .attr('y', 830)
                          .attr('text-anchor', 'middle')
                          .style('font-family', 'Helvetica')
                          .style('font-size', '12px')
                          .text(d3.min(data, function(d) { return d.Total; }));
                
                second_svg.append('text')
                          .attr('x', markingNumber)
                          .attr('y', 695)
                          .attr('text-anchor', 'middle')
                          .style('font-family', 'Helvetica')
                          .style('font-size', '12px')
                          .text(d3.max(data, function(d) { return d.Total; }));

			           const newLabel = second_svg.append('text')
                                            .attr('text-anchor', 'middle')
                                            .style('font-family', 'Helvetica')
                                            .style('font-size', '12px');
                          
                       newLabel.append('svg:tspan')
                               .attr('x', 940)
                               .attr('y', 650)
                               .text("Amount of food waste ");

                       newLabel.append('svg:tspan')
                               .attr('x', 940)
                               .attr('y', 670)
                               .text("per capita(kg/year)");
   });
})

            
// Create name for the map.
second_svg.append('text')
          .attr('x', second_width / 2)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', '20px')
          .text('Amount of food waste per capita in Australian states, 2019 (kg/year)');